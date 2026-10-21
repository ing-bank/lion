import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  COMPONENT_SYNONYMS,
  SYSTEM_SYNONYMS,
} from '../../../scripts/lib/component-synonyms.mjs';

const skillDir = path.resolve(import.meta.dirname, '../../../packages/ui/skills/lion-ui');
const index = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8');
const indexLines = index.split('\n');

const entries: [kind: string, name: string, entry: { synonyms: string[] }][] = [
  ...Object.entries(COMPONENT_SYNONYMS).map(
    ([name, entry]) => ['components', name, entry] as [string, string, { synonyms: string[] }],
  ),
  ...Object.entries(SYSTEM_SYNONYMS).map(
    ([name, entry]) => ['systems', name, entry] as [string, string, { synonyms: string[] }],
  ),
];

test('every synonym is present in the skill index', () => {
  const missing: string[] = [];
  for (const [kind, name, entry] of entries) {
    for (const synonym of entry.synonyms) {
      if (!index.includes(synonym)) missing.push(`${kind}/${name}: ${synonym}`);
    }
  }
  assert.deepEqual(missing, [], `synonyms absent from the index: ${missing.join(', ')}`);
});

test('an index entry carries its own synonyms, so an ambiguous word is resolvable from context', () => {
  // Synonyms are routing *hints*, not a lookup table: the prompter's vocabulary may be incomplete or
  // wrong, so the model derives the component from the description and the surrounding index. A word
  // that fits two entries ("popup" for dialog and overlays, "form" for the component and the system) is
  // therefore allowed — what must hold is that each entry names its own hints, which is what makes the
  // derivation possible.
  const problems: string[] = [];
  for (const [kind, name, entry] of entries) {
    const marker = `references/${kind}/${name}.md`;
    const line = indexLines.find(
      candidate => candidate.startsWith('- [') && candidate.includes(marker),
    );
    if (!line) {
      problems.push(`${kind}/${name}: no index line`);
      continue;
    }
    for (const synonym of entry.synonyms) {
      if (!line.includes(synonym)) problems.push(`${kind}/${name}: index line lacks "${synonym}"`);
    }
  }
  assert.deepEqual(problems, [], problems.join(', '));
});
