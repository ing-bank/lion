import { globby } from 'globby';
import path from 'path';
import fs from 'fs';

// TODO: get these utils from providence (instead of copying) or a shared package between the two

/**
 * @typedef {{
 *  name: string;
 *  dependencies?: {[dep:string]: string; };
 *  devDependencies?: {[dep:string]: string; };
 *  exports?: {[key:string]: string | object | null; };
 * }} PackageJson
 *
 * @typedef {{
 *  [packageName: string]: {
 *    [entryPoint:string]: string;
 *  }
 * }} ImportMap
 */

/**
 * @param {string} rootPath
 * @returns {Promise<PackageJson|undefined>}
 */
export async function getPackageJson(rootPath) {
  try {
    const fileContent = await fs.promises.readFile(`${rootPath}/package.json`, 'utf8');
    return JSON.parse(fileContent);
  } catch (_) {
    try {
      // For testing purposes, we allow to have a package.mock.json that contains 'fictional'
      // packages (like 'exporting-ref-project') not on npm registry
      const fileContent = await fs.promises.readFile(`${rootPath}/package.mock.json`, 'utf8');
      return JSON.parse(fileContent);
    } catch {
      return undefined;
    }
  }
}

/**
 * @param {string} localPath
 * @returns {string}
 */
export function normalizeLocalPathWithDotSlash(localPath) {
  return localPath.startsWith('./') ? localPath : `./${localPath}`;
}

/**
 * @param {string} localPathWithDotSlash
 * @returns {string}
 */
function stripDotSlashFromLocalPath(localPathWithDotSlash) {
  return localPathWithDotSlash.replace(/^\.\//, '');
}

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
 * Deducts all exposed entrypoints in export map and resolves their relative internal paths.
 *
 * @param {{[key:string]: string | object | null}} exportMap
 * @param {object} opts
 * @param {'default' | 'development' | string} [opts.nodeResolveMode='default']
 * @param {string} opts.packageRootPath
 * @returns {Promise<{internal: string; exposed: string}[]>}
 */
export async function resolveExportMap(
  exportMap,
  { nodeResolveMode = 'default', packageRootPath },
) {
  const exportMapPaths = [];

  for (const [key, valObjOrStr] of Object.entries(exportMap)) {
    let resolvedKey = key;
    let resolvedVal = getStringOrObjectValOfExportMapEntry({ valObjOrStr, nodeResolveMode });
    if (resolvedVal === null) continue; // eslint-disable-line no-continue

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
      continue; // eslint-disable-line no-continue
    }

    // https://nodejs.org/api/packages.html#subpath-exportMap
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
        pathInside.match(new RegExp(valueToUseForGlob.replace('*', '(.*)').replace(/\\/g, '/'))) ||
        [];
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
 * @type {string}
 */
let _monoRootPath;

/**
 * @param {string} pkgRootPath
 * @returns {string}
 */
function findMonoRootPath(pkgRootPath) {
  if (typeof _monoRootPath === 'string') return _monoRootPath;

  let currentPath = pkgRootPath;
  // Are we in a monorepo? If so, find the closest parent with package.json / node_modules
  while (!_monoRootPath && currentPath !== '/') {
    currentPath = path.resolve(currentPath, '..');
    const potentialPackagePath = path.join(currentPath, 'package.json');
    if (fs.existsSync(potentialPackagePath)) {
      _monoRootPath = currentPath;
      return _monoRootPath;
    }
  }
  _monoRootPath = '';
  return _monoRootPath;
}

/**
 * Give a package name like '@my/package', find the package root path in the filesystem.
 * This is usually inside node_modules of the current package, or in node_modules of a possible monorepo root
 * @param {string} dep
 * @param {string} pkgRootPath
 */
function resolvePackageRootFromPackageName(dep, pkgRootPath) {
  const depPathInNodeModules = path.join(pkgRootPath, 'node_modules', dep);
  if (fs.existsSync(depPathInNodeModules)) {
    return path.join(pkgRootPath, 'node_modules', dep);
  }
  const monoRootPath = findMonoRootPath(pkgRootPath);
  if (monoRootPath) {
    const depPathInMonoRootNodeModules = path.join(monoRootPath, 'node_modules', dep);
    if (fs.existsSync(depPathInMonoRootNodeModules)) {
      return depPathInMonoRootNodeModules;
    }
  }
  return undefined;
}

/**
 * @param {string} pkgRootPath
 * @param {{cwd?: string}} opts
 * @returns {string}
 */
function getRelativePathFromCwd(pkgRootPath, { cwd = process.cwd() } = {}) {
  const relativePath = path.relative(cwd, pkgRootPath);
  if (relativePath.startsWith('..')) {
    throw new Error(`Package root path ${pkgRootPath} is outside of the current working directory`);
  }
  return relativePath;
}

/**
 * @param {string[]} pkgRootPaths all
 * @param {{
 *  packagesToTraceDepsFor?: string[];
 *  cwd?: string;
 * }} opts
 * @returns {Promise<ImportMap>} the import map
 */
export async function createImportMap(
  pkgRootPaths,
  { packagesToTraceDepsFor = [], cwd = process.cwd() } = {},
) {
  if (!Array.isArray(pkgRootPaths) || pkgRootPaths.length === 0) {
    throw new Error('No package root path(s) provided');
  }

  /** @type {ImportMap} */
  const importMap = {};
  for (const pkgRootPath of pkgRootPaths) {
    // get pkg json
    const pkgJson = await getPackageJson(pkgRootPath);
    if (!pkgJson) {
      throw new Error(`No package.json found in ${pkgRootPath}`);
    }

    // 1. Add our own resolved export map
    if (pkgJson.exports) {
      const exportMap = pkgJson.exports || {};
      const exportMapPaths = await resolveExportMap(exportMap, {
        nodeResolveMode: 'default',
        packageRootPath: pkgRootPath,
      });
      importMap[pkgJson.name] = importMap[pkgJson.name] || {};
      for (const { internal, exposed } of exportMapPaths) {
        importMap[pkgJson.name][exposed] = getRelativePathFromCwd(
          path.resolve(pkgRootPath, internal),
          { cwd },
        );
      }
    } else {
      // If no exports, we assume the package is a module and add all files in the root
      const files = await globby('**/*.js', { cwd: pkgRootPath, onlyFiles: true });
      importMap[pkgJson.name] = importMap[pkgJson.name] || {};
      for (const file of files) {
        importMap[pkgJson.name][normalizeLocalPathWithDotSlash(file)] = getRelativePathFromCwd(
          path.resolve(pkgRootPath, file),
          { cwd },
        );
      }
    }

    // 2. Do the same for all dependencies
    if (!packagesToTraceDepsFor.includes(pkgJson.name)) continue; // eslint-disable-line no-continue

    const deps = Object.keys(pkgJson.dependencies || {});
    const depRootPaths = /** @type {string[]} */ (
      deps.map(dep => resolvePackageRootFromPackageName(dep, pkgRootPath)).filter(Boolean)
    );

    const depsImportMap = await createImportMap(depRootPaths, { packagesToTraceDepsFor, cwd });
    Object.assign(importMap, depsImportMap);
  }
  return importMap;
}
