/* eslint-disable no-console */
/**
 * A server command has to answer within 20000ms.
 *
 * That limit is hardcoded in `@web/dev-server-core`'s `webSocketsPlugin` (the browser fails a
 * command with "Did not receive a server response ... within 20000ms") and cannot be raised through
 * the test runner config. Every `sr.*` step is one such command, so anything inside it - a wait for
 * a screen reader to speak, typing through a reader, an anchor that runs several reader commands -
 * has to fit in that window. This gate keeps the numbers we control on the safe side of it.
 *
 * Guards:
 *   1. the budget and hard limit constants in the flow
 *   2. the wait default the browser sends to the server
 *   3. any literal wait timeout in a screen reader test
 *   4. a test timeout that is longer than the time the whole suite may take
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const FLOW_DIR = path.join(__dirname, '..', 'packages-node', 'test-runner-screenreader');
const PLUGIN = path.join(FLOW_DIR, 'src', 'screenreaderPlugin.js');
const COMMANDS = path.join(FLOW_DIR, 'src', 'commands.js');
const SR_CONFIG = path.join(__dirname, '..', 'web-test-runner-sr.config.mjs');

/** The limit in `@web/dev-server-core`: only change this when that number changes. */
const HARD_LIMIT_MS = 20000;
/** The bump we want between our own budget and the hard limit, so a command is not borderline. */
const MIN_MARGIN_MS = 2000;

const problems = [];
const checked = [];

/**
 * @param {string} file
 * @param {RegExp} pattern
 * @returns {number | undefined}
 */
function readNumber(file, pattern) {
  const match = pattern.exec(fs.readFileSync(file, 'utf8'));
  return match ? Number(match[1]) : undefined;
}

/** 1. the constants of the flow */
const hardLimitMs = readNumber(PLUGIN, /export const SR_COMMAND_HARD_LIMIT_MS = (\d+);/);
const budgetMs = readNumber(PLUGIN, /export const SR_COMMAND_BUDGET_MS = (\d+);/);

if (hardLimitMs !== HARD_LIMIT_MS) {
  problems.push(
    `${path.relative(process.cwd(), PLUGIN)}: SR_COMMAND_HARD_LIMIT_MS is ${
      hardLimitMs ?? 'missing'
    }, expected ${HARD_LIMIT_MS} (@web/dev-server-core webSocketsPlugin: "within 20000ms"). ` +
      'Check that plugin before changing this gate.',
  );
}
if (budgetMs === undefined) {
  problems.push(`${path.relative(process.cwd(), PLUGIN)}: SR_COMMAND_BUDGET_MS is missing.`);
} else {
  if (budgetMs >= HARD_LIMIT_MS) {
    problems.push(
      `${path.relative(process.cwd(), PLUGIN)}: SR_COMMAND_BUDGET_MS (${budgetMs}) has to stay below ` +
        `the hard limit of ${HARD_LIMIT_MS}ms.`,
    );
  }
  if (budgetMs > HARD_LIMIT_MS - MIN_MARGIN_MS) {
    problems.push(
      `${path.relative(process.cwd(), PLUGIN)}: SR_COMMAND_BUDGET_MS (${budgetMs}) leaves less than ` +
        `${MIN_MARGIN_MS}ms margin to the ${HARD_LIMIT_MS}ms hard limit.`,
    );
  }
  checked.push(`budget ${budgetMs}ms < hard limit ${HARD_LIMIT_MS}ms`);
}

/** 2. the wait the browser asks the server for */
const browserWaitMs = readNumber(COMMANDS, /const DEFAULT_WAIT_TIMEOUT = (\d+);/);
// The server side may name the budget constant instead of repeating the number.
const serverWaitRaw = /const DEFAULT_WAIT_TIMEOUT = ([A-Z_a-z0-9]+);/.exec(
  fs.readFileSync(PLUGIN, 'utf8'),
)?.[1];
const serverWaitMs = serverWaitRaw === 'SR_COMMAND_BUDGET_MS' ? budgetMs : Number(serverWaitRaw);

for (const [file, waitMs] of [
  [COMMANDS, browserWaitMs],
  [PLUGIN, serverWaitMs],
]) {
  const label = path.relative(process.cwd(), file);
  if (waitMs === undefined) {
    problems.push(`${label}: DEFAULT_WAIT_TIMEOUT is missing.`);
  } else {
    if (budgetMs !== undefined && waitMs > budgetMs) {
      problems.push(
        `${label}: DEFAULT_WAIT_TIMEOUT (${waitMs}ms) is over the command budget of ${budgetMs}ms.`,
      );
    }
    checked.push(`wait default ${waitMs}ms in ${label}`);
  }
}

/** 3. literal wait timeouts in the screen reader tests */
const testFiles = execFileSync(
  'git',
  ['ls-files', 'packages/ui/components/**/test/*.sr.test.mjs'],
  { encoding: 'utf8' },
)
  .split('\n')
  .filter(Boolean);

let waitLiterals = 0;
for (const testFile of testFiles) {
  const lines = fs.readFileSync(testFile, 'utf8').split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    // sr.waitFor('phrase', { timeout: 25000 })
    if (/\bwaitFor\(/.test(lines[index])) {
      const literal = /timeout:\s*(\d+)/.exec(lines.slice(index, index + 3).join(' '));
      if (literal) {
        waitLiterals += 1;
        const timeout = Number(literal[1]);
        const tooLong = budgetMs !== undefined ? timeout > budgetMs : timeout >= HARD_LIMIT_MS;
        if (tooLong) {
          problems.push(
            `${testFile}:${index + 1}: a wait of ${timeout}ms is over the command budget of ${
              budgetMs ?? HARD_LIMIT_MS
            }ms; the browser stops waiting for the server at ${HARD_LIMIT_MS}ms.`,
          );
        }
      }
    }
  }
}
checked.push(`${waitLiterals} wait timeout(s) in ${testFiles.length} screen reader test file(s)`);

/** 4. suite budget versus test budget */
const testTimeout = readNumber(SR_CONFIG, /timeout: isRealReader \? '(\d+)'/);
const suiteTimeout = readNumber(SR_CONFIG, /testsFinishTimeout: isRealReader \? (\d+)/);

if (testTimeout !== undefined && suiteTimeout !== undefined) {
  if (testTimeout >= suiteTimeout) {
    problems.push(
      `${path.relative(process.cwd(), SR_CONFIG)}: a test timeout of ${testTimeout}ms leaves no room ` +
        `under the ${suiteTimeout}ms the whole suite may take.`,
    );
  }
  checked.push(`test timeout ${testTimeout}ms under suite timeout ${suiteTimeout}ms`);
}

for (const line of checked) {
  console.log(`  ok  ${line}`);
}

if (problems.length > 0) {
  console.error('\nA screen reader command has to answer within 20000ms:\n');
  for (const problem of problems) {
    console.error(`  ✖  ${problem}`);
  }
  console.error(
    '\nSee packages-node/test-runner-screenreader/README.md ("Known limits") for what makes a\n' +
      'command slow: waiting for a reader to speak, typing through VoiceOver, or an anchor that\n' +
      'runs several reader commands.\n',
  );
  process.exit(1);
}

console.log('  ok  every screen reader command fits in the 20s the browser waits\n');
