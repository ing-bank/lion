const fs = require('fs');
const path = require('path');

function getDirectories(srcPath) {
  return fs
    .readdirSync(srcPath)
    .filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
}

const components = getDirectories('./packages/ui/components');

module.exports = {
  scopes: ['', 'ui', 'release', ...components],
};
