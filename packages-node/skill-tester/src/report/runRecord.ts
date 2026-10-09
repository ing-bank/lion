/**
 * Reporting: turns a `SkillTesterReport` into
 *
 *   1. a JSON sidecar with the full, machine-readable result, and
 *   2. a markdown run record shaped to feed `recursive-skill-improver`
 *      (see its `references/run-record.md`),
 *
 * The markdown record is the bridge between the two tools: it lists every failed check as
 * evidence, classifies each scenario's outcome, and carries the convergence checklist, so an
 * improver campaign can read one file instead of re-deriving the state from raw logs.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { SkillTesterReport, RunRecordMetadata, ScenarioRunResult } from '../skillTester.ts';
import type { TestScenario } from '../scenarios/types.ts';

const DEFAULT_REPORT_DIR = path.join(process.cwd(), '.tmp', 'skill-tester', 'reports');

export type RunRecordResult = {
  markdownPath: string;
  jsonPath: string;
};

function passMark(passed: boolean): string {
  return passed ? 'pass' : 'FAIL';
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function renderRunRecord({
  report,
  campaign,
  scenarios,
  passThreshold,
}: {
  report: SkillTesterReport;
  campaign?: RunRecordMetadata;
  scenarios: TestScenario[];
  passThreshold: number;
}): string {
  const scenarioByName = new Map(scenarios.map(scenario => [scenario.name, scenario]));
  const failingRuns = report.runs.filter(run => run.score.percent < passThreshold);
  const totalTurns = sum(report.runs.map(run => run.agentRun.turns));
  const totalToolCalls = sum(report.runs.map(run => run.agentRun.toolCalls));
  const totalToolErrors = sum(report.runs.map(run => run.agentRun.toolErrors));
  const totalTokens = sum(report.runs.map(run => run.agentRun.totalTokens));
  const maxTurnsHits = report.runs.filter(run => run.agentRun.stopReason === 'max_turns').length;

  const lines: string[] = [];
  lines.push(`# skill-tester run record — ${report.skillOrAgent.name}`);
  lines.push('');
  lines.push(`Generated ${report.finishedAt} by \`packages-node/skill-tester\`.`);
  lines.push('');

  lines.push('## Run identity');
  lines.push('');
  lines.push('| Field | Value |');
  lines.push('| --- | --- |');
  lines.push(`| Run number | ${campaign?.runNumber ?? 'n/a'} |`);
  lines.push(`| Task | ${campaign?.task ?? `${report.scenarios.length} isolated lion-ui scenarios`} |`);
  const defaultAgent =
    report.provider === 'copilot'
      ? 'GitHub Copilot (custom agent)'
      : 'OpenAI-compatible chat model + file tools';
  lines.push(`| Agent | ${campaign?.agent ?? defaultAgent} |`);
  lines.push(`| Provider | ${report.provider} |`);
  if (report.provider === 'openai' && report.baseUrl) {
    lines.push(`| Endpoint | ${report.baseUrl} |`);
  }
  lines.push(`| Target repository revision | ${campaign?.targetRepositoryRevision ?? 'n/a'} |`);
  lines.push(`| Skill-source revision | ${campaign?.skillSourceRevision ?? 'n/a'} |`);
  lines.push(`| Skill under test | \`${report.skillOrAgent.type}\` ${report.skillOrAgent.name} |`);
  lines.push(`| Models | ${report.models.join(', ')} |`);
  lines.push(`| Samples per scenario | ${report.sampleSize} |`);
  lines.push(`| Pass threshold | ${passThreshold}% |`);
  lines.push(`| Start time | ${report.startedAt} |`);
  lines.push(`| End time | ${report.finishedAt} |`);
  lines.push(`| Duration | ${Math.round(report.durationMs / 1000)}s |`);
  lines.push(
    `| Exit reason | ${maxTurnsHits > 0 ? `${maxTurnsHits} run(s) hit the turn cap` : 'completed'} |`,
  );
  lines.push('');

  lines.push('## Quality score');
  lines.push('');
  lines.push(`Overall mean: **${(report.overall.mean * 100).toFixed(1)}%**`);
  lines.push('');
  lines.push('| Model | Mean | Min | Max | Std dev | Runs |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const entry of report.perModel) {
    lines.push(
      `| ${entry.model} | ${(entry.stats.mean * 100).toFixed(1)}% | ${(entry.stats.min * 100).toFixed(1)}% | ` +
        `${(entry.stats.max * 100).toFixed(1)}% | ${(entry.stats.stdDev * 100).toFixed(1)} | ${entry.stats.count} |`,
    );
  }
  lines.push('');

  lines.push('### Per scenario');
  lines.push('');
  lines.push('| Model | Scenario | Mean | Kind |');
  lines.push('| --- | --- | --- | --- |');
  for (const entry of [...report.perModelScenario].sort((a, b) => a.stats.mean - b.stats.mean)) {
    const kind = scenarioByName.get(entry.scenario)?.kind ?? '';
    lines.push(`| ${entry.model} | ${entry.scenario} | ${(entry.stats.mean * 100).toFixed(1)}% | ${kind} |`);
  }
  lines.push('');

  if (report.behaviour) {
    // Reported separately from the conformance score on purpose: a scenario can reach 100% on the
    // convention checks and the goldens while the produced code does not work at all, and that gap
    // is the finding worth surfacing rather than averaging away.
    lines.push('## Behaviour (real browser)');
    lines.push('');
    lines.push(
      `Produced code executed in a headless browser: **${report.behaviour.passed}/${report.behaviour.total} passed**` +
        (report.behaviour.failed > 0 ? `, ${report.behaviour.failed} failed` : '') +
        ` (${(report.behaviour.durationMs / 1000).toFixed(1)}s).`,
    );
    lines.push('');
    lines.push('| Model | Scenario | Behaviour | Evidence |');
    lines.push('| --- | --- | --- | --- |');
    for (const run of report.runs) {
      if (!run.behaviour) continue;
      const evidence = run.behaviour.passed
        ? 'passed'
        : run.behaviour.failures
            .map(failure => `${failure.test}: ${failure.message}`)
            .join('; ')
            .slice(0, 200);
      lines.push(
        `| ${run.model} | ${run.scenario} | ${run.behaviour.passed ? 'pass' : 'FAIL'} | ${evidence} |`,
      );
    }
    lines.push('');
  }

  lines.push('## Measured milestones');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('| --- | --- |');
  lines.push(`| Valid runs | ${report.runs.length} |`);
  lines.push(`| Model turns (total / mean) | ${totalTurns} / ${avg(totalTurns, report.runs.length)} |`);
  lines.push(
    `| Tool calls (total / mean) | ${totalToolCalls} / ${avg(totalToolCalls, report.runs.length)} |`,
  );
  lines.push(`| Tool errors (avoidable retries) | ${totalToolErrors} |`);
  lines.push(`| Runs that hit the turn cap | ${maxTurnsHits} |`);
  lines.push(`| Total tokens | ${totalTokens} |`);
  lines.push(`| Time to first product edit | n/a (not instrumented) |`);
  lines.push(`| Time to first lint | n/a (not instrumented) |`);
  lines.push(`| Time to green tests | n/a (not instrumented) |`);
  lines.push('');

  lines.push('## Undesirable behaviors (evidence)');
  lines.push('');
  if (failingRuns.length === 0 && totalToolErrors === 0) {
    lines.push('None observed: every scenario passed and no tool call errored.');
  } else {
    lines.push('| Evidence | Scenario | Model | Impact | Classification |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const run of failingRuns) {
      for (const check of run.score.checks.filter(check => !check.passed)) {
        lines.push(
          `| ${check.description} | ${run.scenario}:${run.sample} | ${run.model} | check failed | ${run.agentRun.attempted ? 'knowledge / navigation' : 'not attempted'} |`,
        );
      }
      for (const file of run.score.files.filter(file => !file.normalizedMatch)) {
        lines.push(
          `| ${file.path} differs beyond formatting (similarity ${(file.similarity * 100).toFixed(0)}%) | ` +
            `${run.scenario}:${run.sample} | ${run.model} | golden mismatch | knowledge |`,
        );
      }
    }
    for (const run of report.runs.filter(run => run.agentRun.toolErrors > 0)) {
      lines.push(
        `| ${run.agentRun.toolErrors} tool error(s) | ${run.scenario}:${run.sample} | ${run.model} | avoidable retries | navigation / adherence |`,
      );
    }
    for (const run of report.runs) {
      for (const gate of run.score.gates.filter(gate => !gate.passed)) {
        lines.push(
          `| ${gate.name} gate failed (score zeroed): ${gate.summary} | ${run.scenario}:${run.sample} | ${run.model} | output does not parse | correctness (deterministic) |`,
        );
      }
    }
  }
  lines.push('');

  lines.push('## Convergence');
  lines.push('');
  const clean = failingRuns.length === 0 && totalToolErrors === 0;
  lines.push(`- [${passMark(report.overall.mean * 100 >= passThreshold)}] Every scenario reached the pass threshold.`);
  lines.push(
    `- [${passMark(report.runs.every(run => run.score.gates.every(gate => gate.passed)))}] Every scenario passed its deterministic gates.`,
  );
  lines.push(`- [${passMark(totalToolErrors === 0)}] No avoidable tool-call retries.`);
  lines.push(`- [${passMark(maxTurnsHits === 0)}] Every run finished within the turn budget.`);
  lines.push(`- [${passMark(clean)}] No actionable knowledge or navigation gap remains.`);

  // Separate the two failure modes: a model that never wrote the deliverable says nothing about
  // the skill, so it is reported as an attempt rate rather than folded into the score.
  const attemptedRuns = report.runs.filter(run => run.agentRun.attempted).length;
  lines.push(
    `- Attempt rate: ${attemptedRuns}/${report.runs.length} run(s) modified the deliverable.`,
  );

  const redoable = report.redoable ?? [];
  if (redoable.length > 0) {
    lines.push('');
    lines.push('## Runs to redo');
    lines.push('');
    lines.push('Excluded from the score: the endpoint failed, so no comparable result exists.');
    lines.push('');
    lines.push('| Scenario | Model | Sample | Reason | Evidence |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const run of redoable) {
      lines.push(
        `| ${run.scenario} | ${run.model} | ${run.sample} | ${run.reason} | ${run.message.replace(/\s+/g, ' ').replace(/\|/g, '\\|').slice(0, 200)} |`,
      );
    }
    lines.push('');
    lines.push(
      `- [FAIL] ${redoable.length} run(s) need a redo (endpoint failure) and are excluded from the score.`,
    );
  }
  lines.push('');
  lines.push(`Run result: **${clean ? 'clean' : 'not clean'}**`);
  lines.push('');

  return `${lines.join('\n')}\n`;
}

export function writeRunRecord({
  report,
  campaign,
  scenarios,
  passThreshold,
  outputDir = DEFAULT_REPORT_DIR,
}: {
  report: SkillTesterReport;
  campaign?: RunRecordMetadata;
  scenarios: TestScenario[];
  passThreshold: number;
  outputDir?: string;
}): RunRecordResult {
  fs.mkdirSync(outputDir, { recursive: true });
  const timestamp = report.finishedAt.replace(/[:.]/g, '-');
  const slugName = report.skillOrAgent.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const basename = `${timestamp}-${slugName}`;

  const markdownPath = path.join(outputDir, `${basename}.md`);
  const jsonPath = path.join(outputDir, `${basename}.json`);
  fs.writeFileSync(markdownPath, renderRunRecord({ report, campaign, scenarios, passThreshold }));
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);

  return { markdownPath, jsonPath };
}

export function summariseFailingChecks(run: ScenarioRunResult): string[] {
  return unique(run.score.checks.filter(check => !check.passed).map(check => check.description));
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function avg(total: number, count: number): string {
  return count === 0 ? '0' : (total / count).toFixed(1);
}
