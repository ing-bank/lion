import fs from 'fs';
import path from 'path';
import { getPublicApiOfPkg } from './getPublicApiOfPkg.js';

/**
 * @param {object} opts
 * @param {string} [opts.nodeModulesDir]
 * @param {string} [opts.npmScope]
 * @param {string} opts.classPrefix
 * @param {string} opts.classBareImport
 * @param {string} opts.tagPrefix
 * @param {string} opts.tagBareImport
 * @param {string} [opts.exportsMapJsonFileName]
 * @returns
 */
export async function generateExtendDocsConfig(opts) {
  const {
    nodeModulesDir,
    npmScope = '@lion',
    classPrefix,
    classBareImport,
    tagPrefix,
    tagBareImport,
    exportsMapJsonFileName = 'package.json',
  } = opts;
  const _nodeModulesDir = nodeModulesDir || path.resolve('./node_modules');

  const folderToCheck = npmScope ? path.join(_nodeModulesDir, npmScope) : _nodeModulesDir;
  const packages = fs
    .readdirSync(folderToCheck)
    .filter(dir => fs.statSync(path.join(folderToCheck, dir)).isDirectory())
    .map(dir => (npmScope ? `${npmScope}/${dir}` : dir));

  const changes = [];
  for (const pkgName of packages) {
    const pkgPath = path.join(_nodeModulesDir, ...pkgName.split('/'));
    const pkgJsonPath = path.join(pkgPath, exportsMapJsonFileName);

    const publicApi = await getPublicApiOfPkg(pkgJsonPath);
    for (const entryPoint of publicApi.entryPoints) {
      const { exports, name, namePath, path: entryPointFile } = entryPoint;

      for (const exportName of exports) {
        changes.push({
          name: `${name} - ${exportName}`,
          variable: {
            from: exportName,
            to: exportName.replace(/^Lion/, classPrefix),
            paths: [
              {
                from: name,
                to: `${classBareImport}${namePath}`,
              },
            ],
          },
        });
      }

      const src = await fs.promises.readFile(entryPointFile, 'utf8');
      if (src.includes('.define(')) {
        const matches = src.match(/define\(['"](.*)['"]/);
        if (matches && matches[1]) {
          const tagName = matches[1];
          changes.push({
            name,
            tag: {
              from: tagName,
              to: tagName.replace(/^lion-/, tagPrefix),
              paths: [
                {
                  from: name,
                  to: `${tagBareImport}${namePath.replace('lion-', tagPrefix)}`,
                },
              ],
            },
          });
        }
      }
    }
  }

  return changes;
}
