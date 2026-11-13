import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { defaultRepoRoot } from '../src/behaviour/runner.ts';

const repoRoot = defaultRepoRoot();
const skillRoot = path.join(repoRoot, 'packages/ui/skills/lion-ui');
const entrypointsReference = path.join(skillRoot, 'references/entrypoints.md');

/** The one section whose job is to name the global `define` entrypoints as forbidden. */
const FORBIDDEN_SECTION = '## Do not use these: global `define` entrypoints';

function markdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return full.endsWith('.md') ? [full] : [];
  });
}

test('the generated lion-ui skill teaches a global define entrypoint only where it forbids it', () => {
  // A global `@lion/ui/define/*` entrypoint registers the element globally and opts out of the host's scoped
  // element registry - the rule the skill exists to teach, and the reason the scenario checks fail any
  // produced file that imports one (see gates.test.ts for the failing side). The skill may not DEMONSTRATE
  // what the harness rejects, so every generated markdown file is rewritten to the consumer form
  // (packages/ui/scripts/lib/consumer-imports.mjs) - with one deliberate exception.
  //
  // `references/entrypoints.md` exists to list the real specifiers, and it carries a
  // "## Do not use these: global `define` entrypoints" section that must NAME them to forbid them. That is
  // documentation of the rule, not usage of it. Rewriting the page would turn that list into the very
  // consumer specifiers the same page recommends under "## Importing a class" - measured: the forbidden
  // section named exactly the 35 specifiers the recommended section advised. So the define specifiers are
  // allowed in that one section and nowhere else: not on the page outside it, and not in any other file.
  const offenders: string[] = [];
  for (const file of markdownFiles(skillRoot)) {
    const text = fs.readFileSync(file, 'utf-8');
    const relative = path.relative(repoRoot, file);
    if (file !== entrypointsReference) {
      if (text.includes('@lion/ui/define/lion-')) offenders.push(relative);
      continue;
    }
    const sectionStart = text.indexOf(FORBIDDEN_SECTION);
    if (sectionStart === -1) {
      offenders.push(`${relative} (the forbidden section is missing)`);
      continue;
    }
    if (text.slice(0, sectionStart).includes('@lion/ui/define/lion-')) {
      offenders.push(`${relative} (a define specifier outside the forbidden section)`);
    }
    if (!text.slice(sectionStart).includes('@lion/ui/define/lion-')) {
      offenders.push(`${relative} (the forbidden section names no define specifier)`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `a define specifier appears outside "${FORBIDDEN_SECTION}": ${offenders.join(', ')}`,
  );
});
