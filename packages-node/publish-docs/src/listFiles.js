import fs from 'fs';
import path from 'path';

import glob from 'glob';

/**
 * Lists all files using the specified glob, starting from the given root directory.
 *
 * Will return all matching file paths fully resolved.
 *
 * @param {string} fromGlob
 * @param {string} rootDir
 */
export function listFiles(fromGlob, rootDir) {
  return new Promise(resolve => {
    glob(
      fromGlob,
      { cwd: rootDir },
      /**
       * @param {Error | null} er
       * @param {string[]} files
       */
      (er, files) => {
        // remember, each filepath returned is relative to rootDir
        resolve(
          files
            // fully resolve the filename relative to rootDir
            .map(filePath => path.resolve(rootDir, filePath))
            // filter out directories
            .filter(filePath => !fs.lstatSync(filePath).isDirectory()),
        );
      },
    );
  });
}
