/**
 * Lightweight css tagged literal that is compatible with css literal from lit and enables syntax highlighting
 * @param {TemplateStringsArray} strings
 * @param {any[]} values
 * @returns {CSSStyleSheet}
 */
export function cssSheet(strings, ...values) {
  if (values.length > 0) {
    throw new Error('css function does not support interpolations. Use lit css instead');
  }
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(strings[0]);
  return sheet;
}
