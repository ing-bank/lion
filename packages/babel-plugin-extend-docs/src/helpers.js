const path = require('path');

function joinPaths(a, b) {
  let joinMe = b;
  if (a && a === b.substring(0, a.length)) {
    joinMe = b.substring(a.length + 1);
  }
  // Normalize for windows
  const updatedPath = path.posix.join(a, joinMe);

  if (a === '' && b.startsWith('./')) {
    return `./${updatedPath}`;
  }
  return updatedPath;
}

module.exports = {
  joinPaths,
};
