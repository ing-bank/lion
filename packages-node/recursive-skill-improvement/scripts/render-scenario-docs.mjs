#!/usr/bin/env node
/**
 * Writes `scenario-docs.json`: the docs each scenario derives from. A docs change marks the scenarios that
 * derive from it as affected (`packages-node/change-graph/src/docs-coupling.js`), and the coverage report
 * counts a documented use case as reachable only when a scenario declares its docs file.
 *
 * Two kinds of entry, and this script owns only one of them:
 *
 *   - a DERIVED use-case scenario (`use-case/<unit>--<slug>`) declares exactly the docs file it was derived
 *     from. This script writes those entries, from the same derivation the registry uses, so no one types
 *     them by hand;
 *   - every other entry (components, systems, integrations, repairs and the hand-authored symptom
 *     scenarios) is CURATED: it lists the docs a person judged the scenario depends on. This script keeps
 *     those lines exactly as they are.
 *
 * Regenerate with: `npm run scenarios:docs -w packages-node/recursive-skill-improvement`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(packageRoot, '../..');
const outputPath = path.join(packageRoot, 'scenario-docs.json');

/**
 * The file's content with the derived entries written in. Existing curated entries are kept verbatim;
 * a derived entry overwrites any previous value for its name, because the derivation is authoritative for it.
 * Keys are sorted, as the committed file has always been, so a regeneration is a minimal diff.
 */
export function mergeScenarioDocs(existing, derivedDocs) {
  const scenarios = { ...existing.scenarios };
  for (const [name, docs] of Object.entries(derivedDocs)) scenarios[name] = docs;
  const sorted = Object.fromEntries(Object.keys(scenarios).sort().map(key => [key, scenarios[key]]));
  return { ...existing, scenarios: sorted };
}

/** `use-case/<unit>--<slug>` -> `[the docs file it was derived from]`, from the registry's own derivation. */
export async function deriveUseCaseDocs(root = repoRoot) {
  const { deriveUseCaseScenariosSync } = await import(
    pathToFileURL(path.join(root, 'packages-node/recursive-skill-improvement/src/scenarios/useCases.ts')).href
  );
  const { derived } = deriveUseCaseScenariosSync({ repoRoot: root });
  return Object.fromEntries(derived.map(entry => [entry.scenario.name, [entry.source.file]]));
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const derivedDocs = await deriveUseCaseDocs(repoRoot);
  const merged = mergeScenarioDocs(existing, derivedDocs);
  fs.writeFileSync(outputPath, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(
    `scenario-docs: ${Object.keys(derivedDocs).length} derived use-case declaration(s) written; ` +
      `${Object.keys(merged.scenarios).length} scenario(s) in ${path.relative(repoRoot, outputPath)}`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
