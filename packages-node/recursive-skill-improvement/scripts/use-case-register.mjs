#!/usr/bin/env node
/**
 * The use-case register for story 1: every documented use case, and whether a scenario covers it.
 *
 * The inventory lives in the generated references (`## Use Cases` per component), because that is where the
 * docs' knowledge lands. "Covered" means the scenario for that component exists; it does NOT mean the use
 * case is asserted - the scenarios are one-per-component today, so this register is the gap list, not a
 * pass certificate.
 */
import fs from 'node:fs';
import path from 'node:path';

const refsDir = 'packages/ui/skills/lion-ui/references/components';
const ledger = JSON.parse(fs.readFileSync('packages-node/recursive-skill-improvement/results/ledger.json', 'utf8'));
const scenarios = new Set((ledger.entries ?? []).map(entry => entry.scenario).filter(Boolean));

/**
 * A documented name can be a component OR a system - `icon` is a system in `SYSTEM_NAMES`, so looking only
 * at `component/<name>` reported it as uncovered while `system/icon` exists. That false gap is exactly the
 * kind of claim this register exists to prevent, so it checks both namespaces and reports which one matched.
 */
const scenarioFor = name => {
  for (const namespace of ['component', 'system', 'field', 'form']) {
    if (scenarios.has(`${namespace}/${name}`)) return `${namespace}/${name}`;
  }
  return undefined;
};

const rows = [];
for (const file of fs.readdirSync(refsDir).filter(name => name.endsWith('.md'))) {
  const component = path.basename(file, '.md');
  const body = fs.readFileSync(path.join(refsDir, file), 'utf8');
  const section = /## Use Cases\n([\s\S]*?)(?=\n## |$)/.exec(body);
  /**
   * A use case is a documented story, so the inventory is the `### ` headings in that section ("Default
   * Accordion collapsed", "Prefilled"). Counting bullets instead found only 92 across 14 components and
   * silently dropped the 20 references whose stories are prose-plus-snippet, which is how a partial number
   * nearly became "the" number.
   */
  const useCases = section
    ? section[1]
        .split('\n')
        .filter(line => /^### /.test(line))
        .map(line => line.replace(/^### /, '').trim())
    : [];
  const scenario = scenarioFor(component);
  for (const useCase of useCases) rows.push({ component, useCase, scenario });
}

const withScenario = rows.filter(row => row.scenario).length;
const components = [...new Set(rows.map(row => row.component))];
const noScenario = components.filter(name => !scenarioFor(name));

console.log(`use cases gedocumenteerd: ${rows.length} over ${components.length} componenten/systemen`);
console.log(`met een scenario: ${components.length - noScenario.length} | zonder: ${noScenario.length}`);
console.log(
  `use cases in een gedekt component: ${withScenario} | in een ongedekt component: ${rows.length - withScenario}`,
);
console.log('zonder scenario:', noScenario.join(', ') || '(geen)');

const perComponent = {};
for (const row of rows) perComponent[row.component] = (perComponent[row.component] ?? 0) + 1;
console.log('meeste use cases:');
for (const [name, count] of Object.entries(perComponent)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)) {
  const covered = scenarioFor(name);
  console.log(`  ${name}: ${count}${covered ? ` ✓ ${covered}` : ' ✗ geen scenario'}`);
}

fs.writeFileSync('/tmp/use-case-register.json', JSON.stringify(rows, null, 2));
console.log(`register: /tmp/use-case-register.json (${rows.length} rijen)`);
