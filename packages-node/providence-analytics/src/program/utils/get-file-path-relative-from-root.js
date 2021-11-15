/**
 * @typedef {import('../types/core/core').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../types/core/core').PathFromSystemRoot} PathFromSystemRoot
 */

/**
 * Relative path of analyzed file, realtive to project root of analyzed project
 * - from: '/my/machine/details/analyzed-project/relevant/file.js'
 * - to: './relevant/file.js'
 * @param {PathFromSystemRoot} absolutePath
 * @param {PathFromSystemRoot} projectRoot
 * @returns {PathRelativeFromProjectRoot}
 */
function getFilePathRelativeFromRoot(absolutePath, projectRoot) {
  return /** @type {PathRelativeFromProjectRoot} */ (absolutePath.replace(projectRoot, '.'));
}

module.exports = { getFilePathRelativeFromRoot };
