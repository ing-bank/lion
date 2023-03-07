import { expect, fixture, html, unsafeStatic } from '@open-wc/testing';

// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon';

import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-input-amount.js';
import '@lion/ui/define/lion-input-date.js';
import '@lion/ui/define/lion-input-datepicker.js';
import '@lion/ui/define/lion-input-email.js';
import '@lion/ui/define/lion-input-iban.js';
import '@lion/ui/define/lion-input-range.js';
import '@lion/ui/define/lion-input-stepper.js';
import '@lion/ui/define/lion-input-tel.js';
import '@lion/ui/define/lion-input-tel-dropdown.js';
import '@lion/ui/define/lion-textarea.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-radio.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-switch.js';
import '@lion/ui/define/lion-select.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-form.js';
import '@lion/ui/define/lion-field.js';
import '@lion/ui/define/lion-validation-feedback.js';

import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';

/**
 * @typedef {import('../../form-core/src/LionField.js').LionField} LionField
 * @typedef {import('../../form-core/types/FormControlMixinTypes.js').FormControlHost & LitElement & {__parentFormGroup?: HTMLElement, checked?: boolean, disabled: boolean, hasFeedbackFor: string[], makeRequestToBeDisabled: Function }} FormControl
 * @typedef {import('../../input/src/LionInput.js').LionInput} LionInput
 * @typedef {import('../../select/src/LionSelect.js').LionSelect} LionSelect
 * @typedef {import('../../listbox/src/LionOption.js').LionOption} LionOption
 */

/**
 * @param {FormControl} el
 */
function getProtectedMembers(el) {
  return {
    // @ts-ignore
    repropagationRole: el._repropagationRole,
  };
}

const featureName = 'model value';

const getFirstPaintTitle = /** @param {number} count */ count =>
  `should dispatch ${count} time(s) on first paint`;
const getInteractionTitle = /** @param {number} count */ count =>
  `should dispatch ${count} time(s) on interaction`;

const firstStampCount = 1;
const interactionCount = 1;

/**
 * @param {string} tagname
 * @param {number} count
 */
const fieldDispatchesCountOnFirstPaint = (tagname, count) => {
  const tag = unsafeStatic(tagname);
  const spy = sinon.spy();
  it(getFirstPaintTitle(count), async () => {
    await fixture(html`<${tag} @model-value-changed="${spy}"></${tag}>`);
    expect(spy.callCount).to.equal(count);
  });
};

/**
 * @param {string} tagname
 * @param {number} count
 */
const fieldDispatchesCountOnInteraction = (tagname, count) => {
  const tag = unsafeStatic(tagname);
  const spy = sinon.spy();
  it(getInteractionTitle(count), async () => {
    const el = /** @type {LionField} */ (await fixture(html`<${tag}></${tag}>`));
    el.addEventListener('model-value-changed', spy);
    // TODO: discuss if this is the "correct" way to interact with component
    el.modelValue = 'foo';
    await el.updateComplete;
    expect(spy.callCount).to.equal(count);
  });
};

/**
 * @param {string} tagname
 * @param {number} count
 */
const choiceDispatchesCountOnFirstPaint = (tagname, count) => {
  const tag = unsafeStatic(tagname);
  const spy = sinon.spy();
  it(getFirstPaintTitle(count), async () => {
    await fixture(html`<${tag} @model-value-changed="${spy}" .choiceValue="${'option'}"></${tag}>`);
    expect(spy.callCount).to.equal(count);
  });
};

/**
 * @param {string} tagname
 * @param {number} count
 */
const choiceDispatchesCountOnInteraction = (tagname, count) => {
  const tag = unsafeStatic(tagname);
  const spy = sinon.spy();
  it(getInteractionTitle(count), async () => {
    const el = /** @type {HTMLElement & {checked: boolean}} */ (
      await fixture(html`<${tag} .choiceValue="${'option'}"></${tag}>`)
    );
    el.addEventListener('model-value-changed', spy);
    el.checked = true;
    expect(spy.callCount).to.equal(count);
  });
};

/**
 * @param {string} groupTagname
 * @param {string} itemTagname
 * @param {number} count
 */
const choiceGroupDispatchesCountOnFirstPaint = (groupTagname, itemTagname, count) => {
  const groupTag = unsafeStatic(groupTagname);
  const itemTag = unsafeStatic(itemTagname);
  it(getFirstPaintTitle(count), async () => {
    const spy = sinon.spy();
    await fixture(html`
      <${groupTag} @model-value-changed="${spy}" name="group[]">
        <${itemTag} .choiceValue="${'option1'}"></${itemTag}>
        <${itemTag} .choiceValue="${'option2'}"></${itemTag}>
        <${itemTag} .choiceValue="${'option3'}"></${itemTag}>
      </${groupTag}>
    `);

    expect(spy.callCount).to.equal(count);
  });
};

/**
 * @param {string} groupTagname
 * @param {string} itemTagname
 * @param {number} count
 */
const choiceGroupDispatchesCountOnInteraction = (groupTagname, itemTagname, count) => {
  const groupTag = unsafeStatic(groupTagname);
  const itemTag = unsafeStatic(itemTagname);
  it(getInteractionTitle(count), async () => {
    const spy = sinon.spy();
    const el = await fixture(html`
      <${groupTag}  name="group[]">
        <${itemTag} .choiceValue="${'option1'}"></${itemTag}>
        <${itemTag} .choiceValue="${'option2'}"></${itemTag}>
        <${itemTag} .choiceValue="${'option3'}"></${itemTag}>
      </${groupTag}>
    `);

    el.addEventListener('model-value-changed', spy);
    const option2 = /** @type {HTMLElement & {checked: boolean}} */ (
      el.querySelector(`${itemTagname}:nth-child(2)`)
    );
    option2.checked = true;
    expect(spy.callCount).to.equal(count);

    spy.resetHistory();

    const option3 = /** @type {HTMLElement & {checked: boolean}} */ (
      el.querySelector(`${itemTagname}:nth-child(3)`)
    );
    option3.checked = true;
    expect(spy.callCount).to.equal(count);
  });
};

[
  'input',
  'input-amount',
  'input-date',
  'input-datepicker',
  'input-email',
  'input-iban',
  'input-range',
  'textarea',
].forEach(chunk => {
  const tagname = `lion-${chunk}`;
  describe(`${tagname}`, () => {
    describe(featureName, () => {
      fieldDispatchesCountOnFirstPaint(tagname, firstStampCount);
      fieldDispatchesCountOnInteraction(tagname, interactionCount);
    });
  });
});

['checkbox', 'radio'].forEach(chunk => {
  const groupTagname = `lion-${chunk}-group`;
  const itemTagname = `lion-${chunk}`;

  describe(`${itemTagname}`, () => {
    describe(featureName, () => {
      choiceDispatchesCountOnFirstPaint(itemTagname, firstStampCount);
      choiceDispatchesCountOnInteraction(itemTagname, interactionCount);
    });
  });

  describe(`${groupTagname}`, () => {
    describe(featureName, () => {
      choiceGroupDispatchesCountOnFirstPaint(groupTagname, itemTagname, firstStampCount);
      choiceGroupDispatchesCountOnInteraction(groupTagname, itemTagname, interactionCount);
    });
  });
});

describe('lion-select', () => {
  describe(featureName, () => {
    it(getFirstPaintTitle(firstStampCount), async () => {
      const spy = sinon.spy();
      await fixture(html`
        <lion-select @model-value-changed="${/** @type {function} */ (spy)}">
          <select slot="input">
            <option value="option1"></option>
            <option value="option2"></option>
            <option value="option3"></option>
          </select>
        </lion-select>
      `);
      expect(spy.callCount).to.equal(firstStampCount);
    });

    it(getInteractionTitle(interactionCount), async () => {
      const spy = sinon.spy();
      const el = /** @type {LionSelect} */ (
        await fixture(html`
          <lion-select>
            <select slot="input">
              <option value="option1"></option>
              <option value="option2"></option>
              <option value="option3"></option>
            </select>
          </lion-select>
        `)
      );
      el.addEventListener('model-value-changed', spy);
      const option2 = /** @type {HTMLOptionElement} */ (el.querySelector('option:nth-child(2)'));

      // mimic user input
      option2.selected = true;
      el._inputNode.dispatchEvent(new CustomEvent('change'));

      expect(spy.callCount).to.equal(interactionCount);

      spy.resetHistory();

      const option3 = /** @type {HTMLOptionElement} */ (el.querySelector('option:nth-child(3)'));

      // mimic user input
      option3.selected = true;
      el._inputNode.dispatchEvent(new CustomEvent('change'));

      expect(spy.callCount).to.equal(interactionCount);
    });
  });
});

// TODO: change back order when scoped-elements (polyfill) fixed side effects
['select-rich', 'combobox', 'listbox'].forEach(chunk => {
  const tagname = `lion-${chunk}`;
  const tag = unsafeStatic(tagname);
  describe(`${tagname}`, () => {
    describe(featureName, () => {
      it(getFirstPaintTitle(firstStampCount), async () => {
        const spy = sinon.spy();
        await fixture(html`
          <${tag} @model-value-changed="${spy}">
            <lion-option .choiceValue="${'option1'}"></lion-option>
            <lion-option .choiceValue="${'option2'}"></lion-option>
            <lion-option .choiceValue="${'option3'}"></lion-option>
          </${tag}>
        `);

        expect(spy.callCount).to.equal(firstStampCount);
      });

      it(getInteractionTitle(interactionCount), async () => {
        const spy = sinon.spy();
        const el = await fixture(html`
          <${tag}>
            <lion-option .choiceValue="${'option1'}">Option 1</lion-option>
            <lion-option .choiceValue="${'option2'}">Option 2</lion-option>
            <lion-option .choiceValue="${'option3'}">Option 3</lion-option>
          </${tag}>
        `);
        el.addEventListener('model-value-changed', spy);
        const option2 = /** @type {LionOption} */ (el.querySelector('lion-option:nth-child(2)'));
        option2.checked = true;
        expect(spy.callCount).to.equal(interactionCount);

        spy.resetHistory();

        const option3 = /** @type {LionOption} */ (el.querySelector('lion-option:nth-child(3)'));
        option3.checked = true;
        expect(spy.callCount).to.equal(interactionCount);
      });
    });
  });
});

describe('lion-fieldset', () => {
  describe(featureName, () => {
    it(getFirstPaintTitle(firstStampCount), async () => {
      const spy = sinon.spy();
      await fixture(html`
        <lion-fieldset name="parent" @model-value-changed="${/** @type {function} */ (spy)}">
          <lion-input name="input"></lion-input>
        </lion-fieldset>
      `);

      expect(spy.callCount).to.equal(firstStampCount);
    });

    it(getInteractionTitle(interactionCount), async () => {
      const spy = sinon.spy();
      const el = await fixture(html`
        <lion-fieldset name="parent">
          <lion-input name="input"></lion-input>
        </lion-fieldset>
      `);

      el.addEventListener('model-value-changed', spy);
      const input = /** @type {LionInput} */ (el.querySelector('lion-input'));
      input.modelValue = 'foo';
      expect(spy.callCount).to.equal(interactionCount);
    });
  });
});

describe('detail.isTriggeredByUser', () => {
  const allFormControls = [
    // 1) Fields
    'field',
    // 1a) Input Fields
    'input',
    'input-amount',
    'input-date',
    'input-datepicker',
    'input-email',
    'input-iban',
    'input-range',
    'input-stepper',
    'input-tel',
    'input-tel-dropdown',
    'textarea',
    // 1b) Choice Fields
    'option',
    'checkbox',
    'radio',
    'switch',
    // 1c) Choice Group Fields
    'select',
    'listbox',
    'select-rich',
    'combobox',
    // 2) FormGroups
    // 2a) Choice FormGroups
    'checkbox-group',
    'radio-group',
    // 2v) Fieldset
    'fieldset',
    // 2c) Form
    'form',
  ];

  /**
   * "isTriggeredByUser" for different types of fields:
   *
   * RegularField:
   * - true: when change/input (c.q. user-input-changed) fired
   * - false: when .modelValue set programmatically
   *
   * ChoiceField:
   * - true: when 'change' event fired
   * - false: when .modelValue (or checked) set programmatically
   *
   * OptionChoiceField:
   * - true: when 'click' event fired
   * - false: when .modelValue (or checked) set programmatically
   *
   * ChoiceGroupField (listbox, select-rich, combobox, radio-group, checkbox-group):
   * - true: when child formElement condition for ChoiceField(Option) is met
   * - false: when child formElement condition for ChoiceField(Option) is not met
   *
   * FormOrFieldset (fieldset, form):
   * - true: when child formElement condition for RegularField is met
   * - false: when child formElement condition for RegularField is not met
   */

  const featureDetectChoiceField = /** @param {HTMLElement} el */ el =>
    'checked' in el && 'choiceValue' in el;
  const featureDetectOptionChoiceField = /** @param {HTMLElement} el */ el => 'active' in el;

  /**
   * @param {FormControl} el
   * @returns {'RegularField'|'ChoiceField'|'OptionChoiceField'|'ChoiceGroupField'|'FormOrFieldset'}
   */
  function detectType(el) {
    const { repropagationRole } = getProtectedMembers(el);
    if (repropagationRole === 'child') {
      if (featureDetectChoiceField(el)) {
        return featureDetectOptionChoiceField(el) ? 'OptionChoiceField' : 'ChoiceField';
      }
      return 'RegularField';
    }
    return repropagationRole === 'choice-group' ? 'ChoiceGroupField' : 'FormOrFieldset';
  }

  /**
   * @param {FormControl & {value: string;}} el
   * @param {string} newViewValue
   * @param {{ triggerType?: string, labelInsteadOfInput?: boolean, parent?: HTMLElement }} options
   */
  function mimicUserInput(el, newViewValue, options = {}) {
    // @ts-ignore
    const { _inputNode, _labelNode } = getFormControlMembers(el);
    const type = detectType(el);
    let userInputEv;
    if (type === 'RegularField') {
      userInputEv = _inputNode.tagName === 'SELECT' ? 'change' : 'input';
      el.value = newViewValue; // eslint-disable-line no-param-reassign
      _inputNode.dispatchEvent(new Event(userInputEv, { bubbles: true }));
    } else if (type === 'ChoiceField') {
      if (options?.labelInsteadOfInput) {
        _labelNode.click();
      } else {
        _inputNode.click();
      }
    } else if (type === 'OptionChoiceField') {
      if (!options?.triggerType) {
        el.dispatchEvent(new Event('click', { bubbles: true }));
      } else if (options?.triggerType === 'keypress') {
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown', bubbles: true }));
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
      }
    }
  }

  allFormControls.forEach(controlName => {
    it(`lion-${controlName} adds "detail.isTriggeredByUser" to model-value-changed event`, async () => {
      // TODO: add test for user input via calendar
      const spy = sinon.spy();

      const tagname = `lion-${controlName}`;
      const tag = unsafeStatic(tagname);
      let childrenEl;
      if (controlName === 'select') {
        childrenEl = await fixture(
          html`<select slot="input">
            <option value="x"></option>
          </select>`,
        );
      } else if (controlName === 'form') {
        childrenEl = await fixture(html`<form></form>`);
      } else if (controlName === 'field') {
        childrenEl = await fixture(html`<input slot="input" />`);
      }

      const name = controlName === 'checkbox-group' ? 'test[]' : 'test';
      const el =
        /** @type {LitElement & FormControl & {value: string} & {registrationComplete: Promise<boolean>} & {formElements: Array.<FormControl & {value: string}>}} */ (
          await fixture(html`<${tag} name="${name}">${childrenEl}</${tag}>`)
        );
      await el.registrationComplete;

      el.addEventListener('model-value-changed', spy);

      /**
       * @param {FormControl & {value: string}} formControl
       */
      function expectCorrectEventMetaRegularField(formControl) {
        mimicUserInput(formControl, 'userValue');
        expect(spy.firstCall.args[0].detail.isTriggeredByUser).to.be.true;
        // eslint-disable-next-line no-param-reassign
        formControl.modelValue = 'programmaticValue';
        expect(spy.secondCall.args[0].detail.isTriggeredByUser).to.be.false;
      }

      /**
       * @param {FormControl & {value: string}} formControl
       */
      async function resetChoiceFieldToForceRepropagation(formControl) {
        // eslint-disable-next-line no-param-reassign
        formControl.checked = false;
        await formControl.updateComplete;
        spy.resetHistory();
      }

      /**
       * @param {FormControl & {value: string;}} formControl
       * @param {{parent?: FormControl; testKeyboardBehavior?: boolean}} moreOpts
       */
      async function expectCorrectEventMetaChoiceField(
        formControl,
        { parent, testKeyboardBehavior } = {},
      ) {
        const type = detectType(formControl);

        await resetChoiceFieldToForceRepropagation(formControl);
        mimicUserInput(formControl, 'userValue');

        expect(spy.firstCall.args[0].detail.isTriggeredByUser).to.be.true;

        await resetChoiceFieldToForceRepropagation(formControl);
        mimicUserInput(formControl, 'userValue', { labelInsteadOfInput: true });
        expect(spy.firstCall.args[0].detail.isTriggeredByUser).to.be.true;

        await resetChoiceFieldToForceRepropagation(formControl);
        // eslint-disable-next-line no-param-reassign
        formControl.checked = true;
        expect(spy.firstCall.args[0].detail.isTriggeredByUser).to.be.false;

        // eslint-disable-next-line no-param-reassign
        formControl.modelValue = { value: 'programmaticValue', checked: false };
        expect(spy.secondCall.args[0].detail.isTriggeredByUser).to.be.false;

        if (
          type === 'OptionChoiceField' &&
          testKeyboardBehavior &&
          parent?.constructor.name !== 'LionCombobox' // modelValue only changeable via click or textbox
        ) {
          await resetChoiceFieldToForceRepropagation(formControl);
          mimicUserInput(formControl, 'userValue', { triggerType: 'keypress', parent });
          try {
            expect(spy.firstCall.args[0].detail.isTriggeredByUser).to.be.true;
          } catch (e) {
            throw new Error(
              `model-value-changed of ${formControl.constructor.name} with parent ${parent?.constructor.name} not caught`,
            );
          }
        }
      }

      // 1. Derive the type of field we're dealing with
      const type = detectType(el);
      if (type === 'RegularField') {
        expectCorrectEventMetaRegularField(el);
      } else if (type === 'ChoiceField' || type === 'OptionChoiceField') {
        await expectCorrectEventMetaChoiceField(el);
      } else if (type === 'ChoiceGroupField') {
        let childName = 'option';
        if (controlName.endsWith('-group')) {
          [childName] = controlName.split('-group');
        }
        const childTagName = `lion-${childName}`;
        const childTag = unsafeStatic(childTagName);
        const childrenEls = await fixture(
          html`<div><${childTag}></${childTag}><${childTag}></${childTag}></div>`,
        );
        el.appendChild(childrenEls);
        await el.registrationComplete;
        await expectCorrectEventMetaChoiceField(el.formElements[0], {
          testKeyboardBehavior: true,
          parent: el,
        });
      } else if (type === 'FormOrFieldset') {
        const childrenEls = await fixture(
          html`<div><lion-input name="one"></lion-input><lion-input name="two"></lion-input></div>`,
        );
        el.appendChild(childrenEls);
        await el.registrationComplete;
        await el.updateComplete;
        expectCorrectEventMetaRegularField(el.formElements[0]);
      }
    });
  });
});
