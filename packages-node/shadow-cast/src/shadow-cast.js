const fs = require('fs');
const path = require('path');
const { transformHtmlAndCss } = require('./transform-html-and-css.js');

/**
 * @typedef {import('../types/shadow-cast').CssTransformConfig} CssTransformConfig
 * @param {string} annotatedHtmlString
 * @param {string[]} cssSourcePaths
 * @param {CssTransformConfig} [cssTransformConfig]
 */
function shadowCast(annotatedHtmlString, cssSourcePaths, cssTransformConfig) {
  const cssSources = cssSourcePaths.map((/** @type {string} */ p) =>
    fs.readFileSync(path.resolve(process.cwd(), p)).toString(),
  );
  return transformHtmlAndCss(annotatedHtmlString, { cssSources, ...cssTransformConfig });
}

module.exports = {
  shadowCast,
};
