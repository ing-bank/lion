import { fixture, html, expect } from '@open-wc/testing';
import { executeServerCommand } from '@web/test-runner-commands';
import { OverlayController } from '@lion/ui/overlays.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';

/**
 * FCP guard tests — assert that construction/first-render forces little to no layout.
 *
 * A synchronous geometry/style read during construction is on the FCP path (for elements created
 * during page load). These tests trace construction and fail if the count regresses: a plain
 * overlay must force **0** layout events, and select-rich must stay far below the pre-fix 13.
 *
 * The forced-layout trace is Chromium-only (`playwrightLauncher({ product: 'chromium' })`), so on
 * Firefox/WebKit `supported` is false and the assertions are skipped (the suite still passes).
 */

/**
 * Measures forced-layout events during construction → first render.
 * @param {() => void | Promise<void>} setup
 * @returns {Promise<{ supported: boolean, count: number }>}
 */
async function measureConstruction(setup) {
  const start = await executeServerCommand('forced-layout-trace:start');
  if (!start?.supported) {
    return { supported: false, count: 0 };
  }
  await setup();
  await new Promise(resolve => {
    setTimeout(resolve, 150);
  });
  const stop = await executeServerCommand('forced-layout-trace:stop');
  /** @type {{ name: string }[]} */
  const events = stop?.events ?? [];
  return { supported: true, count: events.length };
}

describe('overlay construction forces no layout (FCP guard)', () => {
  it('a plain overlay forces no layout during construction (FCP)', async () => {
    const { supported, count } = await measureConstruction(() => {
      const invoker = document.createElement('div');
      invoker.style.width = '60px';
      invoker.style.height = '20px';
      const content = document.createElement('div');
      content.style.width = '120px';
      content.style.height = '40px';
      document.body.append(invoker, content);
      const ctrl = new OverlayController({
        placementMode: 'local',
        invokerNode: invoker,
        contentNode: content,
      });
      expect(ctrl).to.be.instanceOf(OverlayController); // constructed for its FCP side effects
      invoker.remove();
      content.remove();
    });
    if (!supported) return; // Chromium only
    expect(
      count,
      'a plain overlay should force no layout during construction (FCP): the dialog position ' +
        'fix is rAF-deferred and there is no width alignment read',
    ).to.equal(0);
  });

  it('select-rich construction stays far below the pre-fix forced-layout count', async () => {
    const { supported, count } = await measureConstruction(async () => {
      const el = /** @type {any} */ (
        await fixture(html`
          <lion-select-rich>
            <lion-option .choiceValue=${10}>Item 1</lion-option>
            <lion-option .choiceValue=${20}>A considerably longer option label</lion-option>
          </lion-select-rich>
        `)
      );
      el.remove();
    });
    if (!supported) return; // Chromium only
    // Pre-fix select-rich construction forced ~13 events (re-read on every option add); now ~2
    // (one hidden-content width pre-size read). < 8 catches a reintroduction without flaking on
    // the measured 2-3 variance.
    expect(
      count,
      'select-rich construction should stay far below the pre-fix ~13 forced-layout events',
    ).to.be.below(8);
  });
});
