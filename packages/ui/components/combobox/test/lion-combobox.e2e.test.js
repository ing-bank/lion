import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(import.meta.url);

/**
 * Read the current file and fetch all dynamic import dependencies using regex.
 * TODO use AST instead of regex
 */
const fetchAllTestsDependencies = async () => {
  const currentFile = (await fs.promises.readFile(__dirname)).toString();  
  const importRegexp = /import\((.+)\)/gm;
  const matches = [...currentFile.matchAll(importRegexp)];
  const dependencies = matches.map(arrayItem => {
    const dependency = arrayItem[1];
    return dependency.replace(/['"]+/g, '');
  });
  return dependencies;
}

/**
 * Generates importMap with all the dependencies in the tests in this file and returns importMap as a string
 */
const getImportMap = async () => {
  const dependencies = await fetchAllTestsDependencies();
  const importMapObject = {
    imports: {}
  };
  dependencies.forEach(dependency => {
    importMapObject.imports[dependency] = import.meta.resolve(dependency).split(process.env.PWD)[1];
  });
  return JSON.stringify(importMapObject);
};

const goToPage = async (page) => {
  await page.goto(`http://localhost:8005/?importMap=${await getImportMap()}`);
} 

test.describe('lion-combobox', () => {
  test.skip('Combobox does not flash the menu when _showOverlayCondition returns "false"', async ({ page }, testInfo) => {      
    await goToPage(page, testInfo);  
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

  test("doesn't select any similar options after using delete when requireOptionMatch is false", async ({ page }, testInfo) => {
    await goToPage(page, testInfo);
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

  test.only("Test inline script execution", async ({ page }, testInfo) => {    
    await goToPage(page);
    await page.evaluate(async () => {
      const { html, render } = await import('lit');
      const { Required } = await import('@lion/ui/form-core.js');      
      await import('@lion/ui/define/lion-combobox.js');
      await import('@lion/ui/define/lion-option.js');      
      const { loadDefaultFeedbackMessages } = await import('@lion/ui/validate-messages.js');      
      loadDefaultFeedbackMessages();

      const template = () =>
        html` 
          <lion-combobox name="foo" .validators=${[new Required()]}>
            <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
            <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
            <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
            <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
          </lion-combobox>
        `;

      render(template(), document.querySelector('e2e-root'));
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
    
    expect(await combobox.evaluate((el) => el.checkedIndex)).toEqual(-1);
    expect(await combobox.evaluate((el) => el.modelValue)).toEqual('Art');
    expect(await combobox.evaluate((el) => el.value)).toEqual('Art');
  });

  test('allows new options when multi-choice when requireOptionMatch=false and autocomplete="both", when deleting autocomplete values using Backspace', async ({ page }, testInfo) => {
    await goToPage(page, testInfo);
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

  test('hides listbox on click/enter (when multiple-choice is false)', async ({ page }, testInfo) => {
    await goToPage(page, testInfo);
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

