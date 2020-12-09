/**
 * @param {string} pathStr C:\Example\path/like/this
 * returns {string} /Example/path/like/this
 */
function toPosixPath(pathStr) {
  if (process.platform === 'win32') {
    return pathStr.replace(/^.:/, '').replace(/\\/g, '/');
  }
  return pathStr;
}

module.exports = { toPosixPath };
