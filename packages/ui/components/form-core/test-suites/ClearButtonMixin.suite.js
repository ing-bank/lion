import { LitElement } from 'lit';
import { aTimeout, defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { ClearButtonMixin, FormatMixin } from '@lion/ui/form-core.js';

/**
 * @typedef {import('../types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 */

class ClearButtonClass extends ClearButtonMixin(FormatMixin(LitElement)) {
  get _inputNode() {
    return /** @type {HTMLInputElement} */ (super._inputNode); // casts type
  }

  render() {
    return html`<slot name="input"></slot>`;
  }
}

/**
 * @param {{tagString?: string}} [customConfig]
 */
export function runClearButtonMixinSuite(customConfig) {
  const cfg = {
    tagString: null,
    ...customConfig,
  };

  describe('ClearButtonMixin', async () => {
    /** @type {{_$litStatic$: any}} */
    let tag;

    before(async () => {
      if (!cfg.tagString) {
        cfg.tagString = defineCE(ClearButtonClass);
      }
      tag = unsafeStatic(cfg.tagString);
    });

    it('shows the clear button after filled', async () => {
      const el = /** @type {ClearButtonClass} */ (
        await fixture(html`<${tag}><input slot="input"></${tag}>`)
      );
      // @ts-ignore
      expect(el._clearButtonNode).to.be.null;
      el.filled = true;
      await aTimeout(0);
      expect(el._clearButtonNode).to.exist;
    });

    it('clears the input content on click clear button', async () => {
      const el = /** @type {ClearButtonClass} */ (
        await fixture(html`<${tag} .modelValue="${'foo'}"><input slot="input"></${tag}>`)
      );

      el._clearButtonNode?.click();
      expect(el.modelValue).to.equal('');
      // @ts-ignore
      expect(el._inputNode.value).to.equal('');
    });

    it('fires model-value-changed on click clear button', async () => {
      const spy = sinon.spy();
      const el = /** @type {ClearButtonClass} */ (
        await fixture(
          html`<${tag} .modelValue="${'foo'}" @model-value-changed="${spy}"><input slot="input"></${tag}>`,
        )
      );
      el._clearButtonNode?.click();
      expect(spy.callCount).to.equal(1);
      const clearEvent = spy.lastCall.args[0];
      expect(clearEvent.detail.isTriggeredByUser).to.be.true;
    });

    it('is shown on mouse-enter and hidden on mouse-leave', async () => {
      const el = /** @type {ClearButtonClass} */ (
        await fixture(html`<${tag} .modelValue="${'foo'}"><input slot="input"></${tag}>`)
      );
      const eventMouseEnter = new Event('mouseenter');
      const eventMouseLeave = new Event('mouseleave');
      expect(el._clearButtonNode?.style.display).to.equal('');

      el.dispatchEvent(eventMouseEnter);
      await el.updateComplete;
      expect(el._clearButtonNode?.style.display).to.equal('block');

      el.dispatchEvent(eventMouseLeave);
      await el.updateComplete;
      expect(el._clearButtonNode?.style.display).to.equal('none');
    });

    it('is not hidden on mouse-leave when clearButton is focused', async () => {
      const el = /** @type {ClearButtonClass} */ (
        await fixture(html`<${tag} .modelValue="${'foo'}"><input slot="input"></${tag}>`)
      );
      const eventMouseLeave = new Event('mouseleave');
      el._clearButtonNode?.focus();

      el._focusableNode.dispatchEvent(eventMouseLeave);
      await aTimeout(0);
      expect(el._clearButtonNode?.style.display).to.equal('');
    });

    it('is shown on focusin and hidden on focusout', async () => {
      const el = /** @type {ClearButtonClass} */ (
        await fixture(html`<${tag} .modelValue="${'foo'}"><input slot="input"></${tag}>`)
      );
      const eventFocusIn = new Event('focusin');
      const eventFocusOut = new Event('focusout');
      expect(el._clearButtonNode?.style.display).to.equal('');

      el._focusableNode.dispatchEvent(eventFocusIn);
      expect(el._clearButtonNode?.style.display).to.equal('block');

      el._focusableNode.dispatchEvent(eventFocusOut);
      await aTimeout(0);
      expect(el._clearButtonNode?.style.display).to.equal('none');
    });

    it('is hidden on blur of clearButton', async () => {
      const el = /** @type {ClearButtonClass} */ (
        await fixture(html`<${tag} .modelValue="${'foo'}"><input slot="input"></${tag}>`)
      );
      const eventFocusIn = new Event('focusin');
      // @ts-expect-error [allow-protected-in-test]
      expect(el._clearButtonNode?.style.display).to.equal('');

      // @ts-expect-error [allow-protected-in-test]
      el._focusableNode.dispatchEvent(eventFocusIn);
      // @ts-expect-error [allow-protected-in-test]
      el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      el._clearButtonNode?.dispatchEvent(new Event('blur'));
      await aTimeout(0);
      expect(el._clearButtonNode?.style.display).to.equal('none');
    });

    it('gets disabled attribute when combobox is disabled', async () => {
      const el = /** @type {ClearButtonClass} */ (
        await fixture(html`<${tag} .modelValue="${'foo'}"><input slot="input"></${tag}>`)
      );
      expect(el._clearButtonNode?.hasAttribute('disabled')).to.be.false;
      el.disabled = true;
      await el.updateComplete;
      expect(el._clearButtonNode?.hasAttribute('disabled')).to.be.true;
    });

    it('sets focus to input on clear button click', async () => {
      const el = /** @type {ClearButtonClass} */ (
        await fixture(html`<${tag} .modelValue="${'foo'}"><input slot="input"></${tag}>`)
      );
      el._clearButtonNode?.dispatchEvent(new Event('click'));
      await aTimeout(0);
      expect(document.activeElement).to.equal(el._focusableNode);
    });
  });
}
