/**
 * Read slot declarations out of `get slots()`.
 *
 * A component declares the slots it creates in a `get slots()` accessor that returns an object literal
 * spreading `...super.slots`, with the JSDoc above each key as the slot's description:
 *
 *   get slots() {
 *     return {
 *       ...super.slots,
 *       /** The interactive element that can receive focus *​/
 *       input: () => { ... },
 *     };
 *   }
 *
 * So a slot's NAME is derivable and its DESCRIPTION is not - which is why the docs annotate with `@slot`
 * JSDoc and take the names from here. Two things this deliberately does not do:
 *
 * - it does not regex a template for `<slot name=...>`: that also matches demo code, which produced
 *   slots that do not exist (`overlays:my-content`, `overlays:x`);
 * - it does not slice the getter body at the first `}`: the arrow functions in the values carry their own
 *   object literals and keymaps, which produced a bogus 56 slots where the real count is 18.
 */
import fs from 'node:fs';

/**
 * The class a `get slots()` belongs to: the nearest `class X` above it. Factory mixins
 * (`superclass => class extends …`) have no name of their own, which is exactly the gap that keeps them
 * out of the manifest.
 * @param {string} source
 * @param {number} index
 * @returns {string}
 */
export function classNameFor(source, index) {
  const matches = [...source.slice(0, index).matchAll(/class\s+([A-Z]\w+)/g)];
  return matches.length > 0 ? matches[matches.length - 1][1] : '<anonymous>';
}

/**
 * The object literal a getter returns, with its braces balanced.
 * @param {string} source
 * @param {number} from index just after the getter's opening brace
 * @returns {string | null}
 */
export function returnedObjectLiteral(source, from) {
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
 * Only the keys at depth 1 of the returned literal are slots. The JSDoc directly above a key is its
 * description.
 * @param {string} body
 * @returns {{ name: string, description: string }[]}
 */
export function slotEntries(body) {
  const slots = [];
  let depth = 0;
  let description = '';
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (depth === 0) {
      if (trimmed.startsWith('/**')) description = trimmed.replace(/^\/\*\*?\s*/, '');
      else if (trimmed.endsWith('*/')) {
        description = `${description} ${trimmed.replace(/\*\/$/, '')}`.trim();
      } else if (trimmed.startsWith('*')) {
        description = `${description} ${trimmed.replace(/^\*\s?/, '')}`.trim();
      } else if (trimmed.length > 0) {
        const key = trimmed.match(/^(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$-]*))\s*:/);
        if (key && !trimmed.startsWith('...')) slots.push({ name: key[1] ?? key[2] ?? key[3], description });
        description = '';
      }
    }
    depth += (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0);
  }
  return slots;
}

/**
 * Every `get slots()` in one source file, attributed to the class or factory it belongs to.
 * @param {string} source
 * @returns {{ owner: string, name: string, description: string }[]}
 */
export function slotsInSource(source) {
  const found = [];
  for (const match of source.matchAll(/get\s+slots\(\)\s*\{/g)) {
    const at = match.index;
    const owner = classNameFor(source, at);
    const body = returnedObjectLiteral(source, at + match[0].length);
    if (!body) continue;
    for (const slot of slotEntries(body)) found.push({ owner, ...slot });
  }
  return found;
}

/**
 * Every slot declared anywhere under a components root, keyed `${owner}#${slotName}`.
 * @param {string} root e.g. `packages/ui/components`
 * @returns {Map<string, { description: string, file: string }>}
 */
export function declaredSlots(root) {
  const found = new Map();
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.js') && full.includes('/src/')) {
        for (const slot of slotsInSource(fs.readFileSync(full, 'utf8'))) {
          found.set(`${slot.owner}#${slot.name}`, { description: slot.description, file: full });
        }
      }
    }
  };
  walk(root);
  return found;
}
