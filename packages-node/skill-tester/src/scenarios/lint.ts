/**
 * Scenario linter — the assertions that belong to a *prompt*.
 *
 * A prompt and its checks are a single artifact: if the checks assert something the prompt never
 * demanded, a correct answer fails (measured: a check demanded a rendered `<lion-input-iban>`
 * while the prompt asked for "a field where a user can enter an IBAN", so the model's legitimate
 * subclass answer was marked wrong). If the prompt demands something no check measures, the prompt
 * is decoration. This linter makes both directions mechanical, so a bad scenario fails before a
 * model is ever run.
 *
 * The seven assertions:
 *
 *   L1  every check targets the deliverable file
 *   L2  the behaviour test imports the PRODUCED file (never just the library)
 *   L3  a class named in the prompt is asserted by a check
 *   L4  every value the prompt explicitly demands is measured (check or behaviour test)
 *   L5  everything referenced actually exists (entrypoints/tags/reference docs)
 *   L6  a TODO starter leaks no answer (no imports, no convention statements)
 *   L7  exactly one deliverable, and the prompt forbids creating anything else
 *
 * L4 and L5 are deliberately literal: they only resolve what can be resolved without judgement.
 * Anything requiring taste (is this example idiomatic? is it minimal?) is a review question, not
 * an assertion, and is out of scope here.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { TestScenario } from './types.ts';

export type LintFinding = {
  scenario: string;
  /** Which of the seven assertions produced the finding (L1..L7). */
  assertion: string;
  message: string;
};

export type LintContext = {
  /** Component names that exist under `packages/ui/components`. */
  components?: string[];
  /** System names that exist under `docs/fundamentals/systems`. */
  systems?: string[];
  /** The skill directory, so `references/...` paths in a prompt can be resolved. */
  skillDir?: string;
};

/** Values the prompt demands, that something must therefore measure. */
function demandedValues(prompt: string): string[] {
  const values = new Set<string>();
  for (const match of prompt.matchAll(/"([^"]{2,})"/g)) values.add(match[1]);
  for (const match of prompt.matchAll(/`([^`]{2,})`/g)) values.add(match[1]);
  // Bare tokens that look like a concrete value rather than prose (e.g. NL17INGB0002822608).
  for (const match of prompt.matchAll(/\b[A-Z0-9]{8,}\b/g)) {
    if (/[A-Z]/.test(match[0]) && /\d/.test(match[0])) values.add(match[0]);
  }
  // Underscore/dash identifiers are library/API names, not demanded values. Markup fragments
  // ("<input>", "<form>") describe the DOM rather than demanding a literal, so they are asserted as
  // selectors by checks/behaviour and are not treated as values here.
  return [...values].filter(
    value =>
      !value.includes('/') &&
      !value.includes('.js') &&
      !value.includes('<') &&
      !value.includes('>'),
  );
}

/** `@lion/ui/<name>.js` subpaths referenced by the checks. */
function referencedEntrypoints(scenario: TestScenario): string[] {
  const names = new Set<string>();
  for (const check of scenario.checks ?? []) {
    for (const match of (check.pattern ?? '').matchAll(/@lion\/ui\/(?:define\/lion-)?([a-z0-9-]+)\.js/g)) {
      names.add(match[1]);
    }
  }
  return [...names];
}

export function lintScenario(scenario: TestScenario, context: LintContext = {}): LintFinding[] {
  const findings: LintFinding[] = [];
  const add = (assertion: string, message: string) =>
    findings.push({ scenario: scenario.name, assertion, message });

  const checks = scenario.checks ?? [];
  const declared = Object.keys(scenario.files);

  // L1 — every check targets the deliverable.
  for (const check of checks) {
    if (check.file !== scenario.targetFile) {
      add('L1', `check targets "${check.file}" but the deliverable is "${scenario.targetFile}"`);
    }
  }

  // L2 — the behaviour test must exercise the produced file, not just the library.
  if (scenario.behaviour && !scenario.behaviour.testSource.includes(`./${scenario.targetFile}`)) {
    add('L2', `behaviour test does not import the produced file (./${scenario.targetFile})`);
  }

  // L3 — a class named in the prompt must be asserted.
  const named = /class named `([A-Za-z0-9_]+)`/.exec(scenario.prompt);
  if (named) {
    const expected = `export class ${named[1]}`;
    if (!checks.some(check => (check.pattern ?? '').includes(expected))) {
      add('L3', `prompt names the class "${named[1]}" but no check asserts \`${expected}\``);
    }
  }

  // L4 — every demanded value must be measured somewhere.
  const measured = `${JSON.stringify(checks)}${scenario.behaviour?.testSource ?? ''}`;
  for (const value of demandedValues(scenario.prompt)) {
    if (!measured.includes(value)) {
      add('L4', `prompt demands "${value}" but neither a check nor the behaviour test measures it`);
    }
  }

  // L5 — reachability.
  for (const name of referencedEntrypoints(scenario)) {
    const known = [...(context.components ?? []), ...(context.systems ?? [])];
    if (known.length > 0 && !known.includes(name)) {
      add('L5', `checks reference '@lion/ui/${name}.js' but "${name}" is not a known component/system`);
    }
  }
  if (context.skillDir) {
    for (const match of scenario.prompt.matchAll(/references\/[A-Za-z0-9/_.-]+\.md/g)) {
      if (!fs.existsSync(path.join(context.skillDir, match[0]))) {
        add('L5', `prompt references "${match[0]}" which does not exist in the skill`);
      }
    }
  }

  // L6 — a TODO starter must not pre-answer anything.
  for (const [file, content] of Object.entries(scenario.files)) {
    if (!/TODO/i.test(content)) continue; // only stub starters are held to this
    if (/^\s*import\b/m.test(content)) {
      add('L6', `stub starter "${file}" contains an import, pre-answering the entrypoint checks`);
    }
    if (/\b(never|not from|entrypoints only)\b/i.test(content)) {
      add('L6', `stub starter "${file}" states a convention, pre-answering the checks`);
    }
  }

  // L7 — exactly one deliverable, and the prompt says so.
  if (declared.length !== 1) {
    add('L7', `expected exactly one starting file, found ${declared.length}: ${declared.join(', ')}`);
  }
  if (!/\bonly\b|nothing else/i.test(scenario.prompt)) {
    add('L7', 'prompt does not restrict the model to the single deliverable file');
  }

  return findings;
}

export function lintScenarios(scenarios: TestScenario[], context: LintContext = {}): LintFinding[] {
  return scenarios.flatMap(scenario => lintScenario(scenario, context));
}
