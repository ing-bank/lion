import { Validator } from '@lion/form-core';
import { expect, fixture, html, unsafeStatic, triggerFocusFor, aTimeout } from '@open-wc/testing';

import '@lion/input/define';

/**
 * @typedef {import('../src/LionInput').LionInput} LionInput
 */

const tagString = 'lion-input';
const tag = unsafeStatic(tagString);

describe('<lion-input>', () => {
  it('delegates readOnly property and readonly attribute', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag} readonly></${tag}>`));
    expect(el._inputNode.readOnly).to.equal(true);
    el.readOnly = false;
    await el.updateComplete;
    expect(el.readOnly).to.equal(false);
    expect(el._inputNode.readOnly).to.equal(false);
  });

  it('delegates value attribute', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag} value="prefilled"></${tag}>`));
    expect(el._inputNode.getAttribute('value')).to.equal('prefilled');
  });

  it('can be disabled via attribute', async () => {
    const elDisabled = /** @type {LionInput} */ (await fixture(html`<${tag} disabled></${tag}>`));
    expect(elDisabled.disabled).to.equal(true);
    expect(elDisabled._inputNode.disabled).to.equal(true);
  });

  it('can be disabled via property', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag}></${tag}>`));
    el.disabled = true;
    await el.updateComplete;
    expect(el._inputNode.disabled).to.equal(true);
  });

  // TODO: Add test that css pointerEvents is none if disabled.
  it('is disabled when disabled property is passed', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag}></${tag}>`));
    expect(el._inputNode.hasAttribute('disabled')).to.equal(false);

    el.disabled = true;
    await el.updateComplete;
    await aTimeout(0);

    expect(el._inputNode.hasAttribute('disabled')).to.equal(true);
    const disabledel = /** @type {LionInput} */ (await fixture(html`<${tag} disabled></${tag}>`));
    expect(disabledel._inputNode.hasAttribute('disabled')).to.equal(true);
  });

  it('reads initial value from attribute value', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag} value="one"></${tag}>`));
    expect(
      /** @type {HTMLInputElement[]} */ (Array.from(el.children)).find(
        child => child.slot === 'input',
      )?.value,
    ).to.equal('one');
  });

  it('delegates value property', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag}></${tag}>`));
    expect(
      /** @type {HTMLInputElement[]} */ (Array.from(el.children)).find(
        child => child.slot === 'input',
      )?.value,
    ).to.equal('');
    el.value = 'one';
    expect(el.value).to.equal('one');
    expect(
      /** @type {HTMLInputElement[]} */ (Array.from(el.children)).find(
        child => child.slot === 'input',
      )?.value,
    ).to.equal('one');
  });

  // This is necessary for security, so that _inputNodes autocomplete can be set to 'off'
  it('delegates autocomplete property', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag}></${tag}>`));
    expect(el._inputNode.autocomplete).to.equal('');
    expect(el._inputNode.hasAttribute('autocomplete')).to.be.false;
    el.autocomplete = 'off';
    await el.updateComplete;
    expect(el._inputNode.autocomplete).to.equal('off');
    expect(el._inputNode.getAttribute('autocomplete')).to.equal('off');
  });

  it('preserves the caret position on value change for native text fields (input|textarea)', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag}></${tag}>`));
    await triggerFocusFor(el);
    await el.updateComplete;
    el._inputNode.value = 'hello world';
    el._inputNode.selectionStart = 2;
    el._inputNode.selectionEnd = 2;
    el.value = 'hey there universe';
    expect(el._inputNode.selectionStart).to.equal(2);
    expect(el._inputNode.selectionEnd).to.equal(2);
  });

  it('automatically creates an <input> element if not provided by user', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`
      <${tag}></${tag}>
    `));
    expect(el.querySelector('input')).to.equal(el._inputNode);
  });

  it('has a type which is reflected to an attribute and is synced down to the native input', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag}></${tag}>`));
    expect(el.type).to.equal('text');
    expect(el.getAttribute('type')).to.equal('text');
    expect(el._inputNode.getAttribute('type')).to.equal('text');

    el.type = 'foo';
    await el.updateComplete;
    expect(el.getAttribute('type')).to.equal('foo');
    expect(el._inputNode.getAttribute('type')).to.equal('foo');
  });

  it('has an attribute that can be used to set the placeholder text of the input', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag} placeholder="text"></${tag}>`));
    expect(el.getAttribute('placeholder')).to.equal('text');
    expect(el._inputNode.getAttribute('placeholder')).to.equal('text');

    el.placeholder = 'foo';
    await el.updateComplete;
    expect(el.getAttribute('placeholder')).to.equal('foo');
    expect(el._inputNode.getAttribute('placeholder')).to.equal('foo');
  });

  it('should remove validation when disabled state toggles', async () => {
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
    const el = /** @type {LionInput} */ (await fixture(html`
      <${tag}
        .validators=${[new HasX()]}
        .modelValue=${'a@b.nl'}
      ></${tag}>
    `));
    expect(el.hasFeedbackFor).to.deep.equal(['error']);
    expect(el.validationStates.error.HasX).to.exist;

    el.disabled = true;
    await el.updateComplete;
    expect(el.hasFeedbackFor).to.deep.equal([]);
    expect(el.validationStates.error).to.deep.equal({});
  });

  describe('Delegation', () => {
    it('delegates property value', async () => {
      const el = /** @type {LionInput} */ (await fixture(html`<${tag}></${tag}>`));
      expect(el._inputNode.value).to.equal('');
      el.value = 'one';
      expect(el.value).to.equal('one');
      expect(el._inputNode.value).to.equal('one');
    });

    it('delegates property selectionStart and selectionEnd', async () => {
      const el = /** @type {LionInput} */ (await fixture(html`
        <${tag}
          .modelValue=${'Some text to select'}
        ></${tag}>
      `));

      el.selectionStart = 5;
      el.selectionEnd = 12;
      expect(el._inputNode.selectionStart).to.equal(5);
      expect(el._inputNode.selectionEnd).to.equal(12);
    });
  });

  describe('Accessibility', () => {
    it('is accessible', async () => {
      const el = await fixture(html`<${tag} label="Label"></${tag}>`);
      await expect(el).to.be.accessible();
    });

    it('is accessible when readonly', async () => {
      const el = await fixture(html`<${tag} readonly label="Label"></${tag}>`);
      await expect(el).to.be.accessible();
    });

    it('is accessible when disabled', async () => {
      const el = await fixture(html`<${tag} disabled label="Label"></${tag}>`);
      await expect(el).to.be.accessible();
    });
  });
});
