import path from 'path';

import { oxcTraverse, getPathFromNode, nameOf } from './oxc-traverse.js';
import { trackDownIdentifier } from './track-down-identifier.js';
import { AstService } from '../core/AstService.js';
import { toPosixPath } from './to-posix-path.js';
import { fsAdapter } from './fs-adapter.js';

/**
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').AnalyzerAst} AnalyzerAst
 * @typedef {import('../../../types/index.js').SwcBinding} SwcBinding
 * @typedef {import('../../../types/index.js').SwcPath} SwcPath
 * @typedef {import('@swc/core').Node} SwcNode
 */

/**
 * @param {{rootPath:PathFromSystemRoot; localPath:PathRelativeFromProjectRoot}} opts
 * @returns {PathRelativeFromProjectRoot}
 */
export function getFilePathOrExternalSource({ rootPath, localPath }) {
  if (!localPath.startsWith('.')) {
    // We are not resolving external files like '@lion/input-amount/x.js',
    // but we give a 100% score if from and to are same here..
    return localPath;
  }
  return /** @type {PathRelativeFromProjectRoot} */ (
    toPosixPath(path.resolve(rootPath, localPath))
  );
}

/**
 * Checks whether we are a Declaration (like class X {}) or Declarator (like const x = 88)
 * @param {SwcNode} node
 * @returns {boolean}
 */
function containsIdentifier(node) {
  // @ts-expect-error
  return node.id || node.identifier;
}

/**
 *  Assume we had:
 *  ```js
 *  const x = 88;
 *  const y = x;
 *  export const myIdentifier = y;
 *  ```
 *  - We started in getSourceCodeFragmentOfDeclaration (looking for 'myIdentifier'), which found VariableDeclarator of export myIdentifier
 *  - getReferencedDeclaration is called with { referencedIdentifierName: 'y', globalScopeBindings: {x: SwcBinding; y: SwcBinding} }
 *  - now we will look in globalScopeBindings, till we find declaration of 'y'
 *    - Is it a ref? Call ourselves with referencedIdentifierName ('x' in example above)
 *    - is it a non ref declaration? Return the path of the node
 * @param {{ referencedIdentifierName:string, globalScopeBindings:{[key:string]:SwcBinding}; }} opts
 * @returns {SwcPath|null}
 */
export function getReferencedDeclaration({ referencedIdentifierName, globalScopeBindings }) {
  // We go from referencedIdentifierName 'y' to binding (VariableDeclarator path) 'y';
  const identifierBinding = /** @type {SwcBinding} */ (
    globalScopeBindings[referencedIdentifierName]
  );

  // We provided a referencedIdentifierName that is not in the globalScopeBindings
  if (!identifierBinding) return null;

  const { type } = identifierBinding.path.node;
  const isNonRefDeclaration = type.endsWith('Declaration');
  if (isNonRefDeclaration && !containsIdentifier(identifierBinding.path.node)) {
    throw new Error('Make sure entries added to globalScopeBindings contains an identifier');
  }

  const isImportingSpecifier = ['ImportSpecifier', 'ImportDefaultSpecifier'].includes(type);
  if (isImportingSpecifier || isNonRefDeclaration) {
    return identifierBinding.path;
  }

  const isRefDeclarator = identifierBinding.path.node.init.type === 'Identifier';
  if (isRefDeclarator) {
    return getReferencedDeclaration({
      referencedIdentifierName: nameOf(identifierBinding.path.node.init),
      globalScopeBindings,
    });
  }

  return /** @type {SwcPath} */ (identifierBinding.path.get('init'));
}

/**
 * @example
 * ```js
 * // ------ input file --------
 * const x = 88;
 * const y = x;
 * export const myIdentifier = y;
 * // --------------------------
 *
 * await getSourceCodeFragmentOfDeclaration(code) // finds "88"
 * ```
 *
 * @param {{ code?: string; ast?: object; filePath: PathFromSystemRoot; exportedIdentifier: string; projectRootPath: PathFromSystemRoot; parser?: AnalyzerAst }} opts
 * @returns {Promise<{ sourceNodePath: SwcPath; sourceFragment: string|null; externalImportSource: string|null; }>}
 */
export async function getSourceCodeFragmentOfDeclaration({
  exportedIdentifier,
  projectRootPath,
  parser = 'oxc',
  filePath,
  code,
  ast,
}) {
  if (!code) {
    // eslint-disable-next-line no-param-reassign
    code = await fsAdapter.fs.promises.readFile(filePath, 'utf8');
  }

  if (!ast) {
    // eslint-disable-next-line no-param-reassign
    ast = await AstService.getAst(code, parser);
  }

  // compensate for swc span bug: https://github.com/swc-project/swc/issues/1366#issuecomment-1516539812
  const offset = parser === 'swc' ? await AstService._getSwcOffset() : -1;

  /** @type {SwcPath} */
  let finalNodePath;

  const moduleOrProgramHandler = (
    /** @type {{ stop: () => void; node: { body: any[]; }; scope: { bindings: { [x: string]: { path: any; }; }; }; }} */ astPath,
  ) => {
    astPath.stop();

    // Situations
    // - Identifier is part of default export (in this case 'exportedIdentifier' is '[default]' )
    //   - declared right away (for instance a class)
    //   - referenced (possibly recursively) by other declaration
    // - Identifier is part of a named export
    //   - declared right away
    //   - referenced (possibly recursively) by other declaration

    const globalScopeBindings = getPathFromNode(astPath.node.body?.[0])?.scope.bindings;

    if (exportedIdentifier === '[default]') {
      const defaultExportPath = /** @type {SwcPath} */ (
        getPathFromNode(
          astPath.node.body.find((/** @type {{ type: string; }} */ child) =>
            ['ExportDefaultDeclaration', 'ExportDefaultExpression'].includes(child.type),
          ),
        )
      );

      const isReferenced =
        (defaultExportPath?.node.declaration?.type || defaultExportPath?.node.expression?.type) ===
        'Identifier';

      if (!isReferenced) {
        finalNodePath =
          defaultExportPath.get('declaration') ||
          defaultExportPath.get('decl') ||
          defaultExportPath.get('expression');
      } else {
        finalNodePath = /** @type {SwcPath} */ (
          getReferencedDeclaration({
            referencedIdentifierName: nameOf(
              defaultExportPath.node.declaration || defaultExportPath.node.expression,
            ),
            // @ts-expect-error
            globalScopeBindings,
          })
        );
      }
    } else {
      const variableDeclaratorPath = astPath.scope.bindings[exportedIdentifier].path;
      const varDeclNode = variableDeclaratorPath.node;
      const isReferenced = varDeclNode.init?.type === 'Identifier';
      const contentPath = varDeclNode.init
        ? variableDeclaratorPath.get('init')
        : variableDeclaratorPath;

      const name = varDeclNode.init
        ? nameOf(varDeclNode.init)
        : nameOf(varDeclNode.id) || nameOf(varDeclNode.imported) || nameOf(varDeclNode.orig);

      if (!isReferenced) {
        // it must be an exported declaration
        finalNodePath = contentPath;
      } else {
        finalNodePath = /** @type {SwcPath} */ (
          getReferencedDeclaration({
            referencedIdentifierName: name,
            // @ts-expect-error
            globalScopeBindings,
          })
        );
      }
    }
  };

  oxcTraverse(
    ast,
    {
      Module: moduleOrProgramHandler,
      Program: moduleOrProgramHandler,
    },
    { needsAdvancedPaths: true },
  );

  // @ts-expect-error
  if (finalNodePath.type === 'ImportSpecifier') {
    // @ts-expect-error
    const importDeclNode = finalNodePath.parentPath.node;
    const source = nameOf(importDeclNode.source);
    // @ts-expect-error
    const identifierName = nameOf(finalNodePath.node.imported) || nameOf(finalNodePath.node.local);
    const currentFilePath = filePath;

    const rootFile = await trackDownIdentifier(
      source,
      identifierName,
      currentFilePath,
      projectRootPath,
    );

    const filePathOrSrc = getFilePathOrExternalSource({
      rootPath: projectRootPath,
      localPath: /** @type {PathRelativeFromProjectRoot} */ (rootFile.file),
    });

    // TODO: allow resolving external project file paths
    if (!filePathOrSrc.startsWith('/')) {
      // So we have external project; smth like '@lion/input/x.js'
      return {
        // @ts-expect-error
        sourceNodePath: finalNodePath,
        sourceFragment: null,
        externalImportSource: filePathOrSrc,
      };
    }

    return getSourceCodeFragmentOfDeclaration({
      filePath: /** @type {PathFromSystemRoot} */ (filePathOrSrc),
      exportedIdentifier: rootFile.specifier,
      projectRootPath,
      parser,
    });
  }

  const startOf = (/** @type {{ start: number; span: { start: number; }; }} */ node) =>
    node.start || node.span.start;
  const endOf = (/** @type {{ end: number; span: { end: number; }; }} */ node) =>
    node.end || node.span.end;
  return {
    // @ts-expect-error
    sourceNodePath: finalNodePath,
    sourceFragment: code.slice(
      // @ts-expect-error
      startOf(finalNodePath.node) - 1 - offset,
      // @ts-expect-error
      endOf(finalNodePath.node) - 1 - offset,
    ),
    // sourceFragment: finalNodePath.node?.raw || finalNodePath.node?.value,
    externalImportSource: null,
  };
}
