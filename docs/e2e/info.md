## e2e architecture

e2e tests are the tests written in Playwright API. The tests run agains the app running in the broswer.
We do not use the Lion portal for that. Instead a separate app is running for the tests execution.

### Web app runtime

`Web dev server` is used to host the web app for the tests. Here are the files involved in the server setup:

- Configuration file: `web-dev-srver.config.mjs`
- App index page: `index-e2e.html`

By running `npm run e2e-app:start` the web dev server runs the app and navigates to the default `index-e2e.html`.

### Playwrite configuration

`playwright.config.ts` defines the configuration for Playwright. Its `webServer` property specifies that before running the tests, it runs the web dev server by the command provided in the `command` property. Its `reuseExistingServer` is set to `true` which means it runs the web dev server if it is down and it reuses the web dev server if it is already up.

### How Playwrigth runs the use cases

Every e2e tests consists of two parts:

1. The use case code which runs at the browser side at runtime
2. The actual test code

#### The use code

The use case code is the code that we usually specify in `js script` and `js preview-story` blocks of the documentation `md` files.
The only difference is that we need to use dynamic imports instead of static ones. To run the use case code at the browser side it should be wrapped in `page.evaluate` function. For the reference, see the code snipped down below or check out `packages/ui/components/combobox/test/lion-combobox.e2e.spec.js`.

#### Actual test code

After the use case is defined, the actual test code comes written in Playwright API

### How Playwright tests are executed in a browser

Evevery Playwrigth test should start with calling `goToPage` function. That function navigates the browser to the web dev server default page `index-e2e.html`. The URL used for the navigation also includes the `importMap` URL parameter. The parameter value is calculated once before running any tests. It reads the current e2e test file, extracts all values of the dynamic imports and creates the `importMap` string representation. When navigating to `index-e2e.html`, `importMap` is dynamically inserted into the document at runtime. ImportMap is required because web-dev-server does not resolve dependencies at runtime when the code is wrapped by `page.evaluate` function.

## How to write an e2e test for a component

- In the component directory create a file with the extension that matches `*.e2e.spec.js`. Note if using `*.e2e.test.js` instead of `*.e2e.spec.js` pattern, then `prettier` replaces the relative paths in dynamic imports with `@lion/root` and `import.meta.resolve` cannot resolve it. 
- Use this boilerplate code for an e2e test file:

  ```javascript
  import { test, expect } from '@playwright/test';
  import { goToPage } from '../../../../../e2e/helper.mjs';  

  test.describe('lion-combobox', () => {
    test('Combobox renders', async ({ page }, testInfo) => {
      await goToPage(page, import.meta);
      // Use case
      await page.evaluate(async () => {
        // use case code here
      });

      // actual test code here
    });
  });
  ```

- The first step for any test is to navigate to the server default URL. It should be done by calling `await goToPage(page, import.meta);`
- Provide a use case code in a `await page.evaluate` wrapper. Note, static imports cannot be used an dynamic imports are only allowed.
- Use Playwright API for writing the actual e2e test

## Run e2e tests

- `npm run test:e2e` - run the e2e tests in the headless mode
- `npm run test:e2e:debug` - run the e2e tests in the debug mode
