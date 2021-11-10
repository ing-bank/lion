// const fs = require('fs');
// const pathLib = require('path');
const { isRelativeSourcePath } = require('../../utils/relative-source-path.js');
const { LogService } = require('../../services/LogService.js');
const { resolveImportPath } = require('../../utils/resolve-import-path.js');

/**
 * @param {string} importee like '@lion/core/myFile.js'
 * @returns {string} project name ('@lion/core')
 */
function getProjectFromImportee(importee) {
  const scopedProject = importee[0] === '@';
  // 'external-project/src/file.js' -> ['external-project', 'src', file.js']
  let splitSource = importee.split('/');
  if (scopedProject) {
    // '@external/project'
    splitSource = [splitSource.slice(0, 2).join('/'), ...splitSource.slice(2)];
  }
  // ['external-project', 'src', 'file.js'] -> 'external-project'
  const project = splitSource.slice(0, 1).join('/');

  return project;
}

/**
 * TODO: Use utils/resolve-import-path for  100% accuracy
 *
 * - from: 'reference-project/foo.js'
 * - to: './foo.js'
 * When we need to resolve to the main entry:
 * - from: 'reference-project'
 * - to: './index.js' (or other file specified in package.json 'main')
 * @param {object} config
 * @param {string} config.importee 'reference-project/foo.js'
 * @param {string} config.importer '/my/project/importing-file.js'
 * @returns {string|null} './foo.js'
 */
async function fromImportToExportPerspective({ importee, importer }) {
  if (isRelativeSourcePath(importee)) {
    LogService.warn('[fromImportToExportPerspective] Please only provide external import paths');
    return null;
  }

  const absolutePath = await resolveImportPath(importee, importer);
  const projectName = getProjectFromImportee(importee);

  // console.log(
  //   '&& fromItoE',
  //   importee,
  //   absolutePath.replace(new RegExp(`^.*/${projectName}/?(.*)$`), './$1'),
  // );

  // from /my/reference/project/packages/foo/index.js to './packages/foo/index.js'
  return absolutePath.replace(new RegExp(`^.*/${projectName}/?(.*)$`), './$1');

  // // ['external-project', 'src', 'file.js'] -> 'src/file.js'
  // const localPath = splitSource.slice(1).join('/');

  // if (externalProjectMeta.name !== project) {
  //   return null;
  // }

  // if (localPath) {
  //   // like '@open-wc/x/y.js'
  //   // Now, we need to resolve to a file or path. Even though a path can contain '.',
  //   // we still need to check if we're not dealing with a folder.
  //   // - '@open-wc/x/y.js' -> '@open-wc/x/y.js' or... '@open-wc/x/y.js/index.js' ?
  //   // - or 'lion-based-ui/test' -> 'lion-based-ui/test/index.js' or 'lion-based-ui/test' ?
  //   if (externalRootPath) {
  //     const pathToCheck = pathLib.resolve(externalRootPath, `./${localPath}`);

  //     if (fs.existsSync(pathToCheck)) {
  //       const stat = fs.statSync(pathToCheck);
  //       if (stat && stat.isFile()) {
  //         return `./${localPath}`; // '/path/to/lion-based-ui/fol.der' is a file
  //       }
  //       return `./${localPath}/index.js`; // '/path/to/lion-based-ui/fol.der' is a folder
  //       // eslint-disable-next-line no-else-return
  //     } else if (fs.existsSync(`${pathToCheck}.js`)) {
  //       return `./${localPath}.js`; // '/path/to/lion-based-ui/fol.der' is file '/path/to/lion-based-ui/fol.der.js'
  //     }
  //   } else {
  //     return `./${localPath}`;
  //   }
  // } else {
  //   // like '@lion/core'
  //   let mainEntry = externalProjectMeta.mainEntry || 'index.js';
  //   if (!mainEntry.startsWith('./')) {
  //     mainEntry = `./${mainEntry}`;
  //   }
  //   return mainEntry;
  // }
  // return null;
}

module.exports = { fromImportToExportPerspective };
