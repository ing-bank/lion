/* eslint-env mocha */
/* eslint-disable no-underscore-dangle, no-unused-expressions */
import {
  expect,
  fixture,
  html,
  unsafeStatic,
  triggerFocusFor,
  triggerBlurFor,
} from '@open-wc/testing';
import { unsafeHTML } from '@lion/core';
import sinon from 'sinon';
import { localize } from '@lion/localize';
import { localizeTearDown } from '@lion/localize/test-helpers.js';

import '../lion-field.js';

const nameSuffix = '';
const tagString = 'lion-field';
const tag = unsafeStatic(tagString);
const inputSlotString = '<input slot="input" />';
const inputSlot = unsafeHTML(inputSlotString);

beforeEach(() => {
  localizeTearDown();
});

describe('<lion-field>', () => {
  it(`puts a unique id "${tagString}-[hash]" on the native input`, async () => {
    const lionField = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
    expect(lionField.$$slot('input').id).to.equal(lionField._inputId);
  });

  it('fires focus/blur event on host and native input if focused/blurred', async () => {
    const lionField = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
    const cbFocusHost = sinon.spy();
    lionField.addEventListener('focus', cbFocusHost);
    const cbFocusNativeInput = sinon.spy();
    lionField.inputElement.addEventListener('focus', cbFocusNativeInput);
    const cbBlurHost = sinon.spy();
    lionField.addEventListener('blur', cbBlurHost);
    const cbBlurNativeInput = sinon.spy();
    lionField.inputElement.addEventListener('blur', cbBlurNativeInput);

    await triggerFocusFor(lionField);

    expect(document.activeElement).to.equal(lionField.inputElement);
    expect(cbFocusHost.callCount).to.equal(1);
    expect(cbFocusNativeInput.callCount).to.equal(1);
    expect(cbBlurHost.callCount).to.equal(0);
    expect(cbBlurNativeInput.callCount).to.equal(0);

    await triggerBlurFor(lionField);
    expect(cbBlurHost.callCount).to.equal(1);
    expect(cbBlurNativeInput.callCount).to.equal(1);

    await triggerFocusFor(lionField);
    expect(document.activeElement).to.equal(lionField.inputElement);
    expect(cbFocusHost.callCount).to.equal(2);
    expect(cbFocusNativeInput.callCount).to.equal(2);

    await triggerBlurFor(lionField);
    expect(cbBlurHost.callCount).to.equal(2);
    expect(cbBlurNativeInput.callCount).to.equal(2);
  });

  it('has class "state-focused" if focused', async () => {
    const el = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
    expect(el.classList.contains('state-focused')).to.equal(false, 'no state-focused initially');
    await triggerFocusFor(el.inputElement);
    expect(el.classList.contains('state-focused')).to.equal(true, 'state-focused after focus()');
    await triggerBlurFor(el.inputElement);
    expect(el.classList.contains('state-focused')).to.equal(false, 'no state-focused after blur()');
  });

  it('offers simple getter "this.focused" returning true/false for the current focus state', async () => {
    const lionField = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
    expect(lionField.focused).to.equal(false);
    await triggerFocusFor(lionField);
    expect(lionField.focused).to.equal(true);
    await triggerBlurFor(lionField);
    expect(lionField.focused).to.equal(false);
  });

  it('can be disabled via attribute', async () => {
    const lionFieldDisabled = await fixture(
      `<${tagString} disabled>${inputSlotString}</${tagString}>`,
    );
    expect(lionFieldDisabled.disabled).to.equal(true);
    expect(lionFieldDisabled.inputElement.disabled).to.equal(true);
  });

  it('can be disabled via property', async () => {
    const lionField = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
    lionField.disabled = true;
    await lionField.updateComplete;
    expect(lionField.inputElement.disabled).to.equal(true);
  });

  it('can be cleared which erases value, validation and interaction states', async () => {
    const lionField = await fixture(
      `<${tagString} value="Some value from attribute">${inputSlotString}</${tagString}>`,
    );
    lionField.clear();
    expect(lionField.value).to.equal('');
    lionField.value = 'Some value from property';
    expect(lionField.value).to.equal('Some value from property');
    lionField.clear();
    expect(lionField.value).to.equal('');
  });

  it('reads initial value from attribute value', async () => {
    const lionField = await fixture(`<${tagString} value="one">${inputSlotString}</${tagString}>`);
    expect(lionField.$$slot('input').value).to.equal('one');
  });

  it('delegates value property', async () => {
    const lionField = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
    expect(lionField.$$slot('input').value).to.equal('');
    lionField.value = 'one';
    expect(lionField.value).to.equal('one');
    expect(lionField.$$slot('input').value).to.equal('one');
  });

  // TODO: find out if we could put all listeners on this.value (instead of this.inputElement.value)
  // and make it act on this.value again
  it('has a class "state-filled" if this.value is filled', async () => {
    const lionField = await fixture(
      `<${tagString} value="filled">${inputSlotString}</${tagString}>`,
    );
    expect(lionField.classList.contains('state-filled')).to.equal(true);
    lionField.value = '';
    await lionField.updateComplete;
    expect(lionField.classList.contains('state-filled')).to.equal(false);
    lionField.value = 'bla';
    await lionField.updateComplete;
    expect(lionField.classList.contains('state-filled')).to.equal(true);
  });

  it('preserves the caret position on value change for native text fields (input|textarea)', async () => {
    // eslint-disable-line
    const lionField = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
    await triggerFocusFor(lionField);
    await lionField.updateComplete;
    lionField.inputElement.value = 'hello world';
    lionField.inputElement.selectionStart = 2;
    lionField.inputElement.selectionEnd = 2;
    lionField.value = 'hey there universe';
    expect(lionField.inputElement.selectionStart).to.equal(2);
    expect(lionField.inputElement.selectionEnd).to.equal(2);
  });

  // TODO: add pointerEvents test
  // TODO: why is this a describe?
  describe(`<lion-field> with <input disabled>${nameSuffix}`, () => {
    it('has a class "state-disabled"', async () => {
      const lionField = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      expect(lionField.classList.contains('state-disabled')).to.equal(false);
      expect(lionField.inputElement.hasAttribute('disabled')).to.equal(false);

      lionField.disabled = true;
      await lionField.updateComplete;
      expect(lionField.classList.contains('state-disabled')).to.equal(true);
      expect(lionField.inputElement.hasAttribute('disabled')).to.equal(true);

      const disabledlionField = await fixture(
        `<${tagString} disabled>${inputSlotString}</${tagString}>`,
      );
      expect(disabledlionField.classList.contains('state-disabled')).to.equal(true);
      expect(disabledlionField.inputElement.hasAttribute('disabled')).to.equal(true);
    });
  });

  describe(`A11y${nameSuffix}`, () => {
    it(`by setting corresponding aria-labelledby (for label) and aria-describedby (for helpText, feedback)
      ~~~
      <lion-field>
        <input
          id="lion-field-[hash]"
          slot="input"
          aria-labelledby="label-[id]"
          aria-describedby="help-text-[id] feedback-[id]"
        />
        <label slot="label"     id="label-[id]"    >[label]   </label>
        <span  slot="help-text" id="help-text-[id]">[helpText]</span>
        <div   slot="feedback"   id="feedback-[id]">[feedback] </span>
      </lion-field>
      ~~~`, async () => {
      const lionField = await fixture(`<${tagString}>
            <label slot="label">My Name</label>
            ${inputSlotString}
            <span slot="help-text">Enter your Name</span>
            <span slot="feedback">No name entered</span>
          </${tagString}>
        `);
      const nativeInput = lionField.$$slot('input');
      expect(nativeInput.getAttribute('aria-labelledby')).to.equal(` label-${lionField._inputId}`);
      expect(nativeInput.getAttribute('aria-describedby')).to.contain(
        ` help-text-${lionField._inputId}`,
      );
      expect(nativeInput.getAttribute('aria-describedby')).to.contain(
        ` feedback-${lionField._inputId}`,
      );
    });

    it(`allows additional slots (prefix, suffix, before, after) to be included in labelledby
    (via attribute data-label) and in describedby (via attribute data-description)`, async () => {
      const lionField = await fixture(`<${tagString}>
            ${inputSlotString}
            <span slot="before" data-label>[before]</span>
            <span slot="after"  data-label>[after]</span>
            <span slot="prefix" data-description>[prefix]</span>
            <span slot="suffix" data-description>[suffix]</span>
          </${tagString}>
        `);

      const nativeInput = lionField.$$slot('input');
      expect(nativeInput.getAttribute('aria-labelledby')).to.contain(
        ` before-${lionField._inputId} after-${lionField._inputId}`,
      );
      expect(nativeInput.getAttribute('aria-describedby')).to.contain(
        ` prefix-${lionField._inputId} suffix-${lionField._inputId}`,
      );
    });

    // TODO: put this test on FormControlMixin test once there
    it(`allows to add to aria description or label via addToAriaLabel() and
      addToAriaDescription()`, async () => {
      const wrapper = await fixture(`
        <div id="wrapper">
          <${tagString}>
            ${inputSlotString}
            <label slot="label">Added to label by default</label>
            <div slot="feedback">Added to description by default</div>
          </${tagString}>
          <div id="additionalLabel"> This also needs to be read whenever the input has focus</div>
          <div id="additionalDescription"> Same for this </div>
        </div>`);
      const el = wrapper.querySelector(`${tagString}`);
      // wait until the field element is done rendering
      await el.updateComplete;

      const { inputElement } = el;
      const get = by => inputElement.getAttribute(`aria-${by}`);

      // 1. addToAriaLabel()
      // Check if the aria attr is filled initially
      expect(get('labelledby')).to.contain(`label-${el._inputId}`);
      el.addToAriaLabel('additionalLabel');
      // Now check if ids are added to the end (not overridden)
      expect(get('labelledby')).to.contain(`label-${el._inputId}`);
      // Should be placed in the end
      expect(
        get('labelledby').indexOf(`label-${el._inputId}`) <
          get('labelledby').indexOf('additionalLabel'),
      );

      // 2. addToAriaDescription()
      // Check if the aria attr is filled initially
      expect(get('describedby')).to.contain(`feedback-${el._inputId}`);
      el.addToAriaDescription('additionalDescription');
      // Now check if ids are added to the end (not overridden)
      expect(get('describedby')).to.contain(`feedback-${el._inputId}`);
      // Should be placed in the end
      expect(
        get('describedby').indexOf(`feedback-${el._inputId}`) <
          get('describedby').indexOf('additionalDescription'),
      );
    });
  });

  describe(`Validation${nameSuffix}`, () => {
    beforeEach(() => {
      // Reset and preload validation translations
      localizeTearDown();
      localize.addData('en-GB', 'lion-validate', {
        error: {
          hasX: 'This is error message for hasX',
        },
      });
    });

    it('shows validity states(error|warning|info|success) when interaction criteria met ', async () => {
      // TODO: in order to make this test work as an integration test, we chose a modelValue
      // that is compatible with lion-input-email.
      // However, when we can put priorities to validators (making sure error message of hasX is
      // shown instead of a predefined validator like isEmail), we should fix this.
      function hasX(str) {
        return { hasX: str.indexOf('x') > -1 };
      }
      const lionField = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      const feedbackEl = lionField._feedbackElement;

      lionField.modelValue = 'a@b.nl';
      lionField.errorValidators = [[hasX]];

      expect(lionField.error.hasX).to.equal(true);
      expect(feedbackEl.innerText.trim()).to.equal(
        '',
        'shows no feedback, although the element has an error',
      );
      lionField.dirty = true;
      lionField.touched = true;
      lionField.modelValue = 'ab@c.nl'; // retrigger validation
      await lionField.updateComplete;

      expect(feedbackEl.innerText.trim()).to.equal(
        'This is error message for hasX',
        'shows feedback, because touched=true and dirty=true',
      );

      lionField.touched = false;
      lionField.dirty = false;
      lionField.prefilled = true;
      await lionField.updateComplete;
      expect(feedbackEl.innerText.trim()).to.equal(
        'This is error message for hasX',
        'shows feedback, because prefilled=true',
      );
    });

    it('can be required', async () => {
      const lionField = await fixture(html`
        <${tag}
          .errorValidators=${[['required']]}
        >${inputSlot}</${tag}>
      `);
      expect(lionField.error.required).to.be.true;
      lionField.modelValue = 'cat';
      expect(lionField.error.required).to.be.undefined;
    });
  });

  describe(`Content projection${nameSuffix}`, () => {
    it('renders correctly all slot elements in light DOM', async () => {
      const lionField = await fixture(`
        <${tagString}>
          <label slot="label">[label]</label>
          ${inputSlotString}
          <span slot="help-text">[help-text]</span>
          <span slot="before">[before]</span>
          <span slot="after">[after]</span>
          <span slot="prefix">[prefix]</span>
          <span slot="suffix">[suffix]</span>
          <span slot="feedback">[feedback]</span>
        </${tagString}>
      `);

      const names = [
        'label',
        'input',
        'help-text',
        'before',
        'after',
        'prefix',
        'suffix',
        'feedback',
      ];
      names.forEach(slotName => {
        lionField.querySelector(`[slot="${slotName}"]`).setAttribute('test-me', 'ok');
        const slot = lionField.shadowRoot.querySelector(`slot[name="${slotName}"]`);
        const assignedNodes = slot.assignedNodes();
        expect(assignedNodes.length).to.equal(1);
        expect(assignedNodes[0].getAttribute('test-me')).to.equal('ok');
      });
    });
  });

  describe(`Delegation${nameSuffix}`, () => {
    it('delegates attribute autofocus', async () => {
      const el = await fixture(`<${tagString} autofocus>${inputSlotString}</${tagString}>`);
      expect(el.hasAttribute('autofocus')).to.be.false;
      expect(el.inputElement.hasAttribute('autofocus')).to.be.true;
    });

    it('delegates property value', async () => {
      const el = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      expect(el.inputElement.value).to.equal('');
      el.value = 'one';
      expect(el.value).to.equal('one');
      expect(el.inputElement.value).to.equal('one');
    });

    it('delegates property type', async () => {
      const el = await fixture(`<${tagString} type="text">${inputSlotString}</${tagString}>`);
      const inputElemTag = el.inputElement.tagName.toLowerCase();
      if (inputElemTag === 'select') {
        // TODO: later on we might want to support multi select ?
        expect(el.inputElement.type).to.contain('select-one');
      } else if (inputElemTag === 'textarea') {
        expect(el.inputElement.type).to.contain('textarea');
      } else {
        // input or custom inputElement
        expect(el.inputElement.type).to.contain('text');
        el.type = 'password';
        expect(el.type).to.equal('password');
        expect(el.inputElement.type).to.equal('password');
      }
    });

    it('delegates property onfocus', async () => {
      const el = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      const cbFocusHost = sinon.spy();
      el.onfocus = cbFocusHost;
      await triggerFocusFor(el.inputElement);
      expect(cbFocusHost.callCount).to.equal(1);
    });

    it('delegates property onblur', async () => {
      const el = await fixture(`<${tagString}>${inputSlotString}</${tagString}>`);
      const cbBlurHost = sinon.spy();
      el.onblur = cbBlurHost;
      await triggerFocusFor(el.inputElement);
      await triggerBlurFor(el.inputElement);
      expect(cbBlurHost.callCount).to.equal(1);
    });

    it('delegates property selectionStart and selectionEnd', async () => {
      const lionField = await fixture(html`
        <${tag}
          .modelValue=${'Some text to select'}
        >${unsafeHTML(inputSlotString)}</${tag}>
      `);

      lionField.selectionStart = 5;
      lionField.selectionEnd = 12;
      expect(lionField.inputElement.selectionStart).to.equal(5);
      expect(lionField.inputElement.selectionEnd).to.equal(12);
    });
  });
});
