import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { LitElement } from 'lit';
import { DisabledController } from '@lion/ui/core.js';

describe('DisabledController', () => {
  class CanBeDisabled extends LitElement {
    disabledController = new DisabledController(this, value => this.setDisabled(value));

    static get properties() {
      return {
        disabled: {
          type: Boolean,
          reflect: true,
        },
      };
    }

    constructor() {
      super();
      this.disabled = false;
    }

    /**
     *
     * @param {Boolean} value
     * @memberof CanBeDisabled
     */
    setDisabled(value) {
      this.disabled = value;
    }
  }
  before(() => {
    customElements.define('can-be-disabled', CanBeDisabled);
  });

  it('reflects disabled to attribute', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    expect(el.hasAttribute('disabled')).to.be.false;
    el.disabledController.makeRequestToBeDisabled();
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).to.be.true;
  });

  it('can be requested to be disabled', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    el.disabledController.makeRequestToBeDisabled();
    expect(el.disabled).to.be.true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).to.be.true;
  });

  it('will not allow to become enabled after makeRequestToBeDisabled()', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    el.disabledController.makeRequestToBeDisabled();
    await el.updateComplete;
    expect(el.disabled).to.be.true;

    el.disabled = false;
    await el.updateComplete;
    expect(el.disabled).to.be.true;
  });

  it('will stay disabled after retractRequestToBeDisabled() if it was disabled before', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled disabled></can-be-disabled>`)
    );
    el.disabledController.makeRequestToBeDisabled();
    el.disabledController.retractRequestToBeDisabled();
    expect(el.disabled).to.be.true;
  });

  it('will become enabled after retractRequestToBeDisabled() if it was enabled before', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    el.disabledController.makeRequestToBeDisabled();
    expect(el.disabled).to.be.true;
    el.disabledController.retractRequestToBeDisabled();
    expect(el.disabled).to.be.false;
  });

  it('may allow multiple calls to makeRequestToBeDisabled()', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    el.disabledController.makeRequestToBeDisabled();
    el.disabledController.makeRequestToBeDisabled();
    el.disabledController.retractRequestToBeDisabled();
    expect(el.disabled).to.be.false;
  });

  it('will restore last state after retractRequestToBeDisabled()', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    el.disabledController.makeRequestToBeDisabled();
    el.disabled = true;
    await el.updateComplete;
    el.disabledController.retractRequestToBeDisabled();
    await el.updateComplete;
    expect(el.disabled).to.be.true;

    el.disabledController.makeRequestToBeDisabled();
    el.disabled = false;
    await el.updateComplete;
    el.disabledController.retractRequestToBeDisabled();
    await el.updateComplete;
    expect(el.disabled).to.be.false;
  });
});
