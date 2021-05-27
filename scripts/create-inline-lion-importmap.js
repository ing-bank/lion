const globby = require('globby');
const prettier = require('prettier');
const path = require('path');
const { promises } = require('fs');
const rootPkgJson = require('../package.json');

const fs = promises;

async function main() {
  let importMaps = {};

  const pkgJsonPaths = await globby(rootPkgJson.workspaces.map(glob => `${glob}/package.json`));

  pkgJsonPaths.forEach(pkgJsonPath => {
    // TODO: use fs maybe... since it complains about non-global + dynamic require usage
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const json = require(path.resolve(pkgJsonPath));

    const fullPkgName = json.name;
    const pkgName = fullPkgName.split('@lion')[1];
    if (!pkgName) {
      return;
    }
    const { exports } = json;

    const mappedExports = {};
    Object.entries(exports).forEach(entry => {
      const key = entry[0].replace('.', fullPkgName);
      const value = entry[1].replace('.', `./lion/packages${pkgName}`);
      mappedExports[key] = value;
    });

    importMaps = {
      ...importMaps,
      ...mappedExports,
    };
  });

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
