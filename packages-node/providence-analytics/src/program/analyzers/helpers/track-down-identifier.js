const fs = require('fs');
const { default: traverse } = require('@babel/traverse');
const {
  isRelativeSourcePath,
  toRelativeSourcePath,
} = require('../../utils/relative-source-path.js');
const { resolveImportPath } = require('../../utils/resolve-import-path.js');
const { AstService } = require('../../services/AstService.js');
const { LogService } = require('../../services/LogService.js');
const { memoizeAsync } = require('../../utils/memoize.js');

/** @typedef {import('./types').RootFile} RootFile */

/**
 * Other than with import, no binding is created for MyClass by Babel(?)
 * This means 'path.scope.getBinding('MyClass')' returns undefined
 * and we have to find a different way to retrieve this value.
 * @param {object} astPath Babel ast traversal path
 * @param {string} identifierName the name that should be tracked (and that exists inside scope of astPath)
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
    ExportSpecifier(path) {
      // eslint-disable-next-line arrow-body-style
      const found =
        path.node.exported.name === identifierName || path.node.local.name === identifierName;
      if (found) {
        bindingPath = path;
        bindingType = 'ExportSpecifier';
        source = path.parentPath.node.source?.value || '[current]';
        path.stop();
      }
    },
  });
  return [source, bindingType, bindingPath];
}

/**
 * @desc returns source and importedIdentifierName: We might be an import that was locally renamed.
 * Since we are traversing, we are interested in the imported name. Or in case of a re-export,
 * the local name.
 * @param {object} astPath Babel ast traversal path
 * @param {string} identifierName the name that should be tracked (and that exists inside scope of astPath)
 */
function getImportSourceFromAst(astPath, identifierName) {
  let source;
  let importedIdentifierName;

  const binding = astPath.scope.getBinding(identifierName);
  let bindingType = binding && binding.path.type;
  let bindingPath = binding && binding.path;
  const matchingTypes = ['ImportSpecifier', 'ImportDefaultSpecifier', 'ExportSpecifier'];

  if (binding && matchingTypes.includes(bindingType)) {
    source = binding.path.parentPath.node.source.value;
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

let trackDownIdentifier;
/**
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
 * @param {string} source an importSpecifier source, like 'ref-proj' or '../file'
 * @param {string} identifierName imported reference/Identifier name, like 'MyComp'
 * @param {string} currentFilePath file path, like '/path/to/target-proj/my-comp-import.js'
 * @param {string} rootPath dir path, like '/path/to/target-proj'
 * @returns {object} file: path of file containing the binding (exported declaration),
 * like '/path/to/ref-proj/src/RefComp.js'
 */
async function trackDownIdentifierFn(source, identifierName, currentFilePath, rootPath, depth = 0) {
  let rootFilePath; // our result path
  let rootSpecifier; // the name under which it was imported

  if (!isRelativeSourcePath(source)) {
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

  /**
   * @prop resolvedSourcePath
   * @type {string}
   * @example resolveImportPath('../file') // => '/path/to/target-proj/file.js'
   */
  const resolvedSourcePath = await resolveImportPath(source, currentFilePath);
  LogService.debug(`[trackDownIdentifier] ${resolvedSourcePath}`);
  const code = fs.readFileSync(resolvedSourcePath, 'utf8');
  const ast = AstService.getAst(code, 'babel', { filePath: resolvedSourcePath });
  const shouldLookForDefaultExport = identifierName === '[default]';

  let reexportMatch = null; // named specifier declaration
  let pendingTrackDownPromise;

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      if (!shouldLookForDefaultExport) {
        return;
      }

      let newSource;
      if (path.node.declaration.type === 'Identifier') {
        newSource = getImportSourceFromAst(path, path.node.declaration.name).source;
      }

      if (newSource) {
        pendingTrackDownPromise = trackDownIdentifier(
          newSource,
          '[default]',
          resolvedSourcePath,
          rootPath,
          depth + 1,
        );
      } else {
        // We found our file!
        rootSpecifier = identifierName;
        rootFilePath = toRelativeSourcePath(resolvedSourcePath, rootPath);
      }
      path.stop();
    },
    ExportNamedDeclaration: {
      enter(path) {
        if (reexportMatch || shouldLookForDefaultExport) {
          return;
        }
        // Are we dealing with a re-export ?
        if (path.node.specifiers && path.node.specifiers.length) {
          const exportMatch = path.node.specifiers.find(s => s.exported.name === identifierName);

          if (exportMatch) {
            const localName = exportMatch.local.name;
            let newSource;
            if (path.node.source) {
              /**
               * @example
               * export { x } from 'y'
               */
              newSource = path.node.source.value;
            } else {
              /**
               * @example
               * import { x } from 'y'
               * export { x }
               */
              newSource = getImportSourceFromAst(path, identifierName).source;
              if (!newSource) {
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
              depth + 1,
            );
            path.stop();
          }
        }
      },
      exit(path) {
        if (!reexportMatch) {
          // We didn't find a re-exported Identifier, that means the reference is declared
          // in current file...
          rootSpecifier = identifierName;
          rootFilePath = toRelativeSourcePath(resolvedSourcePath, rootPath);
          path.stop();
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
  return /** @type {RootFile } */ { file: rootFilePath, specifier: rootSpecifier };
}

trackDownIdentifier = memoizeAsync(trackDownIdentifierFn);

/**
 * @param {BabelPath} astPath
 * @param {string} identifierNameInScope
 * @param {string} fullCurrentFilePath
 * @param {string} projectPath
 */
async function trackDownIdentifierFromScopeFn(
  astPath,
  identifierNameInScope,
  fullCurrentFilePath,
  projectPath,
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
    );
  } else {
    const specifier = sourceObj.importedIdentifierName || identifierNameInScope;
    rootFile = { file: '[current]', specifier };
  }
  return rootFile;
}

const trackDownIdentifierFromScope = memoizeAsync(trackDownIdentifierFromScopeFn);

module.exports = {
  trackDownIdentifier,
  getImportSourceFromAst,
  trackDownIdentifierFromScope,
};
