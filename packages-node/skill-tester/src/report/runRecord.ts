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
  lines.push(`| Agent | ${campaign?.agent ?? 'OpenAI-compatible chat model + file tools'} |`);
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
          `| ${check.description} | ${run.scenario}:${run.sample} | ${run.model} | check failed | knowledge / navigation |`,
        );
      }
      for (const file of run.score.files.filter(file => !file.exact)) {
        lines.push(
          `| ${file.path} not an exact match (similarity ${(file.similarity * 100).toFixed(0)}%) | ` +
            `${run.scenario}:${run.sample} | ${run.model} | golden mismatch | knowledge |`,
        );
      }
    }
    for (const run of report.runs.filter(run => run.agentRun.toolErrors > 0)) {
      lines.push(
        `| ${run.agentRun.toolErrors} tool error(s) | ${run.scenario}:${run.sample} | ${run.model} | avoidable retries | navigation / adherence |`,
      );
    }
  }
  lines.push('');

  lines.push('## Convergence');
  lines.push('');
  const clean = failingRuns.length === 0 && totalToolErrors === 0;
  lines.push(`- [${passMark(report.overall.mean * 100 >= passThreshold)}] Every scenario reached the pass threshold.`);
  lines.push(`- [${passMark(totalToolErrors === 0)}] No avoidable tool-call retries.`);
  lines.push(`- [${passMark(maxTurnsHits === 0)}] Every run finished within the turn budget.`);
  lines.push(`- [${passMark(clean)}] No actionable knowledge or navigation gap remains.`);
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
