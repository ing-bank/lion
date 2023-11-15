// @ts-ignore
import { readFile } from 'fs/promises';
// @ts-ignore
import { init, parse } from 'es-module-lexer';

/**
 * Call `asyncFn` function serially for each item in the `list`
 * @param {any[]} list List of items
 * @param {function} asyncFn asyncFn(item, index, list)
 * @returns {Promise<void>}
 */
export const asyncSerialForEach = async (list, asyncFn) => {
  for (let index = 0; index < list.length; index += 1) {
    await asyncFn(list[index], index, list);
  }
  return Promise.resolve();
};

/**
 * Call `asyncFn` function concurrently for each item in the `list`
 * @param {any[]} list List of items
 * @param {function} asyncFn asyncFn(item, index, list)
 * @returns {Promise<any>}
 */
export const asyncConcurrentForEach = async (list, asyncFn) => {
  const tasks = [];
  for (let index = 0; index < list.length; index += 1) {
    tasks.push(asyncFn(list[index], index, list));
  }
  return Promise.all(tasks);
};

/**
 * Sort `str1`, `str2` by ascending order [A to Z]
 * @example
 *   byStringAscendingSort('apple', 'banana') == -1
 *   byStringAscendingSort('banana', 'banana') == 0
 *   byStringAscendingSort('cucumber', 'banana') == 1
 * @param {string} str1 First string
 * @param {string} str2 Second string
 * @returns {number}
 */
export const byStringAscendingSort = (str1, str2) => str1.localeCompare(str2);

/**
 * Convert `name` from camelCase to kebab-case
 * @example
 *   camelToKebabCase('exportedFileNames') == 'exported-file-names'
 *   camelToKebabCase('IngCalendar', '_') == 'ing_calendar'
 * @param {string} name
 * @param {string} [separator] ['-']
 * @returns {string}
 */
export const camelToKebabCase = (name, separator = '-') => {
  // @ts-ignore
  const toKebabCase = (letter, index) => {
    const isLowerCaseLetter = letter === letter.toLowerCase();
    return isLowerCaseLetter ? letter : `${index === 0 ? '' : separator}${letter.toLowerCase()}`;
  };
  return name.split('').map(toKebabCase).join('');
};

/**
 * Get export specifiers, declared in a js file given with `filePath`
 * @see {@link https://www.npmjs.com/package/es-module-lexer}
 * @param {string} absFilePath
 * @returns {Promise<string[]>}
 */
export const getExportSpecifiersByFile = async absFilePath => {
  await init;
  const exportFile = await readFile(absFilePath, 'utf-8');
  // eslint-disable-next-line
  const [_, exports] = parse(exportFile);
  // @ts-ignore
  return exports;
};
