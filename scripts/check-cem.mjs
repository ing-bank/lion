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
function declaredSlotNames() {
  const found = new Map();
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.js') && full.includes('/src/')) {
        const source = fs.readFileSync(full, 'utf8');
        for (const [, className, body] of source.matchAll(
          /class\s+([A-Z]\w+)[^{]*\{[\s\S]*?get\s+slots\(\)\s*\{([\s\S]*?)\n  \}/g,
        )) {
          const names = [...body.matchAll(/(?:^|\s)(?:'([^']+)'|"([^"]+)"|(\w+))\s*:/g)].map(
            m => m[1] ?? m[2] ?? m[3],
          );
          if (!found.has(className)) found.set(className, new Set());
          for (const name of names) found.get(className).add(name);
        }
      }
    }
  };
  walk('packages/ui/components');
  return found;
}

const declared = declaredSlotNames();
const covered = [];
const uncovered = [];
for (const [className, slotNames] of declared) {
  const declaration = classes.find(d => d.name === className);
  if (!declaration) {
    uncovered.push(`${className} (class is not in the manifest at all)`);
    continue;
  }
  const annotated = new Set((declaration.slots ?? []).map(s => s.name));
  for (const slotName of slotNames) {
    (annotated.has(slotName) ? covered : uncovered).push(`${className}#${slotName}`);
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
    `still open: ${uncovered.length}`,
);
if (uncovered.length > 0) console.log(`    ${uncovered.join(' | ')}`);
console.log(
  `  note: ${missingMixins.length}/${MIXINS.length} mixins are still absent from the manifest ` +
    `(factory functions): ${missingMixins.join(', ')}`,
);
