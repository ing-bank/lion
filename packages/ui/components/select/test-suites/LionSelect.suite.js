import { LionSelect } from '@lion/ui/select.js';
import { aTimeout, expect, fixture, unsafeStatic } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 */

/**
 * Runs the `<lion-select>` behavioural suite. Pass `tagString` to run it against your own
 * registered element (see docs/guides/principles/test-suites.md).
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}>} [customConfig]
 */
export function runSelectSuite({
  classes: { host = LionSelect } = {},
  tagString: legacyTagString,
} = {}) {
  const tag = unsafeStatic(resolveSuiteTag(host, legacyTagString));

  describe('lion-select', () => {
    it('can preselect an option', async () => {
      const lionSelect = await fixture(html`
        <${tag} .modelValue="${'nr2'}">
          <label slot="label"></label>
          <select slot="input">
            <option value="nr1">Item 1</option>
            <option value="nr2">Item 2</option>
          </select>
        </${tag}>
      `);
      expect(lionSelect.querySelector('select')?.value).to.equal('nr2');
    });

    it('sets the values correctly based on the option value and view value', async () => {
      const lionSelect = /** @type {LionSelect} */ (
        await fixture(html`
          <${tag} label="Foo item" .modelValue="${'nr2'}">
            <select slot="input">
              <option value="nr1">Item 1</option>
              <option value="nr2">Item 2</option>
              <option value="nr3"></option>
            </select>
          </${tag}>
        `)
      );
      expect(lionSelect.serializedValue).to.equal('nr2');
      expect(lionSelect.formattedValue).to.equal('Item 2');
      lionSelect.modelValue = 'nr1';
      await lionSelect.updateComplete;
      expect(lionSelect.serializedValue).to.equal('nr1');
      expect(lionSelect.formattedValue).to.equal('Item 1');
      lionSelect.modelValue = 'nr3';
      await lionSelect.updateComplete;
      expect(lionSelect.serializedValue).to.equal('nr3');
      expect(lionSelect.formattedValue).to.equal('');
    });

    it('updates the formattedValue correctly when the value for the selected option is updated', async () => {
      const lionSelect = /** @type {LionSelect} */ (
        await fixture(html`
          <${tag} label="Foo item" .modelValue="${'nr2'}">
            <select slot="input">
              <option value="nr1">Item 1</option>
              <option value="nr2"></option>
              <option value="nr3"></option>
            </select>
          </${tag}>
        `)
      );
      expect(lionSelect.serializedValue).to.equal('nr2');
      expect(lionSelect.formattedValue).to.equal('');

      const select = /** @type {HTMLSlotElement} */ (
        /** @type {ShadowRoot} */ (lionSelect.shadowRoot).querySelector('slot[name=input]')
      ).assignedElements()[0];
      const options = select.querySelectorAll('option');
      options[1].textContent = 'Item 2';

      // The MutationObserver callback runs as a microtask, a macrotask later it has run for sure
      await aTimeout(0);
      expect(lionSelect.formattedValue).to.equal('Item 2');
    });

    it('dispatches one "user-input-changed" event per native "change" event', async () => {
      const lionSelect = /** @type {LionSelect} */ (
        await fixture(html`
          <${tag} label="Foo item">
            <select slot="input">
              <option value="nr1">Item 1</option>
              <option value="nr2">Item 2</option>
            </select>
          </${tag}>
        `)
      );
      const select = /** @type {HTMLSelectElement} */ (lionSelect.querySelector('select'));
      const spy = sinon.spy();
      lionSelect.addEventListener('user-input-changed', spy);

      select.value = 'nr2';
      select.dispatchEvent(new Event('change'));
      expect(spy.callCount).to.equal(1);
      expect(lionSelect.modelValue).to.equal('nr2');
    });

    it('dispatches a bubbling and composed "user-input-changed" event', async () => {
      const lionSelect = /** @type {LionSelect} */ (
        await fixture(html`
          <${tag} label="Foo item">
            <select slot="input">
              <option value="nr1">Item 1</option>
              <option value="nr2">Item 2</option>
            </select>
          </${tag}>
        `)
      );
      const select = /** @type {HTMLSelectElement} */ (lionSelect.querySelector('select'));
      /** @type {Event[]} */
      const events = [];
      lionSelect.addEventListener('user-input-changed', ev => events.push(ev));

      select.dispatchEvent(new Event('change'));
      expect(events.length).to.equal(1);
      expect(events[0].bubbles).to.be.true;
      expect(events[0].composed).to.be.true;
    });

    it('delegates disabled to the native select', async () => {
      const lionSelect = /** @type {LionSelect} */ (
        await fixture(html`
          <${tag} label="Foo item" disabled>
            <select slot="input">
              <option value="nr1">Item 1</option>
            </select>
          </${tag}>
        `)
      );
      const select = /** @type {HTMLSelectElement} */ (lionSelect.querySelector('select'));
      expect(select.disabled).to.be.true;
      lionSelect.disabled = false;
      await lionSelect.updateComplete;
      expect(select.disabled).to.be.false;
    });

    it('delegates name to the native select', async () => {
      const lionSelect = /** @type {LionSelect} */ (
        await fixture(html`
          <${tag} label="Foo item" name="color">
            <select slot="input">
              <option value="nr1">Item 1</option>
            </select>
          </${tag}>
        `)
      );
      const select = /** @type {HTMLSelectElement} */ (lionSelect.querySelector('select'));
      expect(select.name).to.equal('color');
      lionSelect.name = 'colour';
      await lionSelect.updateComplete;
      expect(select.name).to.equal('colour');
    });

    it('delegates autocomplete to the native select', async () => {
      const lionSelect = /** @type {LionSelect} */ (
        await fixture(html`
          <${tag} label="Foo item" autocomplete="country">
            <select slot="input">
              <option value="nr1">Item 1</option>
            </select>
          </${tag}>
        `)
      );
      const select = /** @type {HTMLSelectElement} */ (lionSelect.querySelector('select'));
      expect(select.autocomplete).to.equal('country');
      // @ts-ignore - autocomplete is a property of LionSelect
      lionSelect.autocomplete = 'off';
      await lionSelect.updateComplete;
      expect(select.autocomplete).to.equal('off');
    });

    it('is accessible', async () => {
      const lionSelect = await fixture(html`
        <${tag} .modelValue="${'nr2'}">
          <label slot="label">Label</label>
          <select slot="input">
            <option value="nr1">Item 1</option>
            <option value="nr2">Item 2</option>
          </select>
        </${tag}>
      `);
      await expect(lionSelect).to.be.accessible();
    });
  });
}
