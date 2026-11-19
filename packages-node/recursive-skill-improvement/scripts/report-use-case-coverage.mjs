#!/usr/bin/env node
/**
 * Measures which documented use cases a scenario reaches, per component.
 *
 * The inventory is every `## ` heading in `docs/components/<component>/use-cases.md` (outside code
 * fences). Per component, the report records:
 *   - sections:   the number of documented use cases;
 *   - scenario:   whether the scenario registry has one (`component/<name>`, else `system/<name>`);
 *   - behaviour:  whether that scenario carries a behaviour test (a real browser mount);
 *   - reachable:  the sections, when `scenario-docs.json` declares this use-case file for the scenario.
 *
 * "Reachable" means the scenario is wired to the documented use cases, so a docs change re-runs it. It
 * does NOT mean a use case is asserted: a scenario is one per component, so the number is a gap measure,
 * not a pass certificate.
 *
 * Generated output: `docs/fundamentals/node-tools/recursive-skill-improvement/coverage.md`.
 * Regenerate with: `npm run coverage:use-cases -w packages-node/recursive-skill-improvement`
 *
 * Exports `measureUseCaseCoverage` for the ratchet test (`test-node/useCaseCoverage.test.ts`).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(packageRoot, '../..');
const outputPath = path.join(
  repoRoot,
  'docs/fundamentals/node-tools/recursive-skill-improvement/coverage.md',
);
const COMMAND = 'npm run coverage:use-cases -w packages-node/recursive-skill-improvement';

/** `## ` headings in a use-cases file, ignoring any inside a fenced code block. */
export function useCaseHeadings(markdown) {
  const headings = [];
  let inFence = false;
  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && /^## /.test(line)) headings.push(line.slice(3).trim());
  }
  return headings;
}

/**
 * @param {string} root the repository root
 * @returns {Promise<{components: object[], scenariosWithoutUseCases: string[], totals: object}>}
 */
export async function measureUseCaseCoverage(root = repoRoot) {
  // The scenario registry is TypeScript; Node 22 strips the types on import.
  const { loadLionUiScenarios } = await import(
    pathToFileURL(path.join(root, 'packages-node/recursive-skill-improvement/src/scenarios/index.ts')).href
  );
  const scenarios = loadLionUiScenarios({ repoRoot: root });
  const byName = new Map(scenarios.map(scenario => [scenario.name, scenario]));

  const declaration = JSON.parse(
    fs.readFileSync(path.join(root, 'packages-node/recursive-skill-improvement/scenario-docs.json'), 'utf8'),
  ).scenarios;

  const docsDir = path.join(root, 'docs/components');
  const names = fs
    .readdirSync(docsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => fs.existsSync(path.join(docsDir, name, 'use-cases.md')))
    .sort();

  const components = names.map(name => {
    const docPath = `docs/components/${name}/use-cases.md`;
    const sections = useCaseHeadings(fs.readFileSync(path.join(root, docPath), 'utf8')).length;
    const scenarioName = [`component/${name}`, `system/${name}`].find(candidate => byName.has(candidate));
    const scenario = scenarioName ? byName.get(scenarioName) : undefined;
    // Reachable through ANY scenario that declares this file (e.g. combobox's symptom scenarios reach the
    // same use-cases.md as component/combobox), so a file is counted once, not once per scenario.
    const declared = Object.values(declaration).some(docs => docs.includes(docPath));
    return {
      name,
      sections,
      scenario: scenarioName ?? null,
      behaviour: Boolean(scenario?.behaviour),
      declared,
      reachable: declared ? sections : 0,
    };
  });

  const scenariosWithoutUseCases = scenarios
    .map(scenario => scenario.name)
    .filter(name => !(declaration[name] ?? []).some(docPath => docPath.endsWith('/use-cases.md')))
    .sort();

  const totals = {
    components: components.length,
    sections: components.reduce((sum, c) => sum + c.sections, 0),
    withScenario: components.filter(c => c.scenario).length,
    withBehaviour: components.filter(c => c.behaviour).length,
    reachableSections: components.reduce((sum, c) => sum + c.reachable, 0),
  };
  return { components, scenariosWithoutUseCases, totals };
}

/** The generated markdown page: header, per-component table, totals, and what the columns do not claim. */
export function renderCoveragePage({ components, scenariosWithoutUseCases, totals }) {
  const yesNo = value => (value ? 'yes' : 'no');
  const rows = components.map(
    c =>
      `| \`${c.name}\` | ${c.sections} | ${c.scenario ? `\`${c.scenario}\`` : '—'} | ${yesNo(c.behaviour)} | ${c.reachable} |`,
  );
  return [
    '---',
    "parts:",
    '  - Node Tools',
    "title: 'recursive-skill-improvement: use-case coverage'",
    'eleventyNavigation:',
    '  key: Node Tools >> recursive-skill-improvement use-case coverage',
    '  parent: Node Tools >> recursive-skill-improvement',
    '  title: Use-case coverage',
    '  order: 40',
    '---',
    '',
    '# recursive-skill-improvement: use-case coverage',
    '',
    '> **Generated — do not edit by hand.** Regenerate with:',
    '>',
    `> \`${COMMAND}\``,
    '>',
    '> The script is `packages-node/recursive-skill-improvement/scripts/report-use-case-coverage.mjs`. It reads the',
    '> `docs/components/*/use-cases.md` files, the scenario registry and `scenario-docs.json`.',
    '',
    `Totals: **${totals.components}** components with documented use cases, **${totals.sections}** documented`,
    `use cases, **${totals.withScenario}** components with a scenario, **${totals.withBehaviour}** with a behaviour`,
    `test, **${totals.reachableSections}** documented use cases reachable from a scenario.`,
    '',
    '"Reachable" means the scenario declares the use-case file, so a docs change re-runs it. It does not',
    'mean a use case is asserted: scenarios are one per component, so this page is the gap list.',
    '',
    '| Component | Documented use cases | Scenario | Behaviour test | Reachable from a scenario |',
    '| --- | ---: | --- | --- | ---: |',
    ...rows,
    '',
    scenariosWithoutUseCases.length > 0
      ? `Scenarios with no documented use-case file: ${scenariosWithoutUseCases.map(n => `\`${n}\``).join(', ')}.`
      : 'Every scenario maps to a documented use-case file.',
    '',
  ].join('\n');
}

async function main() {
  const report = await measureUseCaseCoverage(repoRoot);
  fs.writeFileSync(outputPath, renderCoveragePage(report));
  const { totals } = report;
  console.log(
    `use-case coverage: ${totals.components} components, ${totals.sections} documented use cases, ` +
      `${totals.withScenario} with a scenario, ${totals.withBehaviour} with a behaviour test, ` +
      `${totals.reachableSections} reachable from a scenario`,
  );
  console.log(`wrote ${path.relative(repoRoot, outputPath)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
