import { LionInput } from '@lion/ui/input.js';
import '@lion/ui/define/lion-input-date.js';
import '@lion/ui/define/lion-input.js';
import { expect, fixture, html, unsafeStatic } from '@open-wc/testing';

import sinon from 'sinon';
import { CustomChoiceInputMixin } from '../../src/choice-group/CustomChoiceInputMixin.js';
import { getInputMembers } from '../../../input/test-helpers/getInputMembers.js';

class ChoiceInput extends CustomChoiceInputMixin(LionInput) {
  constructor() {
    super();
    this.type = 'radio';
  }
}
customElements.define('choice-group-user-input', ChoiceInput);

const getCustomChoiceInputMembers = (/** @type {ChoiceInput} */ el) => ({
  // @ts-ignore
  ...getInputMembers(/** @type {LionInput} */ (el)),
  // @ts-ignore
  _userInputNode: /** @type { HTMLInputElement | LionInput } */ (el._userInputNode),
  // @ts-ignore
  _userInputSlotNode: /** @type { HTMLElement } */ (el._userInputSlotNode),
});

/**
 * @param {{ tagString?:string, tagType?: string}} config
 * @deprecated
 */
export function runCustomChoiceInputMixinSuite({ tagString } = {}) {
  const cfg = {
    tagString: tagString || 'choice-group-input',
  };

  const tag = unsafeStatic(cfg.tagString);
  describe(`CustomChoiceInputMixin: ${tagString}`, () => {
    it('syncs choiceValue to user value', async () => {
      const el = /** @type {ChoiceInput} */ (
        await fixture(html`<${tag} .choiceValue=${'foo'}></${tag}>`)
      );

      const userValue = getCustomChoiceInputMembers(el)._userInputNode.value;
      expect(userValue).to.equal('foo');
    });

    it('syncs complex data to user value', async () => {
      const date = new Date(2018, 11, 24, 10, 33, 30, 0);

      const el = /** @type {ChoiceInput} */ (
        await fixture(
          html`<${tag} .choiceValue=${date}><lion-input-date slot="user-input"></lion-input-date></${tag}>`,
        )
      );

      const userValue = /** @type {LionInput} */ (getCustomChoiceInputMembers(el)._userInputNode)
        .modelValue;
      expect(userValue.valueOf()).to.equal(date.valueOf());
    });

    it('syncs user value to choiceValue', async () => {
      const el = /** @type {ChoiceInput} */ (
        await fixture(html`<${tag} .choiceValue=${'foo'}></${tag}>`)
      );

      const userInput = getCustomChoiceInputMembers(el)._userInputNode;
      userInput.value = 'bar';
      userInput?.dispatchEvent(new Event('input', { bubbles: true }));

      expect(el.choiceValue).to.equal('bar');
    });

    it('fires one "model-value-changed" event if user value has changed', async () => {
      let counter = 0;
      const el = /** @type {ChoiceInput} */ (
        await fixture(html`
          <${tag}
            @model-value-changed=${() => {
              counter += 1;
            }}
          >
          </${tag}>
        `)
      );
      expect(counter).to.equal(0);

      el.checked = true;
      expect(counter).to.equal(1);

      const userInput = getCustomChoiceInputMembers(el)._userInputNode;
      userInput.value = 'bar';
      userInput.dispatchEvent(new Event('input', { bubbles: true }));

      expect(counter).to.equal(2);
    });

    it('adds "isTriggerByUser" flag on model-value-changed', async () => {
      let isTriggeredByUser;
      const el = /** @type {ChoiceInput} */ (
        await fixture(html`
          <${tag}
            @model-value-changed=${(/** @type {CustomEvent} */ event) => {
              isTriggeredByUser = event.detail.isTriggeredByUser;
            }}
          >
          </${tag}>
        `)
      );
      el.checked = true;

      const userInput = getCustomChoiceInputMembers(el)._userInputNode;
      userInput.value = 'bar';
      userInput.dispatchEvent(new Event('input', { bubbles: true }));

      expect(isTriggeredByUser).to.be.true;
    });

    it('focuses user input when choice is checked', async () => {
      const el = /** @type {ChoiceInput} */ (
        await fixture(html`<${tag} .choiceValue=${'foo'}></${tag}>`)
      );

      getCustomChoiceInputMembers(el)._inputNode.click();

      const userInput = getCustomChoiceInputMembers(el)._userInputNode;
      expect(document.activeElement === userInput).to.be.true;
    });

    it('checks choice when user input is focused', async () => {
      const el = /** @type {ChoiceInput} */ (
        await fixture(html`<${tag} .choiceValue=${'foo'}></${tag}>`)
      );

      expect(el.checked).to.be.false;

      const userInput = getCustomChoiceInputMembers(el)._userInputNode;
      userInput?.focus();

      expect(el.checked).to.be.true;
    });

    it('update data-checked attribute of the user-input slot according to the checked state', async () => {
      const el = /** @type {ChoiceInput} */ (await fixture(html`<${tag}></${tag}>`));

      const userInputSlot = getCustomChoiceInputMembers(el)._userInputSlotNode;
      expect(userInputSlot.dataset.checked).to.equal('false');

      el.checked = true;
      expect(userInputSlot.dataset.checked).to.equal('true');
    });

    it('can be observed for the data-checked attribute mutation', async () => {
      const spy = sinon.spy();
      class CheckedAwareUserInput extends LionInput {
        connectedCallback() {
          super.connectedCallback();
          const observer = ChoiceInput.createMutationObserver(spy);
          observer.observe(/** @type {ShadowRoot} */ (this.shadowRoot).host, { attributes: true });
        }
      }
      customElements.define('checked-aware-user-input', CheckedAwareUserInput);

      const el = /** @type {ChoiceInput} */ (
        await fixture(html`<${tag}><checked-aware-user-input slot="user-input" /></${tag}>`)
      );

      el.checked = true;

      const userInputSlot = getCustomChoiceInputMembers(el)._userInputSlotNode;
      expect(userInputSlot.dataset.checked).to.equal('true');

      expect(spy).to.have.been.calledOnce;
      expect(spy.lastCall.args[0].target.dataset.checked).to.equal('true');
    });
  });
}
