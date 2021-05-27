const globby = require('globby');
const prettier = require('prettier');
const path = require('path');
const { promises } = require('fs');
const rootPkgJson = require('../package.json');

const fs = promises;

async function main() {
  let importMaps = {};

  // Get all paths to package.jsons inside our monorepo
  const pkgJsonPaths = await globby(rootPkgJson.workspaces.map(glob => `${glob}/package.json`));

  for (const pkgJsonPath of pkgJsonPaths) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const json = require(path.resolve(pkgJsonPath));

    const fullPkgName = json.name;
    const pkgName = fullPkgName.split('@lion')[1];

    if (pkgName) {
      const mappedExports = {};
      const { exports } = json;

      // Go through all exports and start mapping
      const entries = Object.entries(exports);
      for (const entry of entries) {
        const key = entry[0].replace('.', fullPkgName);
        const value = entry[1].replace('.', `./lion/packages${pkgName}`);

        // Expand on singular wildcard *
        // Assumptions: it's at the end of the string, it's only 1
        if (key.match(/\*/g)) {
          const absoluteTranslationsPath = path.resolve(
            pkgJsonPath.split('/package.json')[0],
            entry[0],
          );
          const filesFromWildcard = await globby(absoluteTranslationsPath);

          for (const filePath of filesFromWildcard.map(_filePath => path.basename(_filePath))) {
            mappedExports[key.replace('*', filePath)] = value.replace('*', filePath);
          }
        } else {
          mappedExports[key] = value;
        }
      }

      importMaps = {
        ...importMaps,
        ...mappedExports,
      };
    }
  }

  return importMaps;
}

(async () => {
  const importMap = await main();
  fs.writeFile(
    path.resolve('scripts/inline-lion-importmap.json'),
    prettier.format(JSON.stringify({ imports: importMap }), { parser: 'json' }),
    'utf8',
  );
})();
