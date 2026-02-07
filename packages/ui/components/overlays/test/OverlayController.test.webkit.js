/* eslint-disable no-new */
import { OverlayController, overlays } from '@lion/ui/overlays.js';
import { sendKeys } from '@web/test-runner-commands';
import { fixtureSync, fixture, expect, html } from '@open-wc/testing';
import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';

/**
 * @typedef {import('../types/OverlayConfig.js').ViewportPlacement} ViewportPlacement
 * @typedef {import('../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 */

const withGlobalTestConfig = () =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'global',
    contentNode: /** @type {HTMLElement} */ (fixtureSync(html`<div>my content</div>`)),
  });

afterEach(() => {
  overlays.teardown();
  // clean document.body from the DOM nodes left by previous tests
  document.body.innerHTML = '';
});

describe('OverlayController', () => {
  it('keeps focus within the overlay e.g. you can not tab out by accident', async () => {
    const contentNode = /** @type {HTMLElement} */ (
      await fixture(html` <div><input id="input1" /><input id="input2" /></div> `)
    );
    const ctrl = new OverlayController({
      ...withGlobalTestConfig(),
      trapsKeyboardFocus: true,
      contentNode,
    });
    await fixture(html`<button>click me</button>`);
    await ctrl.show();
    const input1 = ctrl.contentNode.querySelectorAll('input')[0];
    const input2 = ctrl.contentNode.querySelectorAll('input')[1];

    input2.focus();
    await sendKeys({ press: 'Tab' });
    expect(isActiveElement(document.body)).to.be.true;
    await sendKeys({ press: 'Tab' });
    // @ts-ignore private memeber
    expect(isActiveElement(ctrl.__wrappingDialogNode)).to.be.true;
    await sendKeys({ press: 'Tab' });
    expect(isActiveElement(ctrl.contentNode)).to.be.true;
    await sendKeys({ press: 'Tab' });
    expect(isActiveElement(input1)).to.be.true;
  });
});
