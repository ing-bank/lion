/**
 * CLI entry point.
 *
 *   node src/cli.ts --models deepseek-chat --samples 1
 *   node src/cli.ts --list
 *   node src/cli.ts --kind component --scenario button --models deepseek-chat
 *
 * Configuration (base URL / API key) is resolved per model by `src/config.ts` — e.g.
 * `DEEPSEEK_API_KEY` for `deepseek-*`, `OPENAI_API_KEY` for everything else.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { green, red, yellow } from 'nanocolors';
import { runSkillTester, defaultLionUiSkillLocation, createAgentConfig } from './skillTester.ts';
import { loadLionUiScenarios, manualScenarios } from './scenarios/index.ts';
import type { TestScenario } from './scenarios/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');

type CliOptions = {
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
    models: (process.env.SKILL_TESTER_MODELS ?? 'deepseek-chat').split(',').map(m => m.trim()).filter(Boolean),
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
      case '--models':
        options.models = (next() ?? '').split(',').map(m => m.trim()).filter(Boolean);
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
  console.log(`skill-tester — evaluate a skill/agent on isolated scenarios via an OpenAI-compatible model

Usage: node src/cli.ts [options]

Options:
  --models <m1,m2>        Models to test (default: $SKILL_TESTER_MODELS or deepseek-chat)
  --samples <n>           Runs per (scenario, model) pair (default: 1)
  --max-turns <n>         Max model round-trips per run (default: 25)
  --pass-threshold <n>    Pass threshold percentage (default: 100)
  --base-url <url>        OpenAI-compatible base URL (overrides per-model default)
  --api-key <key>         API key (overrides env; prefer env vars to avoid shell history)
  --skill <dir>           Skill directory under test (default: packages/ui/skills/lion-ui)
  --mock-agent            Test the mock-repo Copilot agent instead of the lion-ui skill
  --kind <k>              Only scenarios of this kind (component|system|integration)
  --scenario <substring>  Only scenarios whose name contains this substring
  --limit <n>             Run at most n scenarios
  --list                  List the scenarios that would run, then exit
  -h, --help              Show this help

Environment:
  DEEPSEEK_API_KEY / OPENAI_API_KEY / SKILL_TESTER_API_KEY
  SKILL_TESTER_BASE_URL / DEEPSEEK_BASE_URL / OPENAI_BASE_URL
  SKILL_TESTER_MODELS
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
    llm: { baseUrl: options.baseUrl, apiKey: options.apiKey },
  });

  console.log('');
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

await main();
