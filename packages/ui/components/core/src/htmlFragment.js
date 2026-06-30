/**
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 * @returns {string}
 */
function literalsToString(strings, ...values) {
  const resolvedStrings = values.map(v => literalsToString(v, []));
  return strings.map((s, i) => `${s}${resolvedStrings[i] || ''}`).join('');
}

/**
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 * @returns {DocumentFragment}
 */
export function htmlFragment(strings, ...values) {
  return document.createRange().createContextualFragment(literalsToString(strings, ...values));
}
