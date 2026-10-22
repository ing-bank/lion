/* eslint-disable import/no-extraneous-dependencies, no-console, no-void -- measure spec: imports
   repo packages at runtime in whatever worktree it is copied into; console prints the result
   marker; `void` discards the controller constructed for its side effects */
import { fixture, html } from '@open-wc/testing';
import { executeServerCommand } from '@web/test-runner-commands';
import { OverlayController } from '@lion/ui/overlays.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';

/**
 * FCP measurement spec — forced-layout events during construction → first render of an element.
 *
 * A forced layout during construction/first render is a synchronous geometry read on the FCP path
 * (for elements created during page load). This spec traces it for the width-alignment scenarios;
 * the same measurement is exposed as `measureFcpForcedLayout` in
 * `@lion-labs/test-runner-advanced-perf/browser.js`. The logic is inlined here (rather than
 * importing the plugin package) so the identical file runs in a baseline worktree that predates the
 * plugin; the spec result is emitted as `__BASELINE_RESULT__` for @lion-tools/smart-baseline.
 *
 * Run via smart-baseline:
 *   node compare-measures.mjs --current <branch-worktree> \
 *     --spec packages-node/test-runner-advanced-perf/specs/fcp-construction.trace-test.js \
 *     --config packages-node/test-runner-advanced-perf/web-test-runner.measure.config.mjs
 */

/** @param {() => void | Promise<void>} setup */
async function measureFcp(setup) {
  const start = await executeServerCommand('forced-layout-trace:start');
  if (!start?.supported) {
    return { supported: false, forcedLayoutCount: 0 };
  }
  await setup();
  // let deferred (rAF/RO) work settle inside the trace window
  await new Promise(resolve => {
    setTimeout(resolve, 150);
  });
  const stop = await executeServerCommand('forced-layout-trace:stop');
  const events = stop?.events ?? [];
  return { supported: true, forcedLayoutCount: events.length };
}

describe('FCP construction forced-layout measurement', () => {
  it('measures forced layouts during construction + first render', async () => {
    /** @type {{ name: string, value: number }[]} */
    const results = [];

    // 1. plain OverlayController construction — the "average overlay" (no width alignment)
    results.push(
      await (async () => {
        const m = await measureFcp(() => {
          const invoker = document.createElement('div');
          invoker.style.width = '60px';
          invoker.style.height = '20px';
          const content = document.createElement('div');
          content.style.width = '120px';
          content.style.height = '40px';
          document.body.append(invoker, content);
          /** @type {unknown} */
          const ctrl = new OverlayController({
            placementMode: 'local',
            invokerNode: invoker,
            contentNode: content,
          });
          void ctrl;
          invoker.remove();
          content.remove();
        });
        return { name: 'plain-overlay-construction', value: m.forcedLayoutCount };
      })(),
    );

    // 2. raw OverlayController construction with a content-source width config
    results.push(
      await (async () => {
        const m = await measureFcp(() => {
          const invoker = document.createElement('div');
          invoker.style.width = '60px';
          invoker.style.height = '20px';
          const content = document.createElement('div');
          content.style.width = '120px';
          content.style.height = '40px';
          document.body.append(invoker, content);
          /** @type {unknown} */
          const ctrl = new OverlayController({
            placementMode: 'local',
            invokerNode: invoker,
            contentNode: content,
            inheritsReferenceWidth: { mode: 'full', source: 'content', widthOffset: 28 },
          });
          void ctrl;
          invoker.remove();
          content.remove();
        });
        return { name: 'overlay-ctrl-construction', value: m.forcedLayoutCount };
      })(),
    );

    // 2. lion-select-rich construction + first render (the FCP consumer)
    const el = /** @type {any} */ (
      await fixture(html`
        <lion-select-rich>
          <lion-option .choiceValue=${10}>Item 1</lion-option>
          <lion-option .choiceValue=${20}>A considerably longer option label</lion-option>
        </lion-select-rich>
      `)
    );
    el.remove();
    results.push(
      await (async () => {
        const m = await measureFcp(async () => {
          const el2 = /** @type {any} */ (
            await fixture(html`
              <lion-select-rich>
                <lion-option .choiceValue=${10}>Item 1</lion-option>
                <lion-option .choiceValue=${20}>A considerably longer option label</lion-option>
              </lion-select-rich>
            `)
          );
          el2.remove();
        });
        return { name: 'select-rich-construction', value: m.forcedLayoutCount };
      })(),
    );

    console.error(`__BASELINE_RESULT__${JSON.stringify(results)}`);
  });
});
