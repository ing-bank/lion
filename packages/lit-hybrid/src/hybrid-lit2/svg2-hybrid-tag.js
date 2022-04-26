// eslint-disable-next-line import/no-extraneous-dependencies
import { svg as svg2 } from 'lit';

/**
 * @typedef {import('../../core').TemplateResult} TemplateResult1
 * @typedef {import('@lion/core').TemplateResult} TemplateResult2
 */

/**
 * Wraps a lit-html template tag (`html` or `svg`) to add static value support.
 * @param {typeof css2} css2Tag
 */
export const svg2WithHybridSupport =
  svg2Tag =>
  /**
   * @param {TemplateStringsArray} strings
   * @param {unknown[]} values
   * @returns {import('@lion/core').TemplateResult}
   */
  (strings, ...values) => {
    /** @type {unknown[]} */
    const newValues = [];
    values.forEach(v => {
      const newV = v;
      if (newV._$litType$ !== 2) {
        // Make sure it will not be rejected inside 'original' css2 tag
        // (key notation to prevent mangling by rollup and other build tools)
        // eslint-disable-next-line dot-notation
        newV['_$litType$'] = 2;
      }
      newValues.push(newV);
    });
    return svg2Tag(strings, ...newValues);
  };

/**
 * Will be compatible inside lit2 context
 */
export const svg2Hybrid = svg2WithHybridSupport(svg2);
