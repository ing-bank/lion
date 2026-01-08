/* eslint-disable camelcase */
/**
 * @typedef {import('@web/test-runner-core').TestRunnerPlugin} TestRunnerPlugin
 * @typedef {import('@web/test-runner-chrome').ChromeLauncher} ChromeLauncher
 * @typedef {import('@web/test-runner-chrome').puppeteerCore} puppeteerCore
 */

/**
 * @param {{screenReader: 'voiceover'|'nvda'|'virtual'|'auto', getPage: () => import('playwright').Page}} options
 * @returns {{instance: any, initializeScreenReader: () => Promise<void>, stopScreenReader: () => Promise<void>}}
 */
function getSrInstance({ screenReader, getPage }) {
  const allowedReaders = ['voiceover', 'nvda', 'virtual', 'auto'];
  if (!allowedReaders.includes(screenReader)) {
    throw new Error(
      `Unsupported screen reader: ${screenReader}. Allowed: ${allowedReaders.join(', ')}`,
    );
  }

  /** @type {any} */
  let _instance = null;
  let mustStopReader = false;

  /**
   * Initialize the screen reader instance
   */
  const initializeScreenReader = async () => {
    if (screenReader === 'voiceover') {
      // @ts-ignore
      const { voiceOver } = await import('@guidepup/guidepup');
      _instance = voiceOver;
    } else if (screenReader === 'nvda') {
      // @ts-ignore
      const { nvda } = await import('@guidepup/guidepup');
      _instance = nvda;
    } else if (screenReader === 'virtual') {
      const page = getPage();
      // TODO: see if this can be avoided n the future...
      const virtualPaths = [
        '/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.browser.js',
        '/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.mjs',
        '/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.legacy-esm.js',
        '/node_modules/@lion-labs/test-runner-screenreader/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.browser.js',
        '/node_modules/@lion-labs/test-runner-screenreader/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.mjs',
        '/node_modules/@lion-labs/test-runner-screenreader/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.legacy-esm.js',
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
            // Store methods on window for later access
            // @ts-ignore
            window.__guidepup_virtual.getSpoken = () =>
              instance.spokenPhraseLog ? instance.spokenPhraseLog() : [];
            // @ts-ignore
            window.__guidepup_virtual.clearSpoken = () =>
              instance.clearSpokenPhraseLog ? instance.clearSpokenPhraseLog() : undefined;
            // @ts-ignore
            window.__guidepup_virtual.next = () => (instance.next ? instance.next() : undefined);
            // @ts-ignore
            window.__guidepup_virtual.previous = () =>
              instance.previous ? instance.previous() : undefined;
            // @ts-ignore
            window.__guidepup_virtual.act = () => (instance.act ? instance.act() : undefined);
            // @ts-ignore
            window.__guidepup_virtual.itemText = () =>
              instance.itemText ? instance.itemText() : '';
            // @ts-ignore
            window.__guidepup_virtual.lastSpokenPhrase = () =>
              instance.lastSpokenPhrase ? instance.lastSpokenPhrase() : '';
            // @ts-ignore
            window.__guidepup_virtual.itemTextLog = () =>
              instance.itemTextLog ? instance.itemTextLog() : [];
            // @ts-ignore
            window.__guidepup_virtual.clearItemTextLog = () =>
              instance.clearItemTextLog ? instance.clearItemTextLog() : undefined;
            // @ts-ignore
            window.__guidepup_virtual.press = key =>
              instance.press ? instance.press(key) : undefined;
            // @ts-ignore
            window.__guidepup_virtual.type = text =>
              instance.type ? instance.type(text) : undefined;
            // @ts-ignore
            window.__guidepup_virtual.click = options =>
              instance.click ? instance.click(options) : undefined;
            // @ts-ignore
            window.__guidepup_virtual.interact = () =>
              instance.interact ? instance.interact() : undefined;
            // @ts-ignore
            window.__guidepup_virtual.stopInteracting = () =>
              instance.stopInteracting ? instance.stopInteracting() : undefined;
            // @ts-ignore
            window.__guidepup_virtual.perform = cmd =>
              instance.perform ? instance.perform(cmd) : undefined;
            // @ts-ignore
            window.__guidepup_virtual.stop = () => (instance.stop ? instance.stop() : undefined);
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
      // Use getPage() for each call to ensure fresh page reference
      _instance = {
        // Speech/phrase log
        spokenPhraseLog: async () =>
          // @ts-ignore
          getPage().evaluate(() => window.__guidepup_virtual.getSpoken()),
        clearSpokenPhraseLog: async () =>
          // @ts-ignore
          getPage().evaluate(() => window.__guidepup_virtual.clearSpoken()),
        lastSpokenPhrase: async () =>
          // @ts-ignore
          getPage().evaluate(() => window.__guidepup_virtual.lastSpokenPhrase()),
        itemText: async () =>
          // @ts-ignore
          getPage().evaluate(() => window.__guidepup_virtual.itemText()),
        itemTextLog: async () =>
          // @ts-ignore
          getPage().evaluate(() => window.__guidepup_virtual.itemTextLog()),
        clearItemTextLog: async () =>
          // @ts-ignore
          getPage().evaluate(() => window.__guidepup_virtual.clearItemTextLog()),

        // Navigation
        // @ts-ignore
        next: async () => getPage().evaluate(() => window.__guidepup_virtual.next()),
        // @ts-ignore
        previous: async () => getPage().evaluate(() => window.__guidepup_virtual.previous()),
        // @ts-ignore
        act: async () => getPage().evaluate(() => window.__guidepup_virtual.act()),

        // Interaction
        press: async (/** @type {string} */ key) =>
          // @ts-ignore
          getPage().evaluate(k => window.__guidepup_virtual.press(k), key),
        type: async (/** @type {string} */ text) =>
          // @ts-ignore
          getPage().evaluate(t => window.__guidepup_virtual.type(t), text),
        click: async (/** @type {any} */ options) =>
          // @ts-ignore
          getPage().evaluate(opts => window.__guidepup_virtual.click(opts), options),
        interact: async () =>
          // @ts-ignore
          getPage().evaluate(() => window.__guidepup_virtual.interact()),
        stopInteracting: async () =>
          // @ts-ignore
          getPage().evaluate(() => window.__guidepup_virtual.stopInteracting()),
        perform: async (/** @type {any} */ cmd) =>
          // @ts-ignore
          getPage().evaluate(c => window.__guidepup_virtual.perform(c), cmd),

        // Lifecycle
        // @ts-ignore
        stop: async () => getPage().evaluate(() => window.__guidepup_virtual.stop()),
      };
    }

    // Start the reader if it exports a start() method (voiceover/nvda)
    if (_instance?.start) {
      await _instance.start();
      mustStopReader = true;
    }
  };

  const stopScreenReader = async () => {
    if (mustStopReader && _instance?.stop) {
      try {
        await _instance.stop();
      } catch {
        // ignore
      }
    }
    _instance = null;
    mustStopReader = false;
  };

  return {
    get instance() {
      return _instance;
    },
    initializeScreenReader,
    stopScreenReader,
  };
}

/**
 * @param {import('playwright').Browser} browser
 * @returns {'voiceover'|'nvda'|'virtual'}
 */
function autoDetermineScreenReader(browser) {
  switch (browser.browserType?.()) {
    case 'chromium':
      return 'nvda';
    case 'webkit':
      return 'voiceover';
    case 'firefox':
      return 'nvda';
    default:
      return 'virtual';
  }
}

/**
 * Helper to perform element navigation commands
 * @param {any} sr - screen reader wrapper
 * @param {string} commandName - keyboard command name (e.g., 'moveToNextButton')
 */
async function performElementNavigation(sr, commandName) {
  if (sr.instance?.keyboardCommands?.[commandName] && sr.instance.perform) {
    await sr.instance.perform(sr.instance.keyboardCommands[commandName]);
  } else {
    // Fallback for virtual screen reader - just use next()
    await sr.instance.next();
  }
}

/**
 * Wraps Guidepup screen reader commands as WTR commands
 * @param {{screenReader?: 'voiceover'|'nvda'|'virtual'}} options
 * @returns {TestRunnerPlugin}
 */
export function screenreaderPlugin({ screenReader } = {}) {
  // Keep state across commands for each session
  const sessionState = new Map();

  return {
    name: 'screenreader-commands',
    /**
     * @param {{ command: string, payload: any, session: any }} params
     */
    async executeCommand({ command, payload, session }) {
      // Only handle sr-* commands
      if (!command.startsWith('sr-')) {
        return undefined;
      }

      const resolvedScreenReader =
        payload?.screenReader || screenReader || autoDetermineScreenReader(session.browser);

      // Helper to get fresh page reference
      const getPage = () => session.browser.getPage(session.id);

      // Get or create screen reader instance for this session
      if (!sessionState.has(session.id)) {
        sessionState.set(
          session.id,
          getSrInstance({ screenReader: resolvedScreenReader, getPage }),
        );
      }
      const sr = sessionState.get(session.id);

      // ============ Lifecycle Commands ============
      if (command === 'sr-initialize') {
        await sr.initializeScreenReader();
        return { success: true };
      }
      if (command === 'sr-stop') {
        await sr.stopScreenReader();
        sessionState.delete(session.id);
        return { success: true };
      }

      // ============ Speech/Phrase Log Commands ============
      if (command === 'sr-spokenPhraseLog') {
        return sr.instance.spokenPhraseLog();
      }
      if (command === 'sr-clearSpokenPhraseLog') {
        await sr.instance.clearSpokenPhraseLog();
        return { success: true };
      }
      if (command === 'sr-lastSpokenPhrase') {
        return sr.instance.lastSpokenPhrase();
      }
      if (command === 'sr-itemText') {
        return sr.instance.itemText();
      }
      if (command === 'sr-itemTextLog') {
        return sr.instance.itemTextLog();
      }
      if (command === 'sr-clearItemTextLog') {
        await sr.instance.clearItemTextLog();
        return { success: true };
      }

      // ============ Navigation Commands ============
      if (command === 'sr-next') {
        await sr.instance.next();
        return { success: true };
      }
      if (command === 'sr-previous') {
        await sr.instance.previous();
        return { success: true };
      }
      if (command === 'sr-act') {
        await sr.instance.act();
        return { success: true };
      }
      if (command === 'sr-moveToTop') {
        if (sr.instance.moveToTop) {
          await sr.instance.moveToTop();
        }
        return { success: true };
      }
      if (command === 'sr-moveToBottom') {
        if (sr.instance.moveToBottom) {
          await sr.instance.moveToBottom();
        }
        return { success: true };
      }

      // ============ Interaction Commands ============
      if (command === 'sr-click') {
        await sr.instance.click(payload?.options);
        return { success: true };
      }
      if (command === 'sr-press') {
        await sr.instance.press(payload?.key);
        return { success: true };
      }
      if (command === 'sr-type') {
        await sr.instance.type(payload?.text);
        return { success: true };
      }
      if (command === 'sr-perform') {
        await sr.instance.perform(payload?.command);
        return { success: true };
      }
      if (command === 'sr-interact') {
        await sr.instance.interact();
        return { success: true };
      }
      if (command === 'sr-stopInteracting') {
        await sr.instance.stopInteracting();
        return { success: true };
      }

      // ============ Element Navigation Commands ============
      if (command === 'sr-findNextButton') {
        await performElementNavigation(sr, 'moveToNextButton');
        return { success: true };
      }
      if (command === 'sr-findPreviousButton') {
        await performElementNavigation(sr, 'moveToPreviousButton');
        return { success: true };
      }
      if (command === 'sr-findNextHeading') {
        await performElementNavigation(sr, 'moveToNextHeading');
        return { success: true };
      }
      if (command === 'sr-findPreviousHeading') {
        await performElementNavigation(sr, 'moveToPreviousHeading');
        return { success: true };
      }
      if (command === 'sr-findNextLink') {
        await performElementNavigation(sr, 'moveToNextLink');
        return { success: true };
      }
      if (command === 'sr-findPreviousLink') {
        await performElementNavigation(sr, 'moveToPreviousLink');
        return { success: true };
      }
      if (command === 'sr-findNextFormControl') {
        await performElementNavigation(sr, 'moveToNextFormControl');
        return { success: true };
      }
      if (command === 'sr-findPreviousFormControl') {
        await performElementNavigation(sr, 'moveToPreviousFormControl');
        return { success: true };
      }
      if (command === 'sr-findNextLandmark') {
        await performElementNavigation(sr, 'moveToNextLandmark');
        return { success: true };
      }
      if (command === 'sr-findPreviousLandmark') {
        await performElementNavigation(sr, 'moveToPreviousLandmark');
        return { success: true };
      }
      if (command === 'sr-findNextList') {
        await performElementNavigation(sr, 'moveToNextList');
        return { success: true };
      }
      if (command === 'sr-findPreviousList') {
        await performElementNavigation(sr, 'moveToPreviousList');
        return { success: true };
      }
      if (command === 'sr-findNextTable') {
        await performElementNavigation(sr, 'moveToNextTable');
        return { success: true };
      }
      if (command === 'sr-findPreviousTable') {
        await performElementNavigation(sr, 'moveToPreviousTable');
        return { success: true };
      }

      // ============ Info Commands ============
      if (command === 'sr-getScreenreaderInfo') {
        return {
          name: resolvedScreenReader,
          version: sr.instance?.version || 'unknown',
          state: sr.instance ? 'running' : 'stopped',
        };
      }

      // Unknown sr-* command
      throw new Error(`Unknown screenreader command: ${command}`);
    },
  };
}
