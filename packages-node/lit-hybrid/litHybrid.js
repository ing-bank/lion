// eslint-disable-next-line import/no-extraneous-dependencies
import { html as html2, svg as svg2, css as css2, render as render2 } from 'lit';
import { CSSResult as CSSResult1 } from 'lit-element';
import { render as render1 } from 'lit-html';

/**
 * @typedef {import('../../../lion/packages/core/index.js').TemplateResult} TemplateResult1
 * @typedef {import('lit').TemplateResult} TemplateResult2
 * @typedef {import('lit').CSSResult} CSSResult2
 */

/**
 * Helper to render a lit TemplateResult as an offline-created DOM node
 * Make sure that the top-most element in the template has no siblings,
 * as they won't be taken into account. We only return firstElementChild.
 * @param {TemplateResult1} litHtmlTemplate
 */
export const renderLit1AsNode = litHtmlTemplate => {
  const offlineRenderContainer = document.createElement('div');
  render1(litHtmlTemplate, offlineRenderContainer);
  return offlineRenderContainer.firstElementChild;
};

/**
 * Helper to render a lit TemplateResult as an offline-created DOM node
 * Make sure that the top-most element in the template has no siblings,
 * as they won't be taken into account. We only return firstElementChild.
 * @param {TemplateResult2} litHtmlTemplate
 */
export const renderLit2AsNode = litHtmlTemplate => {
  const offlineRenderContainer = document.createElement('div');
  render2(litHtmlTemplate, offlineRenderContainer);
  return offlineRenderContainer.firstElementChild;
};

/**
 * @param {{ processor: any; value: any; _$litType$: any; }|any} potentialTemplateResult
 */
function isLit1TemplateResult(potentialTemplateResult) {
  return (
    potentialTemplateResult.processor &&
    potentialTemplateResult.value &&
    !potentialTemplateResult._$litType$
  );
}

/**
 * Wraps a lit-html template tag (`html` or `svg`) to add static value support.
 * @param {typeof html2 | typeof svg2} html2Tag
 */
export const html2With1Support =
  html2Tag =>
  /**
   * @param {TemplateStringsArray} strings
   * @param {unknown[]} values
   */
  (strings, ...values) => {
    /** @type {unknown[]} */
    const newValues = [];
    values.forEach(v => {
      if (isLit1TemplateResult(v)) {
        newValues.push(renderLit1AsNode(v));
      } else {
        newValues.push(v);
      }
    });
    // By rendering the total result as node, this will be consumable in a lit1 TemplateResult
    return renderLit2AsNode(html2Tag(strings, ...newValues));
  };

export const htmlHybrid = html2With1Support(html2);
export const svgHybrid = html2With1Support(svg2);

/**
 * Wraps a lit-html template tag (`html` or `svg`) to add static value support.
 * @param {typeof css2} css2Tag
 */
export const css2With1Support =
  css2Tag =>
  /**
   * @param {TemplateStringsArray} strings
   * @param {CSSResult1[]} values
   */
  (strings, ...values) => {
    /** @type {CSSResult2[]} */
    const newValues = [];
    values.forEach(v => {
      // Make it pass the check inside of css of lit2, so css1 tags will 'pass'
      if (v instanceof CSSResult1) {
        /** @type {CSSResult2} */
        // @ts-ignore
        const newV = css2Tag([v.cssText]);
        newValues.push(newV);
      } else {
        newValues.push(v);
      }
    });
    return css2Tag(strings, ...newValues);
  };

export const cssHybrid = css2With1Support(css2);
