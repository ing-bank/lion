import { promises as fs } from 'node:fs';
import path from 'node:path';
import { findAffectedUnits } from './reachability.js';

/**
 * Docs-to-unit coupling, the `optionalDep` edge for markdown.
 *
 * A scenario derives from the documentation it was written against, and a change to that documentation must
 * make the scenario *affected* - otherwise a docs fix ships without its use cases ever being re-run. The
 * coupling is declared, not remembered: `packages-node/recursive-skill-improvement/scenario-docs.json` lists, per unit, the
 * doc files it derives from, and this module turns that declaration into the same kind of edge the import
 * graph already produces. No import parsing is involved: a `.md` file is coupled by declaration only, which
 * is what makes the edge optional rather than a build requirement.
 */

export const DEFAULT_DECLARATION = 'packages-node/recursive-skill-improvement/scenario-docs.json';

/**
 * @param {string} cwd
 * @param {string} [declarationPath]
 * @returns {Promise<Record<string, string[]>>} unit -> the doc files it derives from
 */
export async function loadScenarioDocs(cwd, declarationPath = DEFAULT_DECLARATION) {
  const raw = await fs.readFile(path.join(cwd, declarationPath), 'utf-8');
  const parsed = JSON.parse(raw);
  return parsed.scenarios ?? {};
}

/**
 * The declaration as a unit-to-files graph, in the shape `reachability.js` works on.
 * @param {Record<string, string[]>} declaration
 * @returns {Map<string, Set<string>>}
 */
export function docsGraph(declaration) {
  return new Map(
    Object.entries(declaration).map(([unit, docs]) => [
      unit,
      new Set(docs.map(file => file.replace(/\\/g, '/'))),
    ]),
  );
}

/**
 * Units whose declared docs include any of the changed files.
 * @param {Record<string, string[]>} declaration
 * @param {Iterable<string>} changedFiles
 * @returns {string[]}
 */
export function affectedUnitsForDocs(declaration, changedFiles) {
  const changed = [...changedFiles].map(file => file.replace(/\\/g, '/'));
  return findAffectedUnits(docsGraph(declaration), changed).sort((a, b) => a.localeCompare(b));
}
