import path from 'path';
import { fsGlob } from 'providence-analytics/utils.js';
// @ts-ignore
import { createRequire } from 'module';
// @ts-ignore
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isImportDeclaration } from '@babel/types';
import { prettify } from '../prettify.js';
import { asyncConcurrentForEach } from '../util.js';
import { transformCode } from '../babel.js';

export const ERROR_CAN_NOT_RESOLVE_SOURCE = 'Can not resolve source';
export const ERROR_CAN_NOT_ACCESS_PACKAGE_DIR = 'Can not access package directory';

/**
 * Gets the matching pattern and replacement from importMap for the given source
 *
 * @param {string} source
 * @param {string} fileDir
 * @param {string} packageDir
 * @param {object} importMap
 * @returns
 */
const getMatchingPatternAndReplacement = (source, fileDir, packageDir, importMap) => {
  const [pattern, replacement] =
    Object.entries(importMap).find(([key]) => source.includes(key)) || [];
  if (!pattern || !replacement) {
    return { pattern: '', replacement: '' };
  }
  const fileToPackageRelativeDir = path.relative(fileDir, packageDir).replace(/\\/g, '/') || '.';
  // TODO: Is there a case where replacement does not start with ./, check spec.
  const updatedReplacement = replacement.replace('./', `${fileToPackageRelativeDir}/`);
  return { pattern, replacement: updatedReplacement };
};

/**
 * Adjusts the source value of an import declaration.
 *   Example: `import sth from source;`
 * The new source value is calculated with respect to `imports` defined in package.json
 * And checked to be resolvable with Node.js require.resolve
 *
 * https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#visitors
 * @param {string} filePath
 * @param {string} packageDir
 * @param {object} importMap
 * @throws ERROR_ADJUSTED_SOURCE_IS_INVALID
 */
const getAdjustImportVisitor = (filePath, packageDir, importMap) => ({
  // @ts-ignore
  enter({ node }) {
    const isImportNode = isImportDeclaration(node);
    if (!isImportNode) {
      return;
    }
    // @ts-ignore
    const { source } = node;
    const initialSource = source?.value;
    if (!initialSource) {
      return;
    }
    const fileDir = path.dirname(filePath);
    // @ts-ignore
    const { pattern, replacement } = getMatchingPatternAndReplacement(
      initialSource,
      fileDir,
      packageDir,
      importMap,
    );
    if (pattern === replacement) {
      return;
    }
    const adjustedSource = initialSource.replace(pattern, replacement);
    try {
      const require = createRequire(import.meta.url);
      require.resolve(adjustedSource, { paths: [fileDir] });
    } catch (error) {
      throw new Error(ERROR_CAN_NOT_RESOLVE_SOURCE);
    }
    // register the new source value
    source.value = adjustedSource;
  },
});

/**
 * Bypasses import map for a file given by `filePath`
 *
 * @param {string} filePath
 * @param {string} packageDir
 * @param {object} importMap
 * @returns {Promise<any>}
 */
const bypassImportMapForFile = async (filePath, packageDir, importMap) => {
  const initialCode = await readFile(filePath, 'utf-8');
  const adjustImportVisitor = getAdjustImportVisitor(filePath, packageDir, importMap);
  const updatedCode = transformCode(initialCode, adjustImportVisitor);
  const prettyInitialCode = await prettify(initialCode);
  const prettyUpdatedCode = await prettify(updatedCode);
  if (prettyInitialCode === prettyUpdatedCode) {
    return Promise.resolve();
  }
  return writeFile(filePath, prettyUpdatedCode);
};

/**
 * Normalizes string and ESM conditional import targets by removing the stars
 *
 * @param {object} imports packageJson.imports
 * @returns {object}
 */
const normalizeImportMap = imports => {
  // @ts-ignore
  const removeFirstStar = str => str.replace('*', '');
  return Object.entries(imports || {}).reduce((accumulator, [key, value]) => {
    const target =
      value && typeof value === 'object'
        ? Object.entries(value).find(
            ([condition]) => condition === 'import' || condition === 'default',
          )?.[1]
        : value;
    if (typeof target !== 'string') {
      throw new Error(
        `Unsupported import map target for "${key}": expected a string or an import/default string target`,
      );
    }
    // @ts-ignore
    accumulator[removeFirstStar(key)] = removeFirstStar(target);
    return accumulator;
  }, {});
};

/**
 * Bypasses import map for a package given by `packageDir`
 *
 * @param {string} packageDir
 * @param {{ignoredDirs?: string[]}} [options]
 * @throws ERROR_CAN_NOT_ACCESS_PACKAGE_DIR
 * @returns {Promise<any>}
 */
export const bypassImportMap = async (packageDir, options = {}) => {
  // TODO: honour .gitignore when expanding the glob (fsGlob has no gitignore option)
  const ignoredDirs = options.ignoredDirs || ['node_modules'];
  if (!existsSync(packageDir)) {
    throw new Error(ERROR_CAN_NOT_ACCESS_PACKAGE_DIR);
  }
  const require = createRequire(import.meta.url);
  // eslint-disable-next-line import/no-dynamic-require
  const { imports } = require(path.resolve(packageDir, 'package.json'));
  if (!imports) {
    return Promise.resolve();
  }
  // fsGlob's `absolute` returns path.join(cwd, match), so the cwd has to be absolute itself
  const filePaths = await fsGlob(
    ['**/*.js', ...ignoredDirs.map(dir => `!${dir.replace(/\\/g, '/')}/**`)],
    {
      cwd: path.resolve(packageDir),
      absolute: true,
    },
  );
  const importMap = normalizeImportMap(imports);
  // @ts-ignore
  return asyncConcurrentForEach(filePaths, filePath =>
    bypassImportMapForFile(filePath, packageDir, importMap),
  );
};
