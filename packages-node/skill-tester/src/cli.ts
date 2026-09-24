/**
 * CLI entry point.
 *
 * The provider is chosen explicitly; no model is assumed:
 *
 *   # OpenAI-compatible endpoint (default), e.g. DeepSeek or a local server
 *   node src/cli.ts --models deepseek-chat --base-url https://api.deepseek.com/v1 --api-key "$DEEPSEEK_API_KEY"
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
  list: boolean;
  help: boolean;
  filters: { kind?: string; name?: string };
  sampleScenarios?: number;
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
    useMockAgent: false,
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
  --kind <k>              Only scenarios of this kind (component|system|integration)
  --scenario <substring>  Only scenarios whose name contains this substring
  --limit <n>             Run at most n scenarios
  --list                  List the scenarios that would run, then exit
  -h, --help              Show this help

Examples:
  # Any OpenAI-compatible endpoint, e.g. DeepSeek or a local server
  node src/cli.ts --models deepseek-chat --base-url https://api.deepseek.com/v1 --api-key "$DEEPSEEK_API_KEY"
  node src/cli.ts --models my-local-model --base-url http://localhost:8080/v1
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
  });

  console.log('');
  console.log(`Provider: ${report.provider}${report.baseUrl ? ` (${report.baseUrl})` : ''}`);
  console.log(`Overall quality score: ${(report.overall.mean * 100).toFixed(1)}%`);
  for (const entry of report.perModel) {
    console.log(
      `  ${entry.model}: mean ${(entry.stats.mean * 100).toFixed(1)}%, ` +
        `min ${(entry.stats.min * 100).toFixed(1)}%, max ${(entry.stats.max * 100).toFixed(1)}%`,
    );
  }
  const failing = report.perModelScenario
    .filter(entry => entry.stats.mean * 100 < options.passThreshold)
    .sort((a, b) => a.stats.mean - b.stats.mean);
  if (failing.length > 0) {
    console.log(yellow(`\n${failing.length} scenario(s) below ${options.passThreshold}%:`));
    for (const entry of failing.slice(0, 20)) {
      console.log(`  ${entry.model} · ${entry.scenario} → ${(entry.stats.mean * 100).toFixed(1)}%`);
    }
  } else {
    console.log(green(`\nAll scenarios reached ${options.passThreshold}%.`));
  }

  process.exitCode = report.overall.mean * 100 >= options.passThreshold ? 0 : 1;
}

await main().catch(error => {
  console.error(red(error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
});
