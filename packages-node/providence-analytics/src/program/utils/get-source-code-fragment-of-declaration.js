import fs from 'fs';
import path from 'path';
import { swcTraverse, getPathFromNode } from './swc-traverse.js';
import { AstService } from '../core/AstService.js';
import { trackDownIdentifier } from '../analyzers/helpers/track-down-identifier.js';
import { toPosixPath } from './to-posix-path.js';

/**
 * @typedef {import('@babel/types').Node} Node
 * @typedef {import('@babel/traverse').NodePath} NodePath
 * @typedef {import('../../../types/index.js').SwcBinding} SwcBinding
 * @typedef {import('../../../types/index.js').PathRelativeFromProjectRoot} PathRelativeFromProjectRoot
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 */

/**
 * @param {{rootPath:PathFromSystemRoot; localPath:PathRelativeFromProjectRoot}} opts
 * @returns
 */
export function getFilePathOrExternalSource({ rootPath, localPath }) {
  if (!localPath.startsWith('.')) {
    // We are not resolving external files like '@lion/input-amount/x.js',
    // but we give a 100% score if from and to are same here..
    return localPath;
  }
  return toPosixPath(path.resolve(rootPath, localPath));
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
 * @returns {NodePath}
 */
export function getReferencedDeclaration({ referencedIdentifierName, globalScopeBindings }) {
  // We go from referencedIdentifierName 'y' to binding (VariableDeclarator path) 'y';
  // const [, refDeclaratorBinding] =
  //   Object.entries(globalScopeBindings).find(([key]) => key === referencedIdentifierName) || [];

  const refDeclaratorBinding = globalScopeBindings[referencedIdentifierName];

  // We provided a referencedIdentifierName that is not in the globalScopeBindings
  if (!refDeclaratorBinding) {
    return null;
  }

  if (['ImportSpecifier', 'ImportDefaultSpecifier'].includes(refDeclaratorBinding.path.node.type)) {
    return refDeclaratorBinding.path;
  }

  if (refDeclaratorBinding.identifier.init.type === 'Identifier') {
    return getReferencedDeclaration({
      referencedIdentifierName: refDeclaratorBinding.identifier.init.value,
      globalScopeBindings,
    });
  }

  return refDeclaratorBinding.path.get('init');
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
 * @param {{ filePath: PathFromSystemRoot; exportedIdentifier: string; projectRootPath: PathFromSystemRoot }} opts
 * @returns {Promise<{ sourceNodePath: string; sourceFragment: string|null; externalImportSource: string; }>}
 */
export async function getSourceCodeFragmentOfDeclaration({
  filePath,
  exportedIdentifier,
  projectRootPath,
}) {
  const code = fs.readFileSync(filePath, 'utf8');

  // compensate for swc span bug: https://github.com/swc-project/swc/issues/1366#issuecomment-1516539812
  const offset = AstService._getSwcOffset();
  // TODO: fix swc-to-babel lib to make this compatible with 'swc-to-babel' mode of getAst
  const swcAst = AstService._getSwcAst(code);

  /** @type {NodePath} */
  let finalNodePath;

  swcTraverse(
    swcAst,
    {
      Module(astPath) {
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
          const defaultExportPath = getPathFromNode(
            astPath.node.body.find(child =>
              ['ExportDefaultDeclaration', 'ExportDefaultExpression'].includes(child.type),
            ),
          );
          const isReferenced = defaultExportPath?.node.expression?.type === 'Identifier';

          if (!isReferenced) {
            finalNodePath = defaultExportPath.get('decl') || defaultExportPath.get('expression');
          } else {
            finalNodePath = getReferencedDeclaration({
              referencedIdentifierName: defaultExportPath.node.expression.value,
              globalScopeBindings,
            });
          }
        } else {
          const variableDeclaratorPath = astPath.scope.bindings[exportedIdentifier].path;
          const varDeclNode = variableDeclaratorPath.node;
          const isReferenced = varDeclNode.init?.type === 'Identifier';
          const contentPath = varDeclNode.init
            ? variableDeclaratorPath.get('init')
            : variableDeclaratorPath;

          const name = varDeclNode.init
            ? varDeclNode.init.value
            : varDeclNode.id?.value || varDeclNode.imported?.value || varDeclNode.orig?.value;

          if (!isReferenced) {
            // it must be an exported declaration
            finalNodePath = contentPath;
          } else {
            finalNodePath = getReferencedDeclaration({
              referencedIdentifierName: name,
              globalScopeBindings,
            });
          }
        }
      },
    },
    { needsAdvancedPaths: true },
  );

  if (finalNodePath.type === 'ImportSpecifier') {
    const importDeclNode = finalNodePath.parentPath.node;
    const source = importDeclNode.source.value;
    const identifierName = finalNodePath.node.imported?.value || finalNodePath.node.local?.value;
    const currentFilePath = filePath;

    const rootFile = await trackDownIdentifier(
      source,
      identifierName,
      currentFilePath,
      projectRootPath,
    );
    const filePathOrSrc = getFilePathOrExternalSource({
      rootPath: projectRootPath,
      localPath: rootFile.file,
    });

    // TODO: allow resolving external project file paths
    if (!filePathOrSrc.startsWith('/')) {
      // So we have external project; smth like '@lion/input/x.js'
      return {
        sourceNodePath: finalNodePath,
        sourceFragment: null,
        externalImportSource: filePathOrSrc,
      };
    }

    return getSourceCodeFragmentOfDeclaration({
      filePath: filePathOrSrc,
      exportedIdentifier: rootFile.specifier,
      projectRootPath,
    });
  }

  return {
    sourceNodePath: finalNodePath,
    sourceFragment: code.slice(
      finalNodePath.node?.span?.start - 1 - offset,
      finalNodePath.node?.span?.end - 1 - offset,
    ),
    // sourceFragment: finalNodePath.node?.raw || finalNodePath.node?.value,
    externalImportSource: null,
  };
}
