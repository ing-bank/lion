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

const DEFINE_IMPORT = /^([ \t]*)import\s+['"]@lion\/ui\/define\/lion-([a-z0-9-]+)\.js['"];?[ \t]*$/;
const LION_IMPORT = /^[ \t]*import\s*\{([^}]*)\}\s*from\s*['"]@lion\/ui\//;
const FENCE = /^\s*(```|~~~)/;
const RENDERED_NOTE =
  "// Rendered through the host's scoped registry (ScopedElementsMixin), never a global define entrypoint.";
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

/**
 * 1. A whole line that is nothing but a define import becomes the class import it should have been, with its
 *    note on the following line. Line by line, so the structure of the source is kept: one import per line,
 *    comments on their own lines.
 * A code block that already imports the class (e.g. `import { LionCombobox } from '@lion/ui/combobox.js'`)
 * gets only the note: a second import of the same name in one module is a SyntaxError, so the block would not run.
 */
function rewriteDefineStatements(text) {
  let imported = new Set();
  return text
    .split('\n')
    .map(line => {
      if (FENCE.test(line)) {
        imported = new Set();
        return line;
      }
      const existing = LION_IMPORT.exec(line);
      if (existing) {
        for (const binding of existing[1].split(',')) {
          const name = binding
            .trim()
            .split(/\s+as\s+/)[0]
            .trim();
          if (name) imported.add(name);
        }
        return line;
      }
      const match = DEFINE_IMPORT.exec(line);
      if (!match) return line;
      const [, indent, name] = match;
      const note = `${indent}${RENDERED_NOTE}`;
      if (!shipsClassEntrypoint(name)) {
        return [
          `${indent}// <lion-${name}> is not a module of its own - look its entrypoint up in references/entrypoints.md.`,
          note,
        ].join('\n');
      }
      const className = `Lion${pascalCase(name)}`;
      if (imported.has(className)) return note;
      imported.add(className);
      return [`${indent}import { ${className} } from '@lion/ui/${name}.js';`, note].join('\n');
    })
    .join('\n');
}

export function rewriteDefineImports(text) {
  if (typeof text !== 'string' || !text.includes('@lion/ui/define/')) return text;
  const statements = rewriteDefineStatements(text);
  // 2. Everywhere else - prose, comments, inline code - the specifier is wrong on its own, so name the
  //    class entrypoint instead. This is what makes the skill stop advertising the entrypoint it forbids.
  return statements
    .replace(DEFINE_SPECIFIER, (_m, name) =>
      shipsClassEntrypoint(name) ? `@lion/ui/${name}.js` : `<lion-${name}>`,
    )
    .replace(DEFINE_PLACEHOLDER, (_m, name) => `<lion-${name}>`);
}

/**
 * Doc pages the generator does not merge into a reference (`docs/components/<name>/`). A link to one of them
 * from a generated reference points at a file that does not exist in the skill, so it is dead.
 */
export const EXCLUDED_DOC_PAGES = ['index.md', 'api-table.md', 'extensions.md', 'migration.md'];

const LINK_ONLY_LINE = /^\s*\[([^\]]*)\]\(([^)\s]+)\)\s*$/;
const ANY_LINK = /\[([^\]]*)\]\(([^)\s]+)\)/g;

/** A relative link to a markdown page (not a web URL, mailto or same-page anchor). */
function isRelativeMarkdownLink(target) {
  return !/^(https?:|mailto:|#)/.test(target) && target.split('#')[0].endsWith('.md');
}

function isExcludedPageLink(target) {
  return EXCLUDED_DOC_PAGES.includes(path.posix.basename(target.split('#')[0]));
}

/**
 * Neutralises dead relative links: a link whose target is not shipped in the skill (`isDead(target)`) keeps only
 * its label, and a line that is nothing but a link to an excluded page (a "show more" pointer) is removed,
 * because its label carries no meaning once the page is absent.
 * @param {string} markdown
 * @param {(target: string) => boolean} isDead
 * @returns {string}
 */
export function neutraliseDeadLinks(markdown, isDead) {
  if (typeof markdown !== 'string' || !markdown.includes('](')) return markdown;
  return markdown
    .split('\n')
    .flatMap(line => {
      const only = LINK_ONLY_LINE.exec(line);
      if (
        only &&
        isRelativeMarkdownLink(only[2]) &&
        isExcludedPageLink(only[2]) &&
        isDead(only[2])
      ) {
        return [];
      }
      return [
        line.replace(ANY_LINK, (whole, label, target) =>
          isRelativeMarkdownLink(target) && isDead(target) ? label : whole,
        ),
      ];
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}
