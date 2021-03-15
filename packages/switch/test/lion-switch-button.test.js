import { expect, fixture as _fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import '@lion/switch/define-switch-button';

/**
 * @typedef {import('../src/LionSwitchButton').LionSwitchButton} LionSwitchButton
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionSwitchButton>} */ (_fixture);

describe('lion-switch-button', () => {
  /** @type {LionSwitchButton} */
  let el;
  beforeEach(async () => {
    el = await fixture(html`<lion-switch-button></lion-switch-button>`);
  });

  it('should be focusable', () => {
    expect(el.tabIndex).to.equal(0);
    expect(el.getAttribute('tabindex')).to.equal('0');
  });

  it('should not have a [type]', () => {
    expect(el.hasAttribute('type')).to.be.false;
  });

  it('should have checked=false by default', () => {
    expect(el.checked).to.equal(false);
    expect(el.hasAttribute('checked')).to.be.false;
  });

  it('is hidden when attribute hidden is true', async () => {
    el.hidden = true;
    await el.updateComplete;
    expect(el).not.to.be.displayed;
  });

  it('should toggle the value of "checked" on click', async () => {
    expect(el.checked).to.be.false;
    expect(el.hasAttribute('checked')).to.be.false;
    el.click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(el.hasAttribute('checked')).to.be.true;
    el.click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
    expect(el.hasAttribute('checked')).to.be.false;
  });

  it('can be disabled', async () => {
    el.disabled = true;
    expect(el.checked).to.be.false;
    el.click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
    expect(el.hasAttribute('checked')).to.be.false;
    el.disabled = true;
    el.checked = true;
    el.click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(el.hasAttribute('checked')).to.be.true;
  });

  it('should dispatch "checked-changed" event when toggled', () => {
    const handlerSpy = sinon.spy();
    el.addEventListener('checked-changed', handlerSpy);
    el.click();
    el.click();
    expect(handlerSpy.callCount).to.equal(2);
    const checkCall = /** @param {import('sinon').SinonSpyCall} call */ call => {
      expect(call.args).to.have.lengthOf(1);
      const e = call.args[0];
      expect(e).to.be.an.instanceof(Event);
      expect(e.bubbles).to.be.true;
      expect(e.composed).to.be.true;
    };
    checkCall(handlerSpy.getCall(0));
    checkCall(handlerSpy.getCall(1));
  });

  it('should dispatch "checked-changed" event when checked changed', () => {
    const handlerSpy = sinon.spy();
    el.addEventListener('checked-changed', handlerSpy);
    el.checked = true;
    el.checked = false;
    expect(handlerSpy.callCount).to.equal(2);
    const checkCall = /** @param {import('sinon').SinonSpyCall} call */ call => {
      expect(call.args).to.have.lengthOf(1);
      const e = call.args[0];
      expect(e).to.be.an.instanceof(Event);
      expect(e.bubbles).to.be.true;
      expect(e.composed).to.be.true;
    };
    checkCall(handlerSpy.getCall(0));
    checkCall(handlerSpy.getCall(1));
  });

  it('should not dispatch "checked-changed" event if disabled', () => {
    const handlerSpy = sinon.spy();
    el.disabled = true;
    el.addEventListener('checked-changed', handlerSpy);
    el.click();
    expect(handlerSpy.called).to.be.false;
  });

  describe('a11y', () => {
    it('should manage "aria-checked"', async () => {
      expect(el.hasAttribute('aria-checked')).to.be.true;
      expect(el.getAttribute('aria-checked')).to.equal('false');

      el.click();
      await el.updateComplete;
      expect(el.getAttribute('aria-checked')).to.equal('true');
      el.click();
      await el.updateComplete;
      expect(el.getAttribute('aria-checked')).to.equal('false');

      el.checked = true;
      await el.updateComplete;
      expect(el.getAttribute('aria-checked')).to.equal('true');
      el.checked = false;
      await el.updateComplete;
      expect(el.getAttribute('aria-checked')).to.equal('false');

      el.setAttribute('checked', '');
      await el.updateComplete;
      expect(el.getAttribute('aria-checked')).to.equal('true');
      el.removeAttribute('checked');
      await el.updateComplete;
      expect(el.getAttribute('aria-checked')).to.equal('false');
    });
  });
  it('should manage "aria-disabled"', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.getAttribute('aria-disabled')).to.equal('true');
    el.disabled = false;
    await el.updateComplete;
    expect(el.getAttribute('aria-disabled')).to.equal('false');
  });
});
