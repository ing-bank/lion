import { unsafeHTML } from '@lion/core';
import { localize } from '@lion/localize';
import { localizeTearDown } from '@lion/localize/test-helpers';
import { Required, Validator } from '@lion/form-core';
import { expect, fixture, triggerBlurFor, triggerFocusFor } from '@open-wc/testing';
import { html, unsafeStatic } from 'lit/static-html.js';
import { getFormControlMembers } from '@lion/form-core/test-helpers';
import sinon from 'sinon';
import '@lion/form-core/define-field';

/**
 * @typedef {import('../src/LionField.js').LionField} LionField
 * @typedef {import('../types/FormControlMixinTypes').FormControlHost} FormControlHost
 * @typedef {FormControlHost & HTMLElement & {_parentFormGroup?:HTMLElement, checked?:boolean}} FormControl
 */

/** @typedef {HTMLElement & {shadowRoot: HTMLElement, assignedNodes: Function}} ShadowHTMLElement */

const tagString = 'lion-field';
const tag = unsafeStatic(tagString);
const inputSlotString = '<input slot="input" />';
const inputSlot = unsafeHTML(inputSlotString);

/**
 * @param {import("../index.js").LionField} formControl
 * @param {string} newViewValue
 */
function mimicUserInput(formControl, newViewValue) {
  const { _inputNode } = getFormControlMembers(formControl);

  formControl.value = newViewValue; // eslint-disable-line no-param-reassign
  _inputNode.dispatchEvent(new CustomEvent('input', { bubbles: true }));
}

beforeEach(() => {
  localizeTearDown();
});

/**
 * @param {HTMLElement} el
 * @param {string} slot
 */
function getSlot(el, slot) {
  const children = /** @type {any[]} */ (Array.from(el.children));
  return children.find(child => child.slot === slot);
}

describe('<lion-field>', () => {
  it(`puts a unique id "${tagString}-[hash]" on the native input`, async () => {
    const el = /** @type {LionField} */ (await fixture(html`<${tag}>${inputSlot}</${tag}>`));
    // @ts-ignore allow protected accessors in tests
    const inputId = el._inputId;
    expect(getSlot(el, 'input').id).to.equal(inputId);
  });

  it(`has a fieldName based on the label`, async () => {
    const el1 = /** @type {LionField} */ (
      await fixture(html`<${tag} label="foo">${inputSlot}</${tag}>`)
    );
    const { _labelNode: _labelNode1 } = getFormControlMembers(el1);

    expect(el1.fieldName).to.equal(_labelNode1.textContent);

    const el2 = /** @type {LionField} */ (
      await fixture(html`<${tag}><label slot="label">bar</label>${inputSlot}</${tag}>`)
    );
    const { _labelNode: _labelNode2 } = getFormControlMembers(el2);
    expect(el2.fieldName).to.equal(_labelNode2.textContent);
  });

  it(`has a fieldName based on the name if no label exists`, async () => {
    const el = /** @type {LionField} */ (
      await fixture(html`<${tag} name="foo">${inputSlot}</${tag}>`)
    );
    expect(el.fieldName).to.equal(el.name);
  });

  it(`can override fieldName`, async () => {
    const el = /** @type {LionField} */ (
      await fixture(html`<${tag} label="foo" .fieldName="${'bar'}">${inputSlot}</${tag}>`)
    );
    // @ts-ignore [allow-protected] in test
    expect(el.__fieldName).to.equal(el.fieldName);
  });

  it('fires focus/blur event on host and native input if focused/blurred', async () => {
    const el = /** @type {LionField} */ (await fixture(html`<${tag}>${inputSlot}</${tag}>`));
    const { _inputNode } = getFormControlMembers(el);

    const cbFocusHost = sinon.spy();
    el.addEventListener('focus', cbFocusHost);
    const cbFocusNativeInput = sinon.spy();
    _inputNode.addEventListener('focus', cbFocusNativeInput);
    const cbBlurHost = sinon.spy();
    el.addEventListener('blur', cbBlurHost);
    const cbBlurNativeInput = sinon.spy();
    _inputNode.addEventListener('blur', cbBlurNativeInput);

    await triggerFocusFor(el);

    expect(document.activeElement).to.equal(_inputNode);
    expect(cbFocusHost.callCount).to.equal(1);
    expect(cbFocusNativeInput.callCount).to.equal(1);
    expect(cbBlurHost.callCount).to.equal(0);
    expect(cbBlurNativeInput.callCount).to.equal(0);

    await triggerBlurFor(el);
    expect(cbBlurHost.callCount).to.equal(1);
    expect(cbBlurNativeInput.callCount).to.equal(1);

    await triggerFocusFor(el);
    expect(document.activeElement).to.equal(_inputNode);
    expect(cbFocusHost.callCount).to.equal(2);
    expect(cbFocusNativeInput.callCount).to.equal(2);

    await triggerBlurFor(el);
    expect(cbBlurHost.callCount).to.equal(2);
    expect(cbBlurNativeInput.callCount).to.equal(2);
  });

  it('offers simple getter "this.focused" returning true/false for the current focus state', async () => {
    const el = /** @type {LionField} */ (await fixture(html`<${tag}>${inputSlot}</${tag}>`));
    expect(el.focused).to.equal(false);
    await triggerFocusFor(el);
    expect(el.focused).to.equal(true);
    await triggerBlurFor(el);
    expect(el.focused).to.equal(false);
  });

  it('can be cleared which erases value, validation and interaction states', async () => {
    const el = /** @type {LionField} */ (
      await fixture(html`<${tag} value="Some value from attribute">${inputSlot}</${tag}>`)
    );
    el.clear();
    expect(el.modelValue).to.equal('');
    el.modelValue = 'Some value from property';
    expect(el.modelValue).to.equal('Some value from property');
    el.clear();
    expect(el.modelValue).to.equal('');
  });

  it('can be reset which restores original modelValue', async () => {
    const el = /** @type {LionField} */ (
      await fixture(html`
      <${tag} .modelValue="${'foo'}">
        ${inputSlot}
      </${tag}>`)
    );
    expect(el._initialModelValue).to.equal('foo');
    el.modelValue = 'bar';
    el.reset();
    expect(el.modelValue).to.equal('foo');
  });

  describe('Accessibility', () => {
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
      const el = /** @type {LionField} */ (
        await fixture(html`<${tag}>
            <label slot="label">My Name</label>
            ${inputSlot}
            <span slot="help-text">Enter your Name</span>
            <span slot="feedback">No name entered</span>
          </${tag}>
        `)
      );
      const nativeInput = getSlot(el, 'input');
      // @ts-ignore allow protected accessors in tests
      const inputId = el._inputId;
      expect(nativeInput.getAttribute('aria-labelledby')).to.equal(`label-${inputId}`);
      expect(nativeInput.getAttribute('aria-describedby')).to.contain(`help-text-${inputId}`);
      expect(nativeInput.getAttribute('aria-describedby')).to.contain(`feedback-${inputId}`);
    });

    it(`allows additional slots (prefix, suffix, before, after) to be included in labelledby
    (via attribute data-label) and in describedby (via attribute data-description)`, async () => {
      const el = /** @type {LionField} */ (
        await fixture(html`<${tag}>
            ${inputSlot}
            <span slot="before" data-label>[before]</span>
            <span slot="after"  data-label>[after]</span>
            <span slot="prefix" data-description>[prefix]</span>
            <span slot="suffix" data-description>[suffix]</span>
          </${tag}>
        `)
      );

      const nativeInput = getSlot(el, 'input');
      // @ts-ignore allow protected accessors in tests
      const inputId = el._inputId;
      expect(nativeInput.getAttribute('aria-labelledby')).to.contain(
        `before-${inputId} after-${inputId}`,
      );
      expect(nativeInput.getAttribute('aria-describedby')).to.contain(
        `prefix-${inputId} suffix-${inputId}`,
      );
    });
  });

  describe(`Validation`, () => {
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
        static get validatorName() {
          return 'HasX';
        }

        /**
         * @param {string} value
         */
        execute(value) {
          const result = value.indexOf('x') === -1;
          return result;
        }
      };
      const el = /** @type {LionField} */ (
        await fixture(html`
        <${tag}
          .validators=${[new HasX()]}
          .modelValue=${'a@b.nl'}
        >
          ${inputSlot}
        </${tag}>
      `)
      );

      /**
       * @param {import("../index.js").LionField} _sceneEl
       * @param {{ index?: number; el: any; wantedShowsFeedbackFor: any; }} scenario
       */
      const executeScenario = async (_sceneEl, scenario) => {
        const sceneEl = _sceneEl;
        sceneEl.resetInteractionState();
        sceneEl.touched = scenario.el.touched;
        sceneEl.dirty = scenario.el.dirty;
        sceneEl.prefilled = scenario.el.prefilled;
        sceneEl.submitted = scenario.el.submitted;

        await sceneEl.updateComplete;
        await sceneEl.feedbackComplete;
        expect(sceneEl.showsFeedbackFor).to.deep.equal(scenario.wantedShowsFeedbackFor);
      };

      await executeScenario(el, {
        index: 0,
        el: { touched: true, dirty: true, prefilled: false, submitted: false },
        wantedShowsFeedbackFor: ['error'],
      });
      await executeScenario(el, {
        index: 1,
        el: { touched: false, dirty: false, prefilled: true, submitted: false },
        wantedShowsFeedbackFor: ['error'],
      });

      await executeScenario(el, {
        index: 2,
        el: { touched: false, dirty: false, prefilled: false, submitted: true },
        wantedShowsFeedbackFor: ['error'],
      });

      await executeScenario(el, {
        index: 3,
        el: { touched: false, dirty: true, prefilled: false, submitted: false },
        wantedShowsFeedbackFor: [],
      });

      await executeScenario(el, {
        index: 4,
        el: { touched: true, dirty: false, prefilled: false, submitted: false },
        wantedShowsFeedbackFor: [],
      });
    });
    it('should not run validation when disabled', async () => {
      const HasX = class extends Validator {
        static get validatorName() {
          return 'HasX';
        }

        /**
         * @param {string} value
         */
        execute(value) {
          const result = value.indexOf('x') === -1;
          return result;
        }
      };
      const disabledEl = /** @type {LionField} */ (
        await fixture(html`
        <${tag}
          disabled
          .validators=${[new HasX()]}
          .modelValue=${'a@b.nl'}
        >
          ${inputSlot}
        </${tag}>
      `)
      );
      const el = /** @type {LionField} */ (
        await fixture(html`
        <${tag}
          .validators=${[new HasX()]}
          .modelValue=${'a@b.nl'}
        >
          ${inputSlot}
        </${tag}>
      `)
      );

      expect(el.hasFeedbackFor).to.deep.equal(['error']);
      expect(el.validationStates.error.HasX).to.exist;

      expect(disabledEl.hasFeedbackFor).to.deep.equal([]);
      expect(disabledEl.validationStates.error).to.deep.equal({});
    });

    it('can be required', async () => {
      const el = /** @type {LionField} */ (
        await fixture(html`
        <${tag}
          .validators=${[new Required()]}
        >${inputSlot}</${tag}>
      `)
      );
      expect(el.hasFeedbackFor).to.deep.equal(['error']);
      expect(el.validationStates.error.Required).to.exist;
      el.modelValue = 'cat';
      expect(el.hasFeedbackFor).to.deep.equal([]);
      expect(el.validationStates.error.Required).to.not.exist;
    });

    it('will only update formattedValue when valid on `user-input-changed`', async () => {
      const formatterSpy = sinon.spy(value => `foo: ${value}`);
      const Bar = class extends Validator {
        static get validatorName() {
          return 'Bar';
        }

        /**
         * @param {string} value
         */
        execute(value) {
          const hasError = value !== 'bar';
          return hasError;
        }
      };
      const el = /** @type {LionField} */ (
        await fixture(html`
        <${tag}
          .modelValue=${'init-string'}
          .formatter=${formatterSpy}
          .validators=${[new Bar()]}
        >${inputSlot}</${tag}>
      `)
      );

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

  describe(`Content projection`, () => {
    it('renders correctly all slot elements in light DOM', async () => {
      const el = /** @type {LionField} */ (
        await fixture(html`
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
      `)
      );

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
        const slotLight = /** @type {HTMLElement} */ (el.querySelector(`[slot="${slotName}"]`));
        slotLight.setAttribute('test-me', 'ok');
        const slot = /** @type {ShadowHTMLElement} */ (
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector(`slot[name="${slotName}"]`)
        );
        const assignedNodes = slot.assignedNodes();
        expect(assignedNodes.length).to.equal(1);
        expect(assignedNodes[0].getAttribute('test-me')).to.equal('ok');
      });
    });
  });
});
