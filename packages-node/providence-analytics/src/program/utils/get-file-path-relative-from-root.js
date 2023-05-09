/**
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 */

/**
 * Relative path of analyzed file, realtive to project root of analyzed project
 * - from: '/my/machine/details/analyzed-project/relevant/file.js'
 * - to: './relevant/file.js'
 * @param {PathFromSystemRoot} absolutePath
 * @param {PathFromSystemRoot} projectRoot
 * @returns {PathRelativeFromProjectRoot}
 */
export function getFilePathRelativeFromRoot(absolutePath, projectRoot) {
  return /** @type {PathRelativeFromProjectRoot} */ (absolutePath.replace(projectRoot, '.'));
}
