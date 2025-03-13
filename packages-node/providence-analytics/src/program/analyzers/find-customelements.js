import path from 'path';

// import babelTraverse from '@babel/traverse';
import { isLiteral, nameOf, expressionOf } from '../utils/ast-normalizations.js';
import { trackDownIdentifierFromScope } from '../utils/track-down-identifier.js';
import { oxcTraverse } from '../utils/oxc-traverse.js';
import { Analyzer } from '../core/Analyzer.js';

/**
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('@babel/types').File} File
 * @typedef {import("@swc/core").Node} SwcNode
 */

/**
 * @param {SwcNode} node
 * @returns {boolean}
 */
export function isCustomElementsObj(node) {
  if (!node) return false;

  return (
    // @ts-expect-error
    nameOf(node.object) === 'customElements' ||
    // @ts-expect-error
    (nameOf(node.object?.object) === 'window' &&
      // @ts-expect-error
      nameOf(node.object?.property) === 'customElements')
  );
}

/**
 * @param {SwcNode} node
 * @returns {boolean}
 */
export function isCustomElementsGet(node) {
  if (!node) return false;

  // @ts-expect-error
  return isCustomElementsObj(node) && nameOf(node.property) === 'get';
}

/**
 * @param {SwcNode} node
 * @returns {boolean}
 */
export function isCustomElementsDefine(node) {
  if (!node) return false;

  // @ts-expect-error
  return isCustomElementsObj(node) && nameOf(node.property) === 'define';
}

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
 * @param {File} oxcAst
 */
function findCustomElementsPerAstFile(oxcAst) {
  const definitions = [];

  oxcTraverse(oxcAst, {
    CallExpression(astPath) {
      let didFindCeDefine = false;
      const onMemberExpr = memberPath => {
        if (memberPath.node !== astPath.node.callee) return;

        if (isCustomElementsDefine(memberPath.node)) {
          didFindCeDefine = true;
        }
      };
      // Doing it like this we detect 'customElements.define()',
      // but also 'window.customElements.define()'
      astPath.traverse({
        StaticMemberExpression: onMemberExpr,
        // MemberExpression in babel and swc
        MemberExpression: onMemberExpr,
      });
      if (didFindCeDefine) {
        let tagName;
        let constructorIdentifier;

        const firstArg = astPath.node.arguments[0];
        if (isLiteral(expressionOf(firstArg))) {
          tagName = nameOf(expressionOf(firstArg));
        } else {
          // No Literal found. For now, we only mark them as '[variable]'
          tagName = '[variable]';
        }

        const secondArg = expressionOf(astPath.node.arguments[1]);
        if (secondArg.type === 'Identifier') {
          constructorIdentifier = nameOf(secondArg);
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
    return {
      targetProjectPath: null,
      ...this._customConfig,
    };
  }

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
