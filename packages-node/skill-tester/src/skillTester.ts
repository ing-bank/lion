/**
 * skill-tester — orchestrator.
 *
 * Runs one or more skills/agents against a set of isolated scenarios, on any OpenAI-compatible
 * model (OpenAI, Azure OpenAI, local servers, ...), and produces a quality score per run plus a
 * markdown run record that feeds the `recursive-skill-improver` workflow.
 *
 * GitHub Copilot is not required: the skill/agent definition becomes the system prompt and the
 * model edits files in a sandbox through OpenAI-style tool calling (see `llm/agentRunner.ts`).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { blue, gray, green, red, yellow } from 'nanocolors';
import { createProjectSandbox, type ProjectMock } from './createProjectSandbox.ts';
import { parseMarkdownFile } from './parseFrontmatter.ts';
import fsGlob from './fsGlob.ts';
import { resolveLlmConfig, resolveProvider, describeOpenAiCredentialSource } from './config.ts';
import { runAgent as runOpenAiCompatibleAgent } from './llm/agentRunner.ts';
import type { AgentEvent } from './llm/agentRunner.ts';
import { runCopilotAgent } from './llm/copilotRunner.ts';
import {
  aggregate,
  applyGates,
  scoreScenario,
  type AggregateStats,
  type ScenarioScore,
} from './scoring/qualityScore.ts';
import { runGates, allowedLionUiSpecifiers } from './scoring/gates.ts';
import {
  runBehaviourSuite,
  defaultRepoRoot,
  type BehaviourCase,
  type BehaviourFailure,
} from './behaviour/runner.ts';
import { writeRunRecord } from './report/runRecord.ts';
import type { TestScenario } from './scenarios/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type SkillOrAgent = {
  name: string;
  /** A `skill` is a directory containing `SKILL.md` (+ `references/`). An `agent` is a single markdown file. */
  type: 'skill' | 'agent';
  location: string;
  /** Extra files copied into every sandbox on top of the scenario's own files. */
  extraFiles?: ProjectMock;
  /** Copilot tool names the agent may use (only meaningful for the `copilot` provider). */
  tools?: string[];
};

export type SkillTesterConfig = {
  skillOrAgent: SkillOrAgent;
  scenarios: TestScenario[];
  models: string[];
  /** How many times each (scenario, model) pair is run. */
  sampleSize?: number;
  /** Max model round-trips per run. */
  maxTurns?: number;
  /** Score percentage at or above which a run counts as passing (default 100). */
  passThreshold?: number;
  llm?: { baseUrl?: string; apiKey?: string };
  /** Base directory for sandboxes. Defaults to `<cwd>/.tmp/projectSandbox`. */
  sandboxBaseDir?: string;
  /**
   * Run the behaviour tier: execute the produced code in a real browser. Opt-in, because it is the
   * expensive oracle (~24s for every component, one harness invocation) and it requires sandboxes
   * to live inside the repository so `@lion/ui` resolves.
   */
  behaviour?: boolean;
  /** Repository root used by the behaviour tier. Defaults to this package's repository. */
  repoRoot?: string;
  /** Where the markdown run record is written. Pass `false` to skip. */
  reportDir?: string | false;
  /** Campaign metadata recorded in the run record. */
  campaign?: RunRecordMetadata;
  onProgress?: (message: string) => void;
};

export type RunRecordMetadata = {
  runNumber?: number;
  task?: string;
  targetRepositoryRevision?: string;
  skillSourceRevision?: string;
  agent?: string;
};

export type ScenarioRunResult = {
  model: string;
  scenario: string;
  sample: number;
  sandboxRoot: string;
  durationMs: number;
  score: ScenarioScore;
  /** Behaviour tier result, when enabled and the scenario ships a behaviour test. */
  behaviour?: {
    passed: boolean;
    ran: boolean;
    summary: string;
    failures: BehaviourFailure[];
  };
  agentRun: {
    turns: number;
    toolCalls: number;
    toolErrors: number;
    finished: boolean;
    stopReason: 'completed' | 'max_turns';
    totalTokens: number;
  };
};

export type ModelScenarioSummary = {
  model: string;
  scenario: string;
  stats: AggregateStats;
};

export type SkillTesterReport = {
  skillOrAgent: { name: string; type: 'skill' | 'agent' };
  provider: 'openai' | 'copilot';
  /** Endpoint used for the `openai` provider (omitted for `copilot`). */
  baseUrl?: string;
  models: string[];
  scenarios: string[];
  sampleSize: number;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  runs: ScenarioRunResult[];
  perModelScenario: ModelScenarioSummary[];
  perModel: { model: string; stats: AggregateStats }[];
  overall: AggregateStats;
  /**
   * Behaviour tier aggregate. Reported separately from the conformance score on purpose: a run can
   * score 100% on convention checks and goldens while the code does not work at all, and that gap
   * is the finding worth surfacing rather than blending away.
   */
  behaviour?: {
    ran: boolean;
    total: number;
    passed: number;
    failed: number;
    durationMs: number;
  };
};

/**
 * Read a skill directory or agent markdown file and turn it into a system prompt plus the files
 * that must be present in the sandbox for the model to consult.
 *
 * - `skill`: `SKILL.md` body becomes the system prompt; the whole skill directory is copied to
 *   `.skill/<name>/` in the sandbox so its `references/...` links resolve.
 * - `agent`: the markdown body becomes the system prompt; `extraFiles` (already collected) are
 *   used as-is.
 */
export async function loadSkillOrAgent(
  skillOrAgent: SkillOrAgent,
): Promise<{ systemPrompt: string; extraFiles: ProjectMock }> {
  if (skillOrAgent.type === 'agent') {
    const fileContent = await fs.promises.readFile(skillOrAgent.location, 'utf-8');
    const parsed = parseMarkdownFile(fileContent);
    return { systemPrompt: parsed.body, extraFiles: skillOrAgent.extraFiles ?? {} };
  }

  const skillDir = skillOrAgent.location;
  const fileContent = await fs.promises.readFile(path.join(skillDir, 'SKILL.md'), 'utf-8');
  const parsed = parseMarkdownFile(fileContent);

  const skillSandboxDir = `.skill/${skillOrAgent.name}`;
  const extraFiles: ProjectMock = {};
  const collect = async (dir: string): Promise<void> => {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await collect(full);
      } else if (entry.isFile()) {
        const relative = path.relative(skillDir, full).split(path.sep).join('/');
        extraFiles[`${skillSandboxDir}/${relative}`] = await fs.promises.readFile(full, 'utf-8');
      }
    }
  };
  await collect(skillDir);

  const preamble = [
    `The reference files for this skill are available in the project under \`${skillSandboxDir}/\`.`,
    'When the skill mentions a path such as `references/components/button.md`,',
    `read \`${skillSandboxDir}/references/components/button.md\` with the read_file tool.`,
    '',
  ].join('\n');

  return { systemPrompt: `${preamble}${parsed.body}`, extraFiles };
}

/**
 * Collect an agent markdown file plus glob-matched supporting files into a `SkillOrAgent`.
 * Kept for parity with the original proof of concept.
 */
export async function createAgentConfig({
  name,
  projectRoot,
  relativePathToAgentFile,
  globsToExtraFiles = [],
}: {
  name: string;
  projectRoot: string;
  relativePathToAgentFile: string;
  globsToExtraFiles?: string[];
}): Promise<SkillOrAgent> {
  const extraFiles: ProjectMock = {};
  if (globsToExtraFiles.length > 0) {
    const files = await fsGlob(globsToExtraFiles, {
      cwd: projectRoot,
      absolute: true,
      onlyFiles: true,
    });
    for (const filePath of files) {
      const relativePath = filePath.replace(projectRoot, '').replace(/\\/g, '/');
      extraFiles[relativePath] = await fs.promises.readFile(filePath, 'utf-8');
    }
  }
  return {
    name,
    location: path.join(projectRoot, relativePathToAgentFile),
    type: 'agent',
    extraFiles,
  };
}

export async function runSkillTester(config: SkillTesterConfig): Promise<SkillTesterReport> {
  const {
    skillOrAgent,
    scenarios,
    models,
    sampleSize = 5,
    maxTurns = 25,
    llm = {},
    sandboxBaseDir,
    behaviour = false,
    reportDir,
    campaign = {},
    onProgress = message => console.log(message),
  } = config;

  const repoRoot = config.repoRoot ?? defaultRepoRoot();
  // Derived from the package's own export map: one allowlist instead of several denylists, and it
  // cannot go stale when the map changes.
  const allowedSpecifiers = allowedLionUiSpecifiers(repoRoot);
  // The behaviour tier needs the sandboxes inside the repo so that `@lion/ui` (a workspace symlink)
  // resolves; without this an opt-in behaviour run would silently fail every case from outside.
  const sandboxBase =
    sandboxBaseDir ?? (behaviour ? path.join(repoRoot, '.tmp', 'skill-tester-sandbox') : undefined);
  const behaviourCases: BehaviourCase[] = [];

  if (!models || models.length === 0) {
    throw new Error(
      'No model specified. Pass --models <model> (or set SKILL_TESTER_MODELS): ' +
        'skill-tester deliberately does not default to a model.',
    );
  }

  const { systemPrompt, extraFiles } = await loadSkillOrAgent(skillOrAgent);
  const startedAt = new Date();
  const runs: ScenarioRunResult[] = [];

  let sandboxCounter = 0;
  for (const model of models) {
    const llmConfig = resolveLlmConfig(model, llm);

    for (const scenario of scenarios) {
      for (let sample = 1; sample <= sampleSize; sample++) {
        const outputPath = sandboxBase
          ? path.join(sandboxBase, `${slug(model)}-${slug(scenario.name)}-${sample}`)
          : path.join(process.cwd(), '.tmp', 'projectSandbox', `${sandboxCounter++}`);
        const sandboxRoot = await createProjectSandbox(
          { ...scenario.files, ...extraFiles },
          { outputPath },
        );

        onProgress(
          gray(
            `▸ ${model} · ${scenario.name} · sample ${sample}/${sampleSize} · ${path.relative(
              process.cwd(),
              sandboxRoot,
            )}`,
          ),
        );

        const start = Date.now();
        let toolErrors = 0;
        const onAgentEvent = (event: AgentEvent) => {
          if (event.type === 'tool_call') {
            onProgress(gray(`    ↳ ${event.name} ${truncate(event.arguments, 120)}`));
          } else if (event.type === 'tool_result' && event.result.startsWith('Error')) {
            toolErrors++;
            onProgress(red(`    ✗ ${event.result.split('\n')[0]}`));
          } else if (event.type === 'assistant_message' && event.content.trim()) {
            onProgress(gray(`    💬 ${truncate(event.content.trim(), 160)}`));
          }
        };

        // The Copilot provider manages its own agent loop and needs the agent registered by name
        // (and optionally restricted to a tool list); the OpenAI-compatible one runs our loop.
        const agentRun =
          llmConfig.provider === 'copilot'
            ? await runCopilotAgent({
                llmConfig,
                systemPrompt,
                userPrompt: scenario.prompt,
                sandboxRoot,
                agentName: skillOrAgent.name,
                tools: skillOrAgent.tools,
                onEvent: onAgentEvent,
              })
            : await runOpenAiCompatibleAgent({
                llmConfig,
                systemPrompt,
                userPrompt: scenario.prompt,
                sandboxRoot,
                maxTurns,
                onEvent: onAgentEvent,
              });
        const durationMs = Date.now() - start;

        const gates = runGates(sandboxRoot, { allowedLionUiSpecifiers: allowedSpecifiers });
        const score = applyGates(
          scoreScenario({
            sandboxRoot,
            expectedTransformedFiles: scenario.expectedTransformedFiles,
            checks: scenario.checks,
            declaredFiles: Object.keys(scenario.files),
          }),
          gates,
        );

        for (const gate of gates.filter(g => !g.passed)) {
          onProgress(red(`    ⛔ ${gate.name} gate: ${gate.summary}`));
        }

        onProgress(
          `${score.percent >= 100 ? green('✔') : score.percent >= 50 ? yellow('~') : red('✘')} ` +
            `${scenario.name} → ${score.percent}% ` +
            gray(`(${agentRun.turns} turns, ${agentRun.toolCalls} tool calls)`),
        );

        if (behaviour && scenario.behaviour) {
          behaviourCases.push({
            id: runKey(model, scenario.name, sample),
            sandboxRoot,
            testSource: scenario.behaviour.testSource,
          });
        }

        runs.push({
          model,
          scenario: scenario.name,
          sample,
          sandboxRoot,
          durationMs,
          score,
          agentRun: {
            turns: agentRun.turns,
            toolCalls: agentRun.toolCalls,
            toolErrors,
            finished: agentRun.finished,
            stopReason: agentRun.stopReason,
            totalTokens: agentRun.usage.total_tokens ?? 0,
          },
        });
      }
    }
  }

  // Behaviour runs last and batched: one harness invocation covers every run in the campaign.
  let behaviourSummary: SkillTesterReport['behaviour'];
  if (behaviourCases.length > 0) {
    onProgress(
      blue(`▸ behaviour tier: ${behaviourCases.length} run(s) in a real browser (batched)…`),
    );
    const suite = runBehaviourSuite({ cases: behaviourCases, repoRoot });
    for (const run of runs) {
      const result = suite.results[runKey(run.model, run.scenario, run.sample)];
      if (!result) continue;
      run.behaviour = {
        passed: result.passed,
        ran: result.ran,
        summary: result.summary,
        failures: result.failures,
      };
      if (!result.passed) {
        onProgress(red(`    ⛔ behaviour · ${run.scenario}: ${result.summary}`));
      }
    }
    const results = Object.values(suite.results);
    behaviourSummary = {
      ran: suite.ran,
      total: results.length,
      passed: results.filter(result => result.passed).length,
      failed: results.filter(result => !result.passed).length,
      durationMs: suite.durationMs,
    };
    onProgress(
      behaviourSummary.failed === 0
        ? green(`  ✔ behaviour: ${behaviourSummary.passed}/${behaviourSummary.total} passed`)
        : red(`  ✘ behaviour: ${behaviourSummary.failed}/${behaviourSummary.total} failed`),
    );
  }

  const finishedAt = new Date();
  const provider = resolveProvider(llm);
  const report: SkillTesterReport = {
    skillOrAgent: { name: skillOrAgent.name, type: skillOrAgent.type },
    provider,
    ...(provider === 'openai' ? { baseUrl: resolveLlmConfig(models[0], llm).baseUrl } : {}),
    models,
    scenarios: scenarios.map(scenario => scenario.name),
    sampleSize,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    runs,
    perModelScenario: buildPerModelScenario(runs),
    perModel: models.map(model => ({
      model,
      stats: aggregate(runs.filter(run => run.model === model).map(run => run.score.score)),
    })),
    overall: aggregate(runs.map(run => run.score.score)),
    ...(behaviourSummary ? { behaviour: behaviourSummary } : {}),
  };

  if (resolveProvider(llm) === 'openai') {
    const missingCredentials = models.filter(model => !resolveLlmConfig(model, llm).apiKey);
    if (missingCredentials.length > 0) {
      onProgress(
        yellow(
          `! No API key resolved for: ${missingCredentials.join(', ')} ` +
            `(set ${describeOpenAiCredentialSource()}, or pass --api-key for a local endpoint)`,
        ),
      );
    }
  }

  if (reportDir !== false) {
    const { markdownPath } = writeRunRecord({
      report,
      campaign,
      scenarios,
      passThreshold: config.passThreshold ?? 100,
      outputDir: reportDir,
    });
    onProgress(blue(`Run record written to ${path.relative(process.cwd(), markdownPath)}`));
  }

  return report;
}

/** NUL-separated key for a single (model, scenario, sample) run. */
const RUN_KEY_SEPARATOR = String.fromCharCode(0);

function runKey(model: string, scenario: string, sample: number): string {
  return [model, scenario, sample].join(RUN_KEY_SEPARATOR);
}

function buildPerModelScenario(runs: ScenarioRunResult[]): ModelScenarioSummary[] {
  const grouped = new Map<string, number[]>();
  for (const run of runs) {
    const key = `${run.model}\u0000${run.scenario}`;
    const bucket = grouped.get(key) ?? [];
    bucket.push(run.score.score);
    grouped.set(key, bucket);
  }
  return [...grouped.entries()].map(([key, scores]) => {
    const [model, scenario] = key.split('\u0000');
    return { model, scenario, stats: aggregate(scores) };
  });
}

function slug(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function truncate(value: string, max: number): string {
  const singleLine = value.replace(/\s+/g, ' ');
  return singleLine.length > max ? `${singleLine.slice(0, max)}…` : singleLine;
}

/** Absolute path to the default `lion-ui` skill shipped on this branch. */
export function defaultLionUiSkillLocation(
  repoRoot: string = path.resolve(__dirname, '../../../..'),
): string {
  return path.join(repoRoot, 'packages/ui/skills/lion-ui');
}
