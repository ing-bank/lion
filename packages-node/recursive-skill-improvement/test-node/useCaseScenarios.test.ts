/**
 * The `scenarios` task: one scenario per documented use case, derived from the docs.
 *
 * Covers the defaults (against the real repository), custom `--docs` globs and a custom `--headings`
 * pattern (against a fixture repository, so the assertions do not move when the docs change), the
 * component + system relation, the negative cases (a glob or pattern that matches nothing must fail,
 * never emit zero scenarios as success), and the CLI surface.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';
import {
  deriveUseCaseScenarios,
  lintDerivedUseCases,
  DEFAULT_USE_CASE_DOCS,
  DEFAULT_USE_CASE_HEADINGS,
  slugify,
} from '../src/scenarios/useCases.ts';
import { discoverKnownTags, discoverTagClasses } from '../src/scenarios/index.ts';
import { measureUseCaseCoverage, useCaseHeadings } from '../scripts/report-use-case-coverage.mjs';

const repoRoot = defaultRepoRoot();
const packageRoot = path.join(repoRoot, 'packages-node/recursive-skill-improvement');

/** A throwaway repository with the docs layout the task reads. Removed after each test. */
function fixtureRepo(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'use-case-fixture-'));
  for (const [file, content] of Object.entries(files)) {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return root;
}

const WIDGET = [
  '# Use Cases',
  '',
  '## Start small',
  '',
  'A widget starts small and grows when asked to.',
  '',
  '```js',
  'const inside = true;',
  '## not a heading, it is code',
  '```',
  '',
  '### Sub case',
  '',
  'A sub case is not a use case under the default pattern.',
  '',
  '## Second case',
  '',
  'The second case has prose.',
  '',
].join('\n');

const THING = ['# Use Cases', '', '## Thing one', '', 'The thing does one thing.', ''].join('\n');

test('defaults: one scenario per documented use case, the same inventory the coverage page counts', async () => {
  const { derived, files } = await deriveUseCaseScenarios({ repoRoot });
  const coverage = (await measureUseCaseCoverage(repoRoot)) as {
    components: { name: string; sections: number }[];
  };

  // The coverage script's inventory: the `## ` headings of every docs/components/*/use-cases.md.
  const expectedComponents = coverage.components.reduce((sum, c) => sum + c.sections, 0);
  const componentCount = derived.filter(d => d.scenario.kind === 'component').length;
  assert.equal(
    componentCount,
    expectedComponents,
    'component use cases must match the coverage inventory',
  );

  // Systems live under docs/fundamentals/systems (there is no docs/systems folder).
  const systemFiles = files.filter(file => file.includes('/systems/'));
  const expectedSystems = systemFiles.reduce(
    (sum, file) => sum + useCaseHeadings(fs.readFileSync(path.join(repoRoot, file), 'utf8')).length,
    0,
  );
  assert.ok(systemFiles.length > 0, 'the default globs must find the system use-case files');
  assert.equal(derived.filter(d => d.scenario.kind === 'system').length, expectedSystems);

  assert.equal(files.length, coverage.components.length + systemFiles.length);
  assert.equal(derived.length, componentCount + expectedSystems);
});

test('defaults: names follow use-case/<unit>--<slug>, the convention of the hand-authored scenarios', async () => {
  const { derived } = await deriveUseCaseScenarios({ repoRoot });
  for (const { scenario } of derived) {
    assert.match(scenario.name, /^use-case\/[a-z0-9-]+--[a-z0-9-]+$/, scenario.name);
  }
  const names = new Set(derived.map(d => d.scenario.name));
  assert.equal(names.size, derived.length, 'every use case gets a unique name');
  // A heading "Require option match" in docs/components/combobox/use-cases.md.
  assert.ok(names.has('use-case/combobox--require-option-match'));
});

test('defaults: the constants are the documented defaults', () => {
  assert.deepEqual(DEFAULT_USE_CASE_DOCS, [
    'docs/components/*/use-cases.md',
    'docs/fundamentals/systems/*/use-cases.md',
  ]);
  assert.equal(DEFAULT_USE_CASE_HEADINGS, '^## ');
});

test('the prompt of every derived scenario names no component tag or class (the leak rule)', async () => {
  const { derived } = await deriveUseCaseScenarios({ repoRoot });
  const tags = discoverKnownTags(repoRoot);
  const classes = Object.values(discoverTagClasses(repoRoot));
  const leaks: string[] = [];
  for (const { scenario } of derived) {
    for (const token of [...tags, ...classes]) {
      if (new RegExp(`(?<![\\w-])${token}(?![\\w-])`).test(scenario.prompt)) {
        leaks.push(`${scenario.name} names "${token}"`);
      }
    }
  }
  assert.deepEqual(leaks, []);
});

test('the derived scenarios pass the same lint (L1..L8) that eval:list applies', async () => {
  const { derived } = await deriveUseCaseScenarios({ repoRoot });
  assert.deepEqual(lintDerivedUseCases(derived, repoRoot), []);
});

test('custom --docs: only the globs given are read', async () => {
  const root = fixtureRepo({
    'docs/components/widget/use-cases.md': WIDGET,
    'docs/fundamentals/systems/thing/use-cases.md': THING,
  });
  try {
    const onlyComponents = await deriveUseCaseScenarios({
      repoRoot: root,
      docs: ['docs/components/*/use-cases.md'],
    });
    assert.deepEqual(
      onlyComponents.derived.map(d => d.scenario.name),
      ['use-case/widget--start-small', 'use-case/widget--second-case'],
    );
    assert.ok(onlyComponents.derived.every(d => d.scenario.kind === 'component'));

    const both = await deriveUseCaseScenarios({
      repoRoot: root,
      docs: ['docs/components/*/use-cases.md', 'docs/fundamentals/systems/*/use-cases.md'],
    });
    assert.equal(both.derived.length, 3);
    assert.equal(both.files.length, 2);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('custom --headings: the pattern decides what starts a use case, and the name is what follows it', async () => {
  const root = fixtureRepo({ 'docs/components/widget/use-cases.md': WIDGET });
  try {
    // Under '^## ' the `### Sub case` is not a use case, and a `## ` inside a code fence is not one either.
    const defaults = await deriveUseCaseScenarios({
      repoRoot: root,
      docs: ['docs/components/*/use-cases.md'],
    });
    assert.deepEqual(
      defaults.derived.map(d => d.scenario.name),
      ['use-case/widget--start-small', 'use-case/widget--second-case'],
    );

    const subCases = await deriveUseCaseScenarios({
      repoRoot: root,
      docs: ['docs/components/*/use-cases.md'],
      headings: '^### ',
    });
    assert.deepEqual(
      subCases.derived.map(d => d.scenario.name),
      ['use-case/widget--sub-case'],
    );
    assert.equal(subCases.derived[0].source.heading, 'Sub case');
    assert.equal(subCases.derived[0].source.line, 12);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('the relation: a component and a system use case share the naming, and the kind follows the folder', async () => {
  const root = fixtureRepo({
    'docs/components/widget/use-cases.md': WIDGET,
    'docs/fundamentals/systems/overlays/use-cases.md':
      '## Configuration\n\nOverlays are configured.\n',
  });
  try {
    const { derived } = await deriveUseCaseScenarios({
      repoRoot: root,
      docs: ['docs/components/*/use-cases.md', 'docs/fundamentals/systems/*/use-cases.md'],
    });
    const system = derived.find(d => d.scenario.name === 'use-case/overlays--configuration');
    const component = derived.find(d => d.scenario.name === 'use-case/widget--start-small');
    assert.equal(system?.scenario.kind, 'system');
    assert.equal(system?.source.kind, 'system');
    assert.equal(component?.scenario.kind, 'component');
    assert.equal(component?.source.kind, 'component');
    // A system accepts its documented consumer entrypoints as well as the system module.
    const overlayChecks = system!.scenario.checks!.map(check => check.pattern ?? '').join('\n');
    assert.match(overlayChecks, /\(\?:overlays\|dialog\|tooltip\)/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('the real docs: every scenario kind matches the folder it was read from', async () => {
  const { derived } = await deriveUseCaseScenarios({ repoRoot });
  for (const { scenario, source } of derived) {
    assert.equal(scenario.kind, source.kind, scenario.name);
    const folder = source.kind === 'component' ? '/components/' : '/systems/';
    assert.ok(source.file.includes(folder), `${source.file} is not under ${folder}`);
  }
});

test('the slug is the heading, lowercase, with runs of other characters collapsed to one dash', () => {
  assert.equal(slugify('Suggest while you type'), 'suggest-while-you-type');
  assert.equal(slugify('`autocomplete` behaviors'), 'autocomplete-behaviors');
  assert.equal(slugify('Submit & Reset'), 'submit-reset');
});

test('a prose sentence that names the tag is dropped, and the goal falls back to the heading', async () => {
  const root = fixtureRepo({
    'docs/components/widget/use-cases.md': [
      '## Disabled',
      '',
      'Set the `disabled` attribute on the `<lion-widget>` element.',
      '',
      '## Labelled',
      '',
      'The label is shown above the field. It is short.',
      '',
    ].join('\n'),
  });
  try {
    const { derived, headingOnlyGoals } = await deriveUseCaseScenarios({
      repoRoot: root,
      docs: ['docs/components/*/use-cases.md'],
    });
    const disabled = derived.find(d => d.scenario.name === 'use-case/widget--disabled')!;
    assert.match(disabled.scenario.prompt, /Goal: Disabled\.$/);
    assert.deepEqual(headingOnlyGoals, ['use-case/widget--disabled']);
    const labelled = derived.find(d => d.scenario.name === 'use-case/widget--labelled')!;
    assert.match(
      labelled.scenario.prompt,
      /Goal: Labelled\. The label is shown above the field\.$/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('negative: a glob that matches no file fails, it never emits zero scenarios as success', async () => {
  const root = fixtureRepo({ 'docs/components/widget/use-cases.md': WIDGET });
  try {
    await assert.rejects(
      deriveUseCaseScenarios({ repoRoot: root, docs: ['docs/nothing/*/use-cases.md'] }),
      /--docs "docs\/nothing\/\*\/use-cases\.md" matched no files/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('negative: a heading pattern that matches no line fails, it never emits zero scenarios as success', async () => {
  const root = fixtureRepo({ 'docs/components/widget/use-cases.md': WIDGET });
  try {
    await assert.rejects(
      deriveUseCaseScenarios({
        repoRoot: root,
        docs: ['docs/components/*/use-cases.md'],
        headings: '^#### ',
      }),
      /--headings "\^#### " matched no line in 1 docs file/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('negative: an invalid heading pattern is reported as such', async () => {
  const root = fixtureRepo({ 'docs/components/widget/use-cases.md': WIDGET });
  try {
    await assert.rejects(
      deriveUseCaseScenarios({
        repoRoot: root,
        docs: ['docs/components/*/use-cases.md'],
        headings: '(',
      }),
      /is not a valid regular expression/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('negative: two use cases that would share a name are an error, not a silent overwrite', async () => {
  const root = fixtureRepo({
    'docs/components/widget/use-cases.md': '## Start small\n\nOne.\n',
    'docs/components/widget/more.md': '## Start small\n\nTwo.\n',
  });
  try {
    await assert.rejects(
      deriveUseCaseScenarios({ repoRoot: root, docs: ['docs/components/widget/*.md'] }),
      /"use-case\/widget--start-small" is produced twice/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('negative: a heading that itself names a tag is refused, the prompt would leak the answer', async () => {
  const root = fixtureRepo({
    'docs/components/widget/use-cases.md': '## Using lion-widget\n\nText.\n',
  });
  try {
    await assert.rejects(
      deriveUseCaseScenarios({ repoRoot: root, docs: ['docs/components/*/use-cases.md'] }),
      /names a tag or class, so the prompt would leak the answer/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('negative: a docs file that is neither under components/ nor systems/ is refused', async () => {
  const root = fixtureRepo({ 'docs/other/widget/use-cases.md': WIDGET });
  try {
    await assert.rejects(
      deriveUseCaseScenarios({ repoRoot: root, docs: ['docs/other/*/use-cases.md'] }),
      /cannot tell whether .* documents a component or a system/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('the CLI: --help documents the scenarios task and both of its flags', () => {
  const result = spawnSync(process.execPath, ['src/cli.ts', '--help'], {
    cwd: packageRoot,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^ {2}scenarios {15}Derive one scenario per documented use case/m);
  assert.match(result.stdout, /^ {2}--docs <globs> {10}scenarios task only/m);
  assert.match(result.stdout, /^ {2}--headings <pattern> {4}scenarios task only/m);
  assert.match(result.stdout, /node src\/cli\.ts scenarios --docs/);
});

test('the CLI: scenarios with the two parameters lists the derived scenarios and exits 0', () => {
  const result = spawnSync(
    process.execPath,
    [
      'src/cli.ts',
      'scenarios',
      '--docs',
      'docs/components/combobox/use-cases.md',
      '--headings',
      '^## ',
    ],
    { cwd: packageRoot, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^12 use-case scenario\(s\) from 1 docs file\(s\)/m);
  assert.match(
    result.stdout,
    /use-case\/combobox--require-option-match {2}<- docs\/components\/combobox\/use-cases\.md:/,
  );
  assert.match(result.stdout, /All generated scenarios pass lint/);
});

test('the CLI: a --docs glob that matches nothing exits 1 with the reason', () => {
  const result = spawnSync(
    process.execPath,
    ['src/cli.ts', 'scenarios', '--docs', 'docs/nothing/*/use-cases.md'],
    { cwd: packageRoot, encoding: 'utf8' },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /matched no files/);
  assert.doesNotMatch(result.stdout, /use-case scenario\(s\)/);
});

test('the CLI: a --headings pattern that matches nothing exits 1 with the reason', () => {
  const result = spawnSync(
    process.execPath,
    [
      'src/cli.ts',
      'scenarios',
      '--docs',
      'docs/components/combobox/use-cases.md',
      '--headings',
      '^#### nothing$',
    ],
    { cwd: packageRoot, encoding: 'utf8' },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /matched no line/);
});

test('the CLI: --docs without a glob is refused for the scenarios task', () => {
  const result = spawnSync(process.execPath, ['src/cli.ts', 'scenarios', '--docs'], {
    cwd: packageRoot,
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--docs needs one or more globs/);
});

test('the CLI: --headings is refused for any other task', () => {
  const result = spawnSync(process.execPath, ['src/cli.ts', 'eval', '--headings', '^## '], {
    cwd: packageRoot,
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--headings only applies to the scenarios task/);
});
