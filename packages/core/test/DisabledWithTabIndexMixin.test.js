import { expect, fixture, html } from '@open-wc/testing';

/* eslint-disable import/named */
import { LitElement } from '../index.js';
import { DisabledWithTabIndexMixin } from '../src/DisabledWithTabIndexMixin.js';

describe('DisabledWithTabIndexMixin', () => {
  before(() => {
    class WithTabIndex extends DisabledWithTabIndexMixin(LitElement) {}
    customElements.define('can-be-disabled-with-tab-index', WithTabIndex);
  });

  it('has an initial tabIndex of 0', async () => {
    const el = await fixture(html`
      <can-be-disabled-with-tab-index></can-be-disabled-with-tab-index>
    `);
    expect(el.tabIndex).to.equal(0);
    expect(el.getAttribute('tabindex')).to.equal('0');
  });

  it('sets tabIndex to -1 if disabled', async () => {
    const el = await fixture(html`
      <can-be-disabled-with-tab-index></can-be-disabled-with-tab-index>
    `);
    el.disabled = true;
    expect(el.tabIndex).to.equal(-1);
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('-1');
  });

  it('disabled does not override user provided tabindex', async () => {
    const el = await fixture(html`
      <can-be-disabled-with-tab-index tabindex="5" disabled></can-be-disabled-with-tab-index>
    `);
    expect(el.getAttribute('tabindex')).to.equal('-1');
    el.disabled = false;
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('5');
  });

  it('can be disabled imperatively', async () => {
    const el = await fixture(html`
      <can-be-disabled-with-tab-index disabled></can-be-disabled-with-tab-index>
    `);
    expect(el.getAttribute('tabindex')).to.equal('-1');

    el.disabled = false;
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('0');
    expect(el.hasAttribute('disabled')).to.equal(false);

    el.disabled = true;
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('-1');
    expect(el.hasAttribute('disabled')).to.equal(true);
  });

  it('will not allow to change tabIndex after makeRequestToBeDisabled()', async () => {
    const el = await fixture(html`
      <can-be-disabled-with-tab-index></can-be-disabled-with-tab-index>
    `);
    el.makeRequestToBeDisabled();

    el.tabIndex = 5;
    expect(el.tabIndex).to.equal(-1);
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('-1');
  });

  it('will restore last tabIndex after retractRequestToBeDisabled()', async () => {
    const el = await fixture(html`
      <can-be-disabled-with-tab-index tabindex="5"></can-be-disabled-with-tab-index>
    `);
    el.makeRequestToBeDisabled();
    expect(el.tabIndex).to.equal(-1);
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('-1');
    el.retractRequestToBeDisabled();
    expect(el.tabIndex).to.equal(5);
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('5');

    el.makeRequestToBeDisabled();
    el.tabIndex = 12;
    el.retractRequestToBeDisabled();
    expect(el.tabIndex).to.equal(12);
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('12');

    el.makeRequestToBeDisabled();
    el.tabIndex = 13;
    el.tabIndex = 14;
    el.retractRequestToBeDisabled();
    expect(el.tabIndex).to.equal(14);
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('14');
  });

  it('may allow multiple calls to retractRequestToBeDisabled', async () => {
    const el = await fixture(html`
      <can-be-disabled-with-tab-index disabled></can-be-disabled-with-tab-index>
    `);
    el.retractRequestToBeDisabled();
    el.retractRequestToBeDisabled();
    expect(el.disabled).to.be.true;
    expect(el.tabIndex).to.be.equal(-1);
  });
});
