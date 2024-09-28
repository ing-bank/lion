import { test, expect } from '@playwright/test';

test('Combobox does not flash the menu when _showOverlayCondition returns "false"', async ({ page }) => {
  await page.goto('http://localhost:8005/tests?js=/packages/ui/components/combobox/test/index-e2e.js');

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