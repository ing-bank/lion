/**
 * The `lion-ui` skill must never teach a global `@lion/ui/define/*` entrypoint: it registers the element
 * globally and opts out of the host's scoped element registry, which is the rule the skill exists to teach.
 * The harness fails any produced file that imports one (`scenarios: does not use a global define entrypoint`).
 *
 * The source docs do use them, and legitimately: their mdjs preview blocks need the element registered for
 * the docs site to render a live demo. So the generator rewrites them on the way into the skill.
 *
 *   import '@lion/ui/define/lion-progress-indicator.js';
 * becomes
 *   import { LionProgressIndicator } from '@lion/ui/progress-indicator.js';
 *   // Rendered through the host's scoped registry (ScopedElementsMixin) - never '@lion/ui/define/*'.
 */

// Only a specifier that actually ships may be emitted - `packages/ui/exports` is the authority, read
// relative to this file so no caller has to pass it in. A name with no class entrypoint of its own (e.g.
// `validate`, and `checkbox`, whose class lives in the `checkbox-group` module) gets NO specifier at all:
// the element is named and the reader is pointed at the reference table. Guessing a specifier is the exact
// failure this whole rewrite exists to remove, so the rewriter must not commit it either.
const EXPORTS_DIR = path.resolve(new URL('../../exports', import.meta.url).pathname);

function shipsClassEntrypoint(name) {
  return fs.existsSync(path.join(EXPORTS_DIR, name + '.js'));
}

import fs from 'node:fs';
import path from 'node:path';

const DEFINE_IMPORT =
  /^([ \t]*)import\s+['"]@lion\/ui\/define\/lion-([a-z0-9-]+)\.js['"];?[ \t]*$/gm;
const DEFINE_SPECIFIER = /@lion\/ui\/define\/lion-([a-z0-9-]+)\.js/g;
// Prose that names the pattern itself, e.g. "the side-effect `@lion/ui/define/lion-<name>.js` entrypoints".
const DEFINE_PLACEHOLDER = /@lion\/ui\/define\/lion-<([a-z-]+)>(\.js)?/g;

function pascalCase(name) {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const ANY_SPECIFIER = /@lion\/ui\/([a-z0-9-]+)\.js/g;

/**
 * Repairs specifiers that a previous run baked into the skill and that do not ship - the artefacts of the
 * old rewrite, which turned `@lion/ui/define/lion-checkbox.js` into `@lion/ui/checkbox.js`. A specifier
 * that ships is left untouched; one that does not becomes the element name, so the reader is sent to
 * references/entrypoints.md instead of to a module that fails to load.
 */
export function repairUnshippedSpecifiers(text) {
  if (typeof text !== 'string' || !text.includes('@lion/ui/')) return text;
  return text.replace(ANY_SPECIFIER, (match, name) =>
    shipsClassEntrypoint(name) ? match : `<lion-${name}>`,
  );
}

export function rewriteDefineImports(text) {
  if (typeof text !== 'string' || !text.includes('@lion/ui/define/')) return text;
  // 1. A whole line that is nothing but the define import becomes the class import it should have been.
  const statements = text.replace(
    DEFINE_IMPORT,
    (_match, indent, name) =>
      (shipsClassEntrypoint(name)
        ? `${indent}import { Lion${pascalCase(name)} } from '@lion/ui/${name}.js';`
        : `${indent}// <lion-${name}> is not a module of its own - look its entrypoint up in references/entrypoints.md.`) +
      `${indent}// Rendered through the host's scoped registry (ScopedElementsMixin), never a global define entrypoint.`,
  );
  // 2. Everywhere else - prose, comments, inline code - the specifier is wrong on its own, so name the
  //    class entrypoint instead. This is what makes the skill stop advertising the entrypoint it forbids.
  return statements
    .replace(DEFINE_SPECIFIER, (_m, name) =>
      shipsClassEntrypoint(name) ? `@lion/ui/${name}.js` : `<lion-${name}>`,
    )
    .replace(DEFINE_PLACEHOLDER, (_m, name) => `<lion-${name}>`);
}
