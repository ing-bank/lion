/**
 * Comparison of an expected phrase list against what a screen reader spoke.
 * Pure functions, so they can be unit tested in node.
 *
 * @typedef {import('../types/index.js').SrPhraseList} SrPhraseList
 * @typedef {{ ok: boolean, index: number, expectedPhrase?: string, heardPhrase?: string }} Comparison
 */

/**
 * @param {string[]} phrases
 * @returns {string[]} the same phrases, with runs of whitespace collapsed and
 *   empty entries dropped: a screen reader that says nothing is not saying ""
 */
export function normalizePhrases(phrases) {
  return phrases
    .map(phrase => String(phrase).replace(/\s+/g, ' ').trim())
    .filter(phrase => phrase.length > 0);
}

/**
 * @param {string[]} expected
 * @param {string[]} heard
 * @returns {Comparison}
 */
export function compareExact(expected, heard) {
  const expectedPhrases = normalizePhrases(expected);
  const heardPhrases = normalizePhrases(heard);
  const length = Math.max(expectedPhrases.length, heardPhrases.length);
  for (let i = 0; i < length; i += 1) {
    if (expectedPhrases[i] !== heardPhrases[i]) {
      return {
        ok: false,
        index: i,
        expectedPhrase: expectedPhrases[i],
        heardPhrase: heardPhrases[i],
      };
    }
  }
  return { ok: true, index: -1 };
}

/**
 * Order preserving subsequence: every expected phrase has to show up in the
 * heard log, in this order, and other phrases may sit in between.
 *
 * @param {string[]} expected
 * @param {string[]} heard
 * @returns {Comparison}
 */
export function compareContains(expected, heard) {
  const expectedPhrases = normalizePhrases(expected);
  const heardPhrases = normalizePhrases(heard);
  let cursor = 0;
  for (const phrase of expectedPhrases) {
    let at = -1;
    for (let i = cursor; i < heardPhrases.length; i += 1) {
      if (heardPhrases[i] === phrase) {
        at = i;
        break;
      }
    }
    if (at === -1) {
      return {
        ok: false,
        index: cursor,
        expectedPhrase: phrase,
        heardPhrase: heardPhrases[cursor],
      };
    }
    cursor = at + 1;
  }
  return { ok: true, index: -1 };
}

/**
 * Like `compareContains`, but a phrase may be part of a spoken phrase. Readers
 * decorate an announcement that belongs to a live region ("assertive: Error,,
 * Please enter a valid IBAN." for the virtual reader, "polite: Error,," after a
 * re-validation), and that decoration is not what a user hears - the message is.
 *
 * @param {string[]} expected
 * @param {string[]} heard
 * @returns {Comparison}
 */
export function compareContainsLike(expected, heard) {
  const expectedPhrases = normalizePhrases(expected);
  const heardPhrases = normalizePhrases(heard);
  let cursor = 0;
  for (const phrase of expectedPhrases) {
    let at = -1;
    for (let i = cursor; i < heardPhrases.length; i += 1) {
      if (heardPhrases[i].includes(phrase)) {
        at = i;
        break;
      }
    }
    if (at === -1) {
      return {
        ok: false,
        index: cursor,
        expectedPhrase: phrase,
        heardPhrase: heardPhrases[cursor],
      };
    }
    cursor = at + 1;
  }
  return { ok: true, index: -1 };
}

/**
 * @param {SrPhraseList} expected
 * @param {string[]} heard
 * @returns {Comparison}
 */
export function comparePhrases(expected, heard) {
  if (expected.mode === 'exact') {
    return compareExact(expected.phrases, heard);
  }
  return expected.mode === 'containsLike'
    ? compareContainsLike(expected.phrases, heard)
    : compareContains(expected.phrases, heard);
}

/**
 * @param {string[]} phrases
 * @returns {string}
 */
export function formatPhrases(phrases) {
  const normalized = normalizePhrases(phrases);
  if (normalized.length === 0) {
    return '    (nothing spoken)';
  }
  return normalized.map((phrase, index) => `    [${index}] ${JSON.stringify(phrase)}`).join('\n');
}

/**
 * Readable mismatch report, meant to be read from a CI log on a phone.
 *
 * @param {{ reader: string, expected: SrPhraseList, heard: string[], comparison: Comparison }} args
 * @returns {string}
 */
export function formatMismatch({ reader, expected, heard, comparison }) {
  const lines = [
    `screen reader "${reader}" did not speak what the test expects (mode: ${expected.mode})`,
    '',
    `expected (${expected.phrases.length} phrases):`,
    formatPhrases(expected.phrases),
    '',
    `heard (${heard.length} phrases):`,
    formatPhrases(heard),
    '',
  ];

  if (expected.mode === 'exact') {
    lines.push(`first divergence at index ${comparison.index}:`);
    lines.push(`    expected: ${JSON.stringify(comparison.expectedPhrase)}`);
    lines.push(`    heard:    ${JSON.stringify(comparison.heardPhrase)}`);
  } else {
    lines.push(`missing phrase ${JSON.stringify(comparison.expectedPhrase)}`);
    lines.push(
      `    the heard log ran out at index ${comparison.index} (${JSON.stringify(
        comparison.heardPhrase,
      )})`,
    );
  }

  return lines.join('\n');
}
