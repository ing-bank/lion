import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

/**
 *
 * @param {string} rootPath
 * @returns {Promise<>}
 */
function getPackageJson(rootPath) {
  try {
    const fileContent = fs.readFileSync(`${rootPath}/package.json`, 'utf8');
    return JSON.parse(fileContent);
  } catch (_) {
    try {
      // For testing purposes, we allow to have a package.mock.json that contains 'fictional'
      // packages (like 'exporting-ref-project') not on npm registry
      const fileContent = fs.readFileSync(`${rootPath}/package.mock.json`, 'utf8');
      return JSON.parse(fileContent);
    } catch {
      return undefined;
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootPathOfLion = path.resolve(__dirname, '../../packages/ui');

/**
 * @param {{valObjOrStr:object|string|null;nodeResolveMode:string}} opts
 * @returns {string|null}
 */
function getStringOrObjectValOfExportMapEntry({ valObjOrStr, nodeResolveMode }) {
  if (typeof valObjOrStr !== 'object') {
    return valObjOrStr;
  }
  if (!valObjOrStr?.[nodeResolveMode]) {
    // This is allowed: it makes sense to have an entrypoint on the root for typescript, not for others
    return null;
  }
  return valObjOrStr[nodeResolveMode];
}

/**
 * @param {{[key:string]: string|object|null}} exports
 * @param {object} opts
 * @param {'default'|'development'|string} [opts.nodeResolveMode='default']
 * @param {string} opts.packageRootPath
 * @returns {Promise<{internal:string; exposed:string}[]>}
 */
export async function getPathsFromExportMap(
  exports,
  { nodeResolveMode = 'default', packageRootPath },
) {
  const exportMapPaths = [];

  for (const [key, valObjOrStr] of Object.entries(exports)) {
    let resolvedKey = key;
    let resolvedVal = getStringOrObjectValOfExportMapEntry({ valObjOrStr, nodeResolveMode });
    if (resolvedVal === null) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // Allow older specs like "./__element-definitions/" : "./__element-definitions/" to also work,
    // so we normalize them to the new spec
    if (resolvedVal.endsWith?.('/') && resolvedKey.endsWith('/')) {
      resolvedVal += '*';
      resolvedKey += '*';
    }

    if (!resolvedKey.includes('*')) {
      exportMapPaths.push({
        internal: resolvedVal,
        exposed: resolvedKey,
      });
      // eslint-disable-next-line no-continue
      continue;
    }

    // https://nodejs.org/api/packages.html#subpath-exports
    const valueToUseForGlob = stripDotSlashFromLocalPath(resolvedVal).replace('*', '**/*');

    // Generate all possible entries via glob, first strip './'
    const internalExportMapPathsForKeyRaw = await globby(valueToUseForGlob, {
      cwd: packageRootPath,
      onlyFiles: true,
    });

    const exposedExportMapPathsForKeyRaw = internalExportMapPathsForKeyRaw.map(pathInside => {
      // Say we have "exports": { "./*.js": "./src/*.js" }
      // => internalExportMapPathsForKey: ['./src/a.js', './src/b.js']
      // => exposedExportMapPathsForKey: ['./a.js', './b.js']
      const [, variablePart] =
        pathInside.match(new RegExp(valueToUseForGlob.replace('*', '(.*)'))) || [];
      return resolvedKey.replace('*', variablePart);
    });
    const internalExportMapPathsForKey = internalExportMapPathsForKeyRaw.map(
      normalizeLocalPathWithDotSlash,
    );
    const exposedExportMapPathsForKey = exposedExportMapPathsForKeyRaw.map(
      normalizeLocalPathWithDotSlash,
    );

    exportMapPaths.push(
      ...internalExportMapPathsForKey.map((internal, idx) => ({
        internal,
        exposed: exposedExportMapPathsForKey[idx],
      })),
    );
  }

  return exportMapPaths;
}

/**
 *
 * @param {string[]} pkgRootPaths all
 * @param {{depth:number}} opts depth determines how many deps should be traversed
 * @returns {Promise<Record<string,string>>} the import map
 */
export async function createImportMap(pkgRootPaths = [rootPathOfLion], { depth = 1 } = {}) {
  for (const pkgRootPath of pkgRootPaths) {
    // get pkg json
    const pkgJson = getPackageJson(pkgRootPath);
    if (!pkgJson) {
      throw new Error(`No package.json found in ${pkgRootPath}`);
    }
    // get exports
    // generate map...
  }
}
