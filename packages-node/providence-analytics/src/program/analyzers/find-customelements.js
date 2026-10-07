import path from 'path';

// import babelTraverse from '@babel/traverse';
import { oxcTraverse } from '../utils/oxc-traverse.js';

import { trackDownIdentifierFromScope } from '../utils/track-down-identifier.js';
import { Analyzer } from '../core/Analyzer.js';

/**
 * A structural representation of the AST nodes (swc/oxc/babel) that are visited by this
 * analyzer. Every field is optional because the concrete node type depends on the parser.
 * @typedef {object} LooseNode
 * @property {string} [type]
 * @property {string} [name]
 * @property {string} [value]
 * @property {LooseNode} [object]
 * @property {LooseNode} [property]
 * @property {LooseNode} [callee]
 * @property {LooseNode[]} [arguments]
 */
/**
 * @typedef {object} DefinitionObj
 * @property {string} tagName
 * @property {string} constructorIdentifier
 * @property {RootFile} [rootFile]
 * @property {{ astPath: SwcPath }} [__tmp]
 */
/**
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').RootFile} RootFile
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').SwcPath} SwcPath
 * @typedef {import('@babel/types').File} File
 */

/**
 * @param {DefinitionObj[]} transformedEntry
 */
function cleanup(transformedEntry) {
  transformedEntry.forEach(definitionObj => {
    if (definitionObj.__tmp) {
      // eslint-disable-next-line no-param-reassign
      delete definitionObj.__tmp;
    }
  });
  return transformedEntry;
}

/**
 * @param {DefinitionObj[]} transformedEntry
 * @param {string} relativePath
 * @param {string} projectPath
 */
async function trackdownRoot(transformedEntry, relativePath, projectPath) {
  const fullCurrentFilePath = path.resolve(projectPath, relativePath);

  for (const definitionObj of transformedEntry) {
    const tmp = /** @type {{ astPath: SwcPath }} */ (definitionObj.__tmp);
    const rootFile = await trackDownIdentifierFromScope(
      tmp.astPath,
      definitionObj.constructorIdentifier,
      /** @type {PathFromSystemRoot} */ (fullCurrentFilePath),
      /** @type {PathFromSystemRoot} */ (projectPath),
    );
    // eslint-disable-next-line no-param-reassign
    definitionObj.rootFile = rootFile;
  }
  return transformedEntry;
}

/**
 * Finds import specifiers and sources
 * @param {File} oxcAst
 */
function findCustomElementsPerAstFile(oxcAst) {
  /** @type {DefinitionObj[]} */
  const definitions = [];
  oxcTraverse(oxcAst, {
    CallExpression(astPath) {
      const callNode = /** @type {LooseNode} */ (astPath.node);
      let found = false;
      // Doing it like this we detect 'customElements.define()',
      // but also 'window.customElements.define()'
      astPath.traverse({
        // MemberExpression in babel
        MemberExpression(memberPath) {
          const memberNode = /** @type {LooseNode} */ (memberPath.node);
          if (memberPath.node !== callNode.callee) {
            return;
          }

          if (
            memberNode.object?.name === 'customElements' &&
            memberNode.property?.name === 'define'
          ) {
            found = true;
          }
          if (
            memberNode.object?.object?.name === 'window' &&
            memberNode.object?.property?.name === 'customElements' &&
            memberNode.property?.name === 'define'
          ) {
            found = true;
          }
        },
      });
      if (found) {
        /** @type {string} */
        let tagName;
        /** @type {string} */
        let constructorIdentifier;

        const args = /** @type {LooseNode[]} */ (callNode.arguments);
        if (args[0].type === 'StringLiteral' || args[0].type === 'Literal') {
          tagName = /** @type {string} */ (args[0].value);
        } else {
          // No Literal found. For now, we only mark them as '[variable]'
          tagName = '[variable]';
        }
        if (args[1].type === 'Identifier') {
          constructorIdentifier = /** @type {string} */ (args[1].name);
        } else {
          // We assume customElements.define('my-el', class extends HTMLElement {...})
          constructorIdentifier = '[inline]';
        }
        definitions.push({ tagName, constructorIdentifier, __tmp: { astPath } });
      }
    },
  });
  return definitions;
}

export default class FindCustomelementsAnalyzer extends Analyzer {
  /** @type {AnalyzerName} */
  static analyzerName = 'find-customelements';

  /** @type {AnalyzerAst} */
  static requiredAst = 'oxc';

  get config() {
    return /** @type {Analyzer['config']} */ (
      /** @type {unknown} */ ({
        targetProjectPath: null,
        ...this._customConfig,
      })
    );
  }

  /**
   * @param {File} oxcAst
   * @param {{ relativePath:string; projectData:{ project:{ path: PathFromSystemRoot } } }} context
   */
  static async analyzeFile(oxcAst, context) {
    let transformedEntry = findCustomElementsPerAstFile(oxcAst);
    transformedEntry = await trackdownRoot(
      transformedEntry,
      context.relativePath,
      context.projectData.project.path,
    );
    transformedEntry = cleanup(transformedEntry);
    return { result: transformedEntry };
  }
}
