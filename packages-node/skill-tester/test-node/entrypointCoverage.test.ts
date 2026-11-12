import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const skillDir = path.resolve(import.meta.dirname, '../../../packages/ui/skills/lion-ui');
const entrypointsPath = path.join(skillDir, 'references/entrypoints.md');

/**
 * Some public specifiers are not owned by a reference of their own name: the *system* reference that
 * covers their subject owns them. `form-core` exports the mixins and `LionField` that the form system
 * reference explains, and `validate-messages` belongs to that same system.
 */
const OWNER_OVERRIDES: Record<string, string> = {
  '@lion/ui/form-core.js': 'references/systems/form.md',
  '@lion/ui/validate-messages.js': 'references/systems/form.md',
};

/**
 * Consumer specifiers known to lack an owning reference. The test pins this set so a new entrypoint
 * cannot be added without documentation. It is empty: the gaps are closed - keep it that way.
 */
const KNOWN_UNDOCUMENTED = new Set<string>([]);

function specifiers(): string[] {
  const md = fs.readFileSync(entrypointsPath, 'utf8');
  return [...md.matchAll(/^- `(@lion\/ui\/[^`]+)`/gm)].map(match => match[1]);
}

function group(specifier: string): 'define' | 'types' | 'helper' | 'consumer' {
  if (specifier.startsWith('@lion/ui/define/')) return 'define';
  if (specifier.startsWith('@lion/ui/types/')) return 'types';
  if (
    /(test-helpers|test-suites|-suites\.js|define-helpers|\/testing)/.test(specifier) ||
    specifier === '@lion/ui/helpers.js'
  )
    return 'helper';
  return 'consumer';
}

/** The reference that owns a specifier: the page named after it, or the system page mapped above. */
function ownerReference(specifier: string): string | undefined {
  const override = OWNER_OVERRIDES[specifier];
  if (override) return override;
  const name = specifier.replace('@lion/ui/', '').replace(/\.js$/, '');
  for (const kind of ['components', 'systems']) {
    const candidate = `references/${kind}/${name}.md`;
    if (fs.existsSync(path.join(skillDir, candidate))) return candidate;
  }
  return undefined;
}

test('test suites, storybook helpers and non-API specifiers are not listed', () => {
  const specs = specifiers();
  const counts = { consumer: 0, helper: 0, types: 0, define: 0 };
  for (const spec of specs) counts[group(spec)] += 1;
  // Non-API specifiers - the empty `form-integrations` stub and the redundant `*-no-side-effects`
  // variants - must not appear at all; the rest is pinned so the split cannot drift unnoticed.
  // consumer 75 / define 0 since the skill may only name entrypoints that ship: the 35 define entrypoints whose
  // class module exists are written as consumer specifiers now, and the 15 without one are named as elements.
  assert.deepEqual(counts, { consumer: 75, helper: 0, types: 11, define: 0 });
  // 86 since the skill may only name entrypoints that ship: the 15 define entrypoints without a class module
  // of their own are named as elements now instead of being turned into specifiers that do not exist.
  assert.equal(specs.length, 86, 'non-API specifiers must not be listed');
});

test('every consumer entrypoint is owned by a reference', () => {
  const undocumented = specifiers()
    .filter(spec => group(spec) === 'consumer')
    .filter(spec => ownerReference(spec) === undefined);
  const unexpected = undocumented.filter(spec => !KNOWN_UNDOCUMENTED.has(spec));
  assert.deepEqual(
    unexpected,
    [],
    `these consumer entrypoints have no owning reference: ${unexpected.join(', ')}`,
  );
});

test('every owner override still resolves', () => {
  for (const [specifier, reference] of Object.entries(OWNER_OVERRIDES)) {
    assert.ok(
      fs.existsSync(path.join(skillDir, reference)),
      `${specifier} claims ${reference}, which does not exist - update the override`,
    );
  }
});

test('the known-undocumented list does not carry stale entries', () => {
  const stale = [...KNOWN_UNDOCUMENTED].filter(spec => ownerReference(spec) !== undefined);
  assert.deepEqual(stale, [], `these are now owned - remove them: ${stale.join(', ')}`);
});
