/* eslint-disable import/no-extraneous-dependencies */
import { executeServerCommand } from '@web/test-runner-commands';
import { comparePhrases, formatMismatch, formatPhrases } from './comparePhrases.js';

/**
 * @typedef {import('../types/index.js').SrExpectation} SrExpectation
 * @typedef {import('../types/index.js').SrPhraseList} SrPhraseList
 * @typedef {import('../types/index.js').SrReader} SrReader
 */

const DEFAULT_WAIT_TIMEOUT = 15000;

/** Every reader an expectation has to describe. */
export const READERS = /** @type {const} */ (['virtual', 'nvda', 'voiceover']);

/** @type {SrReader | null} */
let activeReader = null;

/**
 * Expect the spoken phrase log to match `phrases` one to one.
 * @param {...string} phrases
 * @returns {SrPhraseList}
 */
export function exact(...phrases) {
  return { mode: 'exact', phrases };
}

/**
 * Expect `phrases` to appear in the spoken phrase log, in this order.
 * @param {...string} phrases
 * @returns {SrPhraseList}
 */
export function contains(...phrases) {
  return { mode: 'contains', phrases };
}

/**
 * @returns {Promise<SrReader>}
 */
async function currentReader() {
  if (!activeReader) {
    activeReader = /** @type {SrReader} */ (await executeServerCommand('sr-reader'));
  }
  return activeReader;
}

/**
 * @param {SrExpectation} expectation
 * @param {SrReader} reader
 */
function assertComplete(expectation, reader) {
  const missing = READERS.filter(name => !expectation || !expectation[name]);
  if (missing.length > 0) {
    throw new Error(
      `An sr expectation has to describe every reader (${READERS.join(', ')}); ` +
        `missing for reader "${reader}": ${missing.join(', ')}.`,
    );
  }
}

/**
 * Focus the control a component delegates focus to (its inner input), so the
 * screen reader talks about that control. A real reader follows OS focus: this
 * is how a test chooses the subject of its expectation, instead of depending on
 * wherever the reader's own cursor happened to be after the previous test.
 *
 * @param {string} selector
 */
export function srFocus(selector) {
  const element = /** @type {HTMLElement | null} */ (document.querySelector(selector));
  if (!element) {
    throw new Error(`srFocus: no element matches "${selector}".`);
  }
  // Lion fields keep their input in the light DOM (the shadow root holds the
  // slots), so look in both.
  const focusable = 'input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const delegate = /** @type {HTMLElement} */ (
    element.shadowRoot?.querySelector(focusable) ?? element.querySelector(focusable) ?? element
  );
  delegate.focus();
  // A component that delegates focus reports itself as the active element while
  // its inner control holds the focus.
  const focused =
    document.activeElement === delegate ||
    document.activeElement === element ||
    element.contains(document.activeElement) ||
    element.shadowRoot?.activeElement === delegate;
  if (!focused) {
    throw new Error(`srFocus: "${selector}" did not take focus.`);
  }
  return executeServerCommand('sr-focus', { selector });
}

/** @type {import('../types/commands.js').ScreenreaderCommands} */
const sr = {
  focus: srFocus,

  async initialize() {
    const result = /** @type {{ reader: SrReader }} */ (
      await executeServerCommand('sr-initialize')
    );
    activeReader = result.reader;
    return result.reader;
  },

  async stop() {
    await executeServerCommand('sr-stop');
    activeReader = null;
  },

  async reset() {
    await executeServerCommand('sr-reset');
  },

  async phraseLog() {
    const phraseLog = /** @type {string[]} */ (await executeServerCommand('sr-phraseLog'));
    return phraseLog;
  },

  async itemText() {
    const itemText = /** @type {string} */ (await executeServerCommand('sr-itemText'));
    return itemText;
  },

  async waitFor(phrase, options = {}) {
    const timeout = options.timeout ?? DEFAULT_WAIT_TIMEOUT;
    const result = /** @type {{ found: boolean, phraseLog: string[] }} */ (
      await executeServerCommand('sr-waitFor', { phrase, timeout })
    );
    if (!result.found) {
      throw new Error(
        `The screen reader never spoke ${JSON.stringify(phrase)} within ${timeout}ms.\n` +
          `heard (${result.phraseLog.length} phrases):\n${formatPhrases(result.phraseLog)}`,
      );
    }
    return result.phraseLog;
  },

  async expect(expectation) {
    const reader = await currentReader();
    assertComplete(expectation, reader);
    const heard = /** @type {string[]} */ (await executeServerCommand('sr-phraseLog'));
    const expected = expectation[reader];
    const comparison = comparePhrases(expected, heard);
    await executeServerCommand('sr-observe', {
      reader,
      mode: expected.mode,
      expected: expected.phrases,
      heard,
      ok: comparison.ok,
    });
    if (!comparison.ok) {
      throw new Error(formatMismatch({ reader, expected, heard, comparison }));
    }
  },

  async press(key) {
    await executeServerCommand('sr-press', { key });
  },

  async type(text) {
    await executeServerCommand('sr-type', { text });
  },

  async next(count = 1) {
    await executeServerCommand('sr-next', { count });
  },

  async previous(count = 1) {
    await executeServerCommand('sr-previous', { count });
  },

  async act() {
    await executeServerCommand('sr-act');
  },

  async interact() {
    await executeServerCommand('sr-interact');
  },

  async stopInteracting() {
    await executeServerCommand('sr-stopInteracting');
  },
};

export default sr;
