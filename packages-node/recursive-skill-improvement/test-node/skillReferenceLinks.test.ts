import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';
import {
  EXCLUDED_DOC_PAGES,
  neutraliseDeadLinks,
  rewriteDefineImports,
} from '../../../packages/ui/scripts/lib/consumer-imports.mjs';

const repoRoot = defaultRepoRoot();
const referencesRoot = path.join(repoRoot, 'packages/ui/skills/lion-ui/references');

function markdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return full.endsWith('.md') ? [full] : [];
  });
}

test('every relative link in a generated reference resolves to a file the skill ships', () => {
  // A link to a page the generator excludes (e.g. `[...show more](./extensions.md)`) points at a file that is
  // not in the skill: a dead link the model would follow into nothing. The generator removes those links
  // (neutraliseExcludedPageLinks); this guard fails if one reappears, or if any other relative link dangles.
  const dead: string[] = [];
  for (const file of markdownFiles(referencesRoot)) {
    const text = fs.readFileSync(file, 'utf-8');
    for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = match[1];
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const withoutAnchor = target.split('#')[0];
      if (!withoutAnchor.endsWith('.md')) continue;
      const resolved = path.resolve(path.dirname(file), withoutAnchor);
      if (!fs.existsSync(resolved)) {
        const page = path.basename(withoutAnchor);
        const excluded = EXCLUDED_DOC_PAGES.includes(page) ? ' (excluded from the skill)' : '';
        dead.push(`${path.relative(repoRoot, file)} -> ${target}${excluded}`);
      }
    }
  }
  assert.deepEqual(dead, [], `dead links in generated references:\n${dead.join('\n')}`);
});

test('neutraliseDeadLinks removes a link-only pointer to an excluded page and keeps the label of any other dead link', () => {
  const dead = (target: string) => target !== './overview.md';
  assert.equal(
    neutraliseDeadLinks('Intro.\n\n[...show more](./extensions.md)\n\nNext.\n', dead),
    'Intro.\n\nNext.\n',
  );
  assert.equal(
    neutraliseDeadLinks('See [the form guide](../form/overview.md) first.', dead),
    'See the form guide first.',
  );
  assert.equal(
    neutraliseDeadLinks('Keep [a page](./overview.md) and [b](https://x.test).', dead),
    'Keep [a page](./overview.md) and [b](https://x.test).',
  );
});

test('rewriteDefineImports keeps one import per line with its comment on its own line', () => {
  const source = [
    "import { LionCombobox } from '@lion/ui/combobox.js';",
    "import '@lion/ui/define/lion-button.js';",
    "import '@lion/ui/define/lion-option.js';",
  ].join('\n');
  const rewritten = rewriteDefineImports(source).split('\n');
  assert.equal(rewritten[0], "import { LionCombobox } from '@lion/ui/combobox.js';");
  assert.equal(rewritten[1], "import { LionButton } from '@lion/ui/button.js';");
  assert.match(rewritten[2], /^\/\/ Rendered through the host's scoped registry/);
  assert.match(rewritten[3], /^\/\/ <lion-option> is not a module of its own/);
  assert.match(rewritten[4], /^\/\/ Rendered through the host's scoped registry/);
  for (const line of rewritten) assert.ok(!line.includes("';//"), line);
});

test('rewriteDefineImports does not import the same class twice in one code block', () => {
  const source = [
    '```js script',
    "import { LionCombobox } from '@lion/ui/combobox.js';",
    "import '@lion/ui/define/lion-combobox.js';",
    '```',
    '',
    '```js',
    "import '@lion/ui/define/lion-combobox.js';",
    '```',
  ].join('\n');
  const rewritten = rewriteDefineImports(source);
  const imports = rewritten.match(/import \{ LionCombobox \}/g) ?? [];
  assert.equal(imports.length, 2, 'once per code block, not twice in the first block');
});
