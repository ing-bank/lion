// eslint-disable-next-line import/no-extraneous-dependencies
import { CSSResult as CSSResult2 } from 'lit';
import { css as css1, CSSResult as CSSResult1 } from 'lit-element';

/**
 * @typedef {import('../../types').CSSResultHybrid} CSSResultHybrid
 */

/**
 * @param {string[]} stringsArray
 * @returns {TemplateStringsArray}
 */
function stringsArrayToTemplateStringsArray(stringsArray) {
  const output = /** @type {* & TemplateStringsArray} */ (stringsArray);
  // eslint-disable-next-line no-param-reassign
  output.raw = stringsArray;
  return output;
}

/**
 * Wraps a lit-html template tag (`html` or `svg`) to add static value support.
 * @param {typeof css1} css1Tag
 */
export const cssWithHybridSupport =
  css1Tag =>
  /**
   * @param {TemplateStringsArray} strings
   * @param {(CSSResult2|CSSResult1)[]} values
   * @returns {CSSResultHybrid}
   */
  (strings, ...values) => {
    /** @type {CSSResultHybrid[]} */
    const newValues = [];
    values.forEach(v => {
      let newV = v;
      if (v instanceof CSSResult2) {
        // 1. Make sure it will not be rejected inside 'original' css1 tag
        /** @type {CSSResult1} */
        newV = css1Tag(stringsArrayToTemplateStringsArray([v.cssText]));
      }
      if (v instanceof CSSResult1) {
        // 2. Make sure it will not be rejected inside 'original' css2 tag
        // (key notation to prevent mangling by rollup and other build tools)
        // eslint-disable-next-line dot-notation
        newV['_$cssResult$'] = true;
      }
      newValues.push(/** @type {CSSResultHybrid} */ (newV));
    });
    const result = /** @type {CSSResultHybrid} */ (css1Tag(strings, ...newValues));
    // Make sure it will not be rejected inside 'original' css1 tag or `static get styles` of LitElement2
    // (key notation to prevent mangling by rollup and other build tools)
    // eslint-disable-next-line dot-notation
    result['_$cssResult$'] = true;
    return result;
  };

/**
 * Will be compatible in both Lit1 and Lit2 context. This entails:
 * - `static get styles` of LitElement1
 * - `static get styles` of LitElement2
 * - inside `css1` tag
 * - inside `css2` tag
 */
export const cssHybrid = cssWithHybridSupport(css1);
