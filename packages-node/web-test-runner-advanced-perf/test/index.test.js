import { expect } from 'chai';
import {
  advancedPerfPlugin,
  analyzeTracePerformance,
  calculateLighthouseScore,
  findForcedLayoutEvents,
} from '../src/index.js';

describe('web-test-runner-advanced-perf', () => {
  describe('calculateLighthouseScore', () => {
    it('calculates near-100 score for optimal performance metrics', () => {
      const optimalMetrics = {
        cls: 0,
        fcp: 500,
        lcp: 800,
        speedIndex: 800,
        tbt: 0,
      };

      const result = calculateLighthouseScore(optimalMetrics);

      expect(result.score).to.be.within(95, 100);
      expect(result.metrics).to.deep.equal(optimalMetrics);
      expect(result.metricScores.fcp).to.be.within(90, 100);
      expect(result.metricScores.lcp).to.be.within(90, 100);
      expect(result.metricScores.tbt).to.equal(100);
      expect(result.metricScores.cls).to.equal(100);
      expect(result.metricScores.speedIndex).to.be.within(90, 100);
    });

    it('calculates low score for poor performance metrics', () => {
      const poorMetrics = {
        cls: 0.4,
        fcp: 4000,
        lcp: 6000,
        speedIndex: 7000,
        tbt: 1000,
      };

      const result = calculateLighthouseScore(poorMetrics);

      expect(result.score).to.be.below(40);
      expect(result.metrics).to.deep.equal(poorMetrics);
      expect(result.metricScores.fcp).to.be.below(50);
      expect(result.metricScores.lcp).to.be.below(50);
      expect(result.metricScores.tbt).to.be.below(50);
      expect(result.metricScores.cls).to.be.below(50);
    });

    it('handles empty or missing metrics using safe defaults', () => {
      const result = calculateLighthouseScore({});

      expect(result.score).to.equal(100);
      expect(result.metrics).to.deep.equal({
        cls: 0,
        fcp: 0,
        lcp: 0,
        speedIndex: 0,
        tbt: 0,
      });
    });

    it('applies standard Lighthouse v10/v11 weights (FCP:10%, SI:10%, LCP:25%, TBT:30%, CLS:25%)', () => {
      const metrics = { cls: 0.1, fcp: 1800, lcp: 2500, speedIndex: 3400, tbt: 200 };
      const result = calculateLighthouseScore(metrics);

      const expectedScore = Math.round(
        result.metricScores.fcp * 0.1 +
          result.metricScores.speedIndex * 0.1 +
          result.metricScores.lcp * 0.25 +
          result.metricScores.tbt * 0.3 +
          result.metricScores.cls * 0.25,
      );

      expect(result.score).to.equal(expectedScore);
    });
  });

  describe('findForcedLayoutEvents', () => {
    const frameId = 'frame-123';

    it('detects unscheduled layout events for matching frame ID', () => {
      const traceEvents = [
        // Scheduled layout inside AnimationFrame::StyleAndLayout
        { name: 'AnimationFrame::StyleAndLayout', ph: 'b', pid: 1, tid: 1, ts: 1000 },
        {
          args: { beginData: { frame: frameId } },
          dur: 500,
          name: 'Layout',
          ph: 'X',
          pid: 1,
          tid: 1,
          ts: 1100,
        },
        { name: 'AnimationFrame::StyleAndLayout', ph: 'e', pid: 1, tid: 1, ts: 2000 },

        // Forced layout outside AnimationFrame::StyleAndLayout
        {
          args: { beginData: { frame: frameId } },
          dur: 300,
          name: 'Layout',
          ph: 'X',
          pid: 1,
          tid: 1,
          ts: 3000,
        },
        {
          args: { beginData: { frame: frameId } },
          dur: 200,
          name: 'UpdateLayoutTree',
          ph: 'X',
          pid: 1,
          tid: 1,
          ts: 3500,
        },

        // Event for another frame (should be ignored)
        {
          args: { beginData: { frame: 'frame-other' } },
          dur: 900,
          name: 'Layout',
          ph: 'X',
          pid: 1,
          tid: 1,
          ts: 4000,
        },
      ];

      const forcedEvents = findForcedLayoutEvents(traceEvents, frameId);

      expect(forcedEvents).to.have.lengthOf(2);
      expect(forcedEvents[0]).to.deep.equal({
        duration: 0.3, // 300us = 0.3ms
        name: 'Layout',
        timestamp: 3000,
      });
      expect(forcedEvents[1]).to.deep.equal({
        duration: 0.2, // 200us = 0.2ms
        name: 'UpdateLayoutTree',
        timestamp: 3500,
      });
    });
  });

  describe('analyzeTracePerformance', () => {
    const frameId = 'frame-123';

    it('aggregates trace durations for layout, style, paint, and script execution', () => {
      const traceEvents = [
        { name: 'AnimationFrame::StyleAndLayout', ph: 'b', pid: 1, tid: 1, ts: 1000 },
        {
          args: { beginData: { frame: frameId } },
          dur: 1000,
          name: 'Layout',
          ph: 'X',
          pid: 1,
          tid: 1,
          ts: 1100,
        },
        { name: 'AnimationFrame::StyleAndLayout', ph: 'e', pid: 1, tid: 1, ts: 2500 },

        {
          args: { beginData: { frame: frameId } },
          dur: 500,
          name: 'Layout',
          ph: 'X',
          pid: 1,
          tid: 1,
          ts: 3000,
        },
        {
          args: { beginData: { frame: frameId } },
          dur: 400,
          name: 'UpdateLayoutTree',
          ph: 'X',
          pid: 1,
          tid: 1,
          ts: 4000,
        },
        {
          args: { beginData: { frame: frameId } },
          dur: 300,
          name: 'Paint',
          ph: 'X',
          pid: 1,
          tid: 1,
          ts: 5000,
        },
        {
          args: { beginData: { frame: frameId } },
          dur: 800,
          name: 'FunctionCall',
          ph: 'X',
          pid: 1,
          tid: 1,
          ts: 6000,
        },
      ];

      const result = analyzeTracePerformance(traceEvents, frameId);

      expect(result.forcedLayoutCount).to.equal(2); // Layout (500us) + UpdateLayoutTree (400us)
      expect(result.forcedLayoutDuration).to.equal(0.9); // 500us + 400us = 0.9ms
      expect(result.scheduledLayoutDuration).to.equal(1); // 1000us = 1ms
      expect(result.layoutTime).to.equal(1.5); // 1500us = 1.5ms
      expect(result.recalcStyleTime).to.equal(0.4); // 400us = 0.4ms
      expect(result.paintTime).to.equal(0.3); // 300us = 0.3ms
      expect(result.scriptTime).to.equal(0.8); // 800us = 0.8ms
      expect(result.totalRenderTime).to.equal(2.2); // 1.5 + 0.4 + 0.3 = 2.2ms
    });
  });

  describe('advancedPerfPlugin command execution', () => {
    let plugin;

    beforeEach(() => {
      plugin = advancedPerfPlugin();
    });

    it('returns undefined for non-perf commands', async () => {
      const session = { browser: { name: 'Chromium', type: 'playwright' }, id: 's1' };
      const result = await plugin.executeCommand({ command: 'unknown-command', session });
      expect(result).to.be.undefined;
    });

    it('returns { supported: false } for non-Playwright/Chromium browser sessions', async () => {
      const firefoxSession = { browser: { name: 'Firefox', type: 'playwright' }, id: 's1' };
      const result = await plugin.executeCommand({
        command: 'perf:start',
        session: firefoxSession,
      });
      expect(result).to.deep.equal({ supported: false });
    });

    it('handles perf:start and perf:stop lifecycle', async () => {
      let tracingHandler;
      const mockCdpSession = {
        detach: async () => {},
        once: (event, handler) => {
          if (event === 'Tracing.tracingComplete') {
            handler();
          }
        },
        on: (event, handler) => {
          if (event === 'Tracing.dataCollected') {
            tracingHandler = handler;
          }
        },
        send: async method => {
          if (method === 'Page.getFrameTree') {
            return { frameTree: { frame: { id: 'frame-test' } } };
          }
          if (method === 'Tracing.start') {
            // simulate incoming trace data
            if (tracingHandler) {
              tracingHandler({
                value: [
                  {
                    args: { beginData: { frame: 'frame-test' } },
                    dur: 400,
                    name: 'Layout',
                    ph: 'X',
                    pid: 1,
                    tid: 1,
                    ts: 1000,
                  },
                ],
              });
            }
          }
          return {};
        },
      };

      const mockPage = {
        context: () => ({
          newCDPSession: async () => mockCdpSession,
        }),
      };

      const session = {
        browser: {
          getPage: () => mockPage,
          name: 'Chromium',
          type: 'playwright',
        },
        id: 'session-1',
      };

      const startResult = await plugin.executeCommand({ command: 'perf:start', session });
      expect(startResult).to.deep.equal({ supported: true });

      // Second start throws error
      try {
        await plugin.executeCommand({ command: 'perf:start', session });
        expect.fail('Should have thrown on double start');
      } catch (err) {
        expect(err.message).to.include('already active');
      }

      const stopResult = await plugin.executeCommand({ command: 'perf:stop', session });
      expect(stopResult.supported).to.be.true;
      expect(stopResult.events).to.have.lengthOf(1);
      expect(stopResult.events[0].name).to.equal('Layout');
      expect(stopResult.renderMetrics.forcedLayoutCount).to.equal(1);
    });

    it('throws error when stopping trace when none is active', async () => {
      const session = {
        browser: {
          getPage: () => ({}),
          name: 'Chromium',
          type: 'playwright',
        },
        id: 'no-active-trace',
      };

      try {
        await plugin.executeCommand({ command: 'perf:stop', session });
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err.message).to.include('No advanced performance trace is active');
      }
    });

    it('handles perf:get-lighthouse-metrics', async () => {
      const mockCdpSession = {
        detach: async () => {},
        send: async method => {
          if (method === 'Performance.getMetrics') {
            return {
              metrics: [
                { name: 'Timestamp', value: 1000 },
                { name: 'LayoutCount', value: 5 },
              ],
            };
          }
          return {};
        },
      };

      const mockPage = {
        context: () => ({
          newCDPSession: async () => mockCdpSession,
        }),
        evaluate: async () => ({
          cls: 0.02,
          fcp: 600,
          lcp: 900,
          speedIndex: 750,
          tbt: 10,
        }),
      };

      const session = {
        browser: {
          getPage: () => mockPage,
          name: 'Chromium',
          type: 'playwright',
        },
        id: 'session-lighthouse',
      };

      const result = await plugin.executeCommand({
        command: 'perf:get-lighthouse-metrics',
        session,
      });

      expect(result.supported).to.be.true;
      expect(result.cdpMetrics).to.deep.equal({
        LayoutCount: 5,
        Timestamp: 1000,
      });
      expect(result.lighthouse.score).to.be.within(90, 100);
      expect(result.lighthouse.metrics).to.deep.equal({
        cls: 0.02,
        fcp: 600,
        lcp: 900,
        speedIndex: 750,
        tbt: 10,
      });
      expect(result.lighthouse.metricScores).to.have.keys([
        'cls',
        'fcp',
        'lcp',
        'speedIndex',
        'tbt',
      ]);
    });

    it('handles perf:measure-render with and without reflow', async () => {
      const mockPage = {
        evaluate: async (fn, opts) => ({
          duration: 16.6,
          firstPaint: 5.2,
          hasReflow: opts.measureReflow,
          reflowDuration: opts.measureReflow ? 2.4 : 0,
        }),
      };

      const session = {
        browser: {
          getPage: () => mockPage,
          name: 'Chromium',
          type: 'playwright',
        },
        id: 'session-render',
      };

      const noReflowResult = await plugin.executeCommand({
        command: 'perf:measure-render',
        payload: { measureReflow: false },
        session,
      });

      expect(noReflowResult.supported).to.be.true;
      expect(noReflowResult.renderPerformance.hasReflow).to.be.false;
      expect(noReflowResult.renderPerformance.reflowDuration).to.equal(0);

      const withReflowResult = await plugin.executeCommand({
        command: 'perf:measure-render',
        payload: { measureReflow: true },
        session,
      });

      expect(withReflowResult.supported).to.be.true;
      expect(withReflowResult.renderPerformance.hasReflow).to.be.true;
      expect(withReflowResult.renderPerformance.reflowDuration).to.equal(2.4);
    });
  });
});
