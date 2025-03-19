/* eslint-disable no-shadow, no-param-reassign */
import path from 'path';

import { trackDownIdentifierFromScope } from '../utils/track-down-identifier.js';
import {
  expressionOf,
  isProperty,
  isSetter,
  isGetter,
  isStatic,
  nameOf,
  idOf,
} from '../utils/ast-normalizations.js';
import { oxcTraverse } from '../utils/oxc-traverse.js';
import { Analyzer } from '../core/Analyzer.js';

import { isCustomElementsGet } from './find-customelements.js';

/**
 * @typedef {import('@babel/types').File} File
 * @typedef {import('@babel/types').ClassMethod} ClassMethod
 * @typedef {import('@babel/traverse').NodePath} NodePath
 * @typedef {import('../../../types/index.js').AnalyzerName} AnalyzerName
 * @typedef {import('../../../types/index.js').FindClassesAnalyzerResult} FindClassesAnalyzerResult
 * @typedef {import('../../../types/index.js').FindClassesAnalyzerOutputFile} FindClassesAnalyzerOutputFile
 * @typedef {import('../../../types/index.js').FindClassesAnalyzerEntry} FindClassesAnalyzerEntry
 * @typedef {import('../../../types/index.js').FindClassesConfig} FindClassesConfig
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import("@swc/core").Node} SwcNode
 */

/**
 * Finds import specifiers and sources
 * @param {File} oxcAst
 * @param {string} fullCurrentFilePath the file being currently processed
 */
async function findMembersPerAstEntry(oxcAst, fullCurrentFilePath, projectPath) {
  // The transformed entry
  const classesFound = [];
  /**
   * Detects private/publicness based on underscores. Checks '$' as well
   * @param {string} name
   * @returns {'public'|'protected'|'private'|'[n/a]'}
   */
  function computeAccessType(name) {
    if (name === 'constructor') {
      return '[n/a]';
    }

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
    return isStatic(node) && isGetter(node) && nameOf(node.key) === 'properties';
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
   * @param {SwcNode|OxcNode} node
   */
  function isSuperClassAMixin(superClassNode) {
    if (!superClassNode) return false;

    const isCallExpression = superClassNode?.type === 'CallExpression';
    if (!isCallExpression) return false;
    return !isCustomElementsGet(superClassNode.callee);
  }

  /**
   * @param {NodePath} astPath
   * @param {{isMixin?:boolean}} opts
   */
  async function traverseClass(astPath, { isMixin = false } = {}) {
    const classRes = {};
    classRes.name = (idOf(astPath.node) && nameOf(idOf(astPath.node))) || null;
    classRes.isMixin = Boolean(isMixin);

    if (astPath.node.superClass) {
      const superClasses = [];

      // Add all Identifier names
      let parent = astPath.node.superClass;
      while (isSuperClassAMixin(parent)) {
        superClasses.push({ name: nameOf(parent.callee), isMixin: true });
        // As long as we are a CallExpression, we will have a parent
        [parent] = parent.arguments.map(expressionOf);
      }

      // At the end of the chain, we find type === Identifier or customElements.get directly.
      if (isCustomElementsGet(parent.callee)) {
        superClasses.push({
          name: null,
          customElementsGetRef: nameOf(parent.arguments?.map(expressionOf)[0]),
          isMixin: false,
        });
      } else {
        // an identifier like 'MyClass'
        superClasses.push({ name: nameOf(expressionOf(parent)), isMixin: false });
      }

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

    const handleMethodDefinitionOrClassMethod = astPath => {
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
              if (!isProperty(objectProperty)) {
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
      const name = nameOf(astPath.node.key);
      methodRes.name = name;
      methodRes.accessType = computeAccessType(name);
      if (
        ['constructor', 'connectedCallback', 'disconnectedCallback', 'adoptedCallback'].includes(
          name,
        )
      ) {
        methodRes.isPartOfPlatformLifeCycle = true;
      }

      if (isSetter(astPath.node) || isGetter(astPath.node)) {
        const setOrGet = isSetter(astPath.node) ? 'set' : 'get';
        if (isStatic(astPath.node)) {
          methodRes.static = true;
        }
        methodRes.kind = [...(methodRes.kind || []), setOrGet];
        // Merge getter/setters into one
        const found = classRes.members.props.find(p => nameOf(p) === name);
        if (found) {
          found.kind = [...(found.kind || []), setOrGet];
        } else {
          classRes.members.props.push(methodRes);
        }
      } else {
        classRes.members.methods.push(methodRes);
      }
    };

    astPath.traverse({
      ClassMethod: handleMethodDefinitionOrClassMethod,
      MethodDefinition: handleMethodDefinitionOrClassMethod,
      // for swc
      Constructor: handleMethodDefinitionOrClassMethod,
    });

    classesFound.push(classRes);
  }

  const classesToTraverse = [];

  oxcTraverse(oxcAst, {
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

  static async analyzeFile(oxcAst, context) {
    const projectPath = context.analyzerCfg.targetProjectPath;
    const fullPath = path.resolve(projectPath, context.relativePath);
    const transformedEntry = await findMembersPerAstEntry(oxcAst, fullPath, projectPath);
    return { result: transformedEntry };
  }
}
