// eslint-disable-next-line import/no-extraneous-dependencies
import { html as html2, isDirectiveResult } from '../lit2-exports.js';
import { isLit1TemplateResult } from '../helpers/isLit1TemplateResult.js';

/**
 * @typedef {import('lit-html').TemplateResult} TemplateResult1
 * @typedef {import('lit').TemplateResult} TemplateResult2
 */

/**
 *
 * @param {unknown[]} values
 */
function getHtml2Values(values) {
  /** @type {unknown[]} */
  const newValues = [];
  values.forEach(v => {
    let newValue = v;
    if (isLit1TemplateResult(v)) {
      // @ts-expect-error
      const newValuesSubTpl = getHtml2Values(/** @type {TemplateResult1} */ (v).values);
      newValue = html2(/** @type {TemplateResult1} */ (v).strings, ...newValuesSubTpl);
    } else if (isDirectiveResult(v)) {
      // @ts-expect-error
      // eslint-disable-next-line no-param-reassign
      v.values = getHtml2Values(/** @type {TemplateResult1} */ (v).values);
    }
    newValues.push(newValue);
  });
  return newValues;
}

/**
 * Wraps a lit-html template tag (`html` or `svg`) to add static value support.
 * @param {typeof html2} html2Tag
 */
export const html2With1Support =
  html2Tag =>
  /**
   * @param {TemplateStringsArray} strings
   * @param {unknown[]} values
   * @returns {import('@lion/core').TemplateResult}
   */
  (strings, ...values) => {
    const newValues = getHtml2Values(values);
    return html2Tag(strings, ...newValues);
  };

export const html2Hybrid = html2With1Support(html2);
