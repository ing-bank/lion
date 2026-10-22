/* eslint-disable import/no-extraneous-dependencies, no-console -- measure spec: imports repo
   packages at runtime in whatever worktree it is copied into; console prints the result marker */
import { fixture, fixtureSync, html } from '@open-wc/testing';
import { executeServerCommand } from '@web/test-runner-commands';
import { OverlayController } from '@lion/ui/overlays.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';

/**
 * Measurement spec for the overlay system's reflow-prone operations.
 *
 * This spec is run UNCHANGED in both the "before" (baseline) and "after" (branch) worktrees.
 * It never asserts on the number of forced layout events — it only traces each operation and
 * reports the count/duration, so it can run on code that still has the reflows. The compare
 * step turns the two result sets into a before/after report.
 *
 * A geometry read only triggers a *forced* layout when the layout is dirty, so every op first
 * dirties the layout (mutates a style) and then performs the read-bearing operation in the
 * same task, inside the trace window. Each op is repeated and the median reported, because
 * async work (popper, transitions) is jittery.
 *
 * Run via: run-measure.mjs --worktree <dir> --spec <this file>
 */

function createInvoker() {
  return /** @type {HTMLDivElement} */ (
    fixtureSync(html`
      <div role="button" style="width: 100px; height: 20px; background: red; color: white;">
        Invoker
      </div>
    `)
  );
}

function createContent() {
  return /** @type {HTMLDivElement} */ (
    fixtureSync(html`
      <div style="width: 80px; height: 40px; background: green; color: white;">Content</div>
    `)
  );
}

/**
 * Runs `op` (which must dirty the layout and then read) between forced-layout trace start/stop,
 * repeated `iterations` times; reports the median event count.
 * @param {string} name
 * @param {(i: number) => void | Promise<void>} op
 * @param {number} [iterations]
 * @param {() => void | Promise<void>} [reset] runs after each stop, outside the trace window,
 *   to restore state so the next iteration is a fresh operation
 */
async function traceOp(name, op, iterations = 5, reset = () => {}) {
  const probe = await executeServerCommand('forced-layout-trace:start');
  if (!probe?.supported) {
    await executeServerCommand('forced-layout-trace:stop'); // close the probe trace
    return {
      name,
      value: 0,
      supported: false,
      note: 'forced-layout-trace not supported on this browser',
    };
  }
  await executeServerCommand('forced-layout-trace:stop'); // close the probe trace
  /** @type {number[]} */
  const counts = [];
  /** @type {number} */
  let lastDurationMs = 0;
  for (let i = 0; i < iterations; i += 1) {
    await executeServerCommand('forced-layout-trace:start');
    await op(i);
    // let async work (popper, transitions, rAF-coalesced reads) settle inside the trace window
    await new Promise(resolve => {
      setTimeout(resolve, 15);
    });
    const stop = await executeServerCommand('forced-layout-trace:stop');
    /** @type {{ name: string; duration: number }[]} */
    const events = stop?.events ?? [];
    counts.push(events.length);
    lastDurationMs = events.reduce((sum, ev) => sum + (ev.duration ?? 0), 0);
    // let any leftover async work settle OUTSIDE the next trace window so it is not attributed
    // to the following iteration
    await new Promise(resolve => {
      setTimeout(resolve, 50);
    });
    await reset();
  }
  counts.sort((a, b) => a - b);
  const median = counts[Math.floor(counts.length / 2)];
  return {
    name,
    value: median,
    supported: true,
    forcedLayoutCount: median,
    runs: counts,
    forcedLayoutMs: Math.round(lastDurationMs * 1000) / 1000,
  };
}

describe('overlay system reflow trace (before/after measurement)', () => {
  it('measures every reflow-prone overlay operation', async () => {
    /** @type {Record<string, unknown>[]} */
    const results = [];

    // 1. Reference-width alignment (select-rich dropdown-width path)
    const invoker = createInvoker();
    const ctrl = new OverlayController({
      placementMode: 'local',
      invokerNode: invoker,
      contentNode: createContent(),
      inheritsReferenceWidth: 'min',
    });
    results.push(
      await traceOp('align-reference-width', i => {
        invoker.style.width = `${110 + (i % 5) * 10}px`; // dirty layout
        ctrl._handleInheritsReferenceWidth(); // reads geometry
      }),
    );

    // 2. Local show/hide (popper positioning + reference-width alignment on show)
    results.push(
      await traceOp(
        'local-show',
        async i => {
          ctrl.contentNode.style.width = `${60 + (i % 4) * 10}px`; // dirty
          await ctrl.show();
        },
        5,
        async () => ctrl.hide(),
      ),
    );
    results.push(
      await traceOp(
        'local-hide',
        async i => {
          document.body.style.marginTop = `${2 + (i % 3)}px`; // dirty
          await ctrl.hide();
        },
        5,
        async () => ctrl.show(),
      ),
    );

    // 3. Body-size / scrollbar management (OverlaysManager reads clientWidth)
    results.push(
      await traceOp(
        'body-size-show',
        i => {
          document.body.style.marginLeft = `${5 + (i % 3) * 2}px`; // dirty body
          ctrl.manager.requestToKeepBodySize({ phase: 'before-show' });
          ctrl.manager.requestToKeepBodySize({ phase: 'show' });
        },
        5,
        () => {
          // requestToKeepBodySize only reads body metrics on the first request (preventScrollCount
          // 0 -> 1); reset so every iteration exercises the read.
          /** @type {any} */ (ctrl.manager).__bodySizeVars.preventScrollCount = 0;
        },
      ),
    );
    results.push(
      await traceOp(
        'body-size-hide',
        i => {
          document.body.style.marginLeft = `${3 + (i % 3) * 2}px`; // dirty body
          ctrl.manager.requestToKeepBodySize({ phase: 'hide' });
        },
        5,
        () => {
          /** @type {any} */ (ctrl.manager).__bodySizeVars.preventScrollCount = 1;
        },
      ),
    );

    // 4. Global overlay show/hide (body-level open/close)
    const globalCtrl = new OverlayController({
      placementMode: 'global',
      contentNode: createContent(),
    });
    results.push(
      await traceOp('global-show', async i => {
        globalCtrl.contentNode.style.height = `${30 + (i % 4) * 10}px`; // dirty
        await globalCtrl.show();
      }),
    );
    results.push(
      await traceOp('global-hide', async i => {
        document.body.style.marginBottom = `${2 + (i % 3)}px`; // dirty
        await globalCtrl.hide();
      }),
    );

    // 5. Select-rich invoker-width alignment — the path the perf PR fixed.
    //    Adding an option triggers addFormElement -> _alignInvokerWidth: baseline reads
    //    getBoundingClientRect synchronously (forced layout); the branch coalesces it into a
    //    requestAnimationFrame.
    const options = Array.from(
      { length: 19 },
      (_, index) => html`<lion-option .choiceValue=${index}>Option ${index + 1}</lion-option>`,
    );
    const selectEl = /** @type {import('@lion/ui/select-rich.js').LionSelectRich} */ (
      await fixture(html`<lion-select-rich>${options}</lion-select-rich>`)
    );
    results.push(
      await traceOp(
        'select-rich-add-option',
        async i => {
          selectEl.style.width = `${280 + (i % 4) * 20}px`; // dirty: changed invoker width
          const opt = document.createElement('lion-option');
          opt.choiceValue = 900 + i;
          opt.textContent = `New option ${i}`;
          selectEl.appendChild(opt); // addFormElement -> _alignInvokerWidth -> reads geometry
          await selectEl.updateComplete;
        },
        3,
      ),
    );
    selectEl.remove();

    // Machine-readable marker the runner greps from WTR output.
    console.error(`__BASELINE_RESULT__${JSON.stringify(results)}`);
  });
});
