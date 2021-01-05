import { expect, html, unsafeStatic, fixture } from '@open-wc/testing';

// eslint-disable-next-line import/no-extraneous-dependencies
import sinon from 'sinon';

import '@lion/input/lion-input.js';
import '@lion/input-amount/lion-input-amount.js';
import '@lion/input-date/lion-input-date.js';
import '@lion/input-datepicker/lion-input-datepicker.js';
import '@lion/input-email/lion-input-email.js';
import '@lion/input-iban/lion-input-iban.js';
import '@lion/input-range/lion-input-range.js';
import '@lion/textarea/lion-textarea.js';

import '@lion/checkbox-group/lion-checkbox-group.js';
import '@lion/checkbox-group/lion-checkbox.js';

import '@lion/radio-group/lion-radio-group.js';
import '@lion/radio-group/lion-radio.js';

import '@lion/select/lion-select.js';

import '@lion/combobox/lion-combobox.js';
import '@lion/listbox/lion-listbox.js';
import '@lion/listbox/lion-option.js';
import '@lion/select-rich/lion-select-rich.js';

import '@lion/fieldset/lion-fieldset.js';
import '@lion/form/lion-form.js';
import '@lion/form-core/lion-field.js';

const featureName = 'model value';

const getFirstPaintTitle = count => `should dispatch ${count} time(s) on first paint`;
const getInteractionTitle = count => `should dispatch ${count} time(s) on interaction`;

const firstStampCount = 1;
const interactionCount = 1;

const fieldDispatchesCountOnFirstPaint = (tagname, count) => {
  const tag = unsafeStatic(tagname);
  const spy = sinon.spy();
  it(getFirstPaintTitle(count), async () => {
    await fixture(html`<${tag} @model-value-changed="${spy}"></${tag}>`);
    expect(spy.callCount).to.equal(count);
  });
};

const fieldDispatchesCountOnInteraction = (tagname, count) => {
  const tag = unsafeStatic(tagname);
  const spy = sinon.spy();
  it(getInteractionTitle(count), async () => {
    const el = await fixture(html`<${tag}></${tag}>`);
    el.addEventListener('model-value-changed', spy);
    // TODO: discuss if this is the "correct" way to interact with component
    el.modelValue = 'foo';
    await el.updateComplete;
    expect(spy.callCount).to.equal(count);
  });
};

const choiceDispatchesCountOnFirstPaint = (tagname, count) => {
  const tag = unsafeStatic(tagname);
  const spy = sinon.spy();
  it(getFirstPaintTitle(count), async () => {
    await fixture(html`<${tag} @model-value-changed="${spy}" .choiceValue="${'option'}"></${tag}>`);
    expect(spy.callCount).to.equal(count);
  });
};

const choiceDispatchesCountOnInteraction = (tagname, count) => {
  const tag = unsafeStatic(tagname);
  const spy = sinon.spy();
  it(getInteractionTitle(count), async () => {
    const el = await fixture(html`<${tag} .choiceValue="${'option'}"></${tag}>`);
    el.addEventListener('model-value-changed', spy);
    el.checked = true;
    expect(spy.callCount).to.equal(count);
  });
};

const choiceGroupDispatchesCountOnFirstPaint = (groupTagname, itemTagname, count) => {
  const groupTag = unsafeStatic(groupTagname);
  const itemTag = unsafeStatic(itemTagname);
  it(getFirstPaintTitle(count), async () => {
    const spy = sinon.spy();
    await fixture(html`
      <${groupTag} @model-value-changed="${spy}">
        <${itemTag} .choiceValue="${'option1'}"></${itemTag}>
        <${itemTag} .choiceValue="${'option2'}"></${itemTag}>
        <${itemTag} .choiceValue="${'option3'}"></${itemTag}>
      </${groupTag}>
    `);

    expect(spy.callCount).to.equal(count);
  });
};

const choiceGroupDispatchesCountOnInteraction = (groupTagname, itemTagname, count) => {
  const groupTag = unsafeStatic(groupTagname);
  const itemTag = unsafeStatic(itemTagname);
  it(getInteractionTitle(count), async () => {
    const spy = sinon.spy();
    const el = await fixture(html`
      <${groupTag}>
        <${itemTag} .choiceValue="${'option1'}"></${itemTag}>
        <${itemTag} .choiceValue="${'option2'}"></${itemTag}>
        <${itemTag} .choiceValue="${'option3'}"></${itemTag}>
      </${groupTag}>
    `);

    el.addEventListener('model-value-changed', spy);
    const option2 = el.querySelector(`${itemTagname}:nth-child(2)`);
    option2.checked = true;
    expect(spy.callCount).to.equal(count);

    spy.resetHistory();

    const option3 = el.querySelector(`${itemTagname}:nth-child(3)`);
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
        <lion-select @model-value-changed="${spy}">
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
      const el = await fixture(html`
        <lion-select>
          <select slot="input">
            <option value="option1"></option>
            <option value="option2"></option>
            <option value="option3"></option>
          </select>
        </lion-select>
      `);
      el.addEventListener('model-value-changed', spy);
      const option2 = el.querySelector('option:nth-child(2)');

      // mimic user input
      option2.selected = true;
      el._inputNode.dispatchEvent(new CustomEvent('change'));

      expect(spy.callCount).to.equal(interactionCount);

      spy.resetHistory();

      const option3 = el.querySelector('option:nth-child(3)');

      // mimic user input
      option3.selected = true;
      el._inputNode.dispatchEvent(new CustomEvent('change'));

      expect(spy.callCount).to.equal(interactionCount);
    });
  });
});

['combobox', 'listbox', 'select-rich'].forEach(chunk => {
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
        const option2 = el.querySelector('lion-option:nth-child(2)');
        option2.checked = true;
        expect(spy.callCount).to.equal(interactionCount);

        spy.resetHistory();

        const option3 = el.querySelector('lion-option:nth-child(3)');
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
        <lion-fieldset name="parent" @model-value-changed="${spy}">
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
      const input = el.querySelector('lion-input');
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
    'textarea',
    // 1b) Choice Fields
    'option',
    'checkbox',
    'radio',
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
   * - true: when child formElement condition for Choice Field is met
   * - false: when child formElement condition for Choice Field is not met
   *
   * FormOrFieldset (fieldset, form):
   * - true: when child formElement condition for Field is met
   * - false: when child formElement condition for Field is not met
   */

  const featureDetectChoiceField = el => 'checked' in el && 'choiceValue' in el;
  const featureDetectOptionChoiceField = el => 'active' in el;

  /**
   * @param {FormControl} el
   * @returns {'RegularField'|'ChoiceField'|'OptionChoiceField'|'ChoiceGroupField'|'FormOrFieldset'}
   */
  function detectType(el) {
    if (el._repropagationRole === 'child') {
      if (featureDetectChoiceField(el)) {
        return featureDetectOptionChoiceField(el) ? 'OptionChoiceField' : 'ChoiceField';
      }
      return 'RegularField';
    }
    return el._repropagationRole === 'choice-group' ? 'ChoiceGroupField' : 'FormOrFieldset';
  }

  /**
   * @param {FormControl} el
   * @param {string} newViewValue
   * @returns {'RegularField'|'ChoiceField'|'OptionChoiceField'|'ChoiceGroupField'|'FormOrFieldset'}
   */
  function mimicUserInput(el, newViewValue) {
    const type = detectType(el);
    let userInputEv;
    if (type === 'RegularField') {
      userInputEv = el._inputNode.tagName === 'SELECT' ? 'change' : 'input';
      el.value = newViewValue; // eslint-disable-line no-param-reassign
      el._inputNode.dispatchEvent(new Event(userInputEv, { bubbles: true }));
    } else if (type === 'ChoiceField') {
      el._inputNode.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (type === 'OptionChoiceField') {
      el.dispatchEvent(new Event('click', { bubbles: true }));
    }
  }

  allFormControls.forEach(controlName => {
    it(`lion-${controlName} adds "detail.isTriggeredByUser" to model-value-changed event`, async () => {
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
      const el = await fixture(html`<${tag}>${childrenEl}</${tag}>`);
      await el.registrationComplete;
      el.addEventListener('model-value-changed', spy);

      function expectCorrectEventMetaRegularField(formControl) {
        mimicUserInput(formControl, 'userValue', 'RegularField');
        expect(spy.firstCall.args[0].detail.isTriggeredByUser).to.be.true;
        // eslint-disable-next-line no-param-reassign
        formControl.modelValue = 'programmaticValue';
        expect(spy.secondCall.args[0].detail.isTriggeredByUser).to.be.false;
      }

      function resetChoiceFieldToForceRepropagation(formControl) {
        // eslint-disable-next-line no-param-reassign
        formControl.checked = false;
        spy.resetHistory();
      }

      function expectCorrectEventMetaChoiceField(formControl) {
        resetChoiceFieldToForceRepropagation(formControl);
        mimicUserInput(formControl, 'userValue', 'ChoiceField');
        expect(spy.firstCall.args[0].detail.isTriggeredByUser).to.be.true;

        resetChoiceFieldToForceRepropagation(formControl);
        // eslint-disable-next-line no-param-reassign
        formControl.checked = true;
        expect(spy.firstCall.args[0].detail.isTriggeredByUser).to.be.false;

        // eslint-disable-next-line no-param-reassign
        formControl.modelValue = { value: 'programmaticValue', checked: false };
        expect(spy.secondCall.args[0].detail.isTriggeredByUser).to.be.false;
      }

      // 1. Derive the type of field we're dealing with
      const type = detectType(el);
      if (type === 'RegularField') {
        expectCorrectEventMetaRegularField(el);
      } else if (type === 'ChoiceField' || type === 'OptionChoiceField') {
        expectCorrectEventMetaChoiceField(el);
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
        expectCorrectEventMetaChoiceField(el.formElements[0]);
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
