const babelParser = require('@babel/parser');
const parse5 = require('parse5');
const traverseHtml = require('../utils/traverse-html.js');
const { LogService } = require('./LogService.js');

/**
 * @typedef {import("@babel/types").File} File
 * @typedef {import("@babel/parser").ParserOptions} ParserOptions
 * @typedef {import('../types/core').PathFromSystemRoot} PathFromSystemRoot
 */

class AstService {
  /**
   * Compiles an array of file paths using Babel.
   * @param {string} code
   * @param {ParserOptions} parserOptions
   * @returns {File}
   */
  static _getBabelAst(code, parserOptions = {}) {
    const ast = babelParser.parse(code, {
      sourceType: 'module',
      plugins: ['importMeta', 'dynamicImport', 'classProperties'],
      ...parserOptions,
    });
    return ast;
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
   * @param { 'babel' } astType
   * @param { {filePath: PathFromSystemRoot} } [options]
   * @returns {File|undefined}
   */
  // eslint-disable-next-line consistent-return
  static getAst(code, astType, { filePath } = {}) {
    // eslint-disable-next-line default-case
    try {
      return this._getBabelAst(code);
    } catch (e) {
      LogService.error(`Error when parsing "${filePath}":/n${e}`);
    }
  }
}

module.exports = { AstService };
