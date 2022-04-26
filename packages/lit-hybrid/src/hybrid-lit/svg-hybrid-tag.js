// eslint-disable-next-line import/no-extraneous-dependencies
import { isTemplateResult as isTemplateResult2 } from '@lion/core';
import { svg as svg1 } from '@lion/core';
import { isLit1TemplateResult as isTemplateResult1 } from '../helpers/isLit1TemplateResult.js.js.js';

/**
 * @typedef {import('../types').CSSResultHybrid} CSSResultHybrid
 * @typedef {import('../types').TemplateResultHybrid} TemplateResultHybrid
 * @typedef {import('@lion/core').TemplateResult} TemplateResult1
 * @typedef {import('@lion/core').TemplateResult} TemplateResult2
 */

/**
 * Wraps a lit-html template tag (`html` or `svg`) to add static value support.
 * @param {typeof svg1} svg1Tag
 */
export const svgWithHybridSupport =
  svg1Tag =>
  /**
   * @param {TemplateStringsArray} strings
   * @param {(TemplateResult2|TemplateResult1)[]} values
   * @returns {TemplateResultHybrid}
   */
  (strings, ...values) => {
    /** @type {TemplateResultHybrid[]} */
    const newValues = [];
    values.forEach(v => {
      let newV = v;
      if (isTemplateResult2(v)) {
        // 1. Make sure it will not be rejected inside 'original' tag
        // @ts-ignore
        /** @type {TemplateResult1} */
        newV = svg1Tag(v.strings, ...v.values);
      }
      if (isTemplateResult1(v)) {
        // 2. Make sure it will not be rejected inside 'original' tag
        // (key notation to prevent mangling by rollup and other build tools)
        // eslint-disable-next-line dot-notation
        newV['_$litType$'] = 2;
      }
      newValues.push(/** @type {TemplateResultHybrid} */ (newV));
    });
    const result = /** @type {TemplateResultHybrid} */ (svg1Tag(strings, ...newValues));
    // Make sure it will not be rejected inside 'original' css1 tag or `static get styles` of LitElement2
    // (key notation to prevent mangling by rollup and other build tools)
    // eslint-disable-next-line dot-notation
    result['_$litType$'] = 2;
    return result;
  };

/**
 * Will be compatible in both Lit1 and Lit2 context.
 */
export const svgHybrid = svgWithHybridSupport(svg1);
