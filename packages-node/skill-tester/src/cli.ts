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

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { green, red, yellow } from 'nanocolors';
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

type CliOptions = {
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
        }
    }
  }
  return options;
}

function printHelp(): void {
  console.log(`skill-tester — evaluate a skill/agent on isolated scenarios

Usage: node src/cli.ts [options]

Options:
  --provider <p>          "openai" (any OpenAI-compatible endpoint, default) or "copilot"
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

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const scenarios = selectScenarios(options);

  if (options.list) {
    console.log(`${scenarios.length} scenario(s)${scenarios.length === manualScenarios.length ? '' : ''}:`);
    for (const scenario of scenarios) {
      console.log(`  ${scenario.kind.padEnd(12)} ${scenario.name}`);
    }
    return;
  }

  if (options.models.length === 0) {
    console.error(
      red('No model specified. Pass --models <model> (or set SKILL_TESTER_MODELS).') +
        '\nskill-tester deliberately does not default to a model.',
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
      : path.join(root, 'docs/fundamentals/node-tools/skill-tester/quality.md');

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
