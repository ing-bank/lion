const fs = require('fs');
const path = require('path');

const defaultGatherFilesConfig = {
  extensions: ['.js'],
  excludeFiles: [],
  excludeFolders: ['node_modules', 'bower_components', '.history'],
  depth: Infinity,
};

/**
 * @desc Gets an array of files for given extension
 * @param {string} startPath - local filesystem path
 * @param {GatherFilesConfig} customConfig - configuration object
 * @param {string[]} [result] - list of file paths, for internal (recursive) calls
 * @param {number} [depth=Infinity] how many recursive calls should be made
 * @returns {string[]} result list of file paths
 */
function gatherFilesFromDir(startPath, customConfig, result = []) {
  const cfg = {
    ...defaultGatherFilesConfig,
    ...customConfig,
  }
  const files = fs.readdirSync(startPath);

  files.forEach((file) => {
    const filePath = path.join(startPath, file);
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory() && cfg.depth !== 0) {
      const folderName = filePath.replace(/.*\/([^/]+)$/, "$1");
      if (!cfg.excludeFolders.includes(folderName)) {
          // search recursively
        this.gatherFilesFromDir(filePath, { ...cfg, depth: cfg.depth -1 }, result);
      }
    } else if (cfg.extensions.includes(path.extname(filePath))) {
      const fileName = filePath.replace(/.*\/([^/]+)$/, "$1");
      if (!cfg.excludeFiles.includes(fileName)) {
        result.push(filePath);
      }
    }
  });
  return result;
}

module.exports = { gatherFilesFromDir };
