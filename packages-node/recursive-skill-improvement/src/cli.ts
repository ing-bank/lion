/**
 * CLI entry point.
 *
 * The provider is chosen explicitly; no model is assumed:
 *
 *   # OpenAI-compatible endpoint (default), e.g. OpenAI or a local server
 *   node src/cli.ts --models gpt-5-mini --api-key "$OPENAI_API_KEY"
 *   node src/cli.ts --models my-model --base-url http://localhost:8080/v1
 *   # GitHub Copilot (requires the optional @github/copilot-sdk)
 *   node src/cli.ts --provider copilot --models <model>
 *   node src/cli.ts --list
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gray, green, red, yellow } from 'nanocolors';
import { runSkillTester, defaultLionUiSkillLocation, createAgentConfig } from './skillTester.ts';
import { loadLionUiScenarios, manualScenarios } from './scenarios/index.ts';
import type { TestScenario } from './scenarios/types.ts';
import type { Provider } from './config.ts';
import { execSync } from 'node:child_process';
import { loadLedger, updateLedger, writeLedger } from './report/ledger.ts';
import { writeQualityPage } from './report/docsPage.ts';

/**
 * Git tree hash of the skill directory. A commit elsewhere in the repo must not invalidate every
 * stored result, so the ledger keys on the skill's own tree hash rather than the commit.
 */
function skillRevisionOf(root: string): string {
  try {
    return execSync('git rev-parse HEAD:packages/ui/skills/lion-ui', {
      cwd: root,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'unknown';
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

/**
 * The tasks this CLI exposes, chosen as the FIRST positional argument
 * (`recursive-skill-improvement <task> [flags]`). The four names are separate things:
 *
 * - the SYSTEM is `recursive-skill-improvement` (this package, docs and CLI together);
 * - the TASK `improve` is one of these — it runs the loop and reports the failing set, attributed;
 * - the PROTOCOL is the hand-written skill `recursive-skill-improver`, which describes that loop.
 *
 * `retire` is deliberately NOT a task: a retired model is data (`RATES[…].retired`), not an action.
 */
export type TaskName = 'eval' | 'sweep' | 'improve' | 'report';

type CliOptions = {
  /** The named task to run (default `eval`, so existing invocations stay valid). */
  task: TaskName;
  provider?: Provider;
  models: string[];
  samples: number;
  maxTurns: number;
  passThreshold: number;
  baseUrl?: string;
  apiKey?: string;
  skillDir?: string;
  useMockAgent: boolean;
  behaviour: boolean;
  list: boolean;
  help: boolean;
  filters: { kind?: string; name?: string };
  sampleScenarios?: number;
  /** After the run, update the results ledger and re-render the docs quality page. */
  docs: boolean;
  docsPath?: string;
  ledgerPath?: string;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    // No default model: the caller must say which model to evaluate.
    task: 'eval',
    models: (process.env.SKILL_TESTER_MODELS ?? '')
      .split(',')
      .map(m => m.trim())
      .filter(Boolean),
    samples: 1,
    maxTurns: 25,
    passThreshold: 100,
    docs: false,
    useMockAgent: false,
    behaviour: false,
    list: false,
    help: false,
    filters: {},
  };

  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => argv[++i];
    switch (arg) {
      case '--provider':
        options.provider = next() as Provider;
        break;
      case '--models':
        options.models = (next() ?? '')
          .split(',')
          .map(m => m.trim())
          .filter(Boolean);
        break;
      case '--samples':
        options.samples = Number(next());
        break;
      case '--max-turns':
        options.maxTurns = Number(next());
        break;
      case '--pass-threshold':
        options.passThreshold = Number(next());
        break;
      case '--base-url':
        options.baseUrl = next();
        break;
      case '--api-key':
        options.apiKey = next();
        break;
      case '--skill':
        options.skillDir = next();
        break;
      case '--mock-agent':
        options.useMockAgent = true;
        break;
      case '--behaviour':
        options.behaviour = true;
        break;
      case '--docs':
        options.docs = true;
        break;
      case '--docs-path': {
        const value = next();
        if (value.startsWith('--')) {
          throw new Error(`--docs-path needs a path, but got "${value}" instead`);
        }
        options.docsPath = value;
        break;
      }
      case '--ledger': {
        const value = next();
        if (value.startsWith('--')) {
          throw new Error(`--ledger needs a path, but got "${value}" instead`);
        }
        options.ledgerPath = value;
        break;
      }
      case '--kind':
        options.filters.kind = next();
        break;
      case '--scenario':
        options.filters.name = next();
        break;
      case '--limit':
        options.sampleScenarios = Number(next());
        break;
      case '--list':
        options.list = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          options.help = true;
        } else {
          positional.push(arg);
        }
    }
  }

  // A leading positional argument is the task: `node src/cli.ts improve --models …`. It must come
  // before any flag, so `--models foo` is never mistaken for a task.
  if (positional.length > 0) {
    if (!argv[0] || argv[0].startsWith('-')) {
      console.error(`Unknown argument: ${positional[0]} (a task must be the first argument)`);
      options.help = true;
    } else {
      options.task = parseTaskName(positional[0]);
    }
  }

  // The `sweep` task is "the full round": measuring plus publishing the ledger and results page.
  if (options.task === 'sweep') options.docs = true;

  return options;
}

/** Resolve a task name, rejecting anything that is not one of the four documented tasks. */
function parseTaskName(value: string | undefined): TaskName {
  const tasks: TaskName[] = ['eval', 'sweep', 'improve', 'report'];
  if (value && (tasks as string[]).includes(value)) return value as TaskName;
  throw new Error(`Unknown task "${value}". Known tasks: ${tasks.join(', ')}.`);
}

function printHelp(): void {
  console.log(`recursive-skill-improvement — evaluate a skill/agent on isolated scenarios

Usage: node src/cli.ts [task] [options]

Tasks (the FIRST positional argument; no task defaults to eval):
  eval                    The atom: one scenario × model, scored. This is the default.
  sweep                   The whole round: measure, then publish the ledger and the results page
                          (equivalent to eval --docs).
  improve                 The failing set, attributed: measure, then classify every failure and
                          report the exact check and its file:line. It reports; it does NOT edit
                          docs — that is human/agent work. It sets the correction up.
  report                  Render/print the ledger as the results page; no runs, no model needed.

  sweep = the whole round; improve = the failing set, attributed.

  The system is \`recursive-skill-improvement\` (this package, its docs and this CLI);
  the task \`improve\` runs the loop (measure -> attribute -> correct -> regenerate -> rerun);
  the protocol is the skill \`recursive-skill-improver\`, which describes that loop.

  \`improve\` cannot edit docs. It runs, attributes each failure to one of
  {docs-gap | harness-defect | model-behaviour}, prints the exact check + file:line, and names the
  coupled scenario(s) that must be re-run at n>=3. Correcting the doc, regenerating and gating
  (\`npm run skills:generate\`, \`npm run skills:check\`) stay in the human/agent loop.

Options:
  --provider <p>          "openai-compatible" (default), "copilot" or "claude-code"
  --models <m1,m2>        Models to test. No default: pass --models or set $SKILL_TESTER_MODELS
  --samples <n>           Runs per (scenario, model) pair (default: 1)
  --max-turns <n>         Max model round-trips per run, "openai" provider only (default: 25)
  --pass-threshold <n>    Pass threshold percentage (default: 100)
  --base-url <url>        OpenAI-compatible base URL (default: $SKILL_TESTER_BASE_URL, $OPENAI_BASE_URL)
  --api-key <key>         API key (prefer env vars so it stays out of your shell history)
  --skill <dir>           Skill directory under test (default: packages/ui/skills/lion-ui)
  --mock-agent            Test the mock-repo agent instead of the lion-ui skill
  --behaviour             Also run the behaviour tier: execute the produced code in a real
                          browser (headless Chromium) and report it as a separate axis
  --kind <k>              Only scenarios of this kind (component|system|integration)
  --scenario <substring>  Only scenarios whose name contains this substring
  --limit <n>             Run at most n scenarios
  --list                  List the scenarios that would run, then exit
  -h, --help              Show this help

Examples:
  # Any OpenAI-compatible endpoint (the default base URL is https://api.openai.com/v1)
  node src/cli.ts --models gpt-5-mini --api-key "$OPENAI_API_KEY"
  node src/cli.ts --models my-model --base-url http://localhost:8080/v1
  # GitHub Copilot (install the optional SDK first)
  npm install @github/copilot-sdk && node src/cli.ts --provider copilot --models <model>

Environment:
  SKILL_TESTER_PROVIDER (openai | copilot)
  SKILL_TESTER_MODELS, SKILL_TESTER_API_KEY, SKILL_TESTER_BASE_URL
  OPENAI_API_KEY, OPENAI_BASE_URL
`);
}

function selectScenarios(options: CliOptions): TestScenario[] {
  const scenarios = loadLionUiScenarios({ repoRoot });
  let selected = scenarios;
  if (options.filters.kind) {
    selected = selected.filter(scenario => scenario.kind === options.filters.kind);
  }
  if (options.filters.name) {
    selected = selected.filter(scenario => scenario.name.includes(options.filters.name!));
  }
  if (typeof options.sampleScenarios === 'number') {
    selected = selected.slice(0, options.sampleScenarios);
  }
  return selected;
}

/** Which of the three buckets a failure is attributed to. */
type Attribution = 'docs-gap' | 'harness-defect' | 'model-behaviour';

/**
 * Attribute one failure. A failure the skill should have prevented by documenting a rule (an
 * entrypoint the model guessed, a placeholder it copied, a binding the entrypoint does not export)
 * is a **docs gap**; a syntax error or a behaviour assertion is **model behaviour**; anything the
 * harness cannot see a model fault in is a **harness defect**. This is a classifying default, not a
 * verdict — `improve` reports, it does not edit.
 */
function attribute(kind: 'gate' | 'check' | 'behaviour' | 'similarity', name: string): Attribution {
  if (kind === 'gate') {
    if (name === 'import-policy') return 'docs-gap';
    if (name === 'syntax') return 'model-behaviour';
    return 'harness-defect';
  }
  if (kind === 'check') {
    return /entrypoint|placeholder|export|import|documented/i.test(name)
      ? 'docs-gap'
      : 'model-behaviour';
  }
  return 'model-behaviour';
}

/** The docs each scenario derives from (`scenario-docs.json`), so a docs gap names its file. */
function loadCoupledDocs(): Record<string, string[]> {
  try {
    const raw = fs.readFileSync(path.join(__dirname, '..', 'scenario-docs.json'), 'utf-8');
    return (JSON.parse(raw).scenarios ?? {}) as Record<string, string[]>;
  } catch {
    return {};
  }
}

/**
 * The attribution half of the `improve` task: for every cell below the pass threshold, name each
 * failing check and its file:line, attribute it to {docs-gap | harness-defect | model-behaviour},
 * and name the coupled scenario(s) that must be re-run at n>=3. It reports the correction; it does
 * not make it — editing docs, regenerating and gating stay in the human/agent loop.
 */
function printImprovementFindings(
  report: Awaited<ReturnType<typeof runSkillTester>>,
  passThreshold: number,
): void {
  const coupled = loadCoupledDocs();
  const below = report.perModelScenario
    .filter(entry => entry.stats.mean * 100 < passThreshold)
    .sort((a, b) => a.stats.mean - b.stats.mean);

  console.log(
    yellow(`\nimprove — the failing set, attributed (${below.length} cell(s) below ${passThreshold}%)`),
  );
  console.log(
    gray('  improve reports; it does not edit docs. Correct, regenerate (npm run skills:generate),\n  gate (npm run skills:check) and re-run stay in the human/agent loop.'),
  );

  if (report.redoable.length > 0) {
    console.log(
      `\n  harness-defect — ${report.redoable.length} run(s) the endpoint failed (re-run, not scored):`,
    );
    for (const run of report.redoable) {
      console.log(red(`    ${run.model} · ${run.scenario} · sample ${run.sample} — ${run.message}`));
    }
  }

  if (below.length === 0) {
    console.log(green('\n  every measured cell reached the pass threshold; nothing to attribute.'));
    return;
  }

  for (const entry of below) {
    console.log(`\n  ${entry.model} · ${entry.scenario} → ${(entry.stats.mean * 100).toFixed(1)}%`);
    const runs = report.runs.filter(
      run =>
        run.model === entry.model &&
        run.scenario === entry.scenario &&
        run.agentRun.attempted,
    );
    const seen = new Set<string>();
    const record = (category: Attribution, line: string) => {
      const single = line.replace(/\s+/g, ' ');
      const key = `${category}:${single}`;
      if (seen.has(key)) return;
      seen.add(key);
      console.log(`${red('    ✗')} ${yellow(`[${category}]`)} ${single}`);
    };
    for (const run of runs) {
      for (const gate of run.score.gates.filter(gate => !gate.passed)) {
        if (gate.failures.length === 0) {
          record(attribute('gate', gate.name), `gate ${gate.name} — ${gate.summary}`);
        }
        for (const failure of gate.failures) {
          const location = failure.line ? `${failure.file}:${failure.line}` : failure.file;
          record(attribute('gate', gate.name), `gate ${gate.name} — ${location} — ${failure.message}`);
        }
      }
      for (const check of run.score.checks.filter(check => !check.passed)) {
        record(attribute('check', check.description), `check "${check.description}"`);
      }
      if (run.behaviour?.ran && !run.behaviour.passed) {
        for (const failure of run.behaviour.failures) {
          record('model-behaviour', `behaviour ${failure.test} — ${failure.message}`);
        }
      }
    }
    if (seen.size === 0) {
      record(
        'model-behaviour',
        'no failing gate or check recorded — a differential (similarity) score below 100%',
      );
    }
    // The coupled scenario(s) to re-run: the cell's own scenario, at n>=3, after the fix.
    console.log(gray(`    → re-run: ${entry.scenario} at n>=3 on ${entry.model}`));
    if (seen.size > 0 && Object.prototype.hasOwnProperty.call(coupled, entry.scenario)) {
      const docs = coupled[entry.scenario];
      if (docs.length > 0) {
        console.log(gray(`    → coupled docs to correct (a docs-gap): ${docs.join(', ')}`));
      }
    }
  }
}

/**
 * The `report` task: render the committed ledger into the results page (or a `--docs-path`), and
 * report the row count. No scenarios run, so no model is needed and no tokens are spent.
 */
function runReportTask(options: CliOptions): void {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(here, '../../..');
  const ledgerFile = options.ledgerPath
    ? path.resolve(options.ledgerPath)
    : path.join(here, '../results/ledger.json');
  const pageFile = options.docsPath
    ? path.resolve(options.docsPath)
    : path.join(root, 'docs/fundamentals/node-tools/recursive-skill-improvement/quality.md');
  const ledger = loadLedger(ledgerFile);
  writeQualityPage(pageFile, ledger);
  console.log(
    green(
      `Rendered ${path.relative(root, pageFile)} from ` +
        `${path.relative(root, ledgerFile)} (${ledger.entries.length} row(s)).`,
    ),
  );
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  // `report` renders the ledger into the results page; it runs no scenarios and needs no model.
  if (options.task === 'report') {
    runReportTask(options);
    return;
  }

  const scenarios = selectScenarios(options);

  if (options.list) {
    console.log(
      `${scenarios.length} scenario(s)${scenarios.length === manualScenarios.length ? '' : ''}:`,
    );
    for (const scenario of scenarios) {
      console.log(`  ${scenario.kind.padEnd(12)} ${scenario.name}`);
    }
    return;
  }

  if (options.models.length === 0) {
    console.error(
      red('No model specified. Pass --models <model> (or set SKILL_TESTER_MODELS).') +
        '\nrecursive-skill-improvement deliberately does not default to a model.',
    );
    process.exitCode = 1;
    return;
  }

  if (scenarios.length === 0) {
    console.error(red('No scenarios selected.'));
    process.exitCode = 1;
    return;
  }

  const skillOrAgent = options.useMockAgent
    ? await createAgentConfig({
        name: '@lion/ui',
        projectRoot: path.join(__dirname, '../mock-repo'),
        relativePathToAgentFile: '.github/agents/lion.agent.md',
        globsToExtraFiles: ['.github/agents/docs/**/*'],
      })
    : {
        name: 'lion-ui',
        type: 'skill' as const,
        location: options.skillDir ?? defaultLionUiSkillLocation(repoRoot),
      };

  console.log(
    `Testing ${skillOrAgent.type} "${skillOrAgent.name}" on ${scenarios.length} scenario(s) ` +
      `with model(s) ${options.models.join(', ')} (${options.samples} sample(s) each)`,
  );

  const report = await runSkillTester({
    skillOrAgent,
    scenarios,
    models: options.models,
    sampleSize: options.samples,
    maxTurns: options.maxTurns,
    passThreshold: options.passThreshold,
    llm: { provider: options.provider, baseUrl: options.baseUrl, apiKey: options.apiKey },
    behaviour: options.behaviour,
  });

  console.log('');
  console.log(`Provider: ${report.provider}${report.baseUrl ? ` (${report.baseUrl})` : ''}`);
  // With no valid runs there is no score: printing 0.0% would read as "it scored zero".
  if (report.runs.length === 0) {
    console.log(
      yellow(
        'Overall quality score: n/a — no comparable run(s)' +
          (report.redoable?.length ? ` (${report.redoable.length} to redo)` : ''),
      ),
    );
  } else {
    // The same rule the run record and the ledger apply: a run that never modified the deliverable is
    // not a zero, it is not a comparable run, so it must not drag the headline down.
    const attemptedRuns = report.runs.filter(run => run.agentRun.attempted);
    if (attemptedRuns.length === 0) {
      console.log(
        yellow(
          `Overall quality score: n/a — no run modified the deliverable (${report.runs.length} run(s))`,
        ),
      );
    } else {
      const attemptedMean =
        attemptedRuns.reduce((sum, run) => sum + run.score.score, 0) / attemptedRuns.length;
      console.log(
        `Overall quality score: ${(attemptedMean * 100).toFixed(1)}%` +
          (attemptedRuns.length < report.runs.length
            ? ` (${attemptedRuns.length}/${report.runs.length} run(s) comparable)`
            : ''),
      );
    }
  }
  if (report.behaviour) {
    const { passed, total, failed } = report.behaviour;
    console.log(
      `Behaviour (real browser): ${passed}/${total} passed` +
        (failed > 0 ? red(` (${failed} failed)`) : ''),
    );
  }
  for (const entry of report.perModel) {
    if (report.runs.filter(run => run.model === entry.model).length === 0) {
      console.log(`  ${entry.model}: no comparable runs (all to redo)`);
      continue;
    }
    console.log(
      `  ${entry.model}: mean ${(entry.stats.mean * 100).toFixed(1)}%, ` +
        `min ${(entry.stats.min * 100).toFixed(1)}%, max ${(entry.stats.max * 100).toFixed(1)}%`,
    );
  }
  const failing = report.perModelScenario
    .filter(entry => entry.stats.mean * 100 < options.passThreshold)
    .sort((a, b) => a.stats.mean - b.stats.mean);
  if (report.runs.length === 0) {
    console.log(
      yellow(
        `\nNo comparable runs: nothing passed and nothing failed. ` +
          `${report.redoable?.length ?? 0} run(s) to redo.`,
      ),
    );
  } else if (failing.length > 0) {
    console.log(yellow(`\n${failing.length} scenario(s) below ${options.passThreshold}%:`));
    for (const entry of failing.slice(0, 20)) {
      console.log(`  ${entry.model} · ${entry.scenario} → ${(entry.stats.mean * 100).toFixed(1)}%`);
    }
  } else {
    // "All scenarios reached X%" is a lie when some were never measured - a sweep that runs out of
    // endpoint balance (measured: HTTP 429 "Insufficient available balance") leaves scenarios with no
    // comparable run at all, and they must be named rather than folded into a clean summary.
    const measuredScenarios = new Set(report.runs.map(run => run.scenario));
    const unmeasured = scenarios
      .map(scenario => scenario.name)
      .filter(name => !measuredScenarios.has(name));
    console.log(
      green(`\nAll measured scenarios reached ${options.passThreshold}%.`) +
        (unmeasured.length
          ? yellow(
              ` ${unmeasured.length} scenario(s) were not measured (nothing comparable): ` +
                unmeasured.join(', '),
            )
          : ''),
    );
  }

  if (options.task === 'improve') {
    printImprovementFindings(report, options.passThreshold);
  }

  // `--ledger <path>` must write on its own: gating the write on `--docs` silently dropped it (the
  // same failure mode as a path-valued `--ledger` eating the next flag).
  if (options.ledgerPath || options.docs) {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const root = path.resolve(here, '../../..');
    const ledgerFile = options.ledgerPath
      ? path.resolve(options.ledgerPath)
      : path.join(here, '../results/ledger.json');
    const pageFile = options.docsPath
      ? path.resolve(options.docsPath)
      : path.join(root, 'docs/fundamentals/node-tools/recursive-skill-improvement/quality.md');

    // Kinds live on the scenarios, not on the report.
    const withKinds = [...loadLionUiScenarios({ repoRoot: root }), ...manualScenarios];
    const ledger = updateLedger(loadLedger(ledgerFile), report, withKinds, skillRevisionOf(root));
    writeLedger(ledgerFile, ledger);
    if (options.docs) writeQualityPage(pageFile, ledger);
    if (options.docs) {
      console.log(
        green(
          `\nResults page: ${path.relative(root, pageFile)} ` +
            `(${ledger.entries.length} row(s) in ${path.relative(root, ledgerFile)})`,
        ),
      );
    }
  }

  process.exitCode = report.overall.mean * 100 >= options.passThreshold ? 0 : 1;
}

await main().catch(error => {
  console.error(red(error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
});
