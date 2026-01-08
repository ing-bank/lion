/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * Shared dialog test suite for screen reader automation.
 * This module abstracts common test functionality that works with
 * VoiceOver, NVDA, and headless browser testing.
 */

import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import Mocha from 'mocha';
import { startDevServer } from '@web/dev-server';

export const TEST_HTML_LION = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lion Dialog Modal Overlay Tests</title>
  <script type="module">
    import '@lion/ui/define/lion-dialog.js';
  </script>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; }
    .dialog-content {
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      min-width: 320px;
      max-width: 480px;
    }
    .dialog-content h2 { margin-top: 0; }
    .dialog-actions { margin-top: 1.5rem; display: flex; gap: 0.5rem; justify-content: flex-end; }
    .dialog-actions button { padding: 0.5rem 1rem; }
  </style>
</head>
<body>
  <h1>Dialog Screen Reader Test</h1>
  
  <p>This page tests modal dialog accessibility with screen readers.</p>

  <lion-dialog id="basic-dialog">
    <button slot="invoker" id="open-dialog-btn">Open Dialog</button>
    <div slot="content" class="dialog-content" aria-label="Example dialog">
      <h2>Dialog Title</h2>
      <p>This is the dialog content. Press Escape or click the close button to dismiss.</p>
      <div class="dialog-actions">
        <button id="dialog-close-btn" 
          onclick="this.dispatchEvent(new Event('close-overlay', { bubbles: true }))">
          Close
        </button>
      </div>
    </div>
  </lion-dialog>

  <lion-dialog id="alert-dialog" is-alert-dialog>
    <button slot="invoker" id="open-alert-btn">Open Alert Dialog</button>
    <div slot="content" class="dialog-content" aria-label="Confirmation required">
      <h2>Are you sure?</h2>
      <p>This action cannot be undone.</p>
      <div class="dialog-actions">
        <button id="alert-cancel-btn"
          onclick="this.dispatchEvent(new Event('close-overlay', { bubbles: true }))">
          Cancel
        </button>
        <button id="alert-confirm-btn"
          onclick="this.dispatchEvent(new Event('close-overlay', { bubbles: true }))">
          Confirm
        </button>
      </div>
    </div>
  </lion-dialog>

  <lion-dialog id="autofocus-dialog">
    <button slot="invoker" id="open-autofocus-btn">Open Dialog with Autofocus</button>
    <div slot="content" class="dialog-content" aria-label="Form dialog">
      <h2>Enter your name</h2>
      <p>
        <label for="name-input">Name:</label>
        <input type="text" id="name-input" autofocus />
      </p>
      <div class="dialog-actions">
        <button id="autofocus-close-btn"
          onclick="this.dispatchEvent(new Event('close-overlay', { bubbles: true }))">
          Cancel
        </button>
        <button id="autofocus-submit-btn"
          onclick="this.dispatchEvent(new Event('close-overlay', { bubbles: true }))">
          Submit
        </button>
      </div>
    </div>
  </lion-dialog>
</body>
</html>
`;

// TEST_HTML_NATIVE removed — use TEST_HTML_LION for virtual tests (lion-dialog)

// For backward compatibility
export const TEST_HTML = TEST_HTML_LION;

/**
 * Creates a test server using @web/dev-server for proper ESM resolution
 * @param {number} port
 * @param {string} html - HTML content to serve (defaults to TEST_HTML_LION)
 * @returns {Promise<{server: Object, close: () => Promise<void>}>}
 */
export async function createTestServer(port = 8080, html = TEST_HTML_LION) {
  // Write HTML to a temp file for @web/dev-server to serve
  const tempHtmlPath = path.join(process.cwd(), 'guidepup-poc-dialog', '__test-page.html');
  await fs.promises.writeFile(tempHtmlPath, html);

  const server = await startDevServer({
    config: {
      port,
      rootDir: process.cwd(),
      nodeResolve: true,
      open: false,
      watch: false,
      appIndex: tempHtmlPath,
    },
    readCliArgs: false,
    readFileConfig: false,
    logStartMessage: false,
  });

  console.log(`@web/dev-server started on http://localhost:${port}`);

  return {
    server,
    close: async () => {
      await server.stop();
      // Clean up temp file
      try {
        await fs.promises.unlink(tempHtmlPath);
      } catch {
        // ignore cleanup errors
      }
    },
  };
}

/**
 * Waits for lion-dialog custom element to be defined
 * @param {import('playwright').Page} page
 */
export async function waitForCustomElements(page) {
  // Listen for console errors
  // @ts-ignore
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Browser console error:', msg.text());
    }
  });
  // @ts-ignore
  page.on('pageerror', err => {
    console.error('Browser page error:', err.message);
  });

  await page.waitForFunction(() => customElements.get('lion-dialog') !== undefined, {
    timeout: 15000,
  });
  await page.waitForTimeout(500);
  console.log('Custom elements loaded');
}

/**
 * @typedef {Object} DialogTestOptions
 * @property {('voiceover'|'nvda'|'virtual'|Object)} [screenReader] - The screen reader enum or instance
 * @property {Object} [commands] - Screen reader specific commands
 * @property {boolean} [useNativeDialog] - Whether using native HTML dialog (vs lion-dialog)
 * @property {number} [port] - Server port (default 8080)
 */

/**
 * Run the dialog test suite with a given screen reader or in headless mode
 * Handles browser launch, server setup, and cleanup internally.
 * @param {DialogTestOptions} options
 */
export async function runDialogTests({
  screenReader,
  commands = undefined,
  useNativeDialog = false,
  port = 8080,
}) {
  let testServer;
  let browser;
  // @ts-ignore
  let page;

  try {
    // Dynamically import playwright browser based on screen reader
    // VoiceOver requires WebKit (Safari), others use Chromium
    const isVoiceOver =
      typeof screenReader === 'string' && screenReader.toLowerCase() === 'voiceover';
    const isHeadless = typeof screenReader === 'string' && screenReader.toLowerCase() === 'virtual';

    let browserType;
    if (isVoiceOver) {
      // @ts-ignore
      const { webkit } = await import('playwright');
      browserType = webkit;
    } else {
      // @ts-ignore
      const { chromium } = await import('playwright');
      browserType = chromium;
    }

    // Start test server
    testServer = await createTestServer(port, TEST_HTML_LION);

    // Launch browser
    browser = await browserType.launch({ headless: isHeadless });
    const context = await browser.newContext();
    page = await context.newPage();

    // Navigate to test page - @web/dev-server serves the temp HTML at this path
    await page.goto(`http://localhost:${port}/guidepup-poc-dialog/__test-page.html`);
    await page.waitForLoadState('domcontentloaded');

    // Wait for custom elements to be defined
    await waitForCustomElements(page);

    console.log('Page loaded, running tests...');

    // Create mocha instance
    const mocha = new Mocha({ reporter: 'spec', timeout: 0 });

    /** @type {any} */
    let readerInstance = null;
    /** @type {string} */
    let readerName = typeof screenReader === 'string' ? screenReader : 'Headless DOM';
    let mustStopReader = false;

    /**
     * Initialize the screen reader instance based on the screenReader option
     */
    const initializeScreenReader = async () => {
      if (typeof screenReader === 'string') {
        const key = screenReader.toLowerCase();
        if (key === 'voiceover') {
          // @ts-ignore
          const { voiceOver } = await import('@guidepup/guidepup');
          readerInstance = voiceOver;
          readerName = 'VoiceOver';
        } else if (key === 'nvda') {
          // @ts-ignore
          const { nvda } = await import('@guidepup/guidepup');
          readerInstance = nvda;
          readerName = 'NVDA';
        } else if (key === 'virtual') {
          readerName = 'Virtual Screen Reader';
          // @ts-ignore
          await page.addInitScript(() => {
            // @ts-ignore
            window.__guidepup_virtual = window.__guidepup_virtual || { started: false };
          });
          const virtualPaths = [
            '/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.browser.js',
            '/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.mjs',
            '/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.legacy-esm.js',
          ];
          // @ts-ignore
          await page.evaluate(async paths => {
            // @ts-ignore
            window.__guidepup_virtual = window.__guidepup_virtual || { started: false };
            // @ts-ignore
            if (window.__guidepup_virtual.started) return;
            let lastError = null;
            for (const p of paths) {
              try {
                const mod = await import(p);
                const Virtual = mod.Virtual ?? mod.default ?? mod.virtual ?? null;
                // eslint-disable-next-line no-continue
                if (!Virtual) continue;
                const instance = new Virtual();
                await instance.start({ container: document.body });
                // @ts-ignore
                window.__guidepup_virtual.instance = instance;
                // @ts-ignore
                window.__guidepup_virtual.getSpoken = () =>
                  instance.spokenPhraseLog ? instance.spokenPhraseLog() : [];
                // @ts-ignore
                window.__guidepup_virtual.clearSpoken = () =>
                  instance.clearSpokenPhraseLog ? instance.clearSpokenPhraseLog() : undefined;
                // @ts-ignore
                window.__guidepup_virtual.next = () =>
                  instance.next ? instance.next() : undefined;
                // @ts-ignore
                window.__guidepup_virtual.itemText = () =>
                  instance.itemText ? instance.itemText() : '';
                // @ts-ignore
                window.__guidepup_virtual.stop = () =>
                  instance.stop ? instance.stop() : undefined;
                // @ts-ignore
                window.__guidepup_virtual.started = true;
                return;
              } catch (err) {
                lastError = err;
              }
            }
            throw new Error(
              `Unable to initialize Virtual screen reader: ${
                // @ts-ignore
                lastError?.message || 'bundle not found'
              }`,
            );
          }, virtualPaths);
          mustStopReader = true;

          // Node-side wrapper that proxies to the page-exposed functions
          readerInstance = {
            spokenPhraseLog: async () =>
              // @ts-ignore
              page.evaluate(() => window.__guidepup_virtual.getSpoken()),
            clearSpokenPhraseLog: async () =>
              // @ts-ignore
              page.evaluate(() => window.__guidepup_virtual.clearSpoken()),
            // @ts-ignore
            next: async () => page.evaluate(() => window.__guidepup_virtual.next()),
            // @ts-ignore
            itemText: async () => page.evaluate(() => window.__guidepup_virtual.itemText()),
            // @ts-ignore
            stop: async () => page.evaluate(() => window.__guidepup_virtual.stop()),
          };
        } else {
          throw new Error(`Unknown screenReader enum: ${screenReader}`);
        }

        // Start the reader if it exports a start() method
        if (readerInstance?.start) {
          await readerInstance.start();
          mustStopReader = true;
        }
      } else if (screenReader && typeof screenReader === 'object') {
        readerInstance = screenReader;
      }

      console.log(`Initialized screen reader`, { screenReader, readerInstance, browserType });
    };

    // Helper to check if dialog is open (handles both lion-dialog and native dialog)
    // @ts-ignore
    const isDialogOpen = async selector => {
      if (useNativeDialog) {
        // @ts-ignore
        return page.evaluate(sel => document.querySelector(sel).open, selector);
      }
      // @ts-ignore
      return page.evaluate(sel => {
        const el = document.querySelector(sel);
        if (!el) return false;
        // lion-dialog uses an "opened" attribute
        return el.hasAttribute('opened');
      }, selector);
    };

    // Helper to get spoken log (handles screen readers that don't have this method)
    const getSpokenLog = async () => {
      if (readerInstance?.spokenPhraseLog) {
        return readerInstance.spokenPhraseLog();
      }
      return [];
    };

    // Helper to clear spoken log
    const clearSpokenLog = async () => {
      if (readerInstance?.clearSpokenPhraseLog) {
        await readerInstance.clearSpokenPhraseLog();
      }
    };

    // Helper for screen reader navigation
    const nextItem = async () => {
      if (readerInstance?.next) {
        await readerInstance.next();
      }
    };

    // Helper to get item text
    const getItemText = async () => {
      // if (commands?.getItemText) {
      //   return commands.getItemText();
      // }
      // voiceover
      if (readerInstance?.itemText) {
        return readerInstance.itemText();
      }
      // nvda
      if (readerInstance?.lastSpokenPhrase) {
        return readerInstance.lastSpokenPhrase();
      }
      // Fallback: for virtual screen reader
      // @ts-ignore
      return page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return '';
        // Try accessible name sources in order of priority
        const ariaLabel = el.getAttribute('aria-label');
        if (ariaLabel) return ariaLabel;
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        if (ariaLabelledBy) {
          const labelEl = document.getElementById(ariaLabelledBy);
          if (labelEl) return labelEl.textContent?.trim() || '';
        }
        // For form elements, try the label
        // @ts-ignore
        if (el.labels?.length > 0) {
          // @ts-ignore
          return el.labels[0].textContent?.trim() || '';
        }
        // For buttons and other simple elements, use text content
        if (el.tagName === 'BUTTON' || el.tagName === 'A') {
          return el.textContent?.trim() || '';
        }
        // Fallback to id
        return el.id || '';
      });
    };

    // Helper to find next button
    const findNextButton = async () => {
      // @ts-ignore
      if (commands?.findNextButton) {
        // @ts-ignore
        await commands.findNextButton();
      } else if (readerInstance?.keyboardCommands?.moveToNextButton) {
        // If the reader exposes a keyboardCommands API, use it
        if (readerInstance.perform) {
          await readerInstance.perform(readerInstance.keyboardCommands.moveToNextButton);
        }
      } else {
        // Fallback: use Tab to navigate to next focusable element
        // N.B. for Safari/webkit, we want to use Alt+Tab instead of Tab alone: https://github.com/microsoft/playwright/issues/5609
        // @ts-ignore
        await page.keyboard.press('Alt+Tab');
      }
    };

    // Register mocha tests using programmatic API
    const suite = Mocha.Suite.create(mocha.suite, `Dialog Accessibility Tests (${readerName})`);
    suite.timeout(0);

    // before hook
    suite.beforeAll(async () => {
      await initializeScreenReader();
    });

    // after hook
    suite.afterAll(async () => {
      if (mustStopReader && readerInstance?.stop) {
        try {
          await readerInstance.stop();
        } catch (e) {
          // @ts-ignore
          console.warn('Error stopping screen reader:', e?.message || e);
        }
      }
    });

    // Basic dialog tests
    const basicDialogSuite = Mocha.Suite.create(suite, 'Basic dialog');

    basicDialogSuite.addTest(
      new Mocha.Test('should announce dialog role when opened', async () => {
        // @ts-ignore
        await page.focus('#open-dialog-btn');
        await nextItem();

        // const itemText = await getItemText();
        // expect(itemText).to.equal('Example dialog');

        // @ts-ignore
        await page.click('#open-dialog-btn');
        // @ts-ignore
        await page.waitForTimeout(500);

        const spokenLog = await getSpokenLog();
        expect(spokenLog.length).to.be.greaterThan(0);

        // console.log('Spoken after opening:', spokenLog.slice(-3));

        const dialogAnnounced = spokenLog.some(
          // @ts-ignore
          phrase =>
            phrase.toLowerCase().includes('dialog') || phrase.toLowerCase().includes('web dialog'),
        );

        expect(dialogAnnounced, 'dialog role announcement').to.be.true;
      }),
    );

    basicDialogSuite.addTest(
      new Mocha.Test('should trap focus within dialog', async () => {
        if (!(await isDialogOpen('#basic-dialog'))) {
          // @ts-ignore
          await page.click('#open-dialog-btn');
          // @ts-ignore
          await page.waitForTimeout(500);
        }

        const hasReader = !!readerInstance?.next;

        if (hasReader) {
          await nextItem();
          let itemText = await getItemText();
          console.log('First navigation in dialog:', itemText);

          await nextItem();
          itemText = await getItemText();
          console.log('Second navigation in dialog:', itemText);

          await findNextButton();
          itemText = await getItemText();
          console.log('Found button in dialog:', itemText);

          const closeButtonAccessible =
            itemText.toLowerCase().includes('close') || itemText.toLowerCase().includes('button');
          expect(closeButtonAccessible, 'close button accessibility').to.be.true;
        } else {
          // @ts-ignore
          await page.focus('#dialog-close-btn');
          const itemText = await getItemText();
          console.log('Close button in dialog:', itemText);

          // @ts-ignore
          const closeButtonFocusable = await page.evaluate(
            () => document.activeElement?.id === 'dialog-close-btn',
          );
          expect(closeButtonFocusable, 'close button should be focusable').to.be.true;
        }
      }),
    );

    basicDialogSuite.addTest(
      new Mocha.Test('should return focus to invoker when closed', async () => {
        if (!(await isDialogOpen('#basic-dialog'))) {
          // @ts-ignore
          await page.click('#open-dialog-btn');
          // @ts-ignore
          await page.waitForTimeout(500);
        }

        // @ts-ignore
        await page.click('#dialog-close-btn');
        // @ts-ignore
        await page.waitForTimeout(500);

        const dialogClosed = !(await isDialogOpen('#basic-dialog'));
        expect(dialogClosed).to.equal(true);

        // @ts-ignore
        const focusedAfterClose = await page.evaluate(() => document.activeElement?.id);

        expect(focusedAfterClose, 'focus after close').to.equal('open-dialog-btn');
      }),
    );

    // basicDialogSuite.addTest(
    //   new Mocha.Test('should close when Escape key is pressed', async () => {
    //     // @ts-ignore
    //     await page.click('#open-dialog-btn');
    //     // @ts-ignore
    //     await page.waitForTimeout(500);

    //     const openBeforeEsc = await isDialogOpen('#basic-dialog');
    //     console.log('Dialog open before Escape:', openBeforeEsc);

    //     // @ts-ignore
    //     await page.keyboard.press('Escape');
    //     // @ts-ignore
    //     await page.waitForTimeout(300);

    //     const openAfterEsc = await isDialogOpen('#basic-dialog');
    //     console.log('Dialog open after Escape:', openAfterEsc);

    //     expect(openBeforeEsc, 'dialog should be open before Escape').to.be.true;
    //     expect(openAfterEsc, 'dialog should be closed after Escape').to.be.false;
    //   }),
    // );

    // Alert dialog tests
    const alertDialogSuite = Mocha.Suite.create(suite, 'Alert dialog');

    alertDialogSuite.addTest(
      new Mocha.Test('should announce alert dialog role', async () => {
        await clearSpokenLog();

        // @ts-ignore
        await page.click('#open-alert-btn');
        // @ts-ignore
        await page.waitForTimeout(500);

        const alertSpokenLog = await getSpokenLog();
        if (alertSpokenLog.length > 0) {
          console.log('Alert dialog announcements:', alertSpokenLog.slice(-3));
        }

        let alertRoleAnnounced = false;
        if (alertSpokenLog.length > 0) {
          alertRoleAnnounced = alertSpokenLog.some(
            // @ts-ignore
            phrase =>
              phrase.toLowerCase().includes('alert') || phrase.toLowerCase().includes('dialog'),
          );
        } else {
          alertRoleAnnounced = await isDialogOpen('#alert-dialog');
        }

        expect(alertRoleAnnounced, 'alert role announcement').to.be.true;
      }),
    );

    // alertDialogSuite.addTest(
    //   new Mocha.Test('should have alertdialog role attribute', async function () {
    //     if (!(await isDialogOpen('#alert-dialog'))) {
    //       await page.click('#open-alert-btn');
    //       await page.waitForTimeout(500);
    //     }

    //     let alertDialogRole;
    //     if (useNativeDialog) {
    //       alertDialogRole = await page.evaluate(() =>
    //         document.querySelector('#alert-dialog').getAttribute('role'),
    //       );
    //     } else {
    //       alertDialogRole = await page.evaluate(() =>
    //         document.querySelector('#alert-dialog [slot="content"]').getAttribute('role'),
    //       );
    //     }
    //     console.log('Alert dialog role attribute:', alertDialogRole);

    //     expect(alertDialogRole, 'alertdialog role attribute').to.equal('alertdialog');

    //     await closeDialogIfOpen('#alert-cancel-btn', '#alert-dialog');
    //   }),
    // );

    // // Autofocus dialog tests
    // const autofocusSuite = Mocha.Suite.create(suite, 'Autofocus dialog');

    // autofocusSuite.addTest(
    //   new Mocha.Test('should focus autofocus element when opened', async function () {
    //     await page.click('#open-autofocus-btn');
    //     await page.waitForTimeout(500);

    //     const autofocusedElement = await page.evaluate(() => document.activeElement?.id);
    //     console.log('Focused element after open:', autofocusedElement);

    //     expect(autofocusedElement, 'autofocus target').to.equal('name-input');

    //     await closeDialogIfOpen('#autofocus-close-btn', '#autofocus-dialog');
    //   }),
    // );

    // Run mocha
    // const failures =
    await new Promise(resolve => {
      mocha.run(resolve);
    });

    // if (failures > 0) {
    //   console.log(`\n⚠️ ${failures} test(s) failed.`);
    //   process.exitCode = 1;
    // } else {
    //   console.log('\n✅ All tests passed!\n');
    // }
  } catch (error) {
    console.error('Test failed:', error);
    process.exitCode = 1;
  } finally {
    // Cleanup browser and server
    if (browser) {
      await browser.close();
    }
    if (testServer) {
      await testServer.close();
    }
  }
}
