const {
  createProgram,
  getPreEmitDiagnostics,
  ModuleKind,
  ModuleResolutionKind,
  ScriptTarget,
} = require('typescript');
const babelParser = require('@babel/parser');
const esModuleLexer = require('es-module-lexer');
const parse5 = require('parse5');
const traverseHtml = require('../utils/traverse-html.js');
const { LogService } = require('./LogService.js');

class AstService {
  /**
   * @deprecated for simplicity/maintainability, only allow Babel for js
   * Compiles an array of file paths using Typescript.
   * @param {string[]} filePaths
   * @param options
   */
  static _getTypescriptAst(filePaths, options) {
    // eslint-disable-next-line no-param-reassign
    filePaths = Array.isArray(filePaths) ? filePaths : [filePaths];

    const defaultOptions = {
      noEmitOnError: false,
      allowJs: true,
      experimentalDecorators: true,
      target: ScriptTarget.Latest,
      downlevelIteration: true,
      module: ModuleKind.ESNext,
      // module: ModuleKind.CommonJS,
      // lib: ["esnext", "dom"],
      strictNullChecks: true,
      moduleResolution: ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      noEmit: true,
      allowSyntheticDefaultImports: true,
      allowUnreachableCode: true,
      allowUnusedLabels: true,
      skipLibCheck: true,
      isolatedModules: true,
    };

    const program = createProgram(filePaths, options || defaultOptions);
    const diagnostics = getPreEmitDiagnostics(program);
    const files = program.getSourceFiles().filter(sf => filePaths.includes(sf.fileName));
    return { diagnostics, program, files };
  }

  /**
   * Compiles an array of file paths using Babel.
   * @param {string} code
   * @param {object} [options]
   */
  static _getBabelAst(code) {
    const ast = babelParser.parse(code, {
      sourceType: 'module',
      plugins: ['importMeta', 'dynamicImport', 'classProperties'],
    });
    return ast;
  }

  /**
   * @desc Combines all script tags as if it were one js file.
   * @param {string} htmlCode
   */
  static getScriptsFromHtml(htmlCode) {
    const ast = parse5.parseFragment(htmlCode);
    /** @type {string[]} */
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
   * @deprecated for simplicity/maintainability, only allow Babel for js
   * @param {string} code
   */
  static async _getEsModuleLexerOutput(code) {
    return esModuleLexer.parse(code);
  }

  /**
   * @desc Returns the desired AST
   * Why would we support multiple ASTs/parsers?
   * - 'babel' is our default tool for analysis. It's the most versatile and popular tool, it's
   * close to the EStree standard (other than Typescript) and a lot of plugins and resources can
   * be found online. It also allows to parse Typescript and spec proposals.
   * - 'typescript' (deprecated) is needed for some valuable third party tooling, like web-component-analyzer
   * - 'es-module-lexer' (deprecated) is needed for the dedicated task of finding module imports; it is way
   * quicker than a full fledged AST parser
   * @param {string} code
   * @param {'babel'|'typescript'|'es-module-lexer'} astType Currently only babel is supported.
   * In the future, we might traverse with Recast
   * @param {object} [options]
   * @param { string } [options.filePath] the path of the file we're trying to parse
   */
  // eslint-disable-next-line consistent-return
  static getAst(code, astType, { filePath } = {}) {
    // eslint-disable-next-line default-case
    try {
      // eslint-disable-next-line default-case
      switch (astType) {
        case 'babel':
          return this._getBabelAst(code);
        case 'typescript':
          LogService.warn(`
            Please notice "typescript" support is deprecated.
          For parsing javascript, "babel" is recommended.`);
          return this._getTypescriptAst(code);
        case 'es-module-lexer':
          LogService.warn(`
            Please notice "es-module-lexer" support is deprecated.
          For parsing javascript, "babel" is recommended.`);
          return this._getEsModuleLexerOutput(code);
      }
    } catch (e) {
      LogService.error(`Error when parsing "${filePath}":/n${e}`);
    }
  }
}

module.exports = { AstService };
