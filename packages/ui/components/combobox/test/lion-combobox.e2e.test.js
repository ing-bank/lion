import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const currentFileRelativePath = import.meta.url.split(process.env.PWD)[1];
const currentDirRelativePath = path.dirname(currentFileRelativePath);

/**
 * Converts a test name into a kebab string which is going to be used for the use case file name
 * @param {string} name 
 */
const convertName = (name) => name.replace(/([^a-z0-9]+)/gi, '-');

/**
 * Converts the test name into kebab string and use it as a file name for the use case to navigate to.
 * Note, make sure the file with such a name is created manually and contains the use case.
 */
const goToPage = async (page, testInfo) => {
  const descriptionAndTestNames = testInfo.titlePath.slice(1).join('-');
  const useCaseFileName = convertName(descriptionAndTestNames);
  const useCaseFileRelativePath = `./e2e-use-cases/${useCaseFileName}.js`;
  await fs.promises.readFile(path.resolve(path.dirname(import.meta.url.split('file://')[1]), useCaseFileRelativePath))
    .catch((er) => {
      console.log('er: ', er);
      throw Error(`The file name for the use case that matches the test name does not exit. Create it manually by the path: ${useCaseFileRelativePath}`);
    });
  await page.goto(`http://localhost:8005/?js=${currentDirRelativePath}/e2e-use-cases/${useCaseFileName}.js`);
};
  

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

