import path from 'path';
import t from '@babel/types';
import babelTraverse from '@babel/traverse';
import { Analyzer } from '../core/Analyzer.js';
import { trackDownIdentifierFromScope } from './helpers/track-down-identifier.js';

/**
 * @typedef {import('@babel/types').File} File
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').FindCustomelementsConfig} FindCustomelementsConfig
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

async function trackdownRoot(transformedEntry, relativePath, projectPath) {
  const fullCurrentFilePath = path.resolve(projectPath, relativePath);

  for (const definitionObj of transformedEntry) {
    const rootFile = await trackDownIdentifierFromScope(
      definitionObj.__tmp.astPath,
      definitionObj.constructorIdentifier,
      fullCurrentFilePath,
      projectPath,
    );
    // eslint-disable-next-line no-param-reassign
    definitionObj.rootFile = rootFile;
  }
  return transformedEntry;
}

/**
 * Finds import specifiers and sources
 * @param {File} babelAst
 */
function findCustomElementsPerAstFile(babelAst) {
  const definitions = [];
  babelTraverse.default(babelAst, {
    CallExpression(astPath) {
      let found = false;
      // Doing it like this we detect 'customElements.define()',
      // but also 'window.customElements.define()'
      astPath.traverse({
        MemberExpression(memberPath) {
          if (memberPath.parentPath !== astPath) {
            return;
          }
          const { node } = memberPath;
          if (node.object.name === 'customElements' && node.property.name === 'define') {
            found = true;
          }
          if (
            node.object.object &&
            node.object.object.name === 'window' &&
            node.object.property.name === 'customElements' &&
            node.property.name === 'define'
          ) {
            found = true;
          }
        },
      });
      if (found) {
        let tagName;
        let constructorIdentifier;

        if (t.isLiteral(astPath.node.arguments[0])) {
          tagName = astPath.node.arguments[0].value;
        } else {
          // No Literal found. For now, we only mark them as '[variable]'
          tagName = '[variable]';
        }
        if (astPath.node.arguments[1].type === 'Identifier') {
          constructorIdentifier = astPath.node.arguments[1].name;
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

  /** @type {'babel'|'swc-to-babel'} */
  requiredAst = 'swc-to-babel';

  /**
   * Finds export specifiers and sources
   * @param {FindCustomelementsConfig} customConfig
   */
  async execute(customConfig = {}) {
    const cfg = {
      targetProjectPath: null,
      ...customConfig,
    };

    /**
     * Prepare
     */
    const cachedAnalyzerResult = this._prepare(cfg);
    if (cachedAnalyzerResult) {
      return cachedAnalyzerResult;
    }

    /**
     * Traverse
     */
    const projectPath = cfg.targetProjectPath;
    const queryOutput = await this._traverse(async (ast, context) => {
      let transformedEntry = findCustomElementsPerAstFile(ast);
      transformedEntry = await trackdownRoot(transformedEntry, context.relativePath, projectPath);
      transformedEntry = cleanup(transformedEntry);
      return { result: transformedEntry };
    });

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }
}
