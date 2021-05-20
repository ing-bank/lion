import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { LitElement } from '../index.js';
import { DisabledMixin } from '../src/DisabledMixin.js';

describe('DisabledMixin', () => {
  class CanBeDisabled extends DisabledMixin(LitElement) {}
  before(() => {
    customElements.define('can-be-disabled', CanBeDisabled);
  });

  it('reflects disabled to attribute', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    expect(el.hasAttribute('disabled')).to.be.false;
    el.makeRequestToBeDisabled();
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).to.be.true;
  });

  it('can be requested to be disabled', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    el.makeRequestToBeDisabled();
    expect(el.disabled).to.be.true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).to.be.true;
  });

  it('will not allow to become enabled after makeRequestToBeDisabled()', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    el.makeRequestToBeDisabled();
    expect(el.disabled).to.be.true;

    el.disabled = false;
    expect(el.disabled).to.be.true;
  });

  it('will stay disabled after retractRequestToBeDisabled() if it was disabled before', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled disabled></can-be-disabled>`)
    );
    el.makeRequestToBeDisabled();
    el.retractRequestToBeDisabled();
    expect(el.disabled).to.be.true;
  });

  it('will become enabled after retractRequestToBeDisabled() if it was enabled before', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    el.makeRequestToBeDisabled();
    expect(el.disabled).to.be.true;
    el.retractRequestToBeDisabled();
    expect(el.disabled).to.be.false;
  });

  it('may allow multiple calls to makeRequestToBeDisabled()', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    el.makeRequestToBeDisabled();
    el.makeRequestToBeDisabled();
    el.retractRequestToBeDisabled();
    expect(el.disabled).to.be.false;
  });

  it('will restore last state after retractRequestToBeDisabled()', async () => {
    const el = /** @type {CanBeDisabled} */ (
      await fixture(html`<can-be-disabled></can-be-disabled>`)
    );
    el.makeRequestToBeDisabled();
    el.disabled = true;
    el.retractRequestToBeDisabled();
    expect(el.disabled).to.be.true;

    el.makeRequestToBeDisabled();
    el.disabled = false;
    el.retractRequestToBeDisabled();
    expect(el.disabled).to.be.false;
  });
});
