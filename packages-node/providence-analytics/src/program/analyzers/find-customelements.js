const pathLib = require('path');
const t = require('@babel/types');
const { default: traverse } = require('@babel/traverse');
const { Analyzer } = require('../core/Analyzer.js');
const { trackDownIdentifierFromScope } = require('./helpers/track-down-identifier.js');
const { aForEach } = require('../utils/async-array-utils.js');

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
  const fullCurrentFilePath = pathLib.resolve(projectPath, relativePath);

  await aForEach(transformedEntry, async definitionObj => {
    const rootFile = await trackDownIdentifierFromScope(
      definitionObj.__tmp.path,
      definitionObj.constructorIdentifier,
      fullCurrentFilePath,
      projectPath,
    );
    // eslint-disable-next-line no-param-reassign
    definitionObj.rootFile = rootFile;
  });
  return transformedEntry;
}

/**
 * @desc Finds import specifiers and sources
 * @param {BabelAst} ast
 */
function findCustomElementsPerAstEntry(ast) {
  const definitions = [];
  traverse(ast, {
    CallExpression(path) {
      let found = false;
      // Doing it like this we detect 'customElements.define()',
      // but also 'window.customElements.define()'
      path.traverse({
        MemberExpression(memberPath) {
          if (memberPath.parentPath !== path) {
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

        if (t.isLiteral(path.node.arguments[0])) {
          tagName = path.node.arguments[0].value;
        } else {
          // No Literal found. For now, we only mark them as '[variable]'
          tagName = '[variable]';
        }
        if (path.node.arguments[1].type === 'Identifier') {
          constructorIdentifier = path.node.arguments[1].name;
        } else {
          // We assume customElements.define('my-el', class extends HTMLElement {...})
          constructorIdentifier = '[inline]';
        }
        definitions.push({ tagName, constructorIdentifier, __tmp: { path } });
      }
    },
  });
  return definitions;
}

class FindCustomelementsAnalyzer extends Analyzer {
  static get analyzerName() {
    return 'find-customelements';
  }

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
    const analyzerResult = this._prepare(cfg);
    if (analyzerResult) {
      return analyzerResult;
    }

    /**
     * Traverse
     */
    const projectPath = cfg.targetProjectPath;
    const queryOutput = await this._traverse(async (ast, { relativePath }) => {
      let transformedEntry = findCustomElementsPerAstEntry(ast);
      transformedEntry = await trackdownRoot(transformedEntry, relativePath, projectPath);
      transformedEntry = cleanup(transformedEntry);
      return { result: transformedEntry };
    });

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }
}

module.exports = FindCustomelementsAnalyzer;
