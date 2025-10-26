/* eslint-disable lit-a11y/no-autofocus */
import { expect, fixture as _fixture, html, waitUntil } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-dialog.js';
import '@lion/ui/define/lion-tooltip.js';

import { mimicUserTyping } from '@lion/ui/combobox-test-helpers.js';

/**
 * @typedef {import('../src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionDialog>} */ (_fixture);

const dropDownEntries = ['Apple', 'Banana'];

describe('lion-dialog', () => {
  describe('lion-combobox integration', () => {
    it('should close lion-combobox dropdown on first Escape and should close the parent lion-dialog on the second Escape', async () => {
      const el = await fixture(html`
        <lion-dialog has-close-button>
          <lion-button slot="invoker">Open Dialog</lion-button>
          <div slot="header">Combobox example</div>
          <div slot="content">
            <lion-combobox name="combo" label="Select a fruit">
              ${dropDownEntries.map(
                (/** @type { string } */ entry) =>
                  html` <lion-option .choiceValue="${entry}">${entry}</lion-option>`,
              )}
            </lion-combobox>
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
      const isDropdownVisible = () =>
        combobox?.shadowRoot?.querySelector('dialog')?.checkVisibility();
      const isDialogVisible = () => el?.shadowRoot?.querySelector('dialog')?.checkVisibility();
      expect(isDropdownVisible()).to.equal(false);
      expect(isDialogVisible()).to.equal(true);
      await sendKeys({
        press: 'Escape',
      });
      expect(isDropdownVisible()).to.equal(false);
      expect(isDialogVisible()).to.equal(false);
    });
  });

  describe('lion-select-rich integration', () => {
    it('should close lion-select-rich dropdown on first Escape and should close the parent lion-dialog on the second Escape', async () => {
      const el = await fixture(html`
        <lion-dialog has-close-button>
          <lion-button slot="invoker">Open Dialog</lion-button>
          <div slot="header">Select rich example</div>
          <div slot="content">
            <lion-select-rich label="Select a fruit">
              ${dropDownEntries.map(
                (/** @type { string } */ entry) =>
                  html` <lion-option .choiceValue="${entry}">${entry}</lion-option>`,
              )}
            </lion-select-rich>
          </div>
        </lion-dialog>
      `);

      const dialogInvoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
      dialogInvoker.click();
      const selectRichInvoker = /** @type {HTMLElement} */ el.querySelector('lion-select-invoker');
      const isSelectRichInvokerRendered = () => !!selectRichInvoker?.shadowRoot?.childNodes.length;
      await waitUntil(isSelectRichInvokerRendered);
      selectRichInvoker?.click();
      const isDropdownVisible = () =>
        el
          ?.querySelector('lion-select-rich')
          ?.shadowRoot?.querySelector('dialog')
          ?.checkVisibility();
      await waitUntil(isDropdownVisible);
      await sendKeys({
        press: 'Escape',
      });
      const isDialogVisible = () => el?.shadowRoot?.querySelector('dialog')?.checkVisibility();
      expect(isDropdownVisible()).to.equal(false);
      expect(isDialogVisible()).to.equal(true);
      await sendKeys({
        press: 'Escape',
      });
      expect(isDropdownVisible()).to.equal(false);
      expect(isDialogVisible()).to.equal(false);
    });
  });

  describe('lion-tooltip integration', () => {
    it('should close lion-tooltip on first Escape and should close the parent lion-dialog on the second Escape', async () => {
      const el = await fixture(html`
        <lion-dialog has-close-button>
          <lion-button slot="invoker" class="dialog-invoker">Open Dialog</lion-button>
          <div slot="header">Tooltip example</div>
          <div slot="content">
            <lion-tooltip has-arrow>
              <button slot="invoker" class="demo-tooltip-invoker">Focus on me</button>
              <div slot="content">This is a tooltip</div>
            </lion-tooltip>
          </div>
        </lion-dialog>
      `);

      await el.updateComplete;
      const dialogInvoker = /** @type {HTMLElement} */ (el.querySelector('.dialog-invoker'));
      dialogInvoker.click();
      const tooltip = /** @type {HTMLElement} */ el.querySelector('lion-tooltip');
      const isTooltipRendered = () => !!tooltip?.shadowRoot?.childNodes.length;
      await waitUntil(isTooltipRendered);
      const tooltipButton = /** @type {HTMLElement} */ el.querySelector('.demo-tooltip-invoker');
      tooltipButton?.focus();
      const getTooltipContent = () =>
        el
          .querySelector('lion-tooltip')
          ?.shadowRoot?.querySelector('#overlay-content-node-wrapper');
      const isTooltipContentVisible = () => getTooltipContent()?.checkVisibility();
      await waitUntil(isTooltipContentVisible);
      await sendKeys({
        press: 'Escape',
      });
      const isDialogVisible = () => el?.shadowRoot?.querySelector('dialog')?.checkVisibility();
      expect(isTooltipContentVisible()).to.equal(false);
      expect(isDialogVisible()).to.equal(true);
      await sendKeys({
        press: 'Escape',
      });
      expect(isTooltipContentVisible()).to.equal(false);
      expect(isDialogVisible()).to.equal(false);
    });
  });
});
