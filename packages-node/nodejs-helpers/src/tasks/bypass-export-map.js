import path from 'path';
import { globby } from 'globby';
// @ts-ignore
import { createRequire } from 'module';
// @ts-ignore
import { readFile, writeFile } from 'fs/promises';
import { existsSync, lstatSync } from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isImportDeclaration, isExportDeclaration } from '@babel/types';
import { prettify } from '../prettify.js';
import { makeDir } from '../fs.js';
import { asyncConcurrentForEach } from '../util.js';
import { transformCode } from '../babel.js';

export const ERROR_CAN_NOT_OVERWRITE_EXISTING_FILE = 'Can not overwrite existing file';
export const ERROR_CAN_NOT_RESOLVE_SOURCE = 'Can not resolve source';
export const ERROR_ADJUSTED_SOURCE_IS_INVALID = 'Adjusted source is invalid'; // TODO: Can not adjust source maybe
export const ERROR_CAN_NOT_ACCESS_PACKAGE_DIR = 'Can not access package directory';

/**
 * Checks whether given `filePath` points to a directory
 * @param {string} filePath
 * @returns {boolean}
 */
const isDirectorySync = filePath => lstatSync(filePath).isDirectory();

/**
 * Adjusts the source by updating the relative path value
 *
 * @param {string} initialSource Example: `import sth from source;`
 * @param {string} exportsDir
 * @param {string} outputDir
 * @returns {string}
 */
const adjustSource = (initialSource, exportsDir, outputDir) => {
  const initialSourcePath = path.resolve(exportsDir, initialSource);
  const adjustedSource = path.relative(outputDir, initialSourcePath);
  return adjustedSource.startsWith('.') ? adjustedSource : `./${adjustedSource}`;
};

/**
 * Checks if initialSource and adjustedSource point to resolvable resources,
 * and if they are pointing to the same resource
 *
 * @param {string} initialSource Example: `import sth from initialSource;`
 * @param {string} adjustedSource Example: `import sth from adjustedSource;`
 * @param {string} exportsDir
 * @param {string} outputDir
 * @returns {boolean}
 * @throws ERROR_CAN_NOT_RESOLVE_SOURCE
 */
const resolvesToSameResource = (initialSource, adjustedSource, exportsDir, outputDir) => {
  try {
    const require = createRequire(import.meta.url);
    const initialResolvedPath = require.resolve(initialSource, { paths: [exportsDir] });
    const adjustedResolvedPath = require.resolve(adjustedSource, { paths: [outputDir] });
    return initialResolvedPath === adjustedResolvedPath;
  } catch (error) {
    throw new Error(ERROR_CAN_NOT_RESOLVE_SOURCE);
  }
};

/**
 * Adjusts the source value of an import/export declaration.
 *   Example: `import sth from source;`
 * The new source value is calculated relative to the outputDir.
 * And checked to be resolvable to the same resource with Node.js require.resolve
 *
 * https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#visitors
 * @param {string} exportsDir
 * @param {string} outputDir
 * @throws ERROR_ADJUSTED_SOURCE_IS_INVALID
 */
const getAdjustImportExportVisitor = (exportsDir, outputDir) => ({
  // @ts-ignore
  enter({ node }) {
    const isImportOrExportNode = isImportDeclaration(node) || isExportDeclaration(node);
    if (!isImportOrExportNode) {
      return;
    }
    // @ts-ignore
    const { source } = node;
    const initialSource = source?.value;
    if (!initialSource) {
      return;
    }
    const isRelativeSource = initialSource?.startsWith('.');
    if (!isRelativeSource) {
      return;
    }
    const adjustedSource = adjustSource(initialSource, exportsDir, outputDir);
    if (!resolvesToSameResource(initialSource, adjustedSource, exportsDir, outputDir)) {
      throw new Error(ERROR_ADJUSTED_SOURCE_IS_INVALID);
    }
    // register the new source value
    source.value = adjustedSource;
  },
});

/**
 * Adjusts relative paths for a given fileName,
 * and writes it with the same fileName under the outputDir
 *
 * @param {string} fileName
 * @param {string} exportsDir
 * @param {string} outputDir
 * @throws ERROR_CAN_NOT_OVERWRITE_EXISTING_FILE
 */
const generateAdjustedExportFile = async (fileName, exportsDir, outputDir) => {
  const outputPath = path.resolve(outputDir, fileName);
  if (existsSync(outputPath)) {
    throw new Error(ERROR_CAN_NOT_OVERWRITE_EXISTING_FILE);
  }
  const inputPath = path.resolve(exportsDir, fileName);
  const initialCode = await readFile(inputPath, 'utf-8');
  const adjustImportExportVisitor = getAdjustImportExportVisitor(exportsDir, outputDir);
  const adjustedCode = transformCode(initialCode, adjustImportExportVisitor);
  return writeFile(outputPath, prettify(adjustedCode));
};

/**
 * @param {string} packageDir
 * @param {string} exportMapKey
 * @param {string} exportMapValue
 * @returns {Promise<any>}
 */
const bypassExportMapItem = async (packageDir, exportMapKey, exportMapValue) => {
  const exportMapValuePath = path.join(packageDir, exportMapValue);
  const exportMapKeyPath = path.join(packageDir, exportMapKey);
  // TODO: css import assertions, use generic export map resolver from providence?
  const searchPattern = isDirectorySync(exportMapValuePath)
    ? path.join(exportMapValuePath, '**', '*.js')
    : exportMapValuePath;
  const filePaths = await globby(searchPattern);
  // @ts-ignore
  return asyncConcurrentForEach(filePaths, async filePath => {
    const outputFilePath = filePath.replace(exportMapValuePath, exportMapKeyPath);
    const outputDir = path.dirname(outputFilePath);
    const fileName = path.basename(filePath);
    const exportsDir = path.dirname(filePath);
    await makeDir(outputDir);
    return generateAdjustedExportFile(fileName, exportsDir, outputDir);
  });
};

/**
 * Stringify export values of the packageJson.exports
 * @param {{default:string, module: string}|string} value Value of an packageJson.exports entry
 * @returns {string} String value of exports map
 */
// @ts-ignore
const stringifyExportValue = value => value?.default || value?.module || value;

/**
 * Normalizes the export values of packageJson.exports by stringifying the values
 * @param {object} exports packageJson.exports
 * @param {string[]} ignoredExportMapKeys
 * @returns {object} packageJson.exports in which all the values are string
 */
const normalizeExportMap = (exports, ignoredExportMapKeys = []) => {
  // @ts-ignore
  const removeFirstStar = str => str.replace('*', '');
  return Object.entries(exports || {})
    .filter(([exportKey]) => !ignoredExportMapKeys.includes(exportKey))
    .reduce((accumulator, [key, value]) => {
      accumulator[removeFirstStar(key)] = removeFirstStar(stringifyExportValue(value));
      return accumulator;
    }, {});
};

/**
 * Bypasses export map
 *
 * @param {string} packageDir
 * @param {{ignoredExportMapKeys?: string[]}} [options]
 * @throws ERROR_CAN_NOT_ACCESS_PACKAGE_DIR
 * @returns {Promise<any>}
 */
export const bypassExportMap = async (packageDir, options = {}) => {
  const ignoredExportMapKeys = options.ignoredExportMapKeys || [];
  if (!existsSync(packageDir)) {
    throw new Error(ERROR_CAN_NOT_ACCESS_PACKAGE_DIR);
  }
  const require = createRequire(import.meta.url);
  // eslint-disable-next-line import/no-dynamic-require
  const { exports } = require(path.resolve(packageDir, 'package.json'));
  const exportMap = normalizeExportMap(exports, ignoredExportMapKeys);
  return asyncConcurrentForEach(
    Object.entries(exportMap),
    // @ts-ignore
    ([exportMapKey, exportMapValue]) =>
      bypassExportMapItem(packageDir, exportMapKey, exportMapValue),
  );
};
