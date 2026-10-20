import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const skillDir = path.resolve(import.meta.dirname, '../../../packages/ui/skills/lion-ui');
const entrypointsPath = path.join(skillDir, 'references/entrypoints.md');

/**
 * Known coverage gaps: consumer-facing specifiers that no reference mentions yet. The test pins this
 * set so a NEW entrypoint cannot be added without documentation - it fails the moment it grows.
 *
 * Three of the entries below (calendar, form, menu) are only apparent gaps: their component IS
 * documented, but the reference names the class rather than the specifier string.
 */
const KNOWN_UNDOCUMENTED = new Set([
  '@lion/ui/calendar.js',
  '@lion/ui/form.js',
  '@lion/ui/menu.js',
  '@lion/ui/form-integrations.js',
  '@lion/ui/icon-no-side-effects.js',
  '@lion/ui/localize-no-side-effects.js',
  '@lion/ui/overlays-no-side-effects.js',
  '@lion/ui/validate-messages-no-side-effects.js',
]);

function specifiers(): string[] {
  const md = fs.readFileSync(entrypointsPath, 'utf8');
  return [...md.matchAll(/^- `(@lion\/ui\/[^`]+)`/gm)].map(match => match[1]);
}

function group(specifier: string): 'define' | 'types' | 'helper' | 'consumer' {
  if (specifier.startsWith('@lion/ui/define/')) return 'define';
  if (specifier.startsWith('@lion/ui/types/')) return 'types';
  if (/(test-helpers|test-suites|-suites\.js|define-helpers|\/testing)/.test(specifier)) return 'helper';
  return 'consumer';
}

function referenceTexts(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md') && entry.name !== 'entrypoints.md') {
        out.push(fs.readFileSync(full, 'utf8'));
      }
    }
  };
  walk(path.join(skillDir, 'references'));
  return out;
}

test('every entrypoint specifier is classified (consumer | helper | types | define)', () => {
  const specs = specifiers();
  assert.ok(specs.length > 100, `expected the full specifier list, got ${specs.length}`);
  const counts = { consumer: 0, helper: 0, types: 0, define: 0 };
  for (const spec of specs) counts[group(spec)] += 1;
  // Test suites and storybook helpers are excluded from the skill entirely; the rest is pinned.
  assert.deepEqual(counts, { consumer: 46, helper: 0, types: 11, define: 50 });
  assert.equal(specs.length, 107, 'test suites and storybook helpers must not be listed');
});

test('no NEW consumer entrypoint is undocumented', () => {
  const refs = referenceTexts();
  const undocumented = specifiers()
    .filter(spec => group(spec) === 'consumer')
    .filter(spec => !refs.some(text => text.includes(spec)));
  const unexpected = undocumented.filter(spec => !KNOWN_UNDOCUMENTED.has(spec));
  assert.deepEqual(
    unexpected,
    [],
    `these consumer entrypoints have no reference mention: ${unexpected.join(', ')}`,
  );
});

test('the known-undocumented list does not carry stale entries', () => {
  const refs = referenceTexts();
  const documented = new Set(
    specifiers().filter(spec => refs.some(text => text.includes(spec))),
  );
  const stale = [...KNOWN_UNDOCUMENTED].filter(spec => documented.has(spec));
  assert.deepEqual(stale, [], `these are now documented - remove them: ${stale.join(', ')}`);
});
