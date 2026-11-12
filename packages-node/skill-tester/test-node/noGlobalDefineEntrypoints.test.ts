import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';

const repoRoot = defaultRepoRoot();
const skillRoot = path.join(repoRoot, 'packages/ui/skills/lion-ui');

function markdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return full.endsWith('.md') ? [full] : [];
  });
}

test('the generated lion-ui skill never teaches a global define entrypoint', () => {
  // A global `@lion/ui/define/*` entrypoint registers the element globally and opts out of the host's scoped
  // element registry - the rule the skill exists to teach, and the reason the scenario checks fail any
  // produced file that imports one (see gates.test.ts for the failing side). The skill must never demonstrate
  // what the harness rejects, so the generator rewrites these specifiers on the way out
  // (packages/ui/scripts/lib/consumer-imports.mjs) and this test pins that it stays that way.
  const offenders = markdownFiles(skillRoot)
    .filter(file => fs.readFileSync(file, 'utf-8').includes('@lion/ui/define/lion-'))
    .map(file => path.relative(repoRoot, file));
  assert.deepEqual(
    offenders,
    [],
    `the skill teaches a global define entrypoint in: ${offenders.join(', ')}`,
  );
});
