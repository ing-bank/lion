
## e2e architecture

e2e tests are the tests written in Playwright API. The tests run agains the app running in the broswer. 
We do not use the Lion portal for that. Instead a separate app is running for the tests execution.

### Web app runtime for tests

`Web dev server` is used to host the web app for the tests. Here are the files involved in the server setup:

- Configuration file: `web-dev-srver.config.mjs`
- App index page: `index-e2e.html`

By running `npm run e2e-app:start` the web dev server run the app and navigates to `index-e2e.html`.
By default the page does not render any components. To render a user case for a particular test, the page listens for the `js` URL parameter. When the `js` URL parameter is the path to the use case file, it renders the use case for a particular component. 
Creation the use case file is covered in the section down below. Here is an example of the URL that renders the use case for a combobox component:
`http://localhost:8005/?js=/packages/ui/components/combobox/test/index-e2e.js`

### Playwrite configuration

`playwright.config.ts` define the configuration for Playwright. Its `webServer` property specifies that before running the tests, it runs the dev server by the command provided in the `command` property. Its `reuseExistingServer` is set to `true` which means it will run the dev server if it is down and it will reuse the dev server if it is already up.


## How to write an e2e test for a component

### Create a component use case

- In the component directory create a file with the name `index-e2e.js`, f.e. `packages/ui/components/combobox/test/index-e2e.js`
- In that file create a use case for the component. The code is going to be run in the browser at runtime. The use case is the same as
`js preview-story` in `md` files.
- You could run or debug example in the browser by running `npm run e2e-app:start` and then navigating to `http://localhost:8005/?js=${index-e2e.js-path}` where `${index-e2e.js-path}` is the path to the `index-e2e.js` file, f.e.: `http://localhost:8005/?js=/packages/ui/components/combobox/test/index-e2e.js`
- The final thing of writing a use case code is to injecting it to the page as follows:
    ```
    render(template(), document.querySelector('e2e-root'));
    ```
    where `template()` is a funtion that returns the html template to render, `'e2e-root'` is the predefined tag name to inject to. 

### Write an e2e test

- In the component directory create a file with the extension that matches `*.e2e.test.js`, f.e. `packages/ui/components/combobox/test/lion-combobox.e2e.test.js`
- Use Playwright API for writing the tests
- The first step for any test is to navigate to the component use case URL. The code for that is as follows:
    ```
    const currentFileRelativePath = import.meta.url.split(process.env.PWD)[1];
    const currentDirRelativePath = path.dirname(currentFileRelativePath);
    await page.goto(`http://localhost:8005/?js=${currentDirRelativePath}/index-e2e.js`);
    ```
    Note, check `packages/ui/components/combobox/test/lion-combobox.e2e.test.js` as a reference implementation.
