import babelParser from '@babel/parser';
import * as parse5 from 'parse5';
import swc from '@swc/core';
import { traverseHtml } from '../utils/traverse-html.js';
import { LogService } from './LogService.js';
import { guardedSwcToBabel } from '../utils/guarded-swc-to-babel.js';

/**
 * @typedef {import("@babel/types").File} File
 * @typedef {import("@swc/core").Module} SwcAstModule
 * @typedef {import("@babel/parser").ParserOptions} ParserOptions
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 */

export class AstService {
  /**
   * Compiles an array of file paths using Babel.
   * @param {string} code
   * @param {ParserOptions} parserOptions
   * @returns {File}
   */
  static _getBabelAst(code, parserOptions = {}) {
    const ast = babelParser.parse(code, {
      sourceType: 'module',
      plugins: [
        'importMeta',
        'dynamicImport',
        'classProperties',
        'exportDefaultFrom',
        'importAssertions',
      ],
      ...parserOptions,
    });
    return ast;
  }

  /**
   * Compiles an array of file paths using Babel.
   * @param {string} code
   * @param {ParserOptions} parserOptions
   * @returns {File}
   */
  static _getSwcToBabelAst(code, parserOptions = {}) {
    if (this.fallbackToBabel) {
      return this._getBabelAst(code, parserOptions);
    }
    const ast = swc.parseSync(code, {
      syntax: 'typescript',
      // importAssertions: true,
      ...parserOptions,
    });
    return guardedSwcToBabel(ast, code);
  }

  /**
   * Compiles an array of file paths using swc.
   * @param {string} code
   * @param {ParserOptions} parserOptions
   * @returns {SwcAstModule}
   */
  static _getSwcAst(code, parserOptions = {}) {
    const ast = swc.parseSync(code, {
      syntax: 'typescript',
      target: 'es2022',
      ...parserOptions,
    });
    return ast;
  }

  /**
   * Compensates for swc span bug: https://github.com/swc-project/swc/issues/1366#issuecomment-1516539812
   * @returns {number}
   */
  static _getSwcOffset() {
    return swc.parseSync('').span.end;
  }

  /**
   * Combines all script tags as if it were one js file.
   * @param {string} htmlCode
   */
  static getScriptsFromHtml(htmlCode) {
    const ast = parse5.parseFragment(htmlCode);
    /**
     * @type {string[]}
     */
    const scripts = [];
    traverseHtml(ast, {
      /**
       * @param {{ node: { childNodes: { value: any; }[]; }; }} path
       */
      script(path) {
        const code = path.node.childNodes[0] ? path.node.childNodes[0].value : '';
        scripts.push(code);
      },
    });
    return scripts;
  }

  /**
   * Returns the Babel AST
   * @param { string } code
   * @param { 'babel'|'swc-to-babel'|'swc'} astType
   * @param { {filePath?: PathFromSystemRoot} } options
   * @returns {File|undefined|SwcAstModule}
   */
  // eslint-disable-next-line consistent-return
  static getAst(code, astType, { filePath } = {}) {
    // eslint-disable-next-line default-case
    try {
      if (astType === 'babel') {
        return this._getBabelAst(code);
      }
      if (astType === 'swc-to-babel') {
        return this._getSwcToBabelAst(code);
      }
      if (astType === 'swc') {
        return this._getSwcAst(code);
      }
      throw new Error(`astType "${astType}" not supported.`);
    } catch (e) {
      LogService.error(`Error when parsing "${filePath}":/n${e}`);
    }
  }
}
/**
 * This option can be used as a last resort when an swc AST combined with swc-to-babel, is backwards incompatible
 * (for instance when @babel/generator expects a different ast structure and fails).
 * Analyzers should use guarded-swc-to-babel util.
 */
AstService.fallbackToBabel = false;
