/**
 * Quality scoring for skill/agent runs.
 *
 * A run produces one transformed sandbox. We score it on three complementary levels so a
 * single number is meaningful without pretending an LLM's output matches a golden file
 * byte-for-byte:
 *
 *   1. exact match        — the transformed file equals the expectation after trimming
 *   2. normalized match   — equal once formatting (whitespace, blank lines) is ignored
 *   3. similarity         — line-level similarity (partial credit for near-correct output)
 *
 * Scenarios can additionally declare objective `checks` (contains / notContains / matches) for
 * properties that must hold but cannot be pinned to one golden file (e.g. "imports from
 * `@lion/ui/*`, never from `@lion/*`"). File scores and check outcomes are averaged into a
 * single 0..100 quality score, with a full breakdown kept for reporting.
 */

import fs from 'node:fs';
import path from 'node:path';
import { diffLines } from 'diff';
import type { ScenarioCheck } from '../scenarios/types.ts';

export type FileScore = {
  path: string;
  exists: boolean;
  exact: boolean;
  normalizedMatch: boolean;
  /** 0..1 line-level similarity against the expected content. */
  similarity: number;
  /** 0..1 composite score actually used in the aggregate. */
  score: number;
};

export type CheckOutcome = {
  description: string;
  passed: boolean;
  weight: number;
};

export type ScenarioScore = {
  /** Weighted 0..1 score. */
  score: number;
  /** Same score expressed 0..100, for dashboards and thresholds. */
  percent: number;
  files: FileScore[];
  checks: CheckOutcome[];
};

export type AggregateStats = {
  count: number;
  mean: number;
  min: number;
  max: number;
  stdDev: number;
};

export function normalizeContent(content: string): string {
  return content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trim().replace(/\s+/g, ' '))
    .filter(line => line.length > 0)
    .join('\n');
}

export function lineSimilarity(expected: string, actual: string): number {
  if (expected === actual) return 1;
  const changes = diffLines(expected, actual);
  let matched = 0;
  let total = 0;
  for (const change of changes) {
    const length = change.value.length;
    total += length;
    if (!change.added && !change.removed) matched += length;
  }
  return total === 0 ? 1 : matched / total;
}

const PARTIAL_CREDIT_CAP = 0.9;
const NORMALIZED_SCORE = 0.95;

export function scoreFile({
  sandboxRoot,
  relativePath,
  expectedContent,
}: {
  sandboxRoot: string;
  relativePath: string;
  expectedContent: string;
}): FileScore {
  const absolutePath = path.join(sandboxRoot, relativePath);
  let actualContent: string | undefined;
  try {
    actualContent = fs.readFileSync(absolutePath, 'utf-8');
  } catch {
    return {
      path: relativePath,
      exists: false,
      exact: false,
      normalizedMatch: false,
      similarity: 0,
      score: 0,
    };
  }

  const exact = actualContent.trim() === expectedContent.trim();
  const normalizedMatch =
    !exact && normalizeContent(actualContent) === normalizeContent(expectedContent);
  const similarity = lineSimilarity(expectedContent.trim(), actualContent.trim());
  const score = exact ? 1 : normalizedMatch ? NORMALIZED_SCORE : Math.min(similarity, PARTIAL_CREDIT_CAP);

  return { path: relativePath, exists: true, exact, normalizedMatch, similarity, score };
}

function readSandboxFile(sandboxRoot: string, relativePath: string): string {
  try {
    return fs.readFileSync(path.join(sandboxRoot, relativePath), 'utf-8');
  } catch {
    return '';
  }
}

const CHECK_DESCRIPTIONS: Record<ScenarioCheck['type'], (check: ScenarioCheck) => string> = {
  contains: check => `${check.file} contains ${JSON.stringify(check.value ?? '')}`,
  notContains: check => `${check.file} does not contain ${JSON.stringify(check.value ?? '')}`,
  matches: check => `${check.file} matches /${check.pattern ?? ''}/`,
  notMatches: check => `${check.file} does not match /${check.pattern ?? ''}/`,
  exists: check => `${check.file} exists`,
};

export function evaluateCheck(sandboxRoot: string, check: ScenarioCheck): CheckOutcome {
  const content = readSandboxFile(sandboxRoot, check.file);
  const description = check.description ?? CHECK_DESCRIPTIONS[check.type](check);
  const weight = check.weight ?? 1;
  let passed = false;

  switch (check.type) {
    case 'exists':
      passed = content.length > 0;
      break;
    case 'contains':
      passed = content.includes(check.value ?? '');
      break;
    case 'notContains':
      passed = !content.includes(check.value ?? '');
      break;
    case 'matches':
      passed = new RegExp(check.pattern ?? '', check.flags).test(content);
      break;
    case 'notMatches':
      passed = !new RegExp(check.pattern ?? '', check.flags).test(content);
      break;
  }

  return { description, passed, weight };
}

export function scoreScenario({
  sandboxRoot,
  expectedTransformedFiles = {},
  checks = [],
}: {
  sandboxRoot: string;
  expectedTransformedFiles?: Record<string, string>;
  checks?: ScenarioCheck[];
}): ScenarioScore {
  const files = Object.entries(expectedTransformedFiles).map(([relativePath, expectedContent]) =>
    scoreFile({ sandboxRoot, relativePath, expectedContent }),
  );
  const checkOutcomes = checks.map(check => evaluateCheck(sandboxRoot, check));

  const items: { score: number; weight: number }[] = [
    ...files.map(file => ({ score: file.score, weight: 1 })),
    ...checkOutcomes.map(check => ({ score: check.passed ? 1 : 0, weight: check.weight })),
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const score =
    totalWeight === 0 ? 1 : items.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight;

  return { score, percent: Math.round(score * 1000) / 10, files, checks: checkOutcomes };
}

export function aggregate(scores: number[]): AggregateStats {
  if (scores.length === 0) {
    return { count: 0, mean: 0, min: 0, max: 0, stdDev: 0 };
  }
  const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  const variance =
    scores.reduce((sum, value) => sum + (value - mean) ** 2, 0) / scores.length;
  return {
    count: scores.length,
    mean,
    min: Math.min(...scores),
    max: Math.max(...scores),
    stdDev: Math.sqrt(variance),
  };
}
