/* eslint-disable no-shadow, no-param-reassign */
import path from 'path';
import t from '@babel/types';
// @ts-ignore
import babelTraverse from '@babel/traverse';
import { Analyzer } from '../core/Analyzer.js';
import { trackDownIdentifierFromScope } from './helpers/track-down-identifier--legacy.js';

/**
 * @typedef {import('@babel/types').File} File
 * @typedef {import('@babel/types').ClassMethod} ClassMethod
 * @typedef {import('@babel/traverse').NodePath} NodePath
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').FindClassesAnalyzerResult} FindClassesAnalyzerResult
 * @typedef {import('../../../types/index.js').FindClassesAnalyzerOutputFile} FindClassesAnalyzerOutputFile
 * @typedef {import('../../../types/index.js').FindClassesAnalyzerEntry} FindClassesAnalyzerEntry
 * @typedef {import('../../../types/index.js').FindClassesConfig} FindClassesConfig
 */

/**
 * Finds import specifiers and sources
 * @param {File} babelAst
 * @param {string} fullCurrentFilePath the file being currently processed
 */
async function findMembersPerAstEntry(babelAst, fullCurrentFilePath, projectPath) {
  // The transformed entry
  const classesFound = [];
  /**
   * Detects private/publicness based on underscores. Checks '$' as well
   * @param {string} name
   * @returns {'public'|'protected'|'private'}
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

  /**
   * @param {{node:ClassMethod}} cfg
   * @returns
   */
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
  //     'requestUpdate',
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

  /**
   *
   * @param {NodePath} astPath
   * @param {{isMixin?:boolean}} opts
   */
  async function traverseClass(astPath, { isMixin = false } = {}) {
    const classRes = {};
    classRes.name = astPath.node.id && astPath.node.id.name;
    classRes.isMixin = Boolean(isMixin);
    if (astPath.node.superClass) {
      const superClasses = [];

      // Add all Identifier names
      let parent = astPath.node.superClass;
      while (parent.type === 'CallExpression') {
        superClasses.push({ name: parent.callee.name, isMixin: true });
        // As long as we are a CallExpression, we will have a parent
        [parent] = parent.arguments;
      }
      // At the end of the chain, we find type === Identifier
      superClasses.push({ name: parent.name, isMixin: false });

      // For all found superclasses, track down their root location.
      // This will either result in a local, relative astPath in the project,
      // or an external astPath like '@lion/overlays'. In the latter case,
      // tracking down will halt and should be done when there is access to
      // the external repo... (similar to how 'match-imports' analyzer works)

      for (const classObj of superClasses) {
        // Finds the file that holds the declaration of the import
        classObj.rootFile = await trackDownIdentifierFromScope(
          astPath,
          classObj.name,
          fullCurrentFilePath,
          projectPath,
        );
      }
      classRes.superClasses = superClasses;
    }

    classRes.members = {
      // meta: private, public, getter/setter, (found in static get properties)
      props: [],
      // meta: private, public, getter/setter
      methods: [],
    };

    astPath.traverse({
      ClassMethod(astPath) {
        // if (isBlacklisted(astPath)) {
        //   return;
        // }
        if (isStaticProperties(astPath)) {
          let hasFoundTopLvlObjExpr = false;
          astPath.traverse({
            ObjectExpression(astPath) {
              if (hasFoundTopLvlObjExpr) return;
              hasFoundTopLvlObjExpr = true;
              astPath.node.properties.forEach(objectProperty => {
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
        const { name } = astPath.node.key;
        methodRes.name = name;
        methodRes.accessType = computeAccessType(name);

        if (astPath.node.kind === 'set' || astPath.node.kind === 'get') {
          if (astPath.node.static) {
            methodRes.static = true;
          }
          methodRes.kind = [...(methodRes.kind || []), astPath.node.kind];
          // Merge getter/setters into one
          const found = classRes.members.props.find(p => p.name === name);
          if (found) {
            found.kind = [...(found.kind || []), astPath.node.kind];
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

  babelTraverse.default(babelAst, {
    ClassDeclaration(astPath) {
      classesToTraverse.push({ astPath, isMixin: false });
    },
    ClassExpression(astPath) {
      classesToTraverse.push({ astPath, isMixin: true });
    },
  });

  for (const klass of classesToTraverse) {
    await traverseClass(klass.astPath, { isMixin: klass.isMixin });
  }

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

export default class FindClassesAnalyzer extends Analyzer {
  /** @type {AnalyzerName} */
  static analyzerName = 'find-classes';

  /** @type {'babel'|'swc-to-babel'} */
  static requiredAst = 'babel';

  /**
   * Will find all public members (properties (incl. getter/setters)/functions) of a class and
   * will make a distinction between private, public and protected methods
   * @param {Partial<FindClassesConfig>} customConfig
   */
  async execute(customConfig) {
    const cfg = customConfig;

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
      const fullPath = path.resolve(projectPath, relativePath);
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
