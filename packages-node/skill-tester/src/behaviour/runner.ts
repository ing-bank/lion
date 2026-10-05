/**
 * Behaviour tier.
 *
 * Runs the *produced* code in a real browser, using the repo's own test harness
 * (`@web/test-runner` + Playwright chromium) rather than a bespoke page. This is the same
 * machinery the repository's component tests use, and the assertions are borrowed from them
 * (element upgrades, documented properties) rather than invented.
 *
 * Two hard constraints, both measured:
 *
 *   - Lion components need a browser: evaluating `@lion/ui/define/*` under Node dies with
 *     `ReferenceError: window is not defined` (in `form-core/src/FocusMixin.js`).
 *   - The sandbox must live *inside* the repo, because `@lion/ui` is a workspace symlink
 *     (`node_modules/@lion/ui -> packages/ui`) and is unresolvable from a temp dir outside it
 *     (`ERR_MODULE_NOT_FOUND: Cannot find package '@lion/ui'`).
 *
 * The gates stay browser-less and cheap; this tier is the expensive, authoritative oracle and is
 * therefore opt-in.
 *
 * Batching: `runBehaviourSuite` runs many sandboxes' test files in ONE harness invocation (one
 * browser boot) instead of one per scenario. Across ~33 components that is the difference between
 * ~2 minutes and a few seconds. Chunking bounds browser memory.
 *
 * Parsing correctness matters more than anything else here. The harness colours its output, so a
 * line-anchored pattern silently matches nothing and every case reports a FALSE PASS — measured,
 * with `FORCE_COLOR=0` set. Output is therefore ANSI-stripped before parsing, and when the harness
 * reports failed tests that cannot be attributed to a file the whole chunk fails rather than
 * passes: this tier must never fail open.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type BehaviourFailure = { test: string; message: string };

export type BehaviourResult = {
  /** Did every generated assertion pass? */
  passed: boolean;
  /** Did the harness execute at all (false on timeout/crash/missing binary)? */
  ran: boolean;
  failures: BehaviourFailure[];
  summary: string;
  durationMs: number;
  /** Raw harness output, kept as evidence. */
  output: string;
};

export type RunBehaviourOptions = {
  /** Sandbox holding the produced code. Must live inside `repoRoot`. */
  sandboxRoot: string;
  /** Source of the generated test file that exercises the produced code. */
  testSource: string;
  /** Repository root; the harness runs from here so workspace packages resolve. */
  repoRoot?: string;
  timeoutMs?: number;
};

export type BehaviourCase = {
  /** Caller-chosen id, used to attribute results. */
  id: string;
  /** Sandbox holding the produced code. Must live inside `repoRoot`. */
  sandboxRoot: string;
  /** Source of the generated test file that exercises the produced code. */
  testSource: string;
};

export type BehaviourSuiteResult = {
  ran: boolean;
  /** True when every case passed. */
  passed: boolean;
  summary: string;
  durationMs: number;
  output: string;
  results: Record<string, BehaviourResult>;
};

export type RunBehaviourSuiteOptions = {
  cases: BehaviourCase[];
  repoRoot?: string;
  timeoutMs?: number;
  /** Where the generated harness config lives (scratch, inside the repo). */
  configDir?: string;
  /** Max test files per harness invocation; bounds browser memory. */
  chunkSize?: number;
};

/** The repo root, resolved from this file's location (`packages-node/skill-tester/src/behaviour`). */
export function defaultRepoRoot(): string {
  return path.resolve(__dirname, '../../../..');
}

/**
 * ANSI escapes, built from a raw code point and a character class so the pattern needs no
 * backslash escaping in source (which is easy to get wrong when this file is edited by tooling).
 */
const ANSI_PATTERN = new RegExp(String.fromCharCode(27) + '[[]' + '[0-9;]*[A-Za-z]', 'g');

export function stripAnsi(value: string): string {
  return value.replace(ANSI_PATTERN, '');
}

function wtrConfigSource(relativeTestFiles: string[]): string {
  return `import { playwrightLauncher } from '@web/test-runner-playwright';

const testRunnerHtml = testRunnerImport => \`
<html>
  <head>
    <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
    <script type="module" src="\${testRunnerImport}"></script>
  </head>
</html>
\`;

export default {
  files: ${JSON.stringify(relativeTestFiles)},
  browsers: [playwrightLauncher({ product: 'chromium' })],
  nodeResolve: true,
  testRunnerHtml,
  concurrency: 1,
};
`;
}

/** The harness binary, or undefined when it is not installed. */
function harnessBinary(repoRoot: string): string | undefined {
  const binary = path.join(repoRoot, 'node_modules/.bin/web-test-runner');
  return fs.existsSync(binary) ? binary : undefined;
}

/** Is the sandbox inside the repo (required for `@lion/ui` to resolve)? */
function insideRepo(sandboxRoot: string, repoRoot: string): boolean {
  const relative = path.relative(repoRoot, sandboxRoot);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function outsideRepoResult(): BehaviourResult {
  return {
    passed: false,
    ran: false,
    failures: [],
    summary:
      'the sandbox must live inside the repository: @lion/ui is a workspace symlink and cannot ' +
      'be resolved from outside (ERR_MODULE_NOT_FOUND)',
    durationMs: 0,
    output: '',
  };
}

function missingHarnessResult(repoRoot: string): BehaviourResult {
  return {
    passed: false,
    ran: false,
    failures: [],
    summary: `the harness is unavailable: node_modules/.bin/web-test-runner not found under ${repoRoot}`,
    durationMs: 0,
    output: '',
  };
}

/**
 * Attribute failures to test files.
 *
 * Expects ANSI-stripped output. The harness prints a `<path>.test.js:` header before the failures
 * of that file, so each failure block belongs to the most recent header. A file that never appears
 * has no failures.
 */
export function parseSuiteOutput(output: string): Map<string, BehaviourFailure[]> {
  const byFile = new Map<string, BehaviourFailure[]>();
  const lines = output.split('\n');
  let current: string | undefined;

  for (let index = 0; index < lines.length; index++) {
    const header = /^(\S+\.test\.js):\s*$/.exec(lines[index]);
    if (header) {
      current = header[1];
      continue;
    }

    const marker = /^\s*❌\s*(.*)$/.exec(lines[index]);
    if (!marker || !current) continue;

    const details: string[] = [];
    for (let next = index + 1; next < lines.length && details.length < 4; next++) {
      if (/^\s*❌/.test(lines[next]) || /^\S+\.test\.js:\s*$/.test(lines[next])) break;
      if (lines[next].trim()) details.push(lines[next].trim());
    }

    const bucket = byFile.get(current) ?? [];
    bucket.push({ test: marker[1].trim(), message: details.join(' ') });
    byFile.set(current, bucket);
  }

  return byFile;
}

/**
 * How many tests the harness itself reported as failed, from its summary line
 * (`... | 1 passed, 1 failed`). Used to detect lost attribution; `undefined` when absent.
 */
export function reportedFailureCount(strippedOutput: string): number | undefined {
  const matches = [...strippedOutput.matchAll(/(\d+) passed, (\d+) failed/g)];
  if (matches.length === 0) return undefined;
  return Number(matches[matches.length - 1][2]);
}

/** Run a chunk of cases in a single harness invocation. */
function runChunk({
  cases,
  repoRoot,
  configDir,
  timeoutMs,
  chunkIndex,
}: {
  cases: BehaviourCase[];
  repoRoot: string;
  configDir: string;
  timeoutMs: number;
  chunkIndex: number;
}): { failuresByFile: Map<string, BehaviourFailure[]>; ran: boolean; output: string } {
  const relativeTestFiles: string[] = [];

  for (const testCase of cases) {
    const testFile = path.join(testCase.sandboxRoot, 'behaviour.test.js');
    fs.writeFileSync(testFile, testCase.testSource);
    relativeTestFiles.push(path.relative(repoRoot, testFile).split(path.sep).join('/'));
  }

  fs.mkdirSync(configDir, { recursive: true });
  const configFile = path.join(configDir, `suite-${chunkIndex}.config.mjs`);
  fs.writeFileSync(configFile, wtrConfigSource(relativeTestFiles));

  const run = spawnSync(harnessBinary(repoRoot) as string, ['--config', configFile], {
    cwd: repoRoot,
    encoding: 'utf8',
    timeout: timeoutMs,
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
  });

  const output = `${run.stdout ?? ''}\n${run.stderr ?? ''}`;
  const stripped = stripAnsi(output);
  const crashed = Boolean(run.error || run.signal);
  const failuresByFile = crashed ? new Map<string, BehaviourFailure[]>() : parseSuiteOutput(stripped);

  const failEveryCase = (message: string): void => {
    for (const relative of relativeTestFiles) {
      failuresByFile.set(relative, [{ test: `${path.basename(relative)} did not run`, message }]);
    }
  };

  // A crash must fail every case in the chunk rather than silently pass them.
  if (crashed) {
    failEveryCase(`the harness did not finish (${run.signal ?? String(run.error)})`);
    return { failuresByFile, ran: false, output };
  }

  // Never fail open: if the harness reports failed tests but none could be attributed to a file,
  // the parser (not the code under test) is broken, and a pass would be a false pass.
  const attributed = [...failuresByFile.values()].reduce((total, list) => total + list.length, 0);
  const reported = reportedFailureCount(stripped);
  if (reported !== undefined && reported > 0 && attributed === 0) {
    failEveryCase(
      `the harness reported ${reported} failed test(s) that could not be attributed to a file; ` +
        'refusing to report a pass',
    );
  }

  return { failuresByFile, ran: true, output };
}

/**
 * Run many scenarios' behaviour tests, batched into a few harness invocations.
 *
 * Guards are evaluated once: an out-of-repo sandbox or a missing harness fails the affected cases
 * with an explanatory summary and never crashes the caller.
 */
export function runBehaviourSuite({
  cases,
  repoRoot = defaultRepoRoot(),
  timeoutMs = 600_000,
  configDir = path.join(repoRoot, '.tmp', 'skill-tester-wtr'),
  chunkSize = 24,
}: RunBehaviourSuiteOptions): BehaviourSuiteResult {
  const start = Date.now();
  const results: Record<string, BehaviourResult> = {};
  const binary = harnessBinary(repoRoot);

  const runnable: BehaviourCase[] = [];
  for (const testCase of cases) {
    if (!insideRepo(testCase.sandboxRoot, repoRoot)) {
      results[testCase.id] = outsideRepoResult();
    } else if (!binary) {
      results[testCase.id] = missingHarnessResult(repoRoot);
    } else {
      runnable.push(testCase);
    }
  }

  let output = '';
  let ran = true;

  for (let offset = 0; offset < runnable.length; offset += chunkSize) {
    const chunk = runnable.slice(offset, offset + chunkSize);
    const chunkResult = runChunk({
      cases: chunk,
      repoRoot,
      configDir,
      timeoutMs,
      chunkIndex: offset / chunkSize,
    });
    output += `\n${chunkResult.output}`;
    ran = ran && chunkResult.ran;

    for (const testCase of chunk) {
      const relative = path
        .relative(repoRoot, path.join(testCase.sandboxRoot, 'behaviour.test.js'))
        .split(path.sep)
        .join('/');
      const failures = chunkResult.failuresByFile.get(relative) ?? [];
      results[testCase.id] = {
        passed: failures.length === 0,
        ran: chunkResult.ran,
        failures,
        summary:
          failures.length === 0
            ? 'behaviour assertions passed in a real browser'
            : `${failures.length} behaviour assertion(s) failed: ` +
              failures.map(failure => `${failure.test} — ${failure.message}`).join('; '),
        durationMs: 0,
        output: chunkResult.output,
      };
    }
  }

  const durationMs = Date.now() - start;
  const total = Object.keys(results).length;
  const failed = Object.values(results).filter(result => !result.passed).length;

  return {
    ran,
    passed: failed === 0,
    summary:
      failed === 0
        ? `${total} behaviour case(s) passed in a real browser`
        : `${failed} of ${total} behaviour case(s) failed`,
    durationMs,
    output,
    results,
  };
}

/**
 * Run a single behaviour case. Kept as the primitive used by tests and by callers that want one
 * sandbox; delegates to the suite so there is a single implementation of the harness run.
 */
export function runBehaviour({
  sandboxRoot,
  testSource,
  repoRoot = defaultRepoRoot(),
  timeoutMs = 120_000,
}: RunBehaviourOptions): BehaviourResult {
  const suite = runBehaviourSuite({
    cases: [{ id: 'case', sandboxRoot, testSource }],
    repoRoot,
    timeoutMs,
    chunkSize: 1,
  });
  const result = suite.results.case;
  return {
    ...result,
    durationMs: result.durationMs || suite.durationMs,
    output: result.output || suite.output,
  };
}
