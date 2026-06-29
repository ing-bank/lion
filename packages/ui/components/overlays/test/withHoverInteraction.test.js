import { OverlayController } from '@lion/ui/overlays.js';
import { expect, fixtureSync, html } from '@open-wc/testing';
import sinon from 'sinon';
import { withHoverInteraction } from '../src/configurations/visibility-trigger-partials/withHoverInteraction.js';

function makeCtrl(opts = {}) {
  return new OverlayController({
    placementMode: 'local',
    contentNode: fixtureSync(html`<div>content</div>`),
    invokerNode: fixtureSync(html`<button>invoker</button>`),
    ...withHoverInteraction(opts),
  });
}

describe('withHoverInteraction (isHoverSupported: false)', () => {
  /** @type {sinon.SinonFakeTimers} */
  let clock;
  /** @type {OverlayController} */
  let ctrl;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    ctrl = makeCtrl({ isHoverSupported: false });
  });

  afterEach(() => {
    ctrl.teardown();
    clock.restore();
  });

  it('opens after holding for longpressDuration (500ms)', async () => {
    ctrl.invokerNode?.dispatchEvent(
      new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }),
    );
    clock.runAll();
    await Promise.resolve();
    expect(ctrl.isShown).to.equal(true);
  });

  it('stays hidden on brief touch: pointerup cancels the timer', () => {
    ctrl.invokerNode?.dispatchEvent(
      new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }),
    );
    ctrl.invokerNode?.dispatchEvent(
      new PointerEvent('pointerup', { pointerType: 'touch', bubbles: true }),
    );
    clock.tick(500);
    expect(ctrl.isShown).to.equal(false);
  });

  it('ignores non-touch pointer events (mouse)', () => {
    ctrl.invokerNode?.dispatchEvent(
      new PointerEvent('pointerdown', { pointerType: 'mouse', bubbles: true }),
    );
    clock.tick(500);
    expect(ctrl.isShown).to.equal(false);
  });

  it('auto-closes after longpressDuration once press ends', async () => {
    ctrl.invokerNode?.dispatchEvent(
      new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }),
    );
    clock.runAll();
    await Promise.resolve();
    expect(ctrl.isShown).to.equal(true);

    ctrl.invokerNode?.dispatchEvent(
      new PointerEvent('pointerup', { pointerType: 'touch', bubbles: true }),
    );
    await clock.tickAsync(501);
    expect(ctrl.isShown).to.equal(false);
  });

  it('does not open on tap-triggered focusin', () => {
    ctrl.invokerNode?.dispatchEvent(new Event('focusin', { bubbles: true }));
    clock.tick(300);
    expect(ctrl.isShown).to.equal(false);
  });
});
