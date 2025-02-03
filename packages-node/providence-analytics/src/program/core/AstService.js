import * as parse5 from 'parse5';
import { traverseHtml } from '../utils/traverse-html.js';
import { LogService } from './LogService.js';

/** @type {import('@babel/parser')} */
let babelParser;
/** @type {import('@swc/core')} */
let swcParser;
/** @type {import('oxc-parser')} */
let oxcParser;

/**
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import("oxc-parser").ParseResult} OxcParseResult
 * @typedef {import("@babel/parser").ParserOptions} ParserOptions
 * @typedef {import("@swc/core").Module} SwcAstModule
 * @typedef {import("@babel/types").File} File
 */

export class AstService {
  /**
   * Compiles an array of file paths using Babel.
   * @param {string} code
   * @param {ParserOptions} parserOptions
   * @returns {Promise<File>}
   */
  static async _getBabelAst(code, parserOptions = {}) {
    if (!babelParser) {
      babelParser = (await import('@babel/parser')).default;
    }

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
   * Compiles an array of file paths using swc.
   * @param {string} code
   * @param {ParserOptions} parserOptions
   * @returns {Promise<SwcAstModule>}
   */
  static async _getSwcAst(code, parserOptions = {}) {
    if (!swcParser) {
      swcParser = (await import('@swc/core')).default;
    }

    const ast = swcParser.parseSync(code, {
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
    return swcParser.parseSync('').span.end;
  }

  /**
   * Compiles an array of file paths using swc.
   * @param {string} code
   * @param {object} opts
   * @param {string} [opts.filePath]
   * @param {ParserOptions} [opts.parserOptions]
   * @returns {Promise<OxcParseResult>}
   */
  static async _getOxcAst(code, { filePath = '', parserOptions = {} } = {}) {
    if (!oxcParser) {
      // eslint-disable-next-line import/no-extraneous-dependencies
      oxcParser = (await import('oxc-parser')).default;
    }

    // we can only send stringified data with napi
    return oxcParser.parseSync(filePath, code, parserOptions);
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
   * @param {AnalyzerAst} astType
   * @param { {filePath?: PathFromSystemRoot} } options
   * @returns {Promise<File|undefined|SwcAstModule|OxcParseResult>}
   */
  // eslint-disable-next-line consistent-return
  static async getAst(code, astType, { filePath } = {}) {
    // eslint-disable-next-line default-case
    try {
      if (astType === 'babel') {
        return await this._getBabelAst(code);
      }
      if (astType === 'swc') {
        return await this._getSwcAst(code);
      }
      if (astType === 'oxc') {
        return await this._getOxcAst(code, { filePath });
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
 */
AstService.fallbackToBabel = false;
