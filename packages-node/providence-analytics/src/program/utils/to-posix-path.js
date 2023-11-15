/**
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 */

/**
 * @param {PathFromSystemRoot|string} pathStr C:\Example\path/like/this
 * @returns {PathFromSystemRoot} /Example/path/like/this
 */
export function toPosixPath(pathStr) {
  if (process.platform === 'win32') {
    return /** @type {PathFromSystemRoot} */ (pathStr.replace(/^.:/, '').replace(/\\/g, '/'));
  }
  return /** @type {PathFromSystemRoot} */ (pathStr);
}
