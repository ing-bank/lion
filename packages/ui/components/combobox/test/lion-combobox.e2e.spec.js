import { test, expect } from '@playwright/test';
import { goToPage } from '../../../../../e2e/helper.mjs';

test.describe('lion-combobox', () => {
  // TODO Fix the lion source code
  test.skip('Combobox does not flash the menu when _showOverlayCondition returns "false"', async ({
    page,
  }) => {
    await goToPage(page, import.meta);
    await page.evaluate(async () => {
      const { html, render } = await import('lit');
      await import('@lion/ui/define/lion-combobox.js');
      await import('@lion/ui/define/lion-option.js');
      const { LionCombobox } = await import('@lion/ui/combobox.js');
      const { listboxComplexData } = await import(
        '../../../../../docs/components/listbox/src/listboxData.js'
      );
      const { lazyRender } = await import(
        '../../../../../docs/components/combobox/src/lazyRender.js'
      );
      const { loadDefaultFeedbackMessages } = await import('@lion/ui/validate-messages.js');
      loadDefaultFeedbackMessages();

      class ComplexCombobox extends LionCombobox {
        _showOverlayCondition(options) {
          /**
           * Do now show dropdown until 3 symbols are typed
           * @override
           */
          // @ts-ignore
          return this.__prevCboxValueNonSelected.length > 3 && super._showOverlayCondition(options);
        }
      }

      customElements.define('complex-combobox', ComplexCombobox);

      const template = () =>
        html` <complex-combobox name="combo" label="Display only the label once selected">
          ${lazyRender(
            listboxComplexData.map(
              entry => html`
                <lion-option .choiceValue="${entry.label}">
                  <div data-key>${entry.label}</div>
                  <small>${entry.description}</small>
                </lion-option>
              `,
            ),
          )}
        </complex-combobox>`;

      render(template(), document.body);
    });

    const input = await page.locator('css=input');
    await input.focus();

    await page.evaluate(() => {
      const config = {
        /**
         * hasDropdownFlashed is `true` if the menu was shown for a short period of time and then got closed
         */
        hasDropdownFlashed: false,
        observer: null,
      };
      const dialog = document.querySelector('complex-combobox').shadowRoot.querySelector('dialog');
      config.observer = new MutationObserver(mutationList => {
        // eslint-disable-next-line no-unused-vars
        for (const mutation of mutationList) {
          if (dialog.style.display === '') {
            config.hasDropdownFlashed = true;
          }
        }
      });
      config.observer.observe(dialog, { attributeFilter: ['style'] });
      document.config = config;
    });

    await page.keyboard.type('a');
    await page.keyboard.type('r');
    await page.keyboard.type('t');
    await page.keyboard.press('Backspace');

    const hasDropdownFlashed = await page.evaluate(() => {
      document.config.observer.disconnect();
      return document.config.hasDropdownFlashed;
    });

    expect(hasDropdownFlashed).toBeFalsy();
  });

  test("doesn't select any similar options after using delete when requireOptionMatch is false", async ({
    page,
  }) => {
    await goToPage(page, import.meta);
    await page.evaluate(async () => {
      const { html, render } = await import('lit');
      const { Required } = await import('@lion/ui/form-core.js');
      await import('@lion/ui/define/lion-combobox.js');
      await import('@lion/ui/define/lion-option.js');
      const { loadDefaultFeedbackMessages } = await import('@lion/ui/validate-messages.js');
      loadDefaultFeedbackMessages();

      const template = () => html`
        <lion-combobox name="foo" .validators=${[new Required()]}>
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `;

      render(template(), document.body);
    });

    await page.evaluate(() => {
      const comboboxEl = document.querySelector('lion-combobox');
      comboboxEl.requireOptionMatch = false;
    });

    const combobox = await page.locator('lion-combobox');
    const input = await page.locator('css=input');
    await input.focus();
    await page.keyboard.type('a');
    await page.keyboard.type('r');
    await page.keyboard.type('t');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');

    expect(await combobox.evaluate(el => el.checkedIndex)).toEqual(-1);
    expect(await combobox.evaluate(el => el.modelValue)).toEqual('Art');
    expect(await combobox.evaluate(el => el.value)).toEqual('Art');
  });

  test('allows new options when multi-choice when requireOptionMatch=false and autocomplete="both", when deleting autocomplete values using Backspace', async ({
    page,
  }) => {
    await goToPage(page, import.meta);
    await page.evaluate(async () => {
      const { html, render } = await import('lit');
      await import('@lion/ui/define/lion-combobox.js');
      await import('@lion/ui/define/lion-option.js');
      const { loadDefaultFeedbackMessages } = await import('@lion/ui/validate-messages.js');
      loadDefaultFeedbackMessages();

      const template = () => html`
        <lion-combobox name="foo" multiple-choice .requireOptionMatch=${false} autocomplete="both">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `;

      render(template(), document.body);
    });

    const combobox = await page.locator('lion-combobox');
    const input = await page.locator('css=input');
    await input.focus();
    await page.keyboard.type('a');
    await page.keyboard.type('r');
    await page.keyboard.type('t');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');

    expect(await combobox.evaluate(el => el.modelValue)).toEqual(['Art']);
  });

  test('hides listbox on click/enter (when multiple-choice is false)', async ({ page }) => {
    await goToPage(page, import.meta);
    await page.evaluate(async () => {
      const { html, render } = await import('lit');
      await import('@lion/ui/define/lion-combobox.js');
      await import('@lion/ui/define/lion-option.js');
      const { loadDefaultFeedbackMessages } = await import('@lion/ui/validate-messages.js');

      loadDefaultFeedbackMessages();

      const template = () => html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `;

      render(template(), document.body);
    });

    const combobox = await page.locator('lion-combobox');
    const input = await page.locator('css=input');
    await input.focus();

    async function open() {
      await input.fill('ch');
    }

    await open();
    expect(await combobox.evaluate(el => el.opened)).toEqual(true);
    const firstVisibleOption = await page.$('lion-option >> visible=true');
    await firstVisibleOption?.click();
    expect(await combobox.evaluate(el => el.opened)).toEqual(false);
    await open();
    expect(await combobox.evaluate(el => el.opened)).toEqual(true);
    const allOptions = await page.locator('lion-option').all();
    const index = allOptions.indexOf(await page.locator('lion-option >> visible=true'));
    // eslint-disable-next-line
    await combobox.evaluate((el, indexValue) => (el.activeIndex = indexValue), index);
    await page.keyboard.press('Enter');
    expect(await combobox.evaluate(el => el.opened)).toEqual(false);
  });
});