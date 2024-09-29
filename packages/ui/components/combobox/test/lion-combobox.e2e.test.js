import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const currentFileRelativePath = import.meta.url.split(process.env.PWD)[1];
const currentDirRelativePath = path.dirname(currentFileRelativePath);

console.log('import.meta.resolve() 1: ', import.meta.resolve('lit'));
console.log('import.meta.resolve() 2: ', import.meta.resolve('@lion/ui/form-core.js'));
console.log('import.meta.resolve() 3: ', import.meta.resolve('@lion/ui/define/lion-combobox.js'));
console.log('import.meta.resolve() 4: ', import.meta.resolve('@lion/ui/define/lion-option.js'));
console.log('import.meta.resolve() 5: ', import.meta.resolve('@lion/ui/validate-messages.js'));

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

  test.only("Test inline script execution", async ({ page }, testInfo) => {
    const importMap = {
      imports: {
        'lit': './../../../../node_modules/lit/index.js',
        '@lion/ui/form-core.js': './../../../../exports/form-core.js',
        '@lion/ui/define/lion-combobox.js': './../../../../exports/define/lion-combobox.js',
        '@lion/ui/define/lion-option.js': './../../../../exports/define/lion-option.js',
        '@lion/ui/validate-messages.js': './../../../../exports/validate-messages.js'
      }
    };
    const importMapString = JSON.stringify(importMap);
    //await page.goto(`http://localhost:8005/?importMap=${importMapString}`);
    await page.goto(`http://localhost:8005`);

    await page.evaluate(async () => {
      // const importMap = {
      //   imports: {
      //     'lit': './../../../../node_modules/lit/index.js',
      //     '@lion/ui/form-core.js': './../../../../exports/form-core.js',
      //     '@lion/ui/define/lion-combobox.js': './../../../../exports/define/lion-combobox.js',
      //     '@lion/ui/define/lion-option.js': './../../../../exports/define/lion-option.js',
      //     '@lion/ui/validate-messages.js': './../../../../exports/validate-messages.js'
      //   }
      // };
      // const importmap = document.createElement("script");
      // importmap.type = "importmap";
      // importmap.textContent = JSON.stringify(importMap);      
      //document.currentScript.after(importmap);

      // const { html, render } = await import('lit');
      // const { Required } = await import('@lion/ui/form-core.js');      
      // await import('@lion/ui/define/lion-combobox.js');
      // await import ('@lion/ui/define/lion-option.js');      
      // const { loadDefaultFeedbackMessages } = await import('@lion/ui/validate-messages.js');

      // const { html, render } = await import('./../../../node_modules/lit/index.js');
      // const { Required } = await import('./../../../exports/form-core.js');
      // await import('./../../../exports/define/lion-combobox.js');
      // await import('./../../../exports/define/lion-option.js');
      // const { loadDefaultFeedbackMessages } = await import('./../../../exports/validate-messages.js');

      const { html, render } = await import('/packages/ui/node_modules/lit/index.js');
      const { Required } = await import('/packages/ui/exports/form-core.js');
      await import('/packages/ui/exports/define/lion-combobox.js');
      await import('/packages/ui/exports/define/lion-option.js');
      const { loadDefaultFeedbackMessages } = await import('/packages/ui/exports/validate-messages.js');

      // import { html, render } from './../../../../node_modules/lit/index.js';
      // import { Required } from './../../../../exports/form-core.js';
      // import './../../../../exports/define/lion-combobox.js';
      // import './../../../../exports/define/lion-option.js';
      // import { loadDefaultFeedbackMessages } from './../../../../exports/validate-messages.js';
      
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

    await page.evaluate(async () => {
      // const importMap = {
      //   imports: {
      //     'lit': './../../../../node_modules/lit/index.js',
      //     '@lion/ui/form-core.js': './../../../../exports/form-core.js',
      //     '@lion/ui/define/lion-combobox.js': './../../../../exports/define/lion-combobox.js',
      //     '@lion/ui/define/lion-option.js': './../../../../exports/define/lion-option.js',
      //     '@lion/ui/validate-messages.js': './../../../../exports/validate-messages.js'
      //   }
      // };
      // const importmap = document.createElement("script");
      // importmap.type = "importmap";
      // importmap.textContent = JSON.stringify(importMap);      
      //document.currentScript.after(importmap);

      // const { html, render } = await import('lit');
      // const { Required } = await import('@lion/ui/form-core.js');      
      // await import('@lion/ui/define/lion-combobox.js');
      // await import ('@lion/ui/define/lion-option.js');      
      // const { loadDefaultFeedbackMessages } = await import('@lion/ui/validate-messages.js');

      // import { html, render } from './../../../../node_modules/lit/index.js';
      // import { Required } from './../../../../exports/form-core.js';
      // import './../../../../exports/define/lion-combobox.js';
      // import './../../../../exports/define/lion-option.js';
      // import { loadDefaultFeedbackMessages } from './../../../../exports/validate-messages.js';
      
      //loadDefaultFeedbackMessages();

      // const template = () =>
      //   html` 
      //     <lion-combobox name="foo" .validators=${[new Required()]}>
      //       <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
      //       <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
      //       <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
      //       <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
      //     </lion-combobox>
      //   `;

      //render(template(), document.querySelector('e2e-root'));

    });

    //await goToPage(page, testInfo);
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

