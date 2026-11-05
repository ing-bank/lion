#!/usr/bin/env node
/**
 * Deterministic invariants for `packages/ui/custom-elements.json`.
 *
 * The manifest is a build artifact and is deliberately not tracked (`**\/custom-elements.json` is
 * gitignored), so a diff never shows when a rule that shapes it breaks. `skills:check` already catches
 * everything that reaches the generated skill; this script catches the rest - the rules that only ever
 * show up inside the manifest, where nobody would notice.
 *
 * Run it after `npm run custom-elements-manifest`.
 */
import fs from 'node:fs';

const manifestPath = 'packages/ui/custom-elements.json';
const cem = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const classes = cem.modules.flatMap(module => (module.declarations ?? []).filter(d => d.kind === 'class'));
const failures = [];

/**
 * Members that come from a mixin on the generator's inheritance deny-list must never surface as an own
 * member. Measured: `localizeNamespaces` did exactly that once the module graph stopped resolving
 * `inheritedFrom` for it, and the api-table coverage gate was the only thing that noticed.
 */
const deniedMemberNames = ['localizeNamespaces'];
for (const declaration of classes) {
  for (const member of declaration.members ?? []) {
    if (deniedMemberNames.includes(member.name) && !member.inheritedFrom) {
      failures.push(`${declaration.name}.${member.name} leaked from a deny-listed mixin`);
    }
  }
}

/**
 * Slot coverage is a ratchet, not a target: the measured baseline may not drop. It grows as the
 * remaining annotations land (24 of the 49 template slots are still unannotated).
 */
const ownSlots = new Set();
const inheritedSlots = new Set();
for (const declaration of classes) {
  for (const slot of declaration.slots ?? []) {
    const key = `${declaration.name}#${slot.name}`;
    if (slot.inheritedFrom) inheritedSlots.add(key);
    else ownSlots.add(key);
  }
}
const MIN_OWN_SLOTS = 20;
if (ownSlots.size < MIN_OWN_SLOTS) {
  failures.push(`own slot annotations dropped to ${ownSlots.size} (baseline ${MIN_OWN_SLOTS})`);
}

/**
 * Slots must be inherited rather than repeated: the field structure is annotated once on LionField and
 * has to reach the fields through the chain, not by re-declaring it per component.
 */
const fields = classes.filter(d => d.name === 'LionField')[0];
const inheritedFieldSlots = classes.filter(d => (d.slots ?? []).some(s => s.inheritedFrom?.name === 'LionField'));
if (!fields || inheritedFieldSlots.length < 5) {
  failures.push(
    `the field slots are not inherited: ${inheritedFieldSlots.length} classes inherit from LionField`,
  );
}

/**
 * The extension layer IS the mixin surface, so the mixins have to be in the manifest at all. Today they
 * are factory functions and the analyzer skips them; this reports the gap rather than hiding it.
 */
const MIXINS = [
  'FormControlMixin',
  'FocusMixin',
  'FormatMixin',
  'InteractionStateMixin',
  'FormRegisteringMixin',
  'FormRegistrarMixin',
  'FormRegistrarPortalMixin',
];
const names = new Set(classes.map(d => d.name));
const missingMixins = MIXINS.filter(name => !names.has(name));

/**
 * The slot declarations a component actually makes live in `get slots()` (17 source files), which is
 * noise-free - unlike a regex over templates, which also matches demo code (measured: overlays:my-content,
 * overlays:my-content-outlet, overlays:x). So: the NAME comes from `get slots()`, the CONTENT (the
 * description a consumer reads) comes from the `@slot` JSDoc. This is the gate for the remaining work,
 * and the covered count is a ratchet so the gap can only shrink.
 */
/**
 * The class a `get slots()` belongs to: the nearest `class X` above it. Factory mixins (`superclass =>
 * class extends …`) have no name, which is exactly the gap that keeps them out of the manifest.
 */
function classNameFor(source, index) {
  const matches = [...source.slice(0, index).matchAll(/class\s+([A-Z]\w+)/g)];
  return matches.length > 0 ? matches[matches.length - 1][1] : '<anonymous>';
}

/**
 * The object literal the getter returns, with its braces balanced. Slicing to the next `}` is what
 * produced the earlier noise (LionItem#TODO, #Enter, #ArrowUp, #https): the arrow functions in the values
 * carry their own object literals, keymaps and switch bodies.
 */
function returnedObjectLiteral(source, from) {
  const open = source.indexOf('{', source.indexOf('return', from));
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  return null;
}

/**
 * Only the keys at depth 1 of the returned literal are slots. The JSDoc directly above a key is the
 * description - the part a consumer reads and the part that cannot be derived from anywhere else.
 */
function slotEntries(body) {
  const slots = [];
  let depth = 0;
  let description = '';
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (depth === 0) {
      if (trimmed.startsWith('/**')) description = trimmed.replace(/^\/\*\*?\s*/, '');
      else if (trimmed.endsWith('*/')) description = `${description} ${trimmed.replace(/\*\/$/, '')}`.trim();
      else if (trimmed.startsWith('*')) {
        description = `${description} ${trimmed.replace(/^\*\s?/, '')}`.trim();
      } else if (trimmed.length > 0) {
        const key = trimmed.match(/^(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$-]*))\s*:/);
        if (key && !trimmed.startsWith('...')) {
          slots.push({ name: key[1] ?? key[2] ?? key[3], description });
        }
        description = '';
      }
    }
    depth += (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0);
  }
  return slots;
}

function declaredSlots() {
  const found = new Map();
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.js') && full.includes('/src/')) {
        const source = fs.readFileSync(full, 'utf8');
        for (const match of source.matchAll(/get\s+slots\(\)\s*\{/g)) {
          const at = match.index;
          const owner = classNameFor(source, at);
          const body = returnedObjectLiteral(source, at + match[0].length);
          if (!body) continue;
          for (const slot of slotEntries(body)) {
            found.set(`${owner}#${slot.name}`, { description: slot.description, file: full });
          }
        }
      }
    }
  };
  walk('packages/ui/components');
  return found;
}

const declared = declaredSlots();
const covered = [];
const uncovered = [];
const withoutDescription = [];
for (const [key, { description, file }] of declared) {
  const [className, slotName] = key.split('#');
  const declaration = classes.find(d => d.name === className);
  if (!declaration) {
    uncovered.push(`${key} (${className} is not in the manifest at all — see ${file})`);
    continue;
  }
  const annotated = (declaration.slots ?? []).find(s => s.name === slotName);
  if (annotated) {
    covered.push(key);
    if (!annotated.description) withoutDescription.push(key);
  } else {
    uncovered.push(key);
  }
}
const MIN_DECLARED_SLOTS_COVERED = 10;
if (covered.length < MIN_DECLARED_SLOTS_COVERED) {
  failures.push(
    `annotated slots for declared \`get slots()\` slots dropped to ${covered.length} ` +
      `(baseline ${MIN_DECLARED_SLOTS_COVERED})`,
  );
}

if (failures.length > 0) {
  console.error('cem:check failed:');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error(
    `  declared in \`get slots()\`: ${covered.length + uncovered.length}, annotated: ${covered.length}, ` +
      `still open: ${uncovered.length}`,
  );
  if (uncovered.length > 0) console.error(`    ${uncovered.join(' | ')}`);
  process.exit(1);
}

console.log(
  `cem:check ok — ${classes.length} classes, ${ownSlots.size} own slots, ` +
    `${inheritedSlots.size} inherited slots, ${inheritedFieldSlots.length} classes inherit the field slots`,
);
console.log(
  `  slots declared in \`get slots()\`: ${covered.length + uncovered.length}, annotated: ${covered.length}, ` +
    `still open: ${uncovered.length}, annotated without a description: ${withoutDescription.length}`,
);
if (uncovered.length > 0) console.log(`    ${uncovered.join(' | ')}`);
console.log(
  `  note: ${missingMixins.length}/${MIXINS.length} mixins are still absent from the manifest ` +
    `(factory functions): ${missingMixins.join(', ')}`,
);
