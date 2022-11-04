import { expect, fixture as _fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';
import { Validator } from '@lion/ui/form-core.js';
import { LionSwitch } from '@lion/ui/switch.js';
import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';

import '@lion/ui/define/lion-switch.js';

/**
 * @typedef {import('../src/LionSwitchButton.js').LionSwitchButton} LionSwitchButton
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {import('../../form-core/types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 */

const IsTrue = class extends Validator {
  static get validatorName() {
    return 'IsTrue';
  }

  execute() {
    return true;
  }
};

/**
 * @param { LionSwitch } el
 */
function getSwitchMembers(el) {
  const obj = getFormControlMembers(/** @type { * & FormControlHost } */ (el));
  return { ...obj, _inputNode: /** @type {LionSwitchButton} */ (obj._inputNode) };
}

const fixture = /** @type {(arg: TemplateResult) => Promise<LionSwitch>} */ (_fixture);

describe('lion-switch', () => {
  it('should have default "input" element', async () => {
    const el = await fixture(html`<lion-switch></lion-switch>`);
    expect(Array.from(el.children).find(child => child.slot === 'input')).not.to.be.false;
  });

  it('clicking the label should toggle the checked state', async () => {
    const el = await fixture(html`<lion-switch label="Enable Setting"></lion-switch>`);
    const { _labelNode } = getFormControlMembers(el);
    _labelNode.click();
    expect(el.checked).to.be.true;
    _labelNode.click();
    expect(el.checked).to.be.false;
  });

  it('clicking the label should not toggle the checked state when disabled', async () => {
    const el = await fixture(html`<lion-switch disabled label="Enable Setting"></lion-switch>`);
    const { _labelNode } = getFormControlMembers(el);
    _labelNode.click();
    expect(el.checked).to.be.false;
  });

  it('clicking the label should focus the toggle button', async () => {
    const el = await fixture(html`<lion-switch label="Enable Setting"></lion-switch>`);
    const { _inputNode, _labelNode } = getSwitchMembers(el);

    _labelNode.click();
    expect(document.activeElement).to.equal(_inputNode);
  });

  it('clicking the label should not focus the toggle button when disabled', async () => {
    const el = await fixture(html`<lion-switch disabled label="Enable Setting"></lion-switch>`);
    const { _inputNode, _labelNode } = getSwitchMembers(el);

    _labelNode.click();
    expect(document.activeElement).to.not.equal(_inputNode);
  });

  it('should sync its "disabled" state to child button', async () => {
    const el = await fixture(html`<lion-switch disabled></lion-switch>`);
    const { _inputNode } = getSwitchMembers(el);
    expect(_inputNode.disabled).to.be.true;
    expect(_inputNode.hasAttribute('disabled')).to.be.true;
    el.disabled = false;
    await el.updateComplete;
    await el.updateComplete; // safari takes longer
    expect(_inputNode.disabled).to.be.false;
    expect(_inputNode.hasAttribute('disabled')).to.be.false;
  });

  it('is hidden when attribute hidden is true', async () => {
    const el = await fixture(html`<lion-switch hidden></lion-switch>`);
    expect(el).not.to.be.displayed;
  });

  it('should sync its "checked" state to child button', async () => {
    const uncheckedEl = await fixture(html`<lion-switch></lion-switch>`);
    const { _inputNode: uncheckeInputNode } = getSwitchMembers(uncheckedEl);
    const checkedEl = await fixture(html`<lion-switch checked></lion-switch>`);
    const { _inputNode: checkeInputNode } = getSwitchMembers(checkedEl);
    expect(uncheckeInputNode.checked).to.be.false;
    expect(checkeInputNode.checked).to.be.true;
    uncheckedEl.checked = true;
    checkedEl.checked = false;
    await uncheckedEl.updateComplete;
    await checkedEl.updateComplete;
    expect(uncheckeInputNode.checked).to.be.true;
    expect(checkeInputNode.checked).to.be.false;
  });

  it('should sync "checked" state received from child button', async () => {
    const el = await fixture(html`<lion-switch></lion-switch>`);
    const { _inputNode } = getSwitchMembers(el);
    const button = _inputNode;
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
    const { _inputNode, _labelNode } = getSwitchMembers(el);
    el.addEventListener('checked-changed', handlerSpy);
    _inputNode.click();
    _labelNode.click();
    await el.updateComplete;
    expect(handlerSpy.callCount).to.equal(2);
    const checkCall = /** @param {import('sinon').SinonSpyCall} call */ call => {
      expect(call.args).to.have.lengthOf(1);
      const e = call.args[0];
      expect(e).to.be.an.instanceof(Event);
      expect(e.bubbles).to.be.true;
    };
    checkCall(handlerSpy.getCall(0));
    checkCall(handlerSpy.getCall(1));
  });

  it('should dispatch "checked-changed" event when checked changed', async () => {
    const handlerSpy = sinon.spy();
    const el = await fixture(html`<lion-switch .choiceValue=${'foo'}></lion-switch>`);
    el.addEventListener('checked-changed', handlerSpy);
    el.checked = true;
    await el.updateComplete;
    expect(handlerSpy.callCount).to.equal(1);
  });

  it('should not propagate the "checked-changed" event further up when caught by switch', async () => {
    const handlerSpy = sinon.spy();
    const parentHandlerSpy = sinon.spy();
    const el = await fixture(
      html`
        <div @checked-changed=${parentHandlerSpy}>
          <lion-switch @checked-changed=${handlerSpy} .choiceValue=${'foo'}></lion-switch>
        </div>
      `,
    );
    const switchEl = /** @type {LionSwitch} */ (el.firstElementChild);
    switchEl.checked = true;
    await switchEl.updateComplete;
    expect(handlerSpy.callCount).to.equal(1);
    expect(parentHandlerSpy.callCount).to.equal(0);
  });

  it('can be configured to show feedback messages immediately', async () => {
    const tagName = 'custom-switch';
    if (!customElements.get(tagName)) {
      customElements.define(
        tagName,
        class CustomSwitch extends LionSwitch {
          static get validationTypes() {
            return [...super.validationTypes, 'info'];
          }

          /**
           * @param {string} type
           * @param {object} meta
           */
          _showFeedbackConditionFor(type, meta) {
            if (type === 'info') {
              return true;
            }
            return super._showFeedbackConditionFor(type, meta);
          }
        },
      );
    }
    const el = await fixture(
      html`<custom-switch
        .validators="${[new IsTrue({}, { type: 'info' })]}"
        .feedbackCondition="${(
          /** @type {string} */ type,
          /** @type {object} */ meta,
          /** @type {(type: string, meta: object) => any} */ defaultCondition,
        ) => {
          if (type === 'info') {
            return true;
          }
          return defaultCondition(type, meta);
        }}"
      ></custom-switch>`,
    );
    expect(el.showsFeedbackFor).to.eql(['info']);
  });

  it('should not cause error by setting an attribute in the constructor', async () => {
    const div = await fixture(html`<div></div>`);
    const el = /** @type {LionSwitch} */ (document.createElement('lion-switch'));
    div.appendChild(el);
    expect(el.role).to.equal('switch');
  });
});
