/* eslint-disable no-shadow, no-param-reassign */
import path from 'path';

import { oxcTraverse, isProperty } from '../utils/oxc-traverse.js';

import { trackDownIdentifierFromScope } from '../utils/track-down-identifier.js';
import { Analyzer } from '../core/Analyzer.js';

/**
 * A structural representation of the AST nodes (swc/oxc/babel) that are visited by this
 * analyzer. Every field is optional because the concrete node type depends on the parser.
 * @typedef {object} LooseNode
 * @property {string} [type]
 * @property {string} [name]
 * @property {string} [kind]
 * @property {boolean} [static]
 * @property {LooseNode} [id]
 * @property {LooseNode} [key]
 * @property {LooseNode} [callee]
 * @property {LooseNode} [superClass]
 * @property {LooseNode} [init]
 * @property {LooseNode[]} [arguments]
 * @property {LooseNode[]} [properties]
 */
/**
 * @typedef {object} MemberResult
 * @property {string} [name]
 * @property {'public'|'protected'|'private'} [accessType]
 * @property {string[]} [kind]
 * @property {boolean} [static]
 */
/**
 * @typedef {object} SuperClassEntry
 * @property {string} [name]
 * @property {boolean} [isMixin]
 * @property {RootFile} [rootFile]
 */
/**
 * @typedef {object} ClassMembers
 * @property {MemberResult[]} props
 * @property {MemberResult[]} methods
 */
/**
 * @typedef {object} ClassResult
 * @property {string} [name]
 * @property {boolean} [isMixin]
 * @property {SuperClassEntry[]} [superClasses]
 * @property {ClassMembers} [members]
 */
/**
 * @typedef {import('@babel/types').File} File
 * @typedef {import('@babel/types').ClassMethod} ClassMethod
 * @typedef {import('../../../types/index.js').RootFile} RootFile
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').SwcPath} SwcPath
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').FindClassesAnalyzerResult} FindClassesAnalyzerResult
 * @typedef {import('../../../types/index.js').FindClassesAnalyzerOutputFile} FindClassesAnalyzerOutputFile
 * @typedef {import('../../../types/index.js').FindClassesAnalyzerEntry} FindClassesAnalyzerEntry
 * @typedef {import('../../../types/index.js').FindClassesConfig} FindClassesConfig
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 */

/**
 * Finds import specifiers and sources
 * @param {File} babelAst
 * @param {string} fullCurrentFilePath the file being currently processed
 * @param {PathFromSystemRoot} projectPath
 */
async function findMembersPerAstEntry(babelAst, fullCurrentFilePath, projectPath) {
  // The transformed entry
  /** @type {ClassResult[]} */
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
   * @param {{node:LooseNode}} cfg
   * @returns {boolean}
   */
  function isStaticProperties({ node }) {
    return Boolean(node.static) && node.kind === 'get' && node.key?.name === 'properties';
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
   * @param {SwcPath} astPath
   * @param {{isMixin?:boolean}} [opts]
   */
  async function traverseClass(astPath, { isMixin = false } = {}) {
    const { node } = /** @type {{ node: LooseNode }} */ (astPath);
    /** @type {ClassResult} */
    const classRes = {};
    classRes.name = node.id && node.id.name;
    classRes.isMixin = Boolean(isMixin);
    if (node.superClass) {
      /** @type {SuperClassEntry[]} */
      const superClasses = [];

      // Add all Identifier names
      /** @type {LooseNode} */
      let parent = node.superClass;
      while (parent.type === 'CallExpression') {
        superClasses.push({ name: parent.callee?.name, isMixin: true });
        // As long as we are a CallExpression, we will have a parent
        [parent] = /** @type {LooseNode[]} */ (parent.arguments);
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
          /** @type {string} */ (classObj.name),
          /** @type {PathFromSystemRoot} */ (fullCurrentFilePath),
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

    const handleMethodDefinitionOrClassMethod = (/** @type {SwcPath} */ methodPath) => {
      // if (isBlacklisted(astPath)) {
      //   return;
      // }
      if (isStaticProperties(/** @type {{node:LooseNode}} */ (methodPath))) {
        let hasFoundTopLvlObjExpr = false;
        methodPath.traverse({
          ObjectExpression(objectPath) {
            if (hasFoundTopLvlObjExpr) return;
            hasFoundTopLvlObjExpr = true;
            const objectNode = /** @type {LooseNode} */ (objectPath.node);
            (objectNode.properties || []).forEach(objectProperty => {
              if (
                !isProperty(
                  /** @type {import('@swc/core').Node} */ (/** @type {unknown} */ (objectProperty)),
                )
              ) {
                // we can also have a SpreadElement
                return;
              }
              /** @type {MemberResult} */
              const propRes = {};
              const name = /** @type {string} */ (objectProperty.key?.name);
              propRes.name = name;
              propRes.accessType = computeAccessType(name);
              propRes.kind = [...(propRes.kind || []), /** @type {string} */ (objectProperty.kind)];
              /** @type {ClassMembers} */ (classRes.members).props.push(propRes);
            });
          },
        });
        return;
      }

      const { node: methodNode } = /** @type {{ node: LooseNode }} */ (methodPath);
      /** @type {MemberResult} */
      const methodRes = {};
      const name = /** @type {string} */ (methodNode.key?.name);
      methodRes.name = name;
      methodRes.accessType = computeAccessType(name);

      if (methodNode.kind === 'set' || methodNode.kind === 'get') {
        if (methodNode.static) {
          methodRes.static = true;
        }
        methodRes.kind = [...(methodRes.kind || []), /** @type {string} */ (methodNode.kind)];
        // Merge getter/setters into one
        const { members } = /** @type {{ members: ClassMembers }} */ (classRes);
        const found = members.props.find(p => p.name === name);
        if (found) {
          found.kind = [...(found.kind || []), /** @type {string} */ (methodNode.kind)];
        } else {
          members.props.push(methodRes);
        }
      } else {
        /** @type {ClassMembers} */ (classRes.members).methods.push(methodRes);
      }
    };

    astPath.traverse({
      ClassMethod: handleMethodDefinitionOrClassMethod,
      MethodDefinition: handleMethodDefinitionOrClassMethod,
    });

    classesFound.push(classRes);
  }

  /** @type {{ astPath: SwcPath; isMixin: boolean }[]} */
  const classesToTraverse = [];

  oxcTraverse(babelAst, {
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

  /** @type {AnalyzerAst} */
  static requiredAst = 'oxc';

  /**
   * @param {File} oxcAst
   * @param {{ relativePath:string; analyzerCfg:{ targetProjectPath: PathFromSystemRoot } }} context
   */
  static async analyzeFile(oxcAst, context) {
    const projectPath = context.analyzerCfg.targetProjectPath;
    const fullPath = path.resolve(projectPath, context.relativePath);
    const transformedEntry = await findMembersPerAstEntry(oxcAst, fullPath, projectPath);
    return { result: transformedEntry };
  }
}
