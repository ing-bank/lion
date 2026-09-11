const START_COMMAND = 'forced-layout-trace:start';
const STOP_COMMAND = 'forced-layout-trace:stop';

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
      duration: event.dur,
      name: event.name,
      timestamp: event.ts,
    }));
}

/**
 * @param {import('@web/test-runner-core').BasicTestSession} session
 */
function isSupported(session) {
  return session.browser.type === 'playwright' && session.browser.name === 'Chromium';
}

export function forcedLayoutPlugin() {
  /** @type {Map<string, {client: import('playwright').CDPSession, events: Record<string, unknown>[], frameId: string}>} */
  const traces = new Map();

  return {
    name: 'forced-layout-trace-command',

    /** @param {import('@web/test-runner-core').ExecuteCommandArgs} args */
    async executeCommand({ command, session }) {
      if (command !== START_COMMAND && command !== STOP_COMMAND) {
        return undefined;
      }

      if (!isSupported(session)) {
        return { supported: false };
      }

      if (command === START_COMMAND) {
        if (traces.has(session.id)) {
          throw new Error('A forced-layout trace is already active for this test session.');
        }

        const page = session.browser.getPage(session.id);
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

      const trace = traces.get(session.id);
      if (!trace) {
        throw new Error('No forced-layout trace is active for this test session.');
      }

      const tracingComplete = new Promise(resolve => {
        trace.client.once('Tracing.tracingComplete', resolve);
      });
      await trace.client.send('Tracing.end');
      await tracingComplete;
      await trace.client.detach();
      traces.delete(session.id);

      return {
        events: findForcedLayoutEvents(trace.events, trace.frameId),
        supported: true,
      };
    },
  };
}
