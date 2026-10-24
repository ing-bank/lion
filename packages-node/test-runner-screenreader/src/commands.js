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
 * A reader may decorate a phrase that belongs to a live region ("polite: Error,,
 * Please enter a valid IBAN."), so the message can be asserted as part of a
 * spoken phrase instead of as the whole phrase.
 *
 * @param {...string} phrases
 * @returns {SrPhraseList}
 */
export function containsLike(...phrases) {
  return { mode: 'containsLike', phrases };
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
  // Lion fields keep their input in the light DOM (the shadow root holds the slots), so look in both,
  // and probe rather than guess: components delegate the focus in different ways (`lion-checkbox-group`
  // forwards from the host, `lion-combobox` to its inner `lion-input`, `lion-input-file` to a button),
  // and a custom element without a tabindex is not focusable at all. The first candidate that actually
  // takes the focus wins, so a component that changes its internals does not break the anchor.
  const focusable =
    'input, select, textarea, button, a[href], [tabindex], [contenteditable="true"], ' +
    'lion-input, lion-textarea, lion-select, lion-checkbox, lion-radio, lion-switch, lion-option';
  /**
   * The first focusable element, looking through the shadow roots of the descendants as well:
   * `lion-combobox` focuses its inner `lion-input`, whose real `<input>` lives one shadow root deeper.
   *
   * @param {DocumentFragment | Element} root
   * @param {number} [depth]
   * @returns {HTMLElement | null}
   */
  const deepFocusable = (root, depth = 0) => {
    const direct = root.querySelector(focusable);
    if (direct instanceof HTMLElement) {
      return direct;
    }
    if (depth > 3) {
      return null;
    }
    for (const host of root.querySelectorAll('*')) {
      if (host.shadowRoot) {
        const found = deepFocusable(host.shadowRoot, depth + 1);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };
  const candidates = [
    element.shadowRoot?.querySelector(focusable),
    element.querySelector(focusable),
    deepFocusable(element.shadowRoot ?? element),
    /** @type {any} */ (element)._focusableNode,
    /** @type {any} */ (element)._inputNode,
    element,
  ].filter(candidate => candidate instanceof HTMLElement);
  const holdsFocus = candidate =>
    document.activeElement === candidate ||
    document.activeElement === element ||
    element.contains(document.activeElement) ||
    element.shadowRoot?.activeElement === candidate;
  for (const candidate of candidates) {
    // eslint-disable-next-line no-await-in-loop
    /** @type {HTMLElement} */ (candidate).focus();
    if (holdsFocus(candidate)) {
      return executeServerCommand('sr-focus', { selector });
    }
  }
  throw new Error(`srFocus: "${selector}" did not take focus.`);
}

/** @type {import('../types/commands.js').ScreenreaderCommands} */
const sr = {
  focus: srFocus,

  async initialize() {
    const result = /** @type {{ reader: SrReader }} */ (
      await executeServerCommand('sr-initialize')
    );
    activeReader = result.reader;
    // A file's first assertion otherwise pays for the reader's cold start, and for VoiceOver that
    // can be an announcement about something else than the item under test. Its own command, so it
    // has its own time budget; a no-op for NVDA and the virtual reader.
    await executeServerCommand('sr-warm-up');
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
