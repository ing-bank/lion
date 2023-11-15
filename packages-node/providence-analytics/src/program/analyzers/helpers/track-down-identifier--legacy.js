/* eslint-disable no-shadow */
// @ts-nocheck
import fs from 'fs';
import pathLib from 'path';
import babelTraverse from '@babel/traverse';
import { isRelativeSourcePath, toRelativeSourcePath } from '../../utils/relative-source-path.js';
import { InputDataService } from '../../core/InputDataService.js';
import { resolveImportPath } from '../../utils/resolve-import-path.js';
import { AstService } from '../../core/AstService.js';
import { LogService } from '../../core/LogService.js';
import { memoize } from '../../utils/memoize.js';

/**
 * @typedef {import('../../../../types/index.js').RootFile} RootFile
 * @typedef {import('../../../../types/index.js').SpecifierSource} SpecifierSource
 * @typedef {import('../../../../types/index.js').IdentifierName} IdentifierName
 * @typedef {import('../../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('@babel/traverse').NodePath} NodePath
 */

/**
 * @param {string} source
 * @param {string} projectName
 */
function isSelfReferencingProject(source, projectName) {
  return source.startsWith(`${projectName}`);
}

/**
 * @param {string} source
 * @param {string} projectName
 */
function isExternalProject(source, projectName) {
  return (
    !source.startsWith('#') &&
    !isRelativeSourcePath(source) &&
    !isSelfReferencingProject(source, projectName)
  );
}

/**
 * Other than with import, no binding is created for MyClass by Babel(?)
 * This means 'path.scope.getBinding('MyClass')' returns undefined
 * and we have to find a different way to retrieve this value.
 * @param {NodePath} astPath Babel ast traversal path
 * @param {IdentifierName} identifierName the name that should be tracked (and that exists inside scope of astPath)
 */
function getBindingAndSourceReexports(astPath, identifierName) {
  // Get to root node of file and look for exports like `export { identifierName } from 'src';`
  let source;
  let bindingType;
  let bindingPath;

  let curPath = astPath;
  while (curPath.parentPath) {
    curPath = curPath.parentPath;
  }
  const rootPath = curPath;
  rootPath.traverse({
    ExportSpecifier(astPath) {
      // eslint-disable-next-line arrow-body-style
      const found =
        astPath.node.exported.name === identifierName || astPath.node.local.name === identifierName;
      if (found) {
        bindingPath = astPath;
        bindingType = 'ExportSpecifier';
        source = astPath.parentPath.node.source
          ? astPath.parentPath.node.source.value
          : '[current]';
        astPath.stop();
      }
    },
  });
  return [source, bindingType, bindingPath];
}

/**
 * Retrieves source (like '@lion/core') and importedIdentifierName (like 'lit') from ast for
 * current file.
 * We might be an import that was locally renamed.
 * Since we are traversing, we are interested in the imported name. Or in case of a re-export,
 * the local name.
 * @param {NodePath} astPath Babel ast traversal path
 * @param {string} identifierName the name that should be tracked (and that exists inside scope of astPath)
 * @returns {{ source:string, importedIdentifierName:string }}
 */
export function getImportSourceFromAst(astPath, identifierName) {
  let source;
  let importedIdentifierName;

  const binding = astPath.scope.getBinding(identifierName);
  let bindingType = binding?.path.type;
  let bindingPath = binding?.path;
  const matchingTypes = ['ImportSpecifier', 'ImportDefaultSpecifier', 'ExportSpecifier'];

  if (bindingType && matchingTypes.includes(bindingType)) {
    source = binding?.path?.parentPath?.node?.source?.value;
  } else {
    // no binding
    [source, bindingType, bindingPath] = getBindingAndSourceReexports(astPath, identifierName);
  }

  const shouldLookForDefaultExport = bindingType === 'ImportDefaultSpecifier';
  if (shouldLookForDefaultExport) {
    importedIdentifierName = '[default]';
  } else if (source) {
    const { node } = bindingPath;
    importedIdentifierName = (node.imported && node.imported.name) || node.local.name;
  }

  return { source, importedIdentifierName };
}

/**
 * @typedef {(source:SpecifierSource,identifierName:IdentifierName,currentFilePath:PathFromSystemRoot,rootPath:PathFromSystemRoot,projectName?: string,depth?:number) => Promise<RootFile>} TrackDownIdentifierFn
 */

/**
 * Follows the full path of an Identifier until its declaration ('root file') is found.
 * @example
 *```js
 * // 1. Starting point
 * //    target-proj/my-comp-import.js
 * import { MyComp as TargetComp } from 'ref-proj';
 *
 * // 2. Intermediate stop: a re-export
 * //    ref-proj/exportsIndex.js (package.json has main: './exportsIndex.js')
 * export { RefComp as MyComp } from './src/RefComp.js';
 *
 * // 3. End point: our declaration
 * //    ref-proj/src/RefComp.js
 * export class RefComp extends LitElement {...}
 *```
 *
 * -param {SpecifierSource} source an importSpecifier source, like 'ref-proj' or '../file'
 * -param {IdentifierName} identifierName imported reference/Identifier name, like 'MyComp'
 * -param {PathFromSystemRoot} currentFilePath file path, like '/path/to/target-proj/my-comp-import.js'
 * -param {PathFromSystemRoot} rootPath dir path, like '/path/to/target-proj'
 * -param {string} [projectName] like 'target-proj' or '@lion/input'
 * -returns {Promise<RootFile>} file: path of file containing the binding (exported declaration),
 * like '/path/to/ref-proj/src/RefComp.js'
 */
/** @type {TrackDownIdentifierFn} */
// eslint-disable-next-line import/no-mutable-exports
export let trackDownIdentifier;

/** @type {TrackDownIdentifierFn} */
async function trackDownIdentifierFn(
  source,
  identifierName,
  currentFilePath,
  rootPath,
  projectName,
  depth = 0,
) {
  let rootFilePath; // our result path
  let rootSpecifier; // the name under which it was imported

  if (!projectName) {
    // eslint-disable-next-line no-param-reassign
    projectName = InputDataService.getPackageJson(rootPath)?.name;
  }

  if (projectName && isExternalProject(source, projectName)) {
    // So, it is an external ref like '@lion/core' or '@open-wc/scoped-elements/index.js'
    // At this moment in time, we don't know if we have file system access to this particular
    // project. Therefore, we limit ourselves to tracking down local references.
    // In case this helper is used inside an analyzer like 'match-subclasses', the external
    // (search-target) project can be accessed and paths can be resolved to local ones,
    // just like in 'match-imports' analyzer.
    /** @type {RootFile} */
    const result = { file: source, specifier: identifierName };
    return result;
  }

  const resolvedSourcePath = await resolveImportPath(source, currentFilePath);

  LogService.debug(`[trackDownIdentifier] ${resolvedSourcePath}`);
  const allowedJsModuleExtensions = ['.mjs', '.js'];
  if (!allowedJsModuleExtensions.includes(pathLib.extname(resolvedSourcePath))) {
    // We have an import assertion
    return /** @type { RootFile } */ {
      file: toRelativeSourcePath(resolvedSourcePath, rootPath),
      specifier: '[default]',
    };
  }
  const code = fs.readFileSync(resolvedSourcePath, 'utf8');
  const babelAst = AstService.getAst(code, 'swc-to-babel', { filePath: resolvedSourcePath });

  const shouldLookForDefaultExport = identifierName === '[default]';

  let reexportMatch = false; // named specifier declaration
  let exportMatch;
  let pendingTrackDownPromise;

  babelTraverse.default(babelAst, {
    ExportDefaultDeclaration(astPath) {
      if (!shouldLookForDefaultExport) {
        return;
      }

      let newSource;
      if (astPath.node.declaration.type === 'Identifier') {
        newSource = getImportSourceFromAst(astPath, astPath.node.declaration.name).source;
      }

      if (newSource) {
        pendingTrackDownPromise = trackDownIdentifier(
          newSource,
          '[default]',
          resolvedSourcePath,
          rootPath,
          projectName,
          depth + 1,
        );
      } else {
        // We found our file!
        rootSpecifier = identifierName;
        rootFilePath = toRelativeSourcePath(resolvedSourcePath, rootPath);
      }
      astPath.stop();
    },
    ExportNamedDeclaration: {
      enter(astPath) {
        if (reexportMatch || shouldLookForDefaultExport) {
          return;
        }

        // Are we dealing with a re-export ?
        if (astPath.node.specifiers?.length) {
          exportMatch = astPath.node.specifiers.find(s => s.exported.name === identifierName);

          if (exportMatch) {
            const localName = exportMatch.local.name;
            let newSource;
            if (astPath.node.source) {
              /**
               * @example
               * export { x } from 'y'
               */
              newSource = astPath.node.source.value;
            } else {
              /**
               * @example
               * import { x } from 'y'
               * export { x }
               */
              newSource = getImportSourceFromAst(astPath, identifierName).source;

              if (!newSource || newSource === '[current]') {
                /**
                 * @example
                 * const x = 12;
                 * export { x }
                 */
                return;
              }
            }
            reexportMatch = true;
            pendingTrackDownPromise = trackDownIdentifier(
              newSource,
              localName,
              resolvedSourcePath,
              rootPath,
              projectName,
              depth + 1,
            );
            astPath.stop();
          }
        }
      },
      exit(astPath) {
        if (!reexportMatch) {
          // We didn't find a re-exported Identifier, that means the reference is declared
          // in current file...
          rootSpecifier = identifierName;
          rootFilePath = toRelativeSourcePath(resolvedSourcePath, rootPath);

          if (exportMatch) {
            astPath.stop();
          }
        }
      },
    },
  });

  if (pendingTrackDownPromise) {
    // We can't handle promises inside Babel traverse, so we do it here...
    const resObj = await pendingTrackDownPromise;
    rootFilePath = resObj.file;
    rootSpecifier = resObj.specifier;
  }

  return /** @type { RootFile } */ { file: rootFilePath, specifier: rootSpecifier };
}

trackDownIdentifier = memoize(trackDownIdentifierFn);

/**
 * @param {NodePath} astPath
 * @param {string} identifierNameInScope
 * @param {PathFromSystemRoot} fullCurrentFilePath
 * @param {PathFromSystemRoot} projectPath
 * @param {string} [projectName]
 */
async function trackDownIdentifierFromScopeFn(
  astPath,
  identifierNameInScope,
  fullCurrentFilePath,
  projectPath,
  projectName,
) {
  const sourceObj = getImportSourceFromAst(astPath, identifierNameInScope);

  /** @type {RootFile} */
  let rootFile;
  if (sourceObj.source) {
    rootFile = await trackDownIdentifier(
      sourceObj.source,
      sourceObj.importedIdentifierName,
      fullCurrentFilePath,
      projectPath,
      projectName,
    );
  } else {
    const specifier = sourceObj.importedIdentifierName || identifierNameInScope;
    rootFile = { file: '[current]', specifier };
  }
  return rootFile;
}

export const trackDownIdentifierFromScope = memoize(trackDownIdentifierFromScopeFn);
