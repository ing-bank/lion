/* eslint-disable lit-a11y/no-autofocus */
import { expect, fixture as _fixture, html, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-select.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-options.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-dialog.js';

import { mimicUserTyping } from '@lion/ui/combobox-test-helpers.js';

/**
 * @typedef {import('../src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionDialog>} */ (_fixture);

const comboboxDataEntry = {
  label: 'Apple',
};

describe('lion-dialog', () => {
  describe('lion-combobox integration', () => {
    it('should close combobox dropdown on first Escape and should close the parent dialog on the second Escape', async () => {
      const el = await fixture(html`
        <lion-dialog has-close-button>
          <lion-button slot="invoker">Open Dialog</lion-button>
          <div slot="header">Combobox example</div>
          <div slot="content">
            <lion-combobox name="combo" label="Select a fruit">
              <lion-option .choiceValue="${comboboxDataEntry.label}"
                >${comboboxDataEntry.label}</lion-option
              >
            </lion-combobox>
            <p>The combobox will overflow outside of the dialog.</p>
          </div>
        </lion-dialog>
      `);

      const dialogInvoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
      dialogInvoker.click();
      const combobox = /** @type {HTMLElement} */ el.querySelector('lion-combobox');
      const isComboboxRendered = () => !!combobox?.shadowRoot?.childNodes.length;
      await waitUntil(isComboboxRendered);
      // @ts-ignore
      await mimicUserTyping(combobox, 'a');
      const firstOption = /** @type { HTMLElement | undefined } */ (
        el.querySelectorAll('lion-option')?.[0]
      );

      const isComboboxFirstOptionInDropdownVisible = () => firstOption?.checkVisibility();
      await waitUntil(isComboboxFirstOptionInDropdownVisible);
      await sendKeys({
        press: 'Escape',
      });
      const isComboboxDropdownVisible = () =>
        combobox?.shadowRoot?.querySelector('dialog')?.checkVisibility();
      const isDialogVisible = () => el?.shadowRoot?.querySelector('dialog')?.checkVisibility();
      expect(isComboboxDropdownVisible()).to.equal(false);
      expect(isDialogVisible()).to.equal(true);
      await sendKeys({
        press: 'Escape',
      });
      expect(isComboboxDropdownVisible()).to.equal(false);
      expect(isDialogVisible()).to.equal(false);
    });
  });
});
