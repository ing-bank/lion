/**
 * @desc determines for a source path of an import- or export specifier, whether
 * it is relative (an internal import/export) or absolute (external)
 * - relative: './helpers', './helpers.js', '../helpers.js'
 * - not relative: '@open-wc/helpers', 'project-x/helpers'
 * @param {string} source source path of an import- or export specifier
 * @returns {boolean}
 */
function isRelativeSourcePath(source) {
  return source.startsWith('.');
}

module.exports = isRelativeSourcePath;
