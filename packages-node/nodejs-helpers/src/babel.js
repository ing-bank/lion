import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
// eslint-disable-next-line no-unused-vars
import * as babelTypes from '@babel/types';

const traverse = _traverse.default;
const generate = _generate.default;

/**
 * @typedef {import('@babel/parser').ParserOptions} ParserOptions
 * @typedef {import('@babel/parser').ParseResult<babelTypes.File>} AST
 */

/**
 * Parses `code` with the given `options` and returns the resulting AST
 * @param {string} code
 * @param {ParserOptions} [options]
 *   [{ sourceType: 'module', plugins: ['importMeta', 'dynamicImport', 'classProperties']}]
 *   - https://babeljs.io/docs/babel-parser#options
 * @returns {AST}
 */
export const parseCode = (code, options = {}) => {
  /** @type ParserOptions */
  const parserOptions = {
    sourceType: 'module',
    plugins: ['importMeta', 'dynamicImport', 'classProperties'],
    ...options,
  };
  const ast = parse(code, parserOptions);
  return ast;
};

/**
 * Transforms `code` by traversing the AST tree with the `visitor`
 * @param {string} code
 * @param {object} visitor https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#visitors
 * @param {ParserOptions} [parserOptions]
 *   [{ sourceType: 'module', plugins: ['importMeta', 'dynamicImport', 'classProperties']}]
 *   - https://babeljs.io/docs/babel-parser#options
 * @returns {string}
 */
export const transformCode = (code, visitor, parserOptions = {}) => {
  const ast = parseCode(code, parserOptions);
  // @ts-ignore
  traverse(ast, visitor);
  // @ts-ignore
  const { code: transformedCode } = generate(ast);
  return transformedCode;
};
