/**
 * @typedef {import('@web/test-runner-core').TestRunnerPlugin} TestRunnerPlugin
 * @typedef {import('@web/test-runner-core').BasicTestSession} TestSession
 * @typedef {import('playwright').Page} Page
 * @typedef {import('../types/index.js').ScreenreaderPluginOptions} ScreenreaderPluginOptions
 * @typedef {import('../types/index.js').SrReader} SrReader
 */

import path from 'path';
import { fileURLToPath } from 'url';

import { normalizePhrases } from './comparePhrases.js';
import { recordObservation, resetObservations } from './transcripts.js';

/**
 * The browser gives up on a server command after 20000ms - hardcoded in `@web/dev-server-core`'s
 * `webSocketsPlugin`, not configurable through the test runner config - and a command that answers
 * later fails the test with a transport error instead of a message about the reader step that was
 * slow. Everything one `sr.*` command does has to fit in the budget below.
 */
export const SR_COMMAND_HARD_LIMIT_MS = 20000;
/** What a single `sr.*` command may take; kept in sync by `npm run lint:sr-command-budget`. */
export const SR_COMMAND_BUDGET_MS = 15000;

const DEFAULT_WAIT_TIMEOUT = SR_COMMAND_BUDGET_MS;
/**
 * VoiceOver can spend the announcement after a focus change on its help banner instead of on the
 * item it is on, and then stays silent: a test that waits for the item line would wait it out. Every
 * REASK_AFTER_MS of waiting costs one re-ask (one command plus a settle, ~REASK_COST_MS), still
 * inside the same budget.
 */
const REASK_AFTER_MS = 4000;
const REASK_COST_MS = 3000;
/** How long the warm-up waits for VoiceOver's first announcement of a file (its own command). */
const WARM_UP_MS = 8000;
const WAIT_POLL_INTERVAL = 50;

/**
 * A command that runs past the budget is on its way to the hard limit, where the test fails with
 * "Did not receive a server response ... within 20000ms" and no clue about what was slow. Report it
 * while the run is still readable (waiting for a reader to speak is the usual cause).
 *
 * @param {string} command
 * @param {number} durationMs
 */
function reportCommandBudget(command, durationMs) {
  if (durationMs < SR_COMMAND_BUDGET_MS) {
    return;
  }
  // eslint-disable-next-line no-console
  console.warn(
    `[sr-budget] ${command} took ${(durationMs / 1000).toFixed(1)}s, over the ${
      SR_COMMAND_BUDGET_MS / 1000
    }s budget. The browser waits ${SR_COMMAND_HARD_LIMIT_MS / 1000}s for a command ` +
      '(@web/dev-server-core), so look for a step that waits for the reader to speak.',
  );
}

/** @type {readonly SrReader[]} */
const READERS = ['virtual', 'nvda', 'voiceover'];

/**
 * Fallback locations of the virtual screen reader browser bundle, for layouts
 * where the package could not be resolved (see getVirtualBundlePaths).
 */
const FALLBACK_VIRTUAL_BUNDLE_PATHS = [
  '/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.browser.js',
  '/node_modules/test-runner-sr/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.browser.js',
];

/**
 * Where the page can find the virtual screen reader browser bundle. Resolved
 * first, so a hoisted, nested or otherwise relocated install works, and the
 * known layouts as a fallback.
 *
 * @returns {string[]}
 */
function getVirtualBundlePaths() {
  /** @type {string[]} */
  const paths = [];
  try {
    const resolved = /** @type {any} */ (import.meta).resolve(
      '@guidepup/virtual-screen-reader/browser.js',
    );
    if (typeof resolved === 'string' && resolved.startsWith('file://')) {
      const relative = path.relative(process.cwd(), fileURLToPath(resolved));
      if (!relative.startsWith('..')) {
        paths.push(`/${relative}`);
      }
    }
  } catch {
    // package not resolvable here: fall back to the known layouts
  }
  return paths.concat(FALLBACK_VIRTUAL_BUNDLE_PATHS);
}

/**
 * Reader methods we hand to node for the virtual reader. This is the part of
 * the virtual screen reader API that overlaps with Guidepup's, so a test file
 * can be written against both.
 */
const VIRTUAL_METHODS = [
  'spokenPhraseLog',
  'clearSpokenPhraseLog',
  'lastSpokenPhrase',
  'itemText',
  'itemTextLog',
  'clearItemTextLog',
  'next',
  'previous',
  'act',
  'interact',
  'stopInteracting',
  'press',
  'type',
  'stop',
];

/** Every reader has to be able to do at least this much. */
const REQUIRED_METHODS = ['spokenPhraseLog', 'clearSpokenPhraseLog', 'next', 'press', 'type'];

/**
 * Start the virtual screen reader inside the page and expose it on the page's
 * global scope, so node side calls can be proxied onto it.
 *
 * @param {Page} page
 */
async function startVirtualReader(page) {
  await page.evaluate(async bundlePaths => {
    /** @type {any} */
    const scope = window;
    if (scope.__lionScreenreader?.started) {
      await scope.__lionScreenreader.instance.start({ container: document.body });
      return;
    }

    /** @type {any} */
    let lastError = null;
    for (const bundlePath of bundlePaths) {
      try {
        const module = await import(bundlePath);
        const Virtual = module.Virtual ?? module.default ?? module.virtual;
        if (!Virtual) {
          throw new Error(`no Virtual export in ${bundlePath}`);
        }
        const instance = new Virtual();
        await instance.start({ container: document.body });
        scope.__lionScreenreader = { started: true, instance };
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      `Could not start the virtual screen reader: ${lastError?.message ?? 'bundle not found'}`,
    );
  }, getVirtualBundlePaths());
}

/**
 * Node side wrapper around the virtual screen reader, which lives in the page.
 * Methods the virtual reader does not know return undefined instead of throwing,
 * so a test can rely on them being absent.
 *
 * @param {Page} page
 * @returns {Record<string, (...args: any[]) => Promise<any>>}
 */
function createVirtualProxy(page) {
  /** @type {Record<string, (...args: any[]) => Promise<any>>} */
  const proxy = {};
  for (const method of VIRTUAL_METHODS) {
    proxy[method] = (...args) =>
      page.evaluate(
        /** @param {{ method: string, args: unknown[] }} payload */
        payload => {
          /** @type {any} */
          const scope = window;
          const fn = scope.__lionScreenreader?.instance?.[payload.method];
          if (typeof fn !== 'function') {
            return undefined;
          }
          return fn.apply(scope.__lionScreenreader.instance, payload.args);
        },
        { method, args },
      );
  }
  return proxy;
}

/**
 * @param {{ screenReader: SrReader, getPage: () => Page, appId: string }} options
 */
function createScreenReader({ screenReader, getPage, appId }) {
  /** @type {any} */
  let instance = null;
  /** @type {any} */
  let guidepup = null;

  /**
   * A screen reader that was just started does not always answer yet: in CI NVDA
   * reports "NVDA is not running" right after `start()`, and only comes back
   * after a stop/start cycle. So wait for an answer instead of trusting the
   * first call, and let `start()` do that twice before giving up.
   *
   * @param {number} [timeout]
   */
  const answersWithin = async (timeout = 15000) => {
    const deadline = Date.now() + timeout;
    for (;;) {
      try {
        const phraseLog = await instance?.spokenPhraseLog?.();
        if (Array.isArray(phraseLog)) {
          return true;
        }
      } catch {
        // not answering (yet)
      }
      if (Date.now() > deadline) {
        return false;
      }
      await new Promise(resolve => {
        setTimeout(resolve, 250);
      });
    }
  };

  /**
   * VoiceOver announces the anchor in more than one phrase and its speech lags the
   * command that caused it ("IBAN edit text" arrives after the "you are currently on a
   * text field" hint), so a test that reads the log right after the anchor can miss the
   * announcement. Wait until the reader has spoken and stopped adding phrases.
   */
  const waitForSpeechToSettle = async (timeout = 3000) => {
    const deadline = Date.now() + timeout;
    let previousSize = -1;
    while (Date.now() < deadline) {
      let size = 0;
      try {
        const phraseLog = await instance?.spokenPhraseLog?.();
        size = Array.isArray(phraseLog) ? phraseLog.length : 0;
      } catch {
        // mid-speech the log can be momentarily unavailable
      }
      if (size > 0 && size === previousSize) {
        return;
      }
      previousSize = size;
      await new Promise(resolve => {
        setTimeout(resolve, 200);
      });
    }
  };

  /**
   * Ask VoiceOver for the item it is on again, and wait for it to speak. A cursor that did not
   * move (VoiceOver was already on the item) produces no announcement at all, which a test
   * otherwise waits out.
   *
   * @returns {Promise<boolean>} whether the reader spoke this time
   */
  const speakAgain = async () => {
    if (!instance?.keyboardCommands?.hearItemDescription) {
      return false;
    }
    await instance.perform(instance.keyboardCommands.hearItemDescription);
    await waitForSpeechToSettle();
    return normalizePhrases(await instance.spokenPhraseLog()).length > 0;
  };

  /**
   * VoiceOver's cursor does not start inside the browser. The machine setup leaves a
   * mounted preferences volume in the Finder, and VoiceOver reads that instead: its
   * log holds "guidepup-voiceover-preferences-macos-15 Volume" for every phrase. This
   * puts the browser in front and uses the item chooser to select its web content, so
   * VoiceOver is at the beginning of the page - the recipe from guidepup's own
   * Playwright example, with the public commands.
   */
  const navigateToWebContent = async () => {
    const commands = instance?.keyboardCommands;
    if (!commands?.openItemChooser) {
      return;
    }
    const { macOSActivateId, MacOSKeyCodes } = guidepup;
    const withNoCapture = { capture: false };

    await macOSActivateId(appId);
    await instance.perform({ keyCode: MacOSKeyCodes.Escape }, withNoCapture);
    await instance.perform(commands.openItemChooser, withNoCapture);
    await instance.type('web content', { capture: 'initial' });
    await instance.perform({ keyCode: MacOSKeyCodes.Enter }, withNoCapture);
    await instance.interact(withNoCapture);

    await instance.clearSpokenPhraseLog();
    await instance.clearItemTextLog();

    await instance.perform(commands.moveCursorToKeyboardFocus);
    await instance.perform(commands.hearItemDescription);
  };

  const start = async () => {
    if (screenReader === 'virtual') {
      const page = getPage();
      await startVirtualReader(page);
      instance = createVirtualProxy(page);
      return;
    }
    // A variable specifier keeps this optional dependency out of the static
    // module graph: only the real screen reader runs need guidepup installed.
    const guidepupModule = '@guidepup/guidepup';
    const module = await import(guidepupModule);
    guidepup = module;
    instance = screenReader === 'nvda' ? module.nvda : module.voiceOver;

    await instance.start();
    if (await answersWithin()) {
      return;
    }

    await instance.stop?.();
    instance = screenReader === 'nvda' ? module.nvda : module.voiceOver;
    await instance.start();

    if (!(await answersWithin())) {
      throw new Error(
        `The ${screenReader} screen reader did not answer after starting twice ` +
          '(check that the screen reader is installed and running for this OS user).',
      );
    }

    if (instance?.keyboardCommands?.moveToFrontWindow) {
      // VoiceOver reads whatever window is in front; the guidepup preferences
      // volume that the setup leaves mounted otherwise ends up in the log
      // ("guidepup-voiceover-preferences-... Volume").
      await instance.perform(instance.keyboardCommands.moveToFrontWindow);
    }
  };

  const stop = async () => {
    try {
      await instance?.stop?.();
    } catch {
      // stopping a reader that already went away is not a test failure
    }
    instance = null;
  };

  /**
   * Empty the logs, so every test observes one state instead of the transcript of
   * its neighbours. A real reader is left running and is not repositioned: it has
   * no "go to the start of the document" command (VoiceOver does, NVDA does not),
   * and restarting it between tests means start/stop bookkeeping on a reader that
   * throws on a double start ("NVDA is already running") or on stopping one that is
   * not running ("NVDA is not running"). A test anchors itself on the control it
   * asserts about with `sr.focus()` instead.
   */
  const reset = async () => {
    if (screenReader === 'virtual') {
      await startVirtualReader(getPage());
    }
    await instance?.clearSpokenPhraseLog?.();
    await instance?.clearItemTextLog?.();
  };

  return {
    get instance() {
      return instance;
    },
    start,
    reset,
    stop,
    navigateToWebContent,
    waitForSpeechToSettle,
    speakAgain,
  };
}

/**
 * @param {SrReader} screenReader
 * @param {TestSession} session
 * @param {string} appId
 */
function createSessionState(screenReader, session, appId) {
  return {
    reader: createScreenReader({
      screenReader,
      getPage: () => /** @type {any} */ (session.browser).getPage(session.id),
      appId,
    }),
  };
}

/**
 * Wraps Guidepup screen readers as Web Test Runner commands.
 *
 * @param {ScreenreaderPluginOptions} options
 * @returns {TestRunnerPlugin}
 */
export function screenreaderPlugin(options) {
  const screenReader = options?.screenReader;
  // Playwright's webkit build is the browser the VoiceOver run drives.
  const appId = options?.appId ?? 'org.webkit.Playwright';
  if (!READERS.includes(screenReader)) {
    throw new Error(
      `Unsupported screen reader: ${JSON.stringify(screenReader)}. Use one of: ${READERS.join(
        ', ',
      )}.`,
    );
  }

  /** @type {Map<string, { reader: ReturnType<typeof createScreenReader> }>} */
  const sessionStates = new Map();

  /**
   * @param {TestSession} session
   */
  const stateFor = session => {
    if (!sessionStates.has(session.id)) {
      sessionStates.set(session.id, createSessionState(screenReader, session, appId));
    }
    return /** @type {{ reader: ReturnType<typeof createScreenReader> }} */ (
      sessionStates.get(session.id)
    );
  };

  /**
   * @param {TestSession} session
   */
  const readerFor = session => {
    const state = stateFor(session);
    if (!state.reader.instance) {
      throw new Error(
        'The screen reader is not running. Call sr.initialize() in a before() hook of the test file.',
      );
    }
    return state.reader.instance;
  };

  const initialize = async (/** @type {TestSession} */ session) => {
    const state = stateFor(session);
    if (state.reader.instance) {
      return;
    }
    await state.reader.start();
    await state.reader.navigateToWebContent();
    resetObservations(session.id);
    // Prove the reader actually answers before a test depends on it.
    const phraseLog = await state.reader.instance.spokenPhraseLog();
    if (!Array.isArray(phraseLog)) {
      throw new Error(
        `The ${screenReader} screen reader did not return a phrase log; check that the reader started.`,
      );
    }
    const missing = REQUIRED_METHODS.filter(
      method => typeof state.reader.instance?.[method] !== 'function',
    );
    if (missing.length > 0) {
      throw new Error(`The ${screenReader} screen reader does not support: ${missing.join(', ')}.`);
    }
  };

  /**
   * @param {{ command: string, payload?: any, session: TestSession }} args
   */
  const runCommand = async ({ command, payload, session }) => {
    if (command === 'sr-initialize') {
      await initialize(session);
      return { reader: screenReader };
    }

    if (command === 'sr-stop') {
      await stateFor(session).reader.stop();
      sessionStates.delete(session.id);
      return { success: true };
    }

    if (command === 'sr-reader') {
      return screenReader;
    }

    if (command === 'sr-reset') {
      await stateFor(session).reader.reset();
      return { success: true };
    }

    if (command === 'sr-phraseLog') {
      const phraseLog = await readerFor(session).spokenPhraseLog();
      return normalizePhrases(phraseLog);
    }

    if (command === 'sr-itemText') {
      return readerFor(session).itemText();
    }

    if (command === 'sr-waitFor') {
      const instance = readerFor(session);
      const state = stateFor(session);
      const timeout = payload?.timeout ?? DEFAULT_WAIT_TIMEOUT;
      const started = Date.now();
      const deadline = started + timeout;
      const needle = String(payload?.phrase ?? '').toLowerCase();
      /** @param {string[]} log */
      const spoke = log =>
        log.some(/** @param {string} phrase */ phrase => phrase.toLowerCase().includes(needle));
      /** @type {string[]} */
      let phraseLog = normalizePhrases(await instance.spokenPhraseLog());
      let nextReask = REASK_AFTER_MS;
      while (!spoke(phraseLog)) {
        const now = Date.now();
        if (now > deadline) {
          return { found: false, phraseLog };
        }
        // The reader is talking about something else and has gone quiet: ask it again for the item
        // it is on, out of the same budget. A reader that is still speaking keeps its turn, and for
        // NVDA (which has no such command) this is a no-op.
        if (now - started >= nextReask && now + REASK_COST_MS < deadline) {
          nextReask += REASK_AFTER_MS;
          await state.reader.speakAgain();
        }
        await new Promise(resolve => {
          setTimeout(resolve, WAIT_POLL_INTERVAL);
        });
        phraseLog = normalizePhrases(await instance.spokenPhraseLog());
      }
      return { found: true, phraseLog };
    }

    if (command === 'sr-warm-up') {
      // VoiceOver only: it is the reader whose first announcement can be the help banner instead of
      // the item, and whose cold start a file's first assertion would otherwise pay for. NVDA and
      // the virtual reader answer immediately, so warming them up would only cost time. The phrases
      // this produces are cleared by the first sr.reset() of the file, like any other.
      if (screenReader !== 'voiceover') {
        return { warmed: false };
      }
      const instance = readerFor(session);
      const state = stateFor(session);
      const commands = instance?.keyboardCommands;
      const deadline = Date.now() + WARM_UP_MS;
      if (commands?.moveCursorToKeyboardFocus) {
        await instance.perform(commands.moveCursorToKeyboardFocus);
        if (commands?.hearItemDescription) {
          await instance.perform(commands.hearItemDescription);
        }
        await state.reader.waitForSpeechToSettle();
      }
      let words = normalizePhrases(await instance.spokenPhraseLog());
      while (words.length === 0 && Date.now() < deadline) {
        await new Promise(resolve => {
          setTimeout(resolve, WAIT_POLL_INTERVAL);
        });
        words = normalizePhrases(await instance.spokenPhraseLog());
      }
      if (words.length === 0) {
        // Not an error - the first wait of the file does the same asking - but it is the signal
        // that this reader started without saying anything, which is worth seeing in the log.
        // eslint-disable-next-line no-console
        console.warn(
          `[sr-warm-up] VoiceOver announced nothing within ${WARM_UP_MS}ms; the first wait of the ` +
            'file will ask again.',
        );
      }
      return { warmed: words.length > 0 };
    }

    if (command === 'sr-focus') {
      // NVDA and the virtual reader do not need help here: NVDA announces what
      // the keyboard focus lands on (its log shows the field, and its
      // per-character echo shows it follows the keyboard), and the virtual
      // reader has its own cursor that a test walks with sr.next(). VoiceOver
      // does not follow the keyboard focus, so its cursor would stay where it
      // was - on the Finder window that the setup leaves mounted, which is what
      // ends up in its log as "guidepup-voiceover-preferences-... Volume".
      if (screenReader === 'virtual') {
        // The virtual reader has no OS focus to follow: give it a fresh walk of
        // the page, so the sr.next() steps a test uses to reach the control start
        // from the top again. The phrase log is left alone, so the test still
        // asserts over everything that was said before.
        await startVirtualReader(/** @type {any} */ (session.browser).getPage(session.id));
        return { focused: true };
      }
      const state = stateFor(session);
      const instance = readerFor(session);
      const keyboardCommands = instance?.keyboardCommands;
      if (keyboardCommands?.moveCursorToKeyboardFocus) {
        // Moving the cursor alone does not speak, so ask for the announced item
        // as well - otherwise the log stays empty and the test cannot tell
        // "VoiceOver is on the field" from "VoiceOver says nothing".
        await instance.perform(keyboardCommands.moveCursorToKeyboardFocus);
        await instance.perform(keyboardCommands.hearItemDescription);
        await state.reader.waitForSpeechToSettle();
        // VoiceOver stays silent when its cursor was already on the item and did not move
        // (in CI one run had an empty log for a whole test because of that), so ask it once
        // more instead of letting the test wait out its full timeout on nothing. Two commands
        // plus two settles stay inside the 20s a command may take.
        if (
          normalizePhrases(await instance.spokenPhraseLog()).length === 0 &&
          !(await state.reader.speakAgain())
        ) {
          // eslint-disable-next-line no-console
          console.warn(
            '[sr-focus] VoiceOver did not announce the item it was anchored on, so the test ' +
              'below will report an empty phrase log.',
          );
        }
      } else {
        await state.reader.waitForSpeechToSettle();
      }
      return { focused: true };
    }

    if (command === 'sr-observe') {
      recordObservation(session.id, /** @type {any} */ (payload));
      return { success: true };
    }

    if (command === 'sr-next' || command === 'sr-previous') {
      const instance = readerFor(session);
      const count = Math.max(1, payload?.count ?? 1);
      const move = command === 'sr-next' ? instance.next : instance.previous;
      for (let i = 0; i < count; i += 1) {
        await move.call(instance);
      }
      return { success: true };
    }

    /** @type {Record<string, () => Promise<any>>} */
    const oneShot = {
      'sr-press': async () => {
        const reader = readerFor(session);
        const key = String(payload?.key ?? '');
        if (!reader.keyboardCommands?.interactWithItem) {
          await reader.press(key);
          return;
        }
        // VoiceOver: press with the browser's own keyboard, like sr.type() does. A key
        // press through VoiceOver did not commit the value in CI (no formatted value, no
        // error state was announced after Tab).
        const page = /** @type {any} */ (session.browser).getPage(session.id);
        await page.keyboard.press(key);
      },
      'sr-type': async () => {
        const reader = readerFor(session);
        const text = String(payload?.text ?? '');
        const commands = reader.keyboardCommands;
        if (!commands?.interactWithItem) {
          await reader.type(text);
          return;
        }
        // VoiceOver: type with the browser's own keyboard. Playwright sends real key events,
        // so the field receives the text, while typing *through* VoiceOver waits for the
        // speech of every keystroke - longer than the 20s a server command may take - and
        // never reached the input in CI. VoiceOver is on the field (sr.focus()), which is
        // enough for the keys to land; entering the field with interactWithItem first made
        // the run hang past the time the whole test suite is allowed to take.
        const page = /** @type {any} */ (session.browser).getPage(session.id);
        await page.keyboard.type(text);
      },
      'sr-act': () => readerFor(session).act(),
      'sr-interact': () => readerFor(session).interact(),
      'sr-stopInteracting': () => readerFor(session).stopInteracting(),
    };
    const oneShotHandler = oneShot[command];
    if (oneShotHandler) {
      await oneShotHandler();
      return { success: true };
    }

    throw new Error(`Unknown screen reader command: ${command}`);
  };

  return {
    name: 'screenreader-commands',

    async executeCommand(args) {
      if (!args.command.startsWith('sr-')) {
        return undefined;
      }
      const startedAt = Date.now();
      try {
        return await runCommand(args);
      } finally {
        // A command that runs over its budget is reported here instead of turning into a
        // transport error later on.
        reportCommandBudget(args.command, Date.now() - startedAt);
      }
    },
  };
}
