import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createComponentScenario, createSystemScenario } from '../src/scenarios/lionUi.ts';
import { evaluateCheck } from '../src/scoring/qualityScore.ts';
import type { TestScenario } from '../src/scenarios/types.ts';

/**
 * Regression: the lion-ui skill taught the validators with a LITERAL placeholder specifier,
 * `import { Required, MinLength } from '<lion-validate>';`. Models copied the placeholder verbatim
 * into their file, and no check caught it — `namedExportsExist` and `importsResolve` both skip
 * unknown/bare specifiers, so a file that cannot load still scored. `entrypointChecks` now carries a
 * `notMatches` on `from '<...>'`, inherited by every component and system scenario.
 *
 * The skill now teaches the real module, `@lion/ui/form-core.js` (packages/ui/exports/form-core.js),
 * so the negative side is the exact specifier the skill ships.
 */

const PLACEHOLDER_DESCRIPTION = 'imports nothing from a placeholder specifier';

function placeholderCheck(scenario: TestScenario) {
  const check = scenario.checks?.find(entry => entry.description === PLACEHOLDER_DESCRIPTION);
  assert.ok(
    check,
    `the "${scenario.name}" scenario must carry the placeholder check so every scenario inherits it`,
  );
  assert.equal(check.type, 'notMatches');
  return check;
}

function runCheck(scenario: TestScenario, content: string) {
  const target = scenario.targetFile;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'st-placeholder-'));
  fs.mkdirSync(path.dirname(path.join(root, target)), { recursive: true });
  fs.writeFileSync(path.join(root, target), content);
  return evaluateCheck(root, placeholderCheck(scenario), [target]);
}

const scenarios: TestScenario[] = [
  createSystemScenario('form'),
  createComponentScenario('button', { knownTags: ['lion-button'] }),
];

test('every component and system scenario carries the placeholder-specifier check', () => {
  for (const scenario of scenarios) placeholderCheck(scenario);
});

test('a file importing a placeholder specifier fails', () => {
  // The exact shape the bug shipped, plus the other angle-bracket forms a model could copy.
  for (const content of [
    "import { Required, MinLength } from '<lion-validate>';\n",
    'import { Required } from "<the-validator-module>";\n',
    "import { html } from 'lit';\nimport { Required } from '<module>';\nexport const x = 1;\n",
  ]) {
    const outcome = runCheck(scenarios[0], content);
    assert.equal(
      outcome.passed,
      false,
      `a placeholder specifier must fail the run: ${JSON.stringify(content)}`,
    );
  }
});

test('a file importing the real module (and bare lit) passes', () => {
  const content = [
    "import { html } from 'lit';",
    "import { Required, MinLength, IsEmail } from '@lion/ui/form-core.js';",
    'export const v = [new Required(), new MinLength(3), new IsEmail()];',
    '',
  ].join('\n');
  const outcome = runCheck(scenarios[0], content);
  assert.equal(outcome.passed, true, JSON.stringify(outcome));
});

test('the real validator specifier ships the classes the skill imports', () => {
  // `@lion/ui/form-core.js` is the authority (packages/ui/exports/form-core.js). If the skill ever
  // names a class the module does not export, `namedExportsExist` fails real runs — so pin it here.
  const exportsFile = fs.readFileSync(
    path.resolve(import.meta.dirname, '../../../packages/ui/exports/form-core.js'),
    'utf-8',
  );
  assert.match(exportsFile, /export \{ Required \}/);
  for (const name of ['MinLength', 'IsEmail', 'Validator']) {
    assert.ok(
      exportsFile.includes(name),
      `@lion/ui/form-core.js must export ${name}, which the skill imports`,
    );
  }
});

test('the placeholder check does not trip on a legitimate angle-free specifier', () => {
  const content = [
    "import { html } from 'lit';",
    "import { LionInput } from '@lion/ui/input.js';",
    "import { helper } from './helper.js';",
    '',
  ].join('\n');
  const outcome = runCheck(scenarios[1], content);
  assert.equal(outcome.passed, true, JSON.stringify(outcome));
});
