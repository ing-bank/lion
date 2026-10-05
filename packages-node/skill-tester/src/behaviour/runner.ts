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

/** The repo root, resolved from this file's location (`packages-node/skill-tester/src/behaviour`). */
export function defaultRepoRoot(): string {
  return path.resolve(__dirname, '../../../..');
}

function wtrConfigSource(relativeTestGlob: string): string {
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
  files: [${JSON.stringify(relativeTestGlob)}],
  browsers: [playwrightLauncher({ product: 'chromium' })],
  nodeResolve: true,
  testRunnerHtml,
  concurrency: 1,
};
`;
}

/** Pull `❌ <name>` blocks out of web-test-runner's output. */
function parseFailures(output: string): BehaviourFailure[] {
  const failures: BehaviourFailure[] = [];
  const lines = output.split('\n');
  for (let index = 0; index < lines.length; index++) {
    const match = /^\s*❌\s*(.*)$/.exec(lines[index]);
    if (!match) continue;
    const details: string[] = [];
    for (let next = index + 1; next < lines.length && details.length < 4; next++) {
      const line = lines[next];
      if (/^\s*❌/.test(line)) break;
      if (line.trim()) details.push(line.trim());
    }
    failures.push({ test: match[1].trim(), message: details.join(' ') });
  }
  return failures;
}

export function runBehaviour({
  sandboxRoot,
  testSource,
  repoRoot = defaultRepoRoot(),
  timeoutMs = 120_000,
}: RunBehaviourOptions): BehaviourResult {
  const start = Date.now();
  const relativeSandbox = path.relative(repoRoot, sandboxRoot);

  if (relativeSandbox.startsWith('..') || path.isAbsolute(relativeSandbox)) {
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

  const testFile = path.join(sandboxRoot, 'behaviour.test.js');
  const configFile = path.join(sandboxRoot, 'wtr.config.mjs');
  fs.writeFileSync(testFile, testSource);
  fs.writeFileSync(
    configFile,
    wtrConfigSource(`${relativeSandbox.split(path.sep).join('/')}/behaviour.test.js`),
  );

  const binary = path.join(repoRoot, 'node_modules/.bin/web-test-runner');
  if (!fs.existsSync(binary)) {
    return {
      passed: false,
      ran: false,
      failures: [],
      summary: `the harness is unavailable: ${path.relative(repoRoot, binary)} not found`,
      durationMs: Date.now() - start,
      output: '',
    };
  }

  const run = spawnSync(binary, ['--config', configFile], {
    cwd: repoRoot,
    encoding: 'utf8',
    timeout: timeoutMs,
    env: { ...process.env, FORCE_COLOR: '0' },
  });

  const output = `${run.stdout ?? ''}\n${run.stderr ?? ''}`;
  const durationMs = Date.now() - start;

  if (run.error || run.signal) {
    return {
      passed: false,
      ran: false,
      failures: [],
      summary: `the harness did not finish (${run.signal ?? String(run.error)})`,
      durationMs,
      output,
    };
  }

  const failures = parseFailures(output);
  const allPassed = /all tests passed/i.test(output);

  return {
    passed: allPassed && failures.length === 0,
    ran: true,
    failures,
    summary: allPassed
      ? 'behaviour assertions passed in a real browser'
      : failures.length > 0
        ? `${failures.length} behaviour assertion(s) failed: ` +
          failures.map(f => `${f.test} — ${f.message}`).join('; ')
        : 'the harness finished without a pass verdict',
    durationMs,
    output,
  };
}
