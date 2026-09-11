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
      duration: Math.round(/** @type {number} */ ((event.dur) / 1000) * 100) / 100, // ms
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

export function advancedPerfPlugin() {
  /** @type {Map<string, {client: import('playwright').CDPSession, events: Record<string, unknown>[], frameId: string}>} */
  const traces = new Map();

  return {
    name: 'advanced-perf-plugin',

    /** @param {import('@web/test-runner-core').ExecuteCommandArgs} args */
    async executeCommand({ command, session, payload }) {
      if (
        !START_COMMANDS.has(command) &&
        !STOP_COMMANDS.has(command) &&
        !LIGHTHOUSE_COMMANDS.has(command) &&
        !MEASURE_RENDER_COMMANDS.has(command)
      ) {
        return undefined;
      }

      if (!isSupported(session)) {
        return { supported: false };
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
