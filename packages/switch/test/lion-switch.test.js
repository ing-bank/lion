import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import '../lion-switch.js';

describe('lion-switch', () => {
  it('should have default "input" element', async () => {
    const el = await fixture(html`<lion-switch></lion-switch>`);
    expect(Array.from(el.children).find(child => child.slot === 'input')).not.to.be.false;
  });

  it('clicking the label should toggle the checked state', async () => {
    const el = await fixture(html`<lion-switch label="Enable Setting"></lion-switch>`);
    el._labelNode.click();
    expect(el.checked).to.be.true;
    el._labelNode.click();
    expect(el.checked).to.be.false;
  });

  it('should sync its "disabled" state to child button', async () => {
    const el = await fixture(html`<lion-switch disabled></lion-switch>`);
    expect(el._inputNode.disabled).to.be.true;
    expect(el._inputNode.hasAttribute('disabled')).to.be.true;
    el.disabled = false;
    await el.updateComplete;
    expect(el._inputNode.disabled).to.be.false;
    expect(el._inputNode.hasAttribute('disabled')).to.be.false;
  });

  it('is hidden when attribute hidden is true', async () => {
    const el = await fixture(html`<lion-switch hidden></lion-switch>`);
    expect(el).not.to.be.displayed;
  });

  it('should sync its "checked" state to child button', async () => {
    const uncheckedEl = await fixture(html`<lion-switch></lion-switch>`);
    const checkedEl = await fixture(html`<lion-switch checked></lion-switch>`);
    expect(uncheckedEl._inputNode.checked).to.be.false;
    expect(checkedEl._inputNode.checked).to.be.true;
    uncheckedEl.checked = true;
    checkedEl.checked = false;
    await uncheckedEl.updateComplete;
    await checkedEl.updateComplete;
    expect(uncheckedEl._inputNode.checked).to.be.true;
    expect(checkedEl._inputNode.checked).to.be.false;
  });

  it('should sync "checked" state received from child button', async () => {
    const el = await fixture(html`<lion-switch></lion-switch>`);
    const button = el._inputNode;
    expect(el.checked).to.be.false;
    button.click();
    expect(el.checked).to.be.true;
    button.click();
    expect(el.checked).to.be.false;
  });

  it('synchronizes modelValue to checked state and vice versa', async () => {
    const el = await fixture(html`<lion-switch .choiceValue=${'foo'}></lion-switch>`);
    expect(el.checked).to.be.false;
    expect(el.modelValue).to.deep.equal({
      checked: false,
      value: 'foo',
    });
    el.checked = true;
    expect(el.checked).to.be.true;
    expect(el.modelValue).to.deep.equal({
      checked: true,
      value: 'foo',
    });
  });

  it('should dispatch "checked-changed" event when toggled via button or label', async () => {
    const handlerSpy = sinon.spy();
    const el = await fixture(html`<lion-switch .choiceValue=${'foo'}></lion-switch>`);
    el.addEventListener('checked-changed', handlerSpy);
    el._inputNode.click();
    el._labelNode.click();
    await el.updateComplete;
    expect(handlerSpy.callCount).to.equal(2);
    const checkCall = call => {
      expect(call.args).to.have.a.lengthOf(1);
      const e = call.args[0];
      expect(e).to.be.an.instanceof(Event);
      expect(e.bubbles).to.be.true;
      expect(e.composed).to.be.true;
    };
    checkCall(handlerSpy.getCall(0), true);
    checkCall(handlerSpy.getCall(1), false);
  });

  it('should dispatch "checked-changed" event when checked changed', async () => {
    const handlerSpy = sinon.spy();
    const el = await fixture(html`<lion-switch .choiceValue=${'foo'}></lion-switch>`);
    el.addEventListener('checked-changed', handlerSpy);
    el.checked = true;
    await el.updateComplete;
    expect(handlerSpy.callCount).to.equal(1);
  });

  it('is submitted by default', async () => {
    const el = await fixture(html`<lion-switch></lion-switch>`);
    expect(el.submitted).to.be.true;
  });
});
