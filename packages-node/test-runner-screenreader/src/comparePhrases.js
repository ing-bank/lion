/**
 * Comparison of an expected phrase list against what a screen reader spoke.
 * Pure functions, so they can be unit tested in node.
 *
 * @typedef {import('../types/index.js').SrPhraseList} SrPhraseList
 * @typedef {{ ok: boolean, index: number, expectedPhrase?: string, heardPhrase?: string }} Comparison
 */

/**
 * @param {string[]} expected
 * @param {string[]} heard
 * @returns {Comparison}
 */
export function compareExact(expected, heard) {
  const length = Math.max(expected.length, heard.length);
  for (let i = 0; i < length; i += 1) {
    if (expected[i] !== heard[i]) {
      return { ok: false, index: i, expectedPhrase: expected[i], heardPhrase: heard[i] };
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
  let cursor = 0;
  for (const phrase of expected) {
    let at = -1;
    for (let i = cursor; i < heard.length; i += 1) {
      if (heard[i] === phrase) {
        at = i;
        break;
      }
    }
    if (at === -1) {
      return { ok: false, index: cursor, expectedPhrase: phrase, heardPhrase: heard[cursor] };
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
  return expected.mode === 'exact'
    ? compareExact(expected.phrases, heard)
    : compareContains(expected.phrases, heard);
}

/**
 * @param {string[]} phrases
 * @returns {string}
 */
export function formatPhrases(phrases) {
  if (phrases.length === 0) {
    return '    (nothing spoken)';
  }
  return phrases.map((phrase, index) => `    [${index}] ${JSON.stringify(phrase)}`).join('\n');
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
