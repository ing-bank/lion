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

import '@lion/select-rich/lion-select-rich.js';
import '@lion/select-rich/lion-options.js';
import '@lion/select-rich/lion-option.js';

import '@lion/fieldset/lion-fieldset.js';

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
    const el = await fixture(html`
      <${groupTag} @model-value-changed="${spy}">
        <${itemTag} .choiceValue="${'option1'}"></${itemTag}>
        <${itemTag} .choiceValue="${'option2'}"></${itemTag}>
        <${itemTag} .choiceValue="${'option3'}"></${itemTag}>
      </${groupTag}>
    `);
    await el.registrationComplete;
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
    await el.registrationComplete;
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

describe('lion-select-rich', () => {
  describe(featureName, () => {
    it(getFirstPaintTitle(firstStampCount), async () => {
      const spy = sinon.spy();
      const el = await fixture(html`
        <lion-select-rich @model-value-changed="${spy}">
          <lion-options slot="input">
            <lion-option .choiceValue="${'option1'}"></lion-option>
            <lion-option .choiceValue="${'option2'}"></lion-option>
            <lion-option .choiceValue="${'option3'}"></lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      await el.registrationComplete;
      expect(spy.callCount).to.equal(firstStampCount);
    });

    it(getInteractionTitle(interactionCount), async () => {
      const spy = sinon.spy();
      const el = await fixture(html`
        <lion-select-rich>
          <lion-options slot="input">
            <lion-option .choiceValue="${'option1'}"></lion-option>
            <lion-option .choiceValue="${'option2'}"></lion-option>
            <lion-option .choiceValue="${'option3'}"></lion-option>
          </lion-options>
        </lion-select-rich>
      `);
      await el.registrationComplete;
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

describe('lion-fieldset', () => {
  describe(featureName, () => {
    it(getFirstPaintTitle(firstStampCount), async () => {
      const spy = sinon.spy();
      const el = await fixture(html`
        <lion-fieldset name="parent" @model-value-changed="${spy}">
          <lion-input name="input"></lion-input>
        </lion-fieldset>
      `);
      await el.registrationComplete;
      expect(spy.callCount).to.equal(firstStampCount);
    });

    it(getInteractionTitle(interactionCount), async () => {
      const spy = sinon.spy();
      const el = await fixture(html`
        <lion-fieldset name="parent">
          <lion-input name="input"></lion-input>
        </lion-fieldset>
      `);
      await el.registrationComplete;
      el.addEventListener('model-value-changed', spy);
      const input = el.querySelector('lion-input');
      input.modelValue = 'foo';
      expect(spy.callCount).to.equal(interactionCount);
    });
  });
});
