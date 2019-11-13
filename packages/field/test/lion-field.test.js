import {
  expect,
  fixture,
  html,
  unsafeStatic,
  triggerFocusFor,
  triggerBlurFor,
  aTimeout,
} from '@open-wc/testing';
import { unsafeHTML } from '@lion/core';
import sinon from 'sinon';
import { Validator, Required } from '@lion/validate';
import { localize } from '@lion/localize';
import { localizeTearDown } from '@lion/localize/test-helpers.js';

import '../lion-field.js';

const nameSuffix = '';
const tagString = 'lion-field';
const tag = unsafeStatic(tagString);
const inputSlotString = '<input slot="input" />';
const inputSlot = unsafeHTML(inputSlotString);

function mimicUserInput(formControl, newViewValue) {
  formControl.value = newViewValue; // eslint-disable-line no-param-reassign
  formControl.inputElement.dispatchEvent(new CustomEvent('input', { bubbles: true }));
}

beforeEach(() => {
  localizeTearDown();
});

describe('<lion-field>', () => {
  it(`puts a unique id "${tagString}-[hash]" on the native input`, async () => {
    const el = await fixture(html`<${tag}>${inputSlot}</${tag}>`);
    expect(el.$$slot('input').id).to.equal(el._inputId);
  });

  it(`has a fieldName based on the label`, async () => {
    const el1 = await fixture(html`<${tag} label="foo">${inputSlot}</${tag}>`);
    expect(el1.fieldName).to.equal(el1._labelNode.textContent);

    const el2 = await fixture(html`<${tag}><label slot="label">bar</label>${inputSlot}</${tag}>`);
    expect(el2.fieldName).to.equal(el2._labelNode.textContent);
  });

  it(`has a fieldName based on the name if no label exists`, async () => {
    const el = await fixture(html`<${tag} name="foo">${inputSlot}</${tag}>`);
    expect(el.fieldName).to.equal(el.name);
  });

  it('fires focus/blur event on host and native input if focused/blurred', async () => {
    const el = await fixture(html`<${tag}>${inputSlot}</${tag}>`);
    const cbFocusHost = sinon.spy();
    el.addEventListener('focus', cbFocusHost);
    const cbFocusNativeInput = sinon.spy();
    el.inputElement.addEventListener('focus', cbFocusNativeInput);
    const cbBlurHost = sinon.spy();
    el.addEventListener('blur', cbBlurHost);
    const cbBlurNativeInput = sinon.spy();
    el.inputElement.addEventListener('blur', cbBlurNativeInput);

    await triggerFocusFor(el);

    expect(document.activeElement).to.equal(el.inputElement);
    expect(cbFocusHost.callCount).to.equal(1);
    expect(cbFocusNativeInput.callCount).to.equal(1);
    expect(cbBlurHost.callCount).to.equal(0);
    expect(cbBlurNativeInput.callCount).to.equal(0);

    await triggerBlurFor(el);
    expect(cbBlurHost.callCount).to.equal(1);
    expect(cbBlurNativeInput.callCount).to.equal(1);

    await triggerFocusFor(el);
    expect(document.activeElement).to.equal(el.inputElement);
    expect(cbFocusHost.callCount).to.equal(2);
    expect(cbFocusNativeInput.callCount).to.equal(2);

    await triggerBlurFor(el);
    expect(cbBlurHost.callCount).to.equal(2);
    expect(cbBlurNativeInput.callCount).to.equal(2);
  });

  it('offers simple getter "this.focused" returning true/false for the current focus state', async () => {
    const el = await fixture(html`<${tag}>${inputSlot}</${tag}>`);
    expect(el.focused).to.equal(false);
    await triggerFocusFor(el);
    expect(el.focused).to.equal(true);
    await triggerBlurFor(el);
    expect(el.focused).to.equal(false);
  });

  it('can be disabled via attribute', async () => {
    const elDisabled = await fixture(html`<${tag} disabled>${inputSlot}</${tag}>`);
    expect(elDisabled.disabled).to.equal(true);
    expect(elDisabled.inputElement.disabled).to.equal(true);
  });

  it('can be disabled via property', async () => {
    const el = await fixture(html`<${tag}>${inputSlot}</${tag}>`);
    el.disabled = true;
    await el.updateComplete;
    expect(el.inputElement.disabled).to.equal(true);
  });

  it('can be cleared which erases value, validation and interaction states', async () => {
    const el = await fixture(html`<${tag} value="Some value from attribute">${inputSlot}</${tag}>`);
    el.clear();
    expect(el.value).to.equal('');
    el.value = 'Some value from property';
    expect(el.value).to.equal('Some value from property');
    el.clear();
    expect(el.value).to.equal('');
  });

  it('can be reset which restores original modelValue', async () => {
    const el = await fixture(html`
      <${tag} .modelValue="${'foo'}">
        ${inputSlot}
      </${tag}>`);
    expect(el._initialModelValue).to.equal('foo');
    el.modelValue = 'bar';
    el.reset();
    expect(el.modelValue).to.equal('foo');
  });

  it('reads initial value from attribute value', async () => {
    const el = await fixture(html`<${tag} value="one">${inputSlot}</${tag}>`);
    expect(el.$$slot('input').value).to.equal('one');
  });

  it('delegates value property', async () => {
    const el = await fixture(html`<${tag}>${inputSlot}</${tag}>`);
    expect(el.$$slot('input').value).to.equal('');
    el.value = 'one';
    expect(el.value).to.equal('one');
    expect(el.$$slot('input').value).to.equal('one');
  });

  // This is necessary for security, so that inputElements autocomplete can be set to 'off'
  it('delegates autocomplete property', async () => {
    const el = await fixture(html`<${tag}>${inputSlot}</${tag}>`);
    expect(el.inputElement.autocomplete).to.equal('');
    expect(el.inputElement.hasAttribute('autocomplete')).to.be.false;
    el.autocomplete = 'off';
    await el.updateComplete;
    expect(el.inputElement.autocomplete).to.equal('off');
    expect(el.inputElement.getAttribute('autocomplete')).to.equal('off');
  });

  // TODO: find out if we could put all listeners on this.value (instead of this.inputElement.value)
  // and make it act on this.value again
  it('has a class "state-filled" if this.value is filled', async () => {
    const el = await fixture(html`<${tag} value="filled">${inputSlot}</${tag}>`);
    expect(el.classList.contains('state-filled')).to.equal(true);
    el.value = '';
    await el.updateComplete;
    expect(el.classList.contains('state-filled')).to.equal(false);
    el.value = 'bla';
    await el.updateComplete;
    expect(el.classList.contains('state-filled')).to.equal(true);
  });

  it('preserves the caret position on value change for native text fields (input|textarea)', async () => {
    const el = await fixture(html`<${tag}>${inputSlot}</${tag}>`);
    await triggerFocusFor(el);
    await el.updateComplete;
    el.inputElement.value = 'hello world';
    el.inputElement.selectionStart = 2;
    el.inputElement.selectionEnd = 2;
    el.value = 'hey there universe';
    expect(el.inputElement.selectionStart).to.equal(2);
    expect(el.inputElement.selectionEnd).to.equal(2);
  });

  // TODO: add pointerEvents test for disabled
  it('has a class "state-disabled"', async () => {
    const el = await fixture(html`<${tag}>${inputSlot}</${tag}>`);
    expect(el.classList.contains('state-disabled')).to.equal(false);
    expect(el.inputElement.hasAttribute('disabled')).to.equal(false);

    el.disabled = true;
    await el.updateComplete;
    await aTimeout();

    expect(el.classList.contains('state-disabled')).to.equal(true);
    expect(el.inputElement.hasAttribute('disabled')).to.equal(true);

    const disabledel = await fixture(html`<${tag} disabled>${inputSlot}</${tag}>`);
    expect(disabledel.classList.contains('state-disabled')).to.equal(true);
    expect(disabledel.inputElement.hasAttribute('disabled')).to.equal(true);
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
      const el = await fixture(html`<${tag}>
            <label slot="label">My Name</label>
            ${inputSlot}
            <span slot="help-text">Enter your Name</span>
            <span slot="feedback">No name entered</span>
          </${tag}>
        `);
      const nativeInput = el.$$slot('input');

      expect(nativeInput.getAttribute('aria-labelledby')).to.equal(` label-${el._inputId}`);
      expect(nativeInput.getAttribute('aria-describedby')).to.contain(` help-text-${el._inputId}`);
      expect(nativeInput.getAttribute('aria-describedby')).to.contain(` feedback-${el._inputId}`);
    });

    it(`allows additional slots (prefix, suffix, before, after) to be included in labelledby
    (via attribute data-label) and in describedby (via attribute data-description)`, async () => {
      const el = await fixture(html`<${tag}>
            ${inputSlot}
            <span slot="before" data-label>[before]</span>
            <span slot="after"  data-label>[after]</span>
            <span slot="prefix" data-description>[prefix]</span>
            <span slot="suffix" data-description>[suffix]</span>
          </${tag}>
        `);

      const nativeInput = el.$$slot('input');
      expect(nativeInput.getAttribute('aria-labelledby')).to.contain(
        ` before-${el._inputId} after-${el._inputId}`,
      );
      expect(nativeInput.getAttribute('aria-describedby')).to.contain(
        ` prefix-${el._inputId} suffix-${el._inputId}`,
      );
    });

    // TODO: put this test on FormControlMixin test once there
    it(`allows to add to aria description or label via addToAriaLabel() and
      addToAriaDescription()`, async () => {
      const wrapper = await fixture(html`
        <div id="wrapper">
          <${tag}>
            ${inputSlot}
            <label slot="label">Added to label by default</label>
            <div slot="feedback">Added to description by default</div>
          </${tag}>
          <div id="additionalLabel"> This also needs to be read whenever the input has focus</div>
          <div id="additionalDescription"> Same for this </div>
        </div>`);
      const el = wrapper.querySelector(tagString);
      // wait until the field element is done rendering
      await el.updateComplete;
      await el.updateComplete;

      const { inputElement } = el;

      // 1. addToAriaLabel()
      // Check if the aria attr is filled initially
      expect(inputElement.getAttribute('aria-labelledby')).to.contain(`label-${el._inputId}`);
      el.addToAriaLabel('additionalLabel');
      // Now check if ids are added to the end (not overridden)
      expect(inputElement.getAttribute('aria-labelledby')).to.contain(`label-${el._inputId}`);
      // Should be placed in the end
      expect(
        inputElement.getAttribute('aria-labelledby').indexOf(`label-${el._inputId}`) <
          inputElement.getAttribute('aria-labelledby').indexOf('additionalLabel'),
      );

      // 2. addToAriaDescription()
      // Check if the aria attr is filled initially
      expect(inputElement.getAttribute('aria-describedby')).to.contain(`feedback-${el._inputId}`);
      el.addToAriaDescription('additionalDescription');
      // Now check if ids are added to the end (not overridden)
      expect(inputElement.getAttribute('aria-describedby')).to.contain(`feedback-${el._inputId}`);
      // Should be placed in the end
      expect(
        inputElement.getAttribute('aria-describedby').indexOf(`feedback-${el._inputId}`) <
          inputElement.getAttribute('aria-describedby').indexOf('additionalDescription'),
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

    it('should conditionally show error', async () => {
      const HasX = class extends Validator {
        constructor() {
          super();
          this.name = 'HasX';
        }

        execute(value) {
          const result = value.indexOf('x') === -1;
          return result;
        }
      };
      const el = await fixture(html`
        <${tag}
          .validators=${[new HasX()]}>
          ${inputSlot}
        </${tag}>
      `);
      el.modelValue = 'a@b.nl';

      await el.feedbackComplete;
      expect(el.hasErrorVisible).to.be.true;

      const executeScenario = async (el, scenario) => {
        el.resetInteractionState();
        el.touched = scenario.el.touched;
        el.dirty = scenario.el.dirty;
        el.prefilled = scenario.el.prefilled;
        el.submitted = scenario.el.submitted;

        await el.updateComplete;
        await el.feedbackComplete;
        expect(el.hasErrorVisible).to.equal(scenario.wantErrorVisible);
      };

      await executeScenario(el, {
        index: 0,
        el: { touched: true, dirty: true, prefilled: false, submitted: false },
        wantErrorVisible: true,
      });
      await executeScenario(el, {
        index: 1,
        el: { touched: false, dirty: false, prefilled: true, submitted: false },
        wantErrorVisible: true,
      });

      await executeScenario(el, {
        index: 2,
        el: { touched: false, dirty: false, prefilled: false, submitted: true },
        wantErrorVisible: true,
      });

      await executeScenario(el, {
        index: 3,
        el: { touched: false, dirty: true, prefilled: false, submitted: false },
        wantErrorVisible: false,
      });

      await executeScenario(el, {
        index: 4,
        el: { touched: true, dirty: false, prefilled: false, submitted: false },
        wantErrorVisible: false,
      });
    });

    it('can be required', async () => {
      const el = await fixture(html`
        <${tag}
          .validators=${[new Required()]}
        >${inputSlot}</${tag}>
      `);
      expect(el.hasError).to.be.true;
      expect(el.errorStates).to.have.a.property('Required');
      el.modelValue = 'cat';
      expect(el.hasError).to.be.false;
      expect(el.errorStates).not.to.have.a.property('Required');
    });

    it('will only update formattedValue when valid on `user-input-changed`', async () => {
      const formatterSpy = sinon.spy(value => `foo: ${value}`);
      const Bar = class extends Validator {
        constructor(...args) {
          super(...args);
          this.name = 'Bar';
        }

        execute(value) {
          return value !== 'bar';
        }
      };
      const el = await fixture(html`
        <${tag}
          .modelValue=${'init-string'}
          .formatter=${formatterSpy}
          .validators=${[new Bar()]}
        >${inputSlot}</${tag}>
      `);

      expect(formatterSpy.callCount).to.equal(0);
      expect(el.formattedValue).to.equal('init-string');

      el.modelValue = 'bar';
      expect(formatterSpy.callCount).to.equal(1);
      expect(el.formattedValue).to.equal('foo: bar');

      mimicUserInput(el, 'foo');
      expect(formatterSpy.callCount).to.equal(1);
      expect(el.value).to.equal('foo');
    });
  });

  describe(`Content projection${nameSuffix}`, () => {
    it('renders correctly all slot elements in light DOM', async () => {
      const el = await fixture(html`
        <${tag}>
          <label slot="label">[label]</label>
          ${inputSlot}
          <span slot="help-text">[help-text]</span>
          <span slot="before">[before]</span>
          <span slot="after">[after]</span>
          <span slot="prefix">[prefix]</span>
          <span slot="suffix">[suffix]</span>
          <span slot="feedback">[feedback]</span>
        </${tag}>
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
        el.querySelector(`[slot="${slotName}"]`).setAttribute('test-me', 'ok');
        const slot = el.shadowRoot.querySelector(`slot[name="${slotName}"]`);
        const assignedNodes = slot.assignedNodes();
        expect(assignedNodes.length).to.equal(1);
        expect(assignedNodes[0].getAttribute('test-me')).to.equal('ok');
      });
    });
  });

  describe('Delegation', () => {
    it('delegates property value', async () => {
      const el = await fixture(html`<${tag}>${inputSlot}</${tag}>`);
      expect(el.inputElement.value).to.equal('');
      el.value = 'one';
      expect(el.value).to.equal('one');
      expect(el.inputElement.value).to.equal('one');
    });

    it('delegates property selectionStart and selectionEnd', async () => {
      const el = await fixture(html`
        <${tag}
          .modelValue=${'Some text to select'}
        >${unsafeHTML(inputSlotString)}</${tag}>
      `);

      el.selectionStart = 5;
      el.selectionEnd = 12;
      expect(el.inputElement.selectionStart).to.equal(5);
      expect(el.inputElement.selectionEnd).to.equal(12);
    });
  });
});
