import { executeServerCommand } from '@web/test-runner-commands';

const benchmarkRuns = new Map();
/** @type {Record<string, unknown>} */
const globalScope = globalThis;
globalScope.__lionAdvancedPerfBenchmarks = benchmarkRuns;

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

/**
 * Measures forced-layout events during construction → first render of an element (an FCP proxy).
 *
 * The forced-layout trace is started, `setup` runs the element construction + first render, then
 * the trace is stopped and the forced-layout events are counted. Forced layout = layout triggered
 * synchronously outside a scheduled `AnimationFrame::StyleAndLayout` interval (Chromium CDP).
 *
 * @param {() => Promise<unknown> | unknown} setup the construction/first-render to measure
 * @param {{ settleMs?: number }} [options] how long to let deferred (rAF/RO) work settle inside
 *   the trace window before stopping it
 * @returns {Promise<{ supported: boolean, forcedLayoutCount: number, events: { name: string, duration: number }[] }>}
 */
export async function measureFcpForcedLayout(setup, options = {}) {
  const start = await executeServerCommand('forced-layout-trace:start');
  if (!start?.supported) {
    return { supported: false, forcedLayoutCount: 0, events: [] };
  }
  await setup();
  await new Promise(resolve => {
    setTimeout(resolve, options.settleMs ?? 150);
  });
  const stop = await executeServerCommand('forced-layout-trace:stop');
  /** @type {{ name: string, duration: number }[]} */
  const events = stop?.events ?? [];
  return { supported: true, forcedLayoutCount: events.length, events };
}
