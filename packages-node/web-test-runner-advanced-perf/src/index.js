const START_COMMANDS = new Set(['perf:start', 'advanced-perf:start', 'forced-layout-trace:start']);
const STOP_COMMANDS = new Set(['perf:stop', 'advanced-perf:stop', 'forced-layout-trace:stop']);
const LIGHTHOUSE_COMMANDS = new Set([
  'perf:get-lighthouse-metrics',
  'advanced-perf:get-lighthouse-metrics',
  'lighthouse-metrics',
]);
const MEASURE_RENDER_COMMANDS = new Set([
  'perf:measure-render',
  'advanced-perf:measure-render',
  'measure-render',
]);
const MEASURE_COMMANDS = new Set(['perf:measure', 'advanced-perf:measure', 'measure']);
const STATISTICAL_MEASURE_COMMANDS = new Set(['perf:statistical-measure']);

/** @param {number} degreesOfFreedom */
function criticalT95(degreesOfFreedom) {
  const z = 1.959963984540054;
  const degrees = Math.max(1, degreesOfFreedom);
  return (
    z +
    (z ** 3 + z) / (4 * degrees) +
    (5 * z ** 5 + 16 * z ** 3 + 3 * z) / (96 * degrees ** 2) +
    (3 * z ** 7 + 19 * z ** 5 + 17 * z ** 3 - 15 * z) / (384 * degrees ** 3)
  );
}

/** @param {number[]} values */
export function summaryStats(values) {
  if (values.length < 2) throw new Error('At least two samples are required.');
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
  const standardDeviation = Math.sqrt(variance);
  const margin = criticalT95(values.length - 1) * (standardDeviation / Math.sqrt(values.length));
  return {
    mean,
    meanCI: { high: mean + margin, low: mean - margin },
    relativeStandardDeviation: standardDeviation / mean,
    size: values.length,
    standardDeviation,
    variance,
  };
}

/** @param {Record<string, ReturnType<typeof summaryStats>>} benchmarks */
export function formatBenchmarkReport(benchmarks) {
  return Object.fromEntries(
    Object.entries(benchmarks).map(([name, statistics]) => [
      name,
      {
        '95% CI': `${statistics.meanCI.low.toFixed(2)} to ${statistics.meanCI.high.toFixed(2)} ms`,
        mean: `${statistics.mean.toFixed(2)} ms`,
        RSD: `${(statistics.relativeStandardDeviation * 100).toFixed(2)} %`,
        samples: `${statistics.size.toFixed(2)} samples`,
        σ: `${statistics.standardDeviation.toFixed(2)} ms`,
      },
    ]),
  );
}

/** @param {ReturnType<typeof formatBenchmarkReport>} report */
export function renderBenchmarkReport(report) {
  const rows = Object.entries(report);
  const headers = ['benchmark', '95% CI', 'mean', 'RSD', 'samples', 'σ'];
  /** @type {string[][]} */
  const cells = rows.map(([name, statistics]) => [
    name,
    statistics['95% CI'],
    statistics.mean,
    statistics.RSD,
    statistics.samples,
    statistics['σ'],
  ]);
  const widths = headers.map((header, index) =>
    Math.max(header.length, ...cells.map(row => row[index].length)),
  );
  const separator = `+-${widths.map(width => '-'.repeat(width)).join('-+-')}-+`;
  /** @param {string[]} row */
  const formatRow = row =>
    `| ${row.map((cell, index) => cell.padEnd(widths[index])).join(' | ')} |`;

  return [separator, formatRow(headers), separator, ...cells.map(formatRow), separator].join('\n');
}

/** @param {ReturnType<typeof summaryStats>} baseline @param {ReturnType<typeof summaryStats>} candidate */
export function computeDifference(baseline, candidate) {
  const mean = candidate.mean - baseline.mean;
  const variance = baseline.variance / baseline.size + candidate.variance / candidate.size;
  const relativeMean = mean / baseline.mean;
  const relativeVariance =
    (baseline.variance * candidate.mean ** 2 + candidate.variance * baseline.mean ** 2) /
    (baseline.mean ** 4 * Math.min(baseline.size, candidate.size));
  const t = criticalT95(Math.min(baseline.size, candidate.size) - 1);
  return {
    absolute: {
      high: mean + t * Math.sqrt(variance),
      low: mean - t * Math.sqrt(variance),
    },
    relative: {
      high: relativeMean + t * Math.sqrt(relativeVariance),
      low: relativeMean - t * Math.sqrt(relativeVariance),
    },
  };
}

/** @param {Record<string, unknown>} event */
function isCompleteEvent(event) {
  return (
    event.ph === 'X' &&
    typeof event.ts === 'number' &&
    typeof event.dur === 'number' &&
    typeof event.pid === 'number' &&
    typeof event.tid === 'number'
  );
}

/** @param {Record<string, unknown>} event */
function getEventFrameId(event) {
  if (event.args && typeof event.args === 'object' && 'beginData' in event.args) {
    const { beginData } = event.args;
    if (beginData && typeof beginData === 'object' && 'frame' in beginData) {
      return beginData.frame;
    }
  }
  return undefined;
}

/** @param {Record<string, unknown>[]} traceEvents */
function getScheduledLayoutIntervals(traceEvents) {
  /** @type {Map<string, number[]>} */
  const starts = new Map();
  const intervals = [];

  for (const event of [...traceEvents].sort(
    (left, right) => /** @type {number} */ (left.ts) - /** @type {number} */ (right.ts),
  )) {
    const isInvalidScheduledLayoutMarker =
      event.name !== 'AnimationFrame::StyleAndLayout' ||
      typeof event.pid !== 'number' ||
      typeof event.tid !== 'number' ||
      typeof event.ts !== 'number';

    if (!isInvalidScheduledLayoutMarker) {
      const key = `${event.pid}:${event.tid}`;
      if (event.ph === 'b') {
        const pendingStarts = starts.get(key) || [];
        pendingStarts.push(/** @type {number} */ (event.ts));
        starts.set(key, pendingStarts);
      } else if (event.ph === 'e') {
        const start = starts.get(key)?.pop();
        if (start !== undefined) {
          intervals.push({ end: /** @type {number} */ (event.ts), key, start });
        }
      }
    }
  }

  return intervals;
}

/**
 * Finds Chromium timeline layout events outside the normal frame lifecycle.
 * Chromium wraps scheduled rendering work in `AnimationFrame::StyleAndLayout`;
 * layout events outside those intervals were synchronously requested.
 *
 * @param {Record<string, unknown>[]} traceEvents
 * @param {string} frameId
 */
export function findForcedLayoutEvents(traceEvents, frameId) {
  const scheduledLayoutIntervals = getScheduledLayoutIntervals(traceEvents);

  return traceEvents
    .filter(isCompleteEvent)
    .filter(event => ['Layout', 'UpdateLayoutTree'].includes(/** @type {string} */ (event.name)))
    .filter(event => getEventFrameId(event) === frameId)
    .filter(event => {
      const key = `${event.pid}:${event.tid}`;
      const eventEnd = /** @type {number} */ (event.ts) + /** @type {number} */ (event.dur);
      return !scheduledLayoutIntervals.some(
        interval =>
          interval.key === key &&
          interval.start <= /** @type {number} */ (event.ts) &&
          interval.end >= eventEnd,
      );
    })
    .map(event => ({
      duration: Math.round(/** @type {number} */ (event.dur / 1000) * 100) / 100, // ms
      name: event.name,
      timestamp: event.ts,
    }));
}

/**
 * Analyzes trace events for detailed rendering breakdown.
 *
 * @param {Record<string, unknown>[]} traceEvents
 * @param {string} frameId
 */
export function analyzeTracePerformance(traceEvents, frameId) {
  const forcedLayoutEvents = findForcedLayoutEvents(traceEvents, frameId);
  const scheduledLayoutIntervals = getScheduledLayoutIntervals(traceEvents);

  let totalLayoutUs = 0;
  let totalRecalcStyleUs = 0;
  let totalPaintUs = 0;
  let totalScriptUs = 0;
  let scheduledLayoutUs = 0;

  for (const event of traceEvents
    .filter(isCompleteEvent)
    .filter(ev => getEventFrameId(ev) === frameId)) {
    const { dur, name } = /** @type {{ dur: number, name: string }} */ (event);

    if (name === 'Layout') {
      totalLayoutUs += dur;
      const key = `${event.pid}:${event.tid}`;
      const eventEnd = /** @type {number} */ (event.ts) + dur;
      const isScheduled = scheduledLayoutIntervals.some(
        interval =>
          interval.key === key &&
          interval.start <= /** @type {number} */ (event.ts) &&
          interval.end >= eventEnd,
      );
      if (isScheduled) {
        scheduledLayoutUs += dur;
      }
    } else if (name === 'UpdateLayoutTree') {
      totalRecalcStyleUs += dur;
    } else if (['Paint', 'RasterTask', 'CompositeLayers'].includes(name)) {
      totalPaintUs += dur;
    } else if (['FunctionCall', 'EvaluateScript', 'v8.compile'].includes(name)) {
      totalScriptUs += dur;
    }
  }

  const forcedLayoutUs = forcedLayoutEvents.reduce((sum, ev) => sum + ev.duration * 1000, 0);

  const layoutTime = Math.round((totalLayoutUs / 1000) * 100) / 100;
  const recalcStyleTime = Math.round((totalRecalcStyleUs / 1000) * 100) / 100;
  const paintTime = Math.round((totalPaintUs / 1000) * 100) / 100;
  const scriptTime = Math.round((totalScriptUs / 1000) * 100) / 100;
  const totalRenderTime = Math.round((layoutTime + recalcStyleTime + paintTime) * 100) / 100;

  return {
    forcedLayoutCount: forcedLayoutEvents.length,
    forcedLayoutDuration: Math.round((forcedLayoutUs / 1000) * 100) / 100,
    forcedLayoutEvents,
    layoutTime,
    paintTime,
    recalcStyleTime,
    scheduledLayoutDuration: Math.round((scheduledLayoutUs / 1000) * 100) / 100,
    scriptTime,
    totalRenderTime,
  };
}

/**
 * Error function approximation for log-normal distribution scoring.
 * @param {number} x
 */
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  const a = Math.abs(x);
  const t = 1.0 / (1.0 + 0.3275911 * a);
  const y =
    1.0 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-a * a);
  return sign * y;
}

/**
 * Lighthouse log-normal metric scoring function.
 * @param {number} value
 * @param {number} p10
 * @param {number} median
 */
function logNormalScore(value, p10, median) {
  if (value <= 0) return 100;
  const location = Math.log(median);
  const shape = Math.abs(Math.log(p10 / median)) / 1.2815515655446004;
  const x = (Math.log(value) - location) / shape;
  const score = 0.5 * (1 - erf(x / Math.SQRT2));
  return Math.min(100, Math.max(0, Math.round(score * 100)));
}

/**
 * Calculates Lighthouse performance metrics score (0-100) using Lighthouse v10/v11 weights:
 * - FCP (First Contentful Paint): 10%
 * - Speed Index (SI): 10%
 * - LCP (Largest Contentful Paint): 25%
 * - TBT (Total Blocking Time): 30%
 * - CLS (Cumulative Layout Shift): 25%
 *
 * @param {{ fcp?: number, lcp?: number, tbt?: number, cls?: number, speedIndex?: number }} metrics
 */
export function calculateLighthouseScore(metrics = {}) {
  const fcp = metrics.fcp ?? 0;
  const lcp = metrics.lcp ?? fcp;
  const tbt = metrics.tbt ?? 0;
  const cls = metrics.cls ?? 0;
  const speedIndex = metrics.speedIndex ?? fcp;

  // Lighthouse v10/v11 scoring curves (p10, median)
  const scores = {
    cls: logNormalScore(cls, 0.1, 0.25),
    fcp: logNormalScore(fcp, 1800, 3000),
    lcp: logNormalScore(lcp, 2500, 4000),
    speedIndex: logNormalScore(speedIndex, 3400, 5800),
    tbt: logNormalScore(tbt, 200, 600),
  };

  // Lighthouse weights
  const totalScore = Math.round(
    scores.fcp * 0.1 +
      scores.speedIndex * 0.1 +
      scores.lcp * 0.25 +
      scores.tbt * 0.3 +
      scores.cls * 0.25,
  );

  return {
    metrics: {
      cls,
      fcp,
      lcp,
      speedIndex,
      tbt,
    },
    metricScores: scores,
    score: totalScore,
  };
}

/**
 * @param {import('@web/test-runner-core').BasicTestSession} session
 */
function isSupported(session) {
  return session.browser.type === 'playwright' && session.browser.name === 'Chromium';
}

/** @param {{ report?: boolean, statisticalBench?: boolean }=} pluginOptions */
export function advancedPerfPlugin(pluginOptions = {}) {
  /** @type {Map<string, {client: import('playwright').CDPSession, events: Record<string, unknown>[], frameId: string}>} */
  const traces = new Map();
  /** @type {Record<string, ReturnType<typeof summaryStats>>} */
  const reportedBenchmarks = {};

  return {
    name: 'advanced-perf-plugin',

    serverStop() {
      if (Object.keys(reportedBenchmarks).length > 0) {
        process.stdout.write(
          `${renderBenchmarkReport(formatBenchmarkReport(reportedBenchmarks))}\n`,
        );
      }
    },

    /** @param {import('@web/test-runner-core').ExecuteCommandArgs} args */
    async executeCommand({ command, session, payload }) {
      const isStatisticalMeasureCommand =
        pluginOptions.statisticalBench && STATISTICAL_MEASURE_COMMANDS.has(command);
      if (
        !START_COMMANDS.has(command) &&
        !STOP_COMMANDS.has(command) &&
        !LIGHTHOUSE_COMMANDS.has(command) &&
        !MEASURE_RENDER_COMMANDS.has(command) &&
        !MEASURE_COMMANDS.has(command) &&
        !isStatisticalMeasureCommand
      ) {
        return undefined;
      }

      if (!isSupported(session)) {
        return { supported: false };
      }

      if (MEASURE_COMMANDS.has(command) || isStatisticalMeasureCommand) {
        if (!pluginOptions.statisticalBench) return { enabled: false, supported: true };
        const page = session.browser.getPage(session.id);
        const options =
          /** @type {{ measure?: { entryName?: string, entryType?: 'mark'|'measure'|'paint', mode: 'callback'|'global'|'paint'|'performance' }, report?: boolean, runId?: string, sampleSize?: number, warmup?: number }} */ (
            payload || {}
          );
        if (!options.runId || !options.measure)
          throw new Error('A benchmark runId and measurement mode are required.');
        const sampleSize = options.sampleSize ?? 50;
        const warmup = options.warmup ?? 5;
        const benchmarkNames = await page.evaluate(runId => {
          const run = globalThis.__lionAdvancedPerfBenchmarks?.get(runId);
          if (!run) throw new Error(`Benchmark run not found: ${runId}`);
          return run.benchmarks.map(benchmark => ({
            baseline: Boolean(benchmark.baseline),
            name: benchmark.name,
          }));
        }, options.runId);
        if (benchmarkNames.length === 0) throw new Error('At least one benchmark is required.');
        const names = new Set(benchmarkNames.map(benchmark => benchmark.name));
        if (names.size !== benchmarkNames.length)
          throw new Error('Benchmark names must be unique.');
        const baseline = benchmarkNames.find(benchmark => benchmark.baseline)?.name;
        if (benchmarkNames.filter(benchmark => benchmark.baseline).length > 1) {
          throw new Error('Only one benchmark may be marked as the baseline.');
        }
        const samples = Object.fromEntries(benchmarkNames.map(benchmark => [benchmark.name, []]));

        for (let round = 0; round < warmup + sampleSize; round += 1) {
          for (const benchmark of benchmarkNames) {
            const value = await page.evaluate(
              async ({ benchmarkName, measure, runId }) => {
                const run = globalThis.__lionAdvancedPerfBenchmarks?.get(runId);
                const benchmarkDefinition = run?.benchmarks.find(
                  item => item.name === benchmarkName,
                );
                if (!benchmarkDefinition) throw new Error(`Benchmark not found: ${benchmarkName}`);
                const context = benchmarkDefinition.reuseFixture
                  ? (benchmarkDefinition.context ||= await benchmarkDefinition.fixture())
                  : await benchmarkDefinition.fixture();
                const paintStart = performance.now();
                let startedAt;
                let callbackValue;
                const controls = {
                  start: () => {
                    if (startedAt !== undefined) throw new Error('Measurement already started.');
                    startedAt = performance.now();
                  },
                  stop: () => {
                    if (startedAt === undefined) throw new Error('Measurement was not started.');
                    callbackValue = performance.now() - startedAt;
                  },
                };
                const entryCount = measure.entryName
                  ? performance.getEntriesByName(measure.entryName, measure.entryType).length
                  : 0;
                delete globalThis.tachometerResult;
                const returnedValue = await benchmarkDefinition.run?.(context, controls);
                let measurement;
                if (measure.mode === 'callback') measurement = callbackValue ?? returnedValue;
                else if (measure.mode === 'global') measurement = globalThis.tachometerResult;
                else if (measure.mode === 'performance') {
                  const entry = performance.getEntriesByName(measure.entryName, measure.entryType)[
                    entryCount
                  ];
                  measurement =
                    measure.entryType === 'measure' ? entry?.duration : entry?.startTime;
                } else {
                  await new Promise(resolve => {
                    requestAnimationFrame(() => requestAnimationFrame(resolve));
                  });
                  measurement = performance.now() - paintStart;
                }
                if (!Number.isFinite(measurement) || measurement < 0)
                  throw new Error(
                    `Benchmark ${benchmarkName} did not produce a finite non-negative duration.`,
                  );
                if (benchmarkDefinition.reset) await benchmarkDefinition.reset(context);
                if (!benchmarkDefinition.reuseFixture && benchmarkDefinition.cleanup)
                  await benchmarkDefinition.cleanup(context);
                return measurement;
              },
              {
                benchmarkName: benchmark.name,
                measure: options.measure,
                runId: options.runId,
              },
            );
            if (round >= warmup) samples[benchmark.name].push(value);
          }
        }

        const benchmarks = Object.fromEntries(
          Object.entries(samples).map(([name, values]) => [name, summaryStats(values)]),
        );
        const comparisons = Object.fromEntries(
          Object.keys(benchmarks).map(name => [
            name,
            Object.fromEntries(
              Object.keys(benchmarks)
                .filter(otherName => otherName !== name)
                .map(otherName => [
                  otherName,
                  computeDifference(benchmarks[otherName], benchmarks[name]),
                ]),
            ),
          ]),
        );
        const report = options.report ?? pluginOptions.report;
        if (report) Object.assign(reportedBenchmarks, benchmarks);
        return {
          baseline,
          benchmarks,
          comparisons,
          enabled: true,
          report,
          resolved: true,
          supported: true,
          timedOut: false,
        };
      }

      const page = session.browser.getPage(session.id);

      if (START_COMMANDS.has(command)) {
        if (traces.has(session.id)) {
          throw new Error('An advanced performance trace is already active for this test session.');
        }

        const client = await page.context().newCDPSession(page);
        const { frameTree } = await client.send('Page.getFrameTree');
        const frameId = frameTree.frame.id;
        const events = [];
        client.on('Tracing.dataCollected', ({ value }) => events.push(...value));
        await client.send('Tracing.start', {
          categories:
            'devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.stack',
          transferMode: 'ReportEvents',
        });
        traces.set(session.id, { client, events, frameId });
        return { supported: true };
      }

      if (STOP_COMMANDS.has(command)) {
        const trace = traces.get(session.id);
        if (!trace) {
          throw new Error('No advanced performance trace is active for this test session.');
        }

        const tracingComplete = new Promise(resolve => {
          trace.client.once('Tracing.tracingComplete', resolve);
        });
        await trace.client.send('Tracing.end');
        await tracingComplete;
        await trace.client.detach();
        traces.delete(session.id);

        const analysis = analyzeTracePerformance(trace.events, trace.frameId);

        return {
          events: analysis.forcedLayoutEvents,
          renderMetrics: analysis,
          supported: true,
        };
      }

      if (LIGHTHOUSE_COMMANDS.has(command)) {
        const client = await page.context().newCDPSession(page);
        await client.send('Performance.enable');
        const { metrics: rawCdpMetrics } = await client.send('Performance.getMetrics');

        /** @type {Record<string, number>} */
        const cdpMetrics = {};
        for (const metric of rawCdpMetrics) {
          cdpMetrics[metric.name] = metric.value;
        }

        // Gather in-page metrics
        const inPageMetrics = await page.evaluate(() => {
          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
          let fcp = 0;
          if (fcpEntry) {
            fcp = fcpEntry.startTime;
          } else if (fpEntry) {
            fcp = fpEntry.startTime;
          }

          const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
          const lcp = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : fcp;

          const layoutShiftEntries = performance.getEntriesByType('layout-shift');
          let cls = 0;
          for (const entry of layoutShiftEntries) {
            // @ts-ignore
            if (!entry.hadRecentInput) {
              // @ts-ignore
              cls += entry.value;
            }
          }

          const longTaskEntries = performance.getEntriesByType('longtask');
          let tbt = 0;
          for (const entry of longTaskEntries) {
            if (entry.duration > 50) {
              tbt += entry.duration - 50;
            }
          }

          const speedIndex = fcp + (lcp - fcp) * 0.5;

          return {
            cls: Math.round(cls * 1000) / 1000,
            fcp: Math.round(fcp * 10) / 10,
            lcp: Math.round(lcp * 10) / 10,
            speedIndex: Math.round(speedIndex * 10) / 10,
            tbt: Math.round(tbt * 10) / 10,
          };
        });

        await client.detach();

        const lighthouseResult = calculateLighthouseScore(inPageMetrics);

        return {
          cdpMetrics,
          lighthouse: lighthouseResult,
          supported: true,
        };
      }

      if (MEASURE_RENDER_COMMANDS.has(command)) {
        const payloadOpts = /** @type {{ selector?: string, measureReflow?: boolean }} */ (
          payload || {}
        );

        // Measure in-browser render/paint performance
        const result = await page.evaluate(
          async ({ selector, measureReflow }) => {
            const element = selector ? document.querySelector(selector) : document.body;
            if (!element) {
              return { error: `Element not found for selector: ${selector}` };
            }

            const startMark = `perf-measure-start-${Date.now()}`;
            const endMark = `perf-measure-end-${Date.now()}`;
            performance.mark(startMark);

            let reflowDuration = 0;
            if (measureReflow) {
              const startReflow = performance.now();
              // Trigger forced layout
              // eslint-disable-next-line no-unused-expressions
              /** @type {HTMLElement} */ (element).offsetWidth;
              reflowDuration = performance.now() - startReflow;
            }

            await new Promise(resolve => {
              requestAnimationFrame(() => resolve(undefined));
            });
            performance.mark(endMark);

            performance.measure('render-measure', startMark, endMark);
            const measures = performance.getEntriesByName('render-measure');
            const duration = measures.length > 0 ? measures[measures.length - 1].duration : 0;

            const paintEntries = performance.getEntriesByType('paint');
            const fp = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;

            return {
              duration: Math.round(duration * 100) / 100,
              firstPaint: Math.round(fp * 100) / 100,
              hasReflow: Boolean(measureReflow),
              reflowDuration: Math.round(reflowDuration * 100) / 100,
            };
          },
          {
            measureReflow: payloadOpts.measureReflow ?? false,
            selector: payloadOpts.selector,
          },
        );

        return {
          renderPerformance: result,
          supported: true,
        };
      }

      return undefined;
    },
  };
}

export const forcedLayoutPlugin = advancedPerfPlugin;
