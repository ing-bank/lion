import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const skillRefs = path.join(repoRoot, 'packages/ui/skills/lion-ui/references/components');
const cem = JSON.parse(fs.readFileSync(path.join(repoRoot, 'packages/ui/custom-elements.json'), 'utf8'));

/**
 * Members that are *inherited* from a shared mixin, documented once in the systems references rather
 * than repeated on every component. Excluded from the per-component completeness check on purpose.
 */
const MIXIN_MEMBERS = new Set(['enabledWarnings', 'scopedElements', 'templates', 'validationTypes']);

/**
 * Real, measured coverage gaps: own public members that no component reference mentions yet. Pinned so
 * the list cannot grow; it must shrink as the docs are completed.
 */
const KNOWN_GAPS: Record<string, string[]> = {
  icon: ['removeIconResolver', 'resolveIcon', 'resolveIconForId'],
  'input-file': ['checkFileSize', 'getExtension', 'isExtensionAllowed', 'isFileTypeAllowed'],
  'input-tel': ['isLoaded', 'loadLibPhoneNumber'],
};

type ComponentApi = { text: string; own: Set<string> };

function referenceNames(): string[] {
  return fs
    .readdirSync(skillRefs)
    .filter(f => f.endsWith('.md') && !f.endsWith('.subclasser.md'))
    .map(f => f.replace(/\.md$/, ''));
}

function ownPublicMembers(componentName: string): Set<string> {
  const own = new Set<string>();
  for (const mod of cem.modules as { path?: string; declarations?: any[] }[]) {
    if (!mod.path || !mod.path.includes(`components/${componentName}/`)) continue;
    if (/\/test-(helpers|suites)\//.test(mod.path)) continue;
    for (const declaration of mod.declarations ?? []) {
      if (declaration.kind !== 'class') continue;
      for (const member of declaration.members ?? []) {
        if (member.inheritedFrom || member.privacy === 'private' || member.privacy === 'protected') {
          continue;
        }
        if (member.name && !member.name.startsWith('_')) own.add(member.name);
      }
    }
  }
  return own;
}

function apis(): Record<string, ComponentApi> {
  const out: Record<string, ComponentApi> = {};
  for (const name of referenceNames()) {
    const own = ownPublicMembers(name);
    if (own.size === 0) continue;
    out[name] = { text: fs.readFileSync(path.join(skillRefs, `${name}.md`), 'utf8'), own };
  }
  return out;
}

test('every component document its own public members (mixins documented in the systems references)', () => {
  const subject = apis();
  assert.ok(Object.keys(subject).length > 20, `expected the component set, got ${Object.keys(subject).length}`);
  const unexpected: string[] = [];
  for (const [name, { text, own }] of Object.entries(subject)) {
    const known = new Set(KNOWN_GAPS[name] ?? []);
    for (const member of own) {
      if (text.includes(member) || MIXIN_MEMBERS.has(member) || known.has(member)) continue;
      unexpected.push(`${name}.${member}`);
    }
  }
  assert.deepEqual(unexpected, [], `undocumented own public members: ${unexpected.join(', ')}`);
});

test('the known-gap list does not carry stale entries', () => {
  const subject = apis();
  const stale: string[] = [];
  for (const [name, members] of Object.entries(KNOWN_GAPS)) {
    const text = subject[name]?.text ?? '';
    for (const member of members) {
      if (text.includes(member)) stale.push(`${name}.${member}`);
    }
  }
  assert.deepEqual(stale, [], `these are now documented - remove them: ${stale.join(', ')}`);
});
