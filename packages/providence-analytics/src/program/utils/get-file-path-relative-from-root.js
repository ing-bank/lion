/**
 * @desc relative path of analyzed file, realtive to project root of analyzed project
 * - from: '/my/machine/details/analyzed-project/relevant/file.js'
 * - to: './relevant/file.js'
 * @param {string} absolutePath
 * @param {string} projectRoot
 */
function getFilePathRelativeFromRoot(absolutePath, projectRoot) {
  return absolutePath.replace(projectRoot, '.');
}

module.exports = { getFilePathRelativeFromRoot };
