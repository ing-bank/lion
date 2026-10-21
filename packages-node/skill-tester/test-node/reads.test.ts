import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { countReads } from '../src/scoring/reads.ts';

/** Build a transcript shaped like the agent runner's: messages carrying read_file tool calls. */
function transcript(paths: string[]) {
  return paths.map(p => ({
    tool_calls: [{ function: { name: 'read_file', arguments: JSON.stringify({ path: p }) } }],
  }));
}

function sandboxWith(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'reads-'));
  for (const [relative, content] of Object.entries(files)) {
    const full = path.join(root, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return root;
}

test('skill reads are counted from the sandbox copy', () => {
  const root = sandboxWith({ '.skill/lion-ui/references/components/button.md': 'x'.repeat(120) });
  const { skillReads, dependencyReads } = countReads(
    transcript(['.skill/lion-ui/references/components/button.md']),
    { skillName: 'lion-ui', sandboxRoot: root },
  );
  assert.equal(skillReads.size, 1);
  assert.equal(skillReads.get('.skill/lion-ui/references/components/button.md'), 120);
  assert.equal(dependencyReads.size, 0);
});

test('a node_modules read is counted as a dependency, never as a skill read', () => {
  const root = sandboxWith({ 'node_modules/@lion/ui/button.js': 'y'.repeat(200) });
  const { skillReads, dependencyReads } = countReads(
    transcript(['node_modules/@lion/ui/button.js']),
    { skillName: 'lion-ui', sandboxRoot: root },
  );
  assert.equal(dependencyReads.size, 1, 'the library source read must be reported as a failure');
  assert.equal(dependencyReads.get('node_modules/@lion/ui/button.js'), 200);
  assert.equal(skillReads.size, 0);
});

test('reads of neither the skill nor a dependency are ignored', () => {
  const root = sandboxWith({ 'src/my-elem.js': 'own work' });
  const { skillReads, dependencyReads } = countReads(
    transcript(['src/my-elem.js', 'package.json', '']),
    { skillName: 'lion-ui', sandboxRoot: root },
  );
  assert.equal(skillReads.size + dependencyReads.size, 0);
});

test('repeated reads of the same file count once, and other tools are ignored', () => {
  const root = sandboxWith({ 'node_modules/@lion/ui/form.js': 'z'.repeat(50) });
  const entries = transcript([
    'node_modules/@lion/ui/form.js',
    'node_modules/@lion/ui/form.js',
  ]);
  entries.push({
    tool_calls: [{ function: { name: 'search_files', arguments: '{"path":"node_modules"}' } }],
  } as never);
  const { dependencyReads } = countReads(entries, { skillName: 'lion-ui', sandboxRoot: root });
  assert.equal(dependencyReads.size, 1);
  assert.equal(dependencyReads.get('node_modules/@lion/ui/form.js'), 50);
});
