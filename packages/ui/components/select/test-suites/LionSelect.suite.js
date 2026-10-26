import '@lion/ui/define/lion-select.js';
import { aTimeout, expect, fixture, unsafeStatic } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('../src/LionSelect.js').LionSelect} LionSelect
 */

/**
 * Runs the `<lion-select>` behavioural suite. Pass `tagString` to run it against your own
 * registered element (see docs/guides/principles/test-suites.md).
 * @param {{ classes?: Record<string, CustomElementConstructor>, tagString?: string }} [customConfig]
 */
export function runSelectSuite(customConfig = {}) {
  const cfg = {
    classes: /** @type {Record<string, CustomElementConstructor>} */ ({}),
    tagString: 'lion-select',
    ...customConfig,
  };

  cfg.tagString = resolveSuiteTag(cfg.classes.select, cfg.tagString, 'lion-select');
  const tag = unsafeStatic(cfg.tagString);

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
      await aTimeout;
      expect(lionSelect.serializedValue).to.equal('nr1');
      expect(lionSelect.formattedValue).to.equal('Item 1');
      lionSelect.modelValue = 'nr3';
      await aTimeout;
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

      await aTimeout;
      expect(lionSelect.formattedValue).to.equal('Item 2');
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
