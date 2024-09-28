import { test, expect } from '@playwright/test';
import * as path from 'path';

const currentFileRelativePath = import.meta.url.split(process.env.PWD)[1];
const currentDirRelativePath = path.dirname(currentFileRelativePath);

test.describe('lion-combobox', () => {
  test('Combobox does not flash the menu when _showOverlayCondition returns "false"', async ({ page }) => {    
    await page.goto(`http://localhost:8005/?js=${currentDirRelativePath}/e2e-use-cases/no-dropdown-flash.js`);
  
    const input = await page.locator('css=input');  
    await input.focus();
  
    await page.evaluate(() => {
      const config = {
        /**
         * hasDropdownFlashed is `true` if the menu was shown for a short period of time and then got closed
         */
        hasDropdownFlashed: false,
        observer: null
      };
      const dialog = document.querySelector('complex-combobox').shadowRoot.querySelector('dialog');
      config.observer = new MutationObserver((mutationList) => {
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

  test("doesn't select any similar options after using delete when requireOptionMatch is false", async ({ page }) => {
    await page.goto(`http://localhost:8005/?js=${currentDirRelativePath}/e2e-use-cases/combobox-e2e-test-2.js`);
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
    
    expect(await combobox.evaluate((el) => el.checkedIndex)).toEqual(-1);
    expect(await combobox.evaluate((el) => el.modelValue)).toEqual('Art');
    expect(await combobox.evaluate((el) => el.value)).toEqual('Art');
  });

  test('allows new options when multi-choice when requireOptionMatch=false and autocomplete="both", when deleting autocomplete values using Backspace', async ({ page }) => {
    await page.goto(`http://localhost:8005/?js=${currentDirRelativePath}/e2e-use-cases/combobox-e2e-test1.js`);
    const combobox = await page.locator('lion-combobox');
    const input = await page.locator('css=input');  
    await input.focus();
    await page.keyboard.type('a');  
    await page.keyboard.type('r');  
    await page.keyboard.type('t');  
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');
    
    expect(await combobox.evaluate((el) => el.modelValue)).toEqual(['Art']);
  });

  test.only('hides listbox on click/enter (when multiple-choice is false)', async ({ page }) => {
    await page.goto(`http://localhost:8005/?js=${currentDirRelativePath}/e2e-use-cases/combobox-e2e-test-3.js`);
    const combobox = await page.locator('lion-combobox');
    const lionOptions = await page.locator('lion-options');
    const input = await page.locator('css=input');  
    await input.focus();

    async function open() {
      await input.fill('ch');
    }

    await open();
    expect(await combobox.evaluate((el) => el.opened)).toEqual(true);
    const firstVisibleOption = await page.$("lion-option >> visible=true");
    await firstVisibleOption?.click();
    expect(await combobox.evaluate((el) => el.opened)).toEqual(false);    
    await open();
    expect(await combobox.evaluate((el) => el.opened)).toEqual(true);    
    const allOptions = await page.locator("lion-option").all();
    const index = allOptions.indexOf(await page.locator("lion-option >> visible=true"));
    await combobox.evaluate((el, index) => el.activeIndex = index, index);
    await page.keyboard.press('Enter');
    expect(await combobox.evaluate((el) => el.opened)).toEqual(false);    
   });
});

