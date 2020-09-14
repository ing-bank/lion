import { html } from '@lion/core';
import { LionInput } from '@lion/input';
import { Required } from '@lion/form-core';
import { expect, fixture } from '@open-wc/testing';
import sinon from 'sinon';
import { ChoiceInputMixin } from '../../src/choice-group/ChoiceInputMixin.js';

describe('ChoiceInputMixin', () => {
  class ChoiceClass extends ChoiceInputMixin(LionInput) {
    constructor() {
      super();
      this.type = 'checkbox'; // could also be 'radio', should be tested in integration test
    }
  }
  customElements.define('choice-input', ChoiceClass);

  it('is hidden when attribute hidden is true', async () => {
    const el = /** @type {ChoiceClass} */ (await fixture(
      html`<choice-input hidden></choice-input>`,
    ));
    expect(el).not.to.be.displayed;
  });

  it('has choiceValue', async () => {
    const el = /** @type {ChoiceClass} */ (await fixture(
      html`<choice-input .choiceValue=${'foo'}></choice-input>`,
    ));

    expect(el.choiceValue).to.equal('foo');
    expect(el.modelValue).to.deep.equal({
      value: 'foo',
      checked: false,
    });
  });

  it('can handle complex data via choiceValue', async () => {
    const date = new Date(2018, 11, 24, 10, 33, 30, 0);

    const el = /** @type {ChoiceClass} */ (await fixture(
      html`<choice-input .choiceValue=${date}></choice-input>`,
    ));

    expect(el.choiceValue).to.equal(date);
    expect(el.modelValue.value).to.equal(date);
  });

  it('fires one "model-value-changed" event if choiceValue or checked state or modelValue changed', async () => {
    let counter = 0;
    const el = /** @type {ChoiceClass} */ (await fixture(html`
      <choice-input
        @model-value-changed=${() => {
          counter += 1;
        }}
        .choiceValue=${'foo'}
      ></choice-input>
    `));
    expect(counter).to.equal(1); // undefined to set value

    el.checked = true;
    expect(counter).to.equal(2);

    // no change means no event
    el.checked = true;
    el.choiceValue = 'foo';
    el.modelValue = { value: 'foo', checked: true };
    expect(counter).to.equal(2);

    el.modelValue = { value: 'foo', checked: false };
    expect(counter).to.equal(3);
  });

  it('fires one "user-input-changed" event after user interaction', async () => {
    let counter = 0;
    const el = /** @type {ChoiceClass} */ (await fixture(html`
      <choice-input
        @user-input-changed="${() => {
          counter += 1;
        }}"
      >
        <input slot="input" />
      </choice-input>
    `));
    expect(counter).to.equal(0);
    // Here we try to mimic user interaction by firing browser events
    const nativeInput = el._inputNode;
    nativeInput.dispatchEvent(new CustomEvent('input', { bubbles: true })); // fired by (at least) Chrome
    expect(counter).to.equal(0);
    nativeInput.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    expect(counter).to.equal(1);
  });

  it('can be required', async () => {
    const el = /** @type {ChoiceClass} */ (await fixture(html`
      <choice-input .choiceValue=${'foo'} .validators=${[new Required()]}></choice-input>
    `));
    expect(el.hasFeedbackFor).to.include('error');
    expect(el.validationStates.error).to.exist;
    expect(el.validationStates.error.Required).to.exist;
    el.checked = true;
    expect(el.hasFeedbackFor).not.to.include('error');
    expect(el.validationStates.error).to.exist;
    expect(el.validationStates.error.Required).not.to.exist;
  });

  describe('Checked state synchronization', () => {
    it('synchronizes checked state initially (via attribute or property)', async () => {
      const el = /** @type {ChoiceClass} */ (await fixture(`<choice-input></choice-input>`));
      expect(el.checked).to.equal(false, 'initially unchecked');

      const precheckedElementAttr = /** @type {ChoiceClass} */ (await fixture(html`
        <choice-input .checked=${true}></choice-input>
      `));
      expect(precheckedElementAttr.checked).to.equal(true, 'initially checked via attribute');
    });

    it('can be checked and unchecked programmatically', async () => {
      const el = /** @type {ChoiceClass} */ (await fixture(`<choice-input></choice-input>`));
      expect(el.checked).to.be.false;
      el.checked = true;
      expect(el.checked).to.be.true;

      await el.updateComplete;
      expect(el._inputNode.checked).to.be.true;
    });

    it('can be checked and unchecked via user interaction', async () => {
      const el = /** @type {ChoiceClass} */ (await fixture(`<choice-input></choice-input>`));
      el._inputNode.click();
      expect(el.checked).to.be.true;
      el._inputNode.click();
      expect(el.checked).to.be.false;
    });

    it('synchronizes modelValue to checked state and vice versa', async () => {
      const el = /** @type {ChoiceClass} */ (await fixture(
        html`<choice-input .choiceValue=${'foo'}></choice-input>`,
      ));
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

    it('ensures optimal synchronize performance by preventing redundant computation steps', async () => {
      /* we are checking private apis here to make sure we do not have cyclical updates
        which can be quite common for these type of connected data */
      const el = /** @type {ChoiceClass} */ (await fixture(
        html`<choice-input .choiceValue=${'foo'}></choice-input>`,
      ));
      expect(el.checked).to.be.false;

      const spyModelCheckedToChecked = sinon.spy(el, '__syncModelCheckedToChecked');
      const spyCheckedToModel = sinon.spy(el, '__syncCheckedToModel');
      el.checked = true;
      expect(el.modelValue.checked).to.be.true;
      expect(spyModelCheckedToChecked.callCount).to.equal(0);
      expect(spyCheckedToModel.callCount).to.equal(1);

      el.modelValue = { value: 'foo', checked: false };
      expect(el.checked).to.be.false;
      expect(spyModelCheckedToChecked.callCount).to.equal(1);
      expect(spyCheckedToModel.callCount).to.equal(1);

      // not changing values should not trigger any updates
      el.checked = false;
      el.modelValue = { value: 'foo', checked: false };
      expect(spyModelCheckedToChecked.callCount).to.equal(1);
      expect(spyCheckedToModel.callCount).to.equal(1);
    });

    it('synchronizes checked state to [checked] attribute for styling purposes', async () => {
      /** @param {ChoiceClass} el */
      const hasAttr = el => el.hasAttribute('checked');
      const el = /** @type {ChoiceClass} */ (await fixture(`<choice-input></choice-input>`));
      const elChecked = /** @type {ChoiceClass} */ (await fixture(html`
        <choice-input .checked=${true}>
          <input slot="input" />
        </choice-input>
      `));

      // Initial values
      expect(hasAttr(el)).to.equal(false, 'initial unchecked element');
      expect(hasAttr(elChecked)).to.equal(true, 'initial checked element');

      // Programmatically via checked
      el.checked = true;
      elChecked.checked = false;

      await el.updateComplete;
      expect(hasAttr(el)).to.equal(true, 'programmatically checked');
      expect(hasAttr(elChecked)).to.equal(false, 'programmatically unchecked');

      // reset
      el.checked = false;
      elChecked.checked = true;

      // Via user interaction
      el._inputNode.click();
      elChecked._inputNode.click();
      await el.updateComplete;
      expect(hasAttr(el)).to.equal(true, 'user click checked');
      expect(hasAttr(elChecked)).to.equal(false, 'user click unchecked');

      // reset
      el.checked = false;
      elChecked.checked = true;

      // Programmatically via modelValue
      el.modelValue = { value: '', checked: true };
      elChecked.modelValue = { value: '', checked: false };
      await el.updateComplete;
      expect(hasAttr(el)).to.equal(true, 'modelValue checked');
      expect(hasAttr(elChecked)).to.equal(false, 'modelValue unchecked');
    });
  });

  describe('Format/parse/serialize loop', () => {
    it('creates a modelValue object like { checked: true, value: foo } on init', async () => {
      const el = /** @type {ChoiceClass} */ (await fixture(
        html`<choice-input .choiceValue=${'foo'}></choice-input>`,
      ));
      expect(el.modelValue).deep.equal({ value: 'foo', checked: false });

      const elChecked = /** @type {ChoiceClass} */ (await fixture(html`
        <choice-input .choiceValue=${'foo'} .checked=${true}></choice-input>
      `));
      expect(elChecked.modelValue).deep.equal({ value: 'foo', checked: true });
    });

    it('creates a formattedValue based on modelValue.value', async () => {
      const el = /** @type {ChoiceClass} */ (await fixture(`<choice-input></choice-input>`));
      expect(el.formattedValue).to.equal('');

      const elementWithValue = /** @type {ChoiceClass} */ (await fixture(html`
        <choice-input .choiceValue=${'foo'}></choice-input>
      `));
      expect(elementWithValue.formattedValue).to.equal('foo');
    });
  });

  describe('Interaction states', () => {
    it('is considered prefilled when checked and not considered prefilled when unchecked', async () => {
      const el = /** @type {ChoiceClass} */ (await fixture(
        html`<choice-input .checked=${true}></choice-input>`,
      ));
      expect(el.prefilled).equal(true, 'checked element not considered prefilled');

      const elUnchecked = /** @type {ChoiceClass} */ (await fixture(
        `<choice-input></choice-input>`,
      ));
      expect(elUnchecked.prefilled).equal(false, 'unchecked element not considered prefilled');
    });
  });
});
