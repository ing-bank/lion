import { executeServerCommand } from '@web/test-runner-commands';

const benchmarkRuns = new Map();
globalThis.__lionAdvancedPerfBenchmarks = benchmarkRuns;

/**
 * @typedef {{
 *   mean: number;
 *   meanCI: { high: number, low: number };
 *   relativeStandardDeviation: number;
 *   size: number;
 *   standardDeviation: number;
 *   variance: number;
 * }} BenchmarkStatistics
 */

/**
 * @typedef {{
 *   absolute: { high: number, low: number };
 *   relative: { high: number, low: number };
 * }} BenchmarkDifference
 */

/**
 * @typedef {{
 *   baseline?: string;
 *   benchmarks: Record<string, BenchmarkStatistics>;
 *   comparisons: Record<string, Record<string, BenchmarkDifference>>;
 *   enabled: boolean;
 *   report: boolean;
 *   resolved: boolean;
 *   supported: boolean;
 *   timedOut: boolean;
 * }} BenchmarkResult
 */

/**
 * @template Context
 * @param {Array<{ name: string, baseline?: boolean, fixture: () => Promise<Context> | Context, run?: (context: Context, controls: { start: () => void, stop: () => void }) => Promise<number | void> | number | void, reset?: (context: Context) => Promise<void> | void, cleanup?: (context: Context) => Promise<void> | void, reuseFixture?: boolean }>} benchmarks
 * @param {{ measure: { entryName?: string, entryType?: 'mark'|'measure'|'paint', mode: 'callback'|'global'|'paint'|'performance' }, report?: boolean, sampleSize?: number, warmup?: number }} options
 * @returns {Promise<BenchmarkResult>}
 */
export async function runBenchmarks(benchmarks, options) {
  const runId = crypto.randomUUID();
  benchmarkRuns.set(runId, { benchmarks });
  try {
    const result = /** @type {BenchmarkResult} */ (
      await executeServerCommand('perf:statistical-measure', {
        ...options,
        runId,
      })
    );
    if (!result.supported) throw new Error('Statistical benchmarks require Playwright Chromium.');
    if (!result.enabled)
      throw new Error('Run Web Test Runner with --statisticalBench to enable benchmarks.');
    return result;
  } finally {
    benchmarkRuns.delete(runId);
  }
}
