import { Required } from '@lion/form-core';
import { LionInput } from '@lion/input';
import { expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { ChoiceInputMixin } from '../../src/choice-group/ChoiceInputMixin.js';

class ChoiceInput extends ChoiceInputMixin(LionInput) {
  constructor() {
    super();
    this.type = 'checkbox';
  }
}
customElements.define('choice-group-input', ChoiceInput);

/**
 * @param {{ tagString?:string, tagType?: string}} [config]
 */
export function runChoiceInputMixinSuite({ tagString } = {}) {
  const cfg = {
    tagString: tagString || 'choice-group-input',
  };

  const tag = unsafeStatic(cfg.tagString);
  describe(`ChoiceInputMixin: ${tagString}`, () => {
    it('is hidden when attribute hidden is true', async () => {
      const el = /** @type {ChoiceInput} */ (await fixture(html`<${tag} hidden></${tag}>`));
      expect(el).not.to.be.displayed;
    });

    it('has choiceValue', async () => {
      const el = /** @type {ChoiceInput} */ (await fixture(
        html`<${tag} .choiceValue=${'foo'}></${tag}>`,
      ));

      expect(el.choiceValue).to.equal('foo');
      expect(el.modelValue).to.deep.equal({
        value: 'foo',
        checked: false,
      });
    });

    it('can handle complex data via choiceValue', async () => {
      const date = new Date(2018, 11, 24, 10, 33, 30, 0);

      const el = /** @type {ChoiceInput} */ (await fixture(
        html`<${tag} .choiceValue=${date}></${tag}>`,
      ));

      expect(el.choiceValue).to.equal(date);
      expect(el.modelValue.value).to.equal(date);
    });

    it('fires one "model-value-changed" event if choiceValue or checked state or modelValue changed', async () => {
      let counter = 0;
      const el = /** @type {ChoiceInput} */ (await fixture(html`
      <${tag}
        @model-value-changed=${() => {
          counter += 1;
        }}
        .choiceValue=${'foo'}
      ></${tag}>
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
      const el = /** @type {ChoiceInput} */ (await fixture(html`
      <${tag}
        @user-input-changed="${() => {
          counter += 1;
        }}"
      >
        <input slot="input" />
      </${tag}>
    `));
      expect(counter).to.equal(0);
      // Here we try to mimic user interaction by firing browser events
      const nativeInput = el._inputNode;
      nativeInput.dispatchEvent(new CustomEvent('input', { bubbles: true })); // fired by (at least) Chrome
      expect(counter).to.equal(0);
      nativeInput.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      expect(counter).to.equal(1);
    });

    it('fires one "click" event when clicking label or input, using the right target', async () => {
      const spy = sinon.spy();
      const el = /** @type {ChoiceInput} */ (await fixture(html`
        <${tag}
          @click="${spy}"
        >
          <input slot="input" />
        </${tag}>
      `));
      el.click();
      expect(spy.args[0][0].target).to.equal(el);
      expect(spy.callCount).to.equal(1);
      el._labelNode.click();
      expect(spy.args[1][0].target).to.equal(el._labelNode);
      expect(spy.callCount).to.equal(2);
      el._inputNode.click();
      expect(spy.args[2][0].target).to.equal(el._inputNode);
      expect(spy.callCount).to.equal(3);
    });

    it('adds "isTriggerByUser" flag on model-value-changed', async () => {
      let isTriggeredByUser;
      const el = /** @type {ChoiceInput} */ (await fixture(html`
      <${tag}
        @model-value-changed="${(/** @type {CustomEvent} */ event) => {
          isTriggeredByUser = event.detail.isTriggeredByUser;
        }}"
      >
        <input slot="input" />
      </${tag}>
    `));
      el._inputNode.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      expect(isTriggeredByUser).to.be.true;
    });

    it('can be required', async () => {
      const el = /** @type {ChoiceInput} */ (await fixture(html`
      <${tag} .choiceValue=${'foo'} .validators=${[new Required()]}></${tag}>
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
        const el = /** @type {ChoiceInput} */ (await fixture(html`<${tag}></${tag}>`));
        expect(el.checked).to.equal(false, 'initially unchecked');

        const precheckedElementAttr = /** @type {ChoiceInput} */ (await fixture(html`
        <${tag} .checked=${true}></${tag}>
      `));
        expect(precheckedElementAttr.checked).to.equal(true, 'initially checked via attribute');
      });

      it('can be checked and unchecked programmatically', async () => {
        const el = /** @type {ChoiceInput} */ (await fixture(html`<${tag}></${tag}>`));
        expect(el.checked).to.be.false;
        el.checked = true;
        expect(el.checked).to.be.true;

        await el.updateComplete;
        expect(el._inputNode.checked).to.be.true;
      });

      it('can be checked and unchecked via user interaction', async () => {
        const el = /** @type {ChoiceInput} */ (await fixture(html`<${tag}></${tag}>`));
        el._inputNode.click();
        expect(el.checked).to.be.true;
        el._inputNode.click();
        await el.updateComplete;
        if (el.type === 'checkbox') {
          expect(el.checked).to.be.false;
        }
      });

      it('can not toggle the checked state when disabled via user interaction', async () => {
        const el = /** @type {ChoiceInput} */ (await fixture(html`<${tag} disabled></${tag}>`));
        el._inputNode.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        expect(el.checked).to.be.false;
      });

      it('synchronizes modelValue to checked state and vice versa', async () => {
        const el = /** @type {ChoiceInput} */ (await fixture(
          html`<${tag} .choiceValue=${'foo'}></${tag}>`,
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
        const el = /** @type {ChoiceInput} */ (await fixture(
          html`<${tag} .choiceValue=${'foo'}></${tag}>`,
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
        /** @param {ChoiceInput} el */
        const hasAttr = el => el.hasAttribute('checked');
        const el = /** @type {ChoiceInput} */ (await fixture(html`<${tag}></${tag}>`));
        const elChecked = /** @type {ChoiceInput} */ (await fixture(html`
        <${tag} .checked=${true}>
          <input slot="input" />
        </${tag}>
      `));

        // Initial values
        expect(hasAttr(el)).to.equal(false, 'initial unchecked element');
        expect(hasAttr(elChecked)).to.equal(true, 'initial checked element');

        // Via user interaction
        el._inputNode.click();
        elChecked._inputNode.click();
        await el.updateComplete;
        expect(el.checked).to.be.true;
        expect(hasAttr(el)).to.equal(true, 'user click checked');
        if (el.type === 'checkbox') {
          expect(hasAttr(elChecked)).to.equal(false, 'user click unchecked');
        }

        // reset
        el.checked = false;
        elChecked.checked = true;

        // Programmatically via checked
        el.checked = true;
        elChecked.checked = false;

        await el.updateComplete;
        expect(hasAttr(el)).to.equal(true, 'programmatically checked');
        expect(hasAttr(elChecked)).to.equal(false, 'programmatically unchecked');

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
        const el = /** @type {ChoiceInput} */ (await fixture(
          html`<${tag} .choiceValue=${'foo'}></${tag}>`,
        ));
        expect(el.modelValue).deep.equal({ value: 'foo', checked: false });

        const elChecked = /** @type {ChoiceInput} */ (await fixture(html`
        <${tag} .choiceValue=${'foo'} .checked=${true}></${tag}>
      `));
        expect(elChecked.modelValue).deep.equal({ value: 'foo', checked: true });
      });

      it('creates a formattedValue based on modelValue.value', async () => {
        const el = /** @type {ChoiceInput} */ (await fixture(html`<${tag}></${tag}>`));
        expect(el.formattedValue).to.equal('');

        const elementWithValue = /** @type {ChoiceInput} */ (await fixture(html`
        <${tag} .choiceValue=${'foo'}></${tag}>
      `));
        expect(elementWithValue.formattedValue).to.equal('foo');
      });

      it('can clear the checked state', async () => {
        const el = /** @type {ChoiceInput} */ (await fixture(html`<${tag}></${tag}>`));
        el.modelValue = { value: 'foo', checked: true };
        el.clear();
        expect(el.modelValue).deep.equal({ value: 'foo', checked: false });
      });
    });

    describe('Interaction states', () => {
      it('is considered prefilled when checked and not considered prefilled when unchecked', async () => {
        const el = /** @type {ChoiceInput} */ (await fixture(
          html`<${tag} .checked=${true}></${tag}>`,
        ));
        expect(el.prefilled).equal(true, 'checked element not considered prefilled');

        const elUnchecked = /** @type {ChoiceInput} */ (await fixture(html`<${tag}></${tag}>`));
        expect(elUnchecked.prefilled).equal(false, 'unchecked element not considered prefilled');
      });
    });
  });
}
