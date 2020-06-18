/* eslint-disable no-shadow, no-param-reassign */
const pathLib = require('path');
const t = require('@babel/types');
const { default: traverse } = require('@babel/traverse');
const { Analyzer } = require('./helpers/Analyzer.js');
const { trackDownIdentifierFromScope } = require('./helpers/track-down-identifier.js');
const { aForEach } = require('../utils/async-array-utils.js');

/** @typedef {import('./types').FindClassesAnalyzerOutput} FindClassesAnalyzerOutput */
/** @typedef {import('./types').FindClassesAnalyzerOutputEntry} FindClassesAnalyzerOutputEntry */
/** @typedef {import('./types').FindClassesConfig} FindClassesConfig */

/**
 * @desc Finds import specifiers and sources
 * @param {BabelAst} ast
 * @param {string} relativePath the file being currently processed
 */
async function findMembersPerAstEntry(ast, fullCurrentFilePath, projectPath) {
  // The transformed entry
  const classesFound = [];
  /**
   * @desc Detects private/publicness based on underscores. Checks '$' as well
   * @returns {'public|protected|private'}
   */
  function computeAccessType(name) {
    if (name.startsWith('_') || name.startsWith('$')) {
      // (at least) 2 prefixes
      if (name.startsWith('__') || name.startsWith('$$')) {
        return 'private';
      }
      return 'protected';
    }
    return 'public';
  }

  function isStaticProperties({ node }) {
    return node.static && node.kind === 'get' && node.key.name === 'properties';
  }

  // function isBlacklisted({ node }) {
  //   // Handle static getters
  //   const sgBlacklistPlatform = ['attributes'];
  //   const sgBlacklistLitEl = ['properties', 'styles'];
  //   const sgBlacklistLion = ['localizeNamespaces'];
  //   const sgBlacklist = [...sgBlacklistPlatform, ...sgBlacklistLitEl, ...sgBlacklistLion];
  //   if (node.kind === 'get' && node.static && sgBlacklist.includes(node.key.name)) {
  //     return true;
  //   }
  //   // Handle getters
  //   const gBlacklistLitEl = ['updateComplete'];
  //   const gBlacklistLion = ['slots'];
  //   const gBlacklist = [...gBlacklistLion, ...gBlacklistLitEl];
  //   if (node.kind === 'get' && !node.static && gBlacklist.includes(node.key.name)) {
  //     return true;
  //   }
  //   // Handle methods
  //   const mBlacklistPlatform = ['constructor', 'connectedCallback', 'disconnectedCallback'];
  //   const mBlacklistLitEl = [
  //     '_requestUpdate',
  //     'createRenderRoot',
  //     'render',
  //     'updated',
  //     'firstUpdated',
  //     'update',
  //     'shouldUpdate',
  //   ];
  //   const mBlacklistLion = ['onLocaleUpdated'];
  //   const mBlacklist = [...mBlacklistPlatform, ...mBlacklistLitEl, ...mBlacklistLion];
  //   if (!node.static && mBlacklist.includes(node.key.name)) {
  //     return true;
  //   }
  //   return false;
  // }

  async function traverseClass(path, { isMixin } = {}) {
    const classRes = {};
    classRes.name = path.node.id && path.node.id.name;
    classRes.isMixin = Boolean(isMixin);
    if (path.node.superClass) {
      const superClasses = [];

      // Add all Identifier names
      let parent = path.node.superClass;
      while (parent.type === 'CallExpression') {
        superClasses.push({ name: parent.callee.name, isMixin: true });
        // As long as we are a CallExpression, we will have a parent
        [parent] = parent.arguments;
      }
      // At the end of the chain, we find type === Identifier
      superClasses.push({ name: parent.name, isMixin: false });

      // For all found superclasses, track down their root location.
      // This will either result in a local, relative path in the project,
      // or an external path like '@lion/overlays'. In the latter case,
      // tracking down will halt and should be done when there is access to
      // the external repo... (similar to how 'match-imports' analyzer works)
      await aForEach(superClasses, async classObj => {
        // Finds the file that holds the declaration of the import
        classObj.rootFile = await trackDownIdentifierFromScope(
          path,
          classObj.name,
          fullCurrentFilePath,
          projectPath,
        );
      });
      classRes.superClasses = superClasses;
    }

    classRes.members = {};
    classRes.members.props = []; // meta: private, public, getter/setter, (found in static get properties)
    classRes.members.methods = []; // meta: private, public, getter/setter
    path.traverse({
      ClassMethod(path) {
        // if (isBlacklisted(path)) {
        //   return;
        // }
        if (isStaticProperties(path)) {
          let hasFoundTopLvlObjExpr = false;
          path.traverse({
            ObjectExpression(path) {
              if (hasFoundTopLvlObjExpr) return;
              hasFoundTopLvlObjExpr = true;
              path.node.properties.forEach(objectProperty => {
                if (!t.isProperty(objectProperty)) {
                  // we can also have a SpreadElement
                  return;
                }
                const propRes = {};
                const { name } = objectProperty.key;
                propRes.name = name;
                propRes.accessType = computeAccessType(name);
                propRes.kind = [...(propRes.kind || []), objectProperty.kind];
                classRes.members.props.push(propRes);
              });
            },
          });
          return;
        }

        const methodRes = {};
        const { name } = path.node.key;
        methodRes.name = name;
        methodRes.accessType = computeAccessType(name);

        if (path.node.kind === 'set' || path.node.kind === 'get') {
          if (path.node.static) {
            methodRes.static = true;
          }
          methodRes.kind = [...(methodRes.kind || []), path.node.kind];
          // Merge getter/setters into one
          const found = classRes.members.props.find(p => p.name === name);
          if (found) {
            found.kind = [...(found.kind || []), path.node.kind];
          } else {
            classRes.members.props.push(methodRes);
          }
        } else {
          classRes.members.methods.push(methodRes);
        }
      },
    });

    classesFound.push(classRes);
  }

  const classesToTraverse = [];
  traverse(ast, {
    ClassDeclaration(path) {
      classesToTraverse.push({ path, isMixin: false });
    },
    ClassExpression(path) {
      classesToTraverse.push({ path, isMixin: true });
    },
  });

  await aForEach(classesToTraverse, async klass => {
    await traverseClass(klass.path, { isMixin: klass.isMixin });
  });

  return classesFound;
}

// // TODO: split up and make configurable
// function _flattenedFormsPostProcessor(queryOutput) {
//   // Temp: post process, so that we, per category, per file, get all public props
//   queryOutput[0].entries = queryOutput[0].entries
//     .filter(entry => {
//       // contains only forms (and thus is not a test or demo)
//       return entry.meta.categories.includes('forms') && entry.meta.categories.length === 1;
//     })
//     .map(entry => {
//       const newResult = entry.result.map(({ name, props, methods }) => {
//         return {
//           name,
//           props: props.filter(p => p.meta.accessType === 'public').map(p => p.name),
//           methods: methods.filter(m => m.meta.accessType === 'public').map(m => m.name),
//         };
//       });
//       return { file: entry.file, result: newResult };
//     });
// }

class FindClassesAnalyzer extends Analyzer {
  constructor() {
    super();
    this.name = 'find-classes';
  }

  /**
   * @desc Will find all public members (properties (incl. getter/setters)/functions) of a class and
   * will make a distinction between private, public and protected methods
   * @param {FindClassesConfig} customConfig
   */
  async execute(customConfig = {}) {
    /** @type {FindClassesConfig} */
    const cfg = {
      gatherFilesConfig: {},
      targetProjectPath: null,
      metaConfig: null,
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
    /** @type {FindClassesAnalyzerOutput} */
    const queryOutput = await this._traverse(async (ast, { relativePath }) => {
      const projectPath = cfg.targetProjectPath;
      const fullPath = pathLib.resolve(projectPath, relativePath);
      const transformedEntry = await findMembersPerAstEntry(ast, fullPath, projectPath);
      return { result: transformedEntry };
    });
    // _flattenedFormsPostProcessor();

    /**
     * Finalize
     */
    return this._finalize(queryOutput, cfg);
  }
}

module.exports = FindClassesAnalyzer;
