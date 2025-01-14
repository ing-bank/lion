import path from 'path';

// import babelTraverse from '@babel/traverse';
import { oxcTraverse } from '../utils/oxc-traverse.js';

import { trackDownIdentifierFromScope } from '../utils/track-down-identifier.js';
import { Analyzer } from '../core/Analyzer.js';

/**
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('@babel/types').File} File
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
 * @param {File} oxcAst
 */
function findCustomElementsPerAstFile(oxcAst) {
  const definitions = [];
  oxcTraverse(oxcAst, {
    CallExpression(astPath) {
      let found = false;
      // Doing it like this we detect 'customElements.define()',
      // but also 'window.customElements.define()'
      astPath.traverse({
        // MemberExpression in babel
        StaticMemberExpression(memberPath) {
          if (memberPath.node !== astPath.node.callee) {
            return;
          }

          const { node } = memberPath;

          if (node.object.name === 'customElements' && node.property.name === 'define') {
            found = true;
          }
          if (
            node.object.object?.name === 'window' &&
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

        if (astPath.node.arguments[0].type === 'StringLiteral') {
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
