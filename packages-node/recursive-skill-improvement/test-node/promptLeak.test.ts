/**
 * A generated prompt must never give away the answer: the component's TAG (`lion-<name>`) or its
 * CLASS name (`Lion<Name>`) is the answer, so a prompt that names either one hands the model the
 * component it is supposed to find.
 *
 * The rule is mechanical and deliberately narrow. Honest user vocabulary is not a leak: a prompt
 * that asks for "a clickable button" contains the folder word `button`, and that is the user's word,
 * not the tag. The folder-word cases are printed as an informational report (never a failure), so
 * that judgement stays visible.
 *
 * Every prompt is checked, generated and hand-authored alike: a hand-written scenario can leak too.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';
import {
  discoverComponentNames,
  discoverKnownTags,
  discoverSystemNames,
  discoverTagClasses,
  manualScenarios,
  runScenarios,
} from '../src/scenarios/index.ts';
import { createLionUiScenarios } from '../src/scenarios/lionUi.ts';
import { deriveUseCaseScenariosSync } from '../src/scenarios/useCases.ts';
import type { TestScenario } from '../src/scenarios/types.ts';

const repoRoot = defaultRepoRoot();
const components = discoverComponentNames(repoRoot);
const systems = discoverSystemNames(repoRoot);
const knownTags = discoverKnownTags(repoRoot);
const tagClasses = discoverTagClasses(repoRoot);

/** The generated component + system scenarios, built exactly as `loadLionUiScenarios` builds them. */
const generated: TestScenario[] = createLionUiScenarios({ components, systems, knownTags, tagClasses });
/** One scenario per documented use case: the prompts a docs heading produces must not leak either. */
const useCases: TestScenario[] = deriveUseCaseScenariosSync({ repoRoot }).derived.map(entry => entry.scenario);
const handAuthored: TestScenario[] = [...manualScenarios, ...runScenarios];
const everyScenario = [...generated, ...useCases, ...handAuthored];

/** `button` -> `Button`, `input-iban` -> `InputIban`. */
const pascal = (name: string): string =>
  name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');

/**
 * Every tag and class name a prompt must not contain. The manifest is the authority; the folder-derived
 * names are a floor, so a component missing from the manifest is still guarded.
 */
const forbiddenTags = [...new Set([...knownTags, ...components.map(name => `lion-${name}`)])];
const forbiddenClasses = [
  ...new Set([...Object.values(tagClasses), ...components.map(name => `Lion${pascal(name)}`)]),
];

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A whole-token match: `lion-input` must not match inside `lion-input-iban`. */
const tokenPattern = (token: string): RegExp =>
  new RegExp(`(?<![\\w-])${escapeRegExp(token)}(?![\\w-])`);

test('the generated scenario set is not empty', () => {
  // Guards the test itself: an empty build would pass the leak check vacuously.
  assert.ok(generated.some(s => s.kind === 'component'), 'no generated component scenarios');
  assert.ok(generated.some(s => s.kind === 'system'), 'no generated system scenarios');
});

test('no prompt contains a component tag or class name', () => {
  const leaks: string[] = [];
  for (const scenario of everyScenario) {
    for (const token of [...forbiddenTags, ...forbiddenClasses]) {
      if (tokenPattern(token).test(scenario.prompt)) leaks.push(`${scenario.name} names "${token}"`);
    }
  }
  assert.equal(
    leaks.length,
    0,
    `a prompt leaks the answer (tag or class name). Offending scenario(s):\n  - ${leaks.join('\n  - ')}`,
  );
});

test('informational: prompts that contain a folder word (not a failure)', t => {
  // A folder word is the user's own vocabulary ("a clickable button" for `button`). Listed so the
  // judgement stays visible; the leak rule above is what fails.
  const hits: string[] = [];
  for (const scenario of generated) {
    const folder = scenario.name.split('/').slice(1).join('/');
    const word = folder.replace(/-/g, ' ');
    const folderPattern = new RegExp(`(?<![\\w-])${escapeRegExp(word)}(?![\\w-])`, 'i');
    if (folderPattern.test(scenario.prompt)) hits.push(`${scenario.name} (folder word "${word}")`);
  }
  t.diagnostic(
    `${hits.length} of ${generated.length} generated prompts contain their folder word (judgement, not a failure):`,
  );
  for (const hit of hits) t.diagnostic(`  - ${hit}`);
});

test('a leak is caught wherever it appears in a prompt', () => {
  // Pins the matcher itself, so a regex change that stops matching fails here and not silently.
  assert.ok(tokenPattern('lion-button').test('use lion-button here'));
  assert.ok(tokenPattern('LionButton').test('a LionButton element'));
  assert.ok(!tokenPattern('lion-input').test('an lion-input-iban field'));
  assert.ok(!tokenPattern('lion-button').test('a clickable button'));
});
