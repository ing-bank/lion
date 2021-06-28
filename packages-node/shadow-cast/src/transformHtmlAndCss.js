const { transformHtml } = require('./transformHtml.js');
const { transformCss } = require('./transformCss.js');

/**
 * @typedef {import('../types/csstree').SelectorPlain} SelectorPlain
 * @typedef {import('../types/csstree').Selector} Selector
 * @typedef {import('../types/csstree').CssNodePlain} CssNodePlain
 * @typedef {import('../types/csstree').CssNode} CssNode
 * @typedef {import('../types/shadow-cast').CssTransformConfig} CssTransformConfig
 */

/**
 * @param {string} annotatedHtmlString
 * @param {CssTransformConfig} [cssTransformConfig]
 */
function transformHtmlAndCss(annotatedHtmlString, cssTransformConfig) {
  const htmlResult = transformHtml(annotatedHtmlString);
  const cssResult = transformCss({
    ...htmlResult.cssTransformConfig,
    ...cssTransformConfig,
    htmlMeta: htmlResult.meta,
  });
  // Override for now, allow deep merge via options
  return {
    shadowHtml: htmlResult.shadowHtml,
    slotsHtml: htmlResult.slotsHtml,
    shadowCss: cssResult,
  };
}

module.exports = {
  transformHtmlAndCss,
};
