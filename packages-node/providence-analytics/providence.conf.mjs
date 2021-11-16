import pathLib from 'path';
import fs from 'fs';

// This file is read by dashboard and cli and needs to be present under process.cwd()
// It mainly serves as an example and it allows to run the dashboard locally
// from within this repo.

/**
 * @returns {string[]}
 */
function getAllLionScopedPackagePaths() {
  const rootPath = pathLib.resolve(__dirname, '../../packages');
  const filesAndDirs = fs.readdirSync(rootPath);
  const packages = filesAndDirs.filter(f => {
    const filePath = pathLib.join(rootPath, f);
    if (fs.lstatSync(filePath).isDirectory()) {
      let pkgJson;
      try {
        pkgJson = JSON.parse(fs.readFileSync(pathLib.resolve(filePath, './package.json')));
        // eslint-disable-next-line no-empty
      } catch (_) {
        return false;
      }
      return pkgJson.name && pkgJson.name.startsWith('@lion/');
    }
    return false;
  });
  return packages.map(p => pathLib.join(rootPath, p));
}

const lionScopedPackagePaths = getAllLionScopedPackagePaths();

export default {
  metaConfig: {
    categoryConfig: [
      {
        // This is the name found in package.json
        project: '@lion/overlays',
        majorVersion: 1,
        // These conditions will be run on overy filePath
        categories: {
          overlays: localFilePath => {
            const names = ['dialog', 'tooltip'];
            const fromPackages = names.some(p => localFilePath.startsWith(`./packages/${p}`));
            const fromRoot =
              names.some(p => localFilePath.startsWith(`./ui-${p}`)) ||
              localFilePath.startsWith('./overlays.js');
            return fromPackages || fromRoot;
          },
          // etc...
        },
      },
    ],
  },
  // By predefening groups, we can do a query for programs/collections...
  // Select via " providence analyze --search-target-collection 'exampleCollection' "
  searchTargetCollections: {
    '@lion-targets': lionScopedPackagePaths,
    // ...
  },
  referenceCollections: {
    // Usually the references are different from the targets.
    // In this demo file, we test @lion usage amongst itself
    // Select via " providence analyze --reference-collection 'exampleCollection' "
    '@lion-references': lionScopedPackagePaths,
  },
};
