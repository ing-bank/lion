// eslint-disable-next-line import/no-extraneous-dependencies
import { css as css2 } from 'lit';

/**
 * @typedef {import('lit').CSSResult} CSSResult2
 */

/**
 * Wraps a lit-html template tag (`html` or `svg`) to add static value support.
 * @param {typeof css2} css2Tag
 */
export const css2WithHybridSupport =
  css2Tag =>
  /**
   * @param {TemplateStringsArray} strings
   * @param {(CSSResult2|CSSResult1)[]} values
   * @returns {CSSResult2}
   */
  (strings, ...values) => {
    /** @type {CSSResult2[]} */
    const newValues = [];
    values.forEach(v => {
      const newV = v;
      if (newV._$cssResult$ !== true) {
        // Make sure it will not be rejected inside 'original' css2 tag
        // (key notation to prevent mangling by rollup and other build tools)
        // eslint-disable-next-line dot-notation
        newV['_$cssResult$'] = true;
      }
      newValues.push(newV);
    });
    return css2Tag(strings, ...newValues);
  };

/**
 * Will be compatible in Lit2 context. This entails:
 * - `static get styles` of LitElement2
 * - inside `css2` tag
 */
export const css2Hybrid = css2WithHybridSupport(css2);
