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
 * @typedef {import('@swc/core').Node & {
 *   body?: SwcNode[];
 *   declaration?: SwcNode;
 *   expression?: SwcNode;
 *   init?: SwcNode;
 *   id?: SwcNode;
 *   identifier?: SwcNode;
 *   source?: SwcNode;
 *   specifiers?: SwcNode[];
 *   imported?: SwcNode;
 *   local?: SwcNode;
 *   orig?: SwcNode;
 *   start?: number | null;
 *   end?: number | null;
 *   span?: { start: number; end: number };
 * }} SwcNode
 * @typedef {import("oxc-parser").ParseResult} OxcParseResult
 * @typedef {import('@swc/core').Module} SwcAstModule
 * @typedef {OxcParseResult|SwcAstModule|SwcNode} ParsedAst
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
  const declarationNode = /** @type {SwcNode} */ (identifierBinding.path.node);
  const isNonRefDeclaration = type.endsWith('Declaration');
  if (isNonRefDeclaration && !containsIdentifier(declarationNode)) {
    throw new Error('Make sure entries added to globalScopeBindings contains an identifier');
  }

  const isImportingSpecifier = ['ImportSpecifier', 'ImportDefaultSpecifier'].includes(type);
  if (isImportingSpecifier || isNonRefDeclaration) {
    return identifierBinding.path;
  }

  const isRefDeclarator = declarationNode.init?.type === 'Identifier';
  if (isRefDeclarator) {
    return getReferencedDeclaration({
      referencedIdentifierName: nameOf(/** @type {SwcNode} */ (declarationNode.init)),
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
 * @param {{ code?: string; ast?: ParsedAst; filePath: PathFromSystemRoot; exportedIdentifier: string; projectRootPath: PathFromSystemRoot; parser?: AnalyzerAst }} opts
 * @returns {Promise<{ sourceNodeType: string; sourceFragment: string|null; externalImportSource: string|null; }>}
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

  // Type guard: ensure ast is defined
  if (!ast) throw new Error('Failed to generate AST');

  // compensate for swc span bug: https://github.com/swc-project/swc/issues/1366#issuecomment-1516539812
  const offset = parser === 'swc' ? await AstService._getSwcOffset() : -1;

  /** @type {SwcPath|undefined} */
  let finalNodePath;

  const moduleOrProgramHandler = (/** @type {SwcPath} */ astPath) => {
    astPath.stop();

    // Situations
    // - Identifier is part of default export (in this case 'exportedIdentifier' is '[default]' )
    //   - declared right away (for instance a class)
    //   - referenced (possibly recursively) by other declaration
    // - Identifier is part of a named export
    //   - declared right away
    //   - referenced (possibly recursively) by other declaration

    const moduleNode = /** @type {SwcNode} */ (astPath.node);
    const globalScopeBindings = getPathFromNode(/** @type {SwcNode} */ (moduleNode.body?.[0]))
      ?.scope?.bindings;

    if (exportedIdentifier === '[default]') {
      const defaultExportPath = /** @type {SwcPath} */ (
        getPathFromNode(
          /** @type {SwcNode} */ (
            moduleNode.body?.find((/** @type {{ type: string; }} */ child) =>
              ['ExportDefaultDeclaration', 'ExportDefaultExpression'].includes(child.type),
            )
          ),
        )
      );
      const defaultExportNode = /** @type {SwcNode|undefined} */ (defaultExportPath?.node);

      const isReferenced =
        (defaultExportNode?.declaration?.type || defaultExportNode?.expression?.type) ===
        'Identifier';

      if (!isReferenced) {
        finalNodePath = /** @type {SwcPath} */ (
          defaultExportPath.get('declaration') ||
            defaultExportPath.get('decl') ||
            defaultExportPath.get('expression')
        );
      } else {
        finalNodePath = /** @type {SwcPath} */ (
          getReferencedDeclaration({
            referencedIdentifierName: nameOf(
              /** @type {SwcNode} */ (
                defaultExportNode?.declaration || defaultExportNode?.expression
              ),
            ),
            // @ts-expect-error
            globalScopeBindings,
          })
        );
      }
    } else {
      const globalBindingForIdentifier = astPath.scope?.bindings[exportedIdentifier];

      // If the identifier is not in root scope, search nested scopes
      if (!globalBindingForIdentifier) {
        // Traverse to find the binding in any nested scope
        oxcTraverse(
          ast,
          {
            VariableDeclarator(/** @type {SwcPath} */ varPath) {
              const varDeclNode = /** @type {SwcNode} */ (varPath.node);
              if (nameOf(/** @type {SwcNode} */ (varDeclNode.id)) === exportedIdentifier) {
                const initType = varDeclNode.init?.type;

                if (!varDeclNode.init) {
                  // No init value
                  finalNodePath = /** @type {SwcPath} */ (varPath.get('init') || varPath);
                } else if (initType === 'Literal') {
                  // Simple literal value - return as-is (covers both string and numeric literals)
                  finalNodePath = /** @type {SwcPath} */ (varPath.get('init') || varPath);
                } else if (initType === 'Identifier') {
                  // References another identifier - try to resolve it
                  const referencedName = nameOf(/** @type {SwcNode} */ (varDeclNode.init));
                  // Get the global scope to look up the binding

                  if (globalScopeBindings) {
                    const resolvedPath = /** @type {SwcPath} */ (
                      getReferencedDeclaration({
                        referencedIdentifierName: referencedName,
                        globalScopeBindings,
                      })
                    );

                    // Only follow the reference if it resolves to a Literal or ImportSpecifier
                    // Otherwise return the identifier itself (don't resolve to expressions)
                    const resolvedType = resolvedPath?.node?.type;
                    if (resolvedType === 'Literal' || resolvedType === 'ImportSpecifier') {
                      finalNodePath = resolvedPath;
                    } else {
                      // Return the identifier itself, not what it references
                      finalNodePath = /** @type {SwcPath} */ (varPath.get('init') || varPath);
                    }
                  } else {
                    finalNodePath = /** @type {SwcPath} */ (varPath.get('init') || varPath);
                  }
                } else {
                  // Expression or other type - return as-is (source code will be extracted)
                  finalNodePath = /** @type {SwcPath} */ (varPath.get('init') || varPath);
                }
                varPath.stop();
              }
            },
          },
          { needsAdvancedPaths: true },
        );
        return;
      }

      const variableDeclaratorPath = globalBindingForIdentifier.path;
      const varDeclNode = /** @type {SwcNode} */ (variableDeclaratorPath.node);
      const initType = varDeclNode.init?.type;
      const contentPath = /** @type {SwcPath} */ (
        varDeclNode.init ? variableDeclaratorPath.get('init') : variableDeclaratorPath
      );

      const name = varDeclNode.init
        ? nameOf(/** @type {SwcNode} */ (varDeclNode.init))
        : nameOf(/** @type {SwcNode} */ (varDeclNode.id)) ||
          nameOf(/** @type {SwcNode} */ (varDeclNode.imported)) ||
          nameOf(/** @type {SwcNode} */ (varDeclNode.orig));

      if (!varDeclNode.init) {
        // No init value
        finalNodePath = contentPath;
      } else if (initType === 'Literal') {
        // Simple literal value - return as-is (covers both string and numeric literals)
        finalNodePath = contentPath;
      } else if (initType === 'Identifier') {
        // References another identifier - resolve it
        const resolvedPath = /** @type {SwcPath} */ (
          getReferencedDeclaration({
            referencedIdentifierName: name,
            // @ts-expect-error
            globalScopeBindings,
          })
        );

        // Only follow the reference if it resolves to a Literal or ImportSpecifier
        // Otherwise return the identifier itself (don't resolve to expressions)
        const resolvedType = resolvedPath?.node?.type;
        if (resolvedType === 'Literal' || resolvedType === 'ImportSpecifier') {
          finalNodePath = resolvedPath;
        } else {
          // Return the identifier itself, not what it references
          finalNodePath = contentPath;
        }
      } else {
        // Expression or other type - return as-is (source code will be extracted)
        finalNodePath = contentPath;
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

  if (finalNodePath?.type === 'ImportSpecifier') {
    const importDeclNode = /** @type {SwcNode} */ (finalNodePath.parentPath?.node);
    const source = nameOf(/** @type {SwcNode} */ (importDeclNode.source));
    const importedNode = /** @type {SwcNode} */ (finalNodePath.node);
    const identifierName =
      nameOf(/** @type {SwcNode} */ (importedNode.imported)) ||
      nameOf(/** @type {SwcNode} */ (importedNode.local));
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
        sourceNodeType: 'ImportSpecifier', // External import, return the import type
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

  // Guard against finalNodePath not being found
  if (!finalNodePath) {
    return {
      sourceNodeType: 'Unknown',
      sourceFragment: null,
      externalImportSource: null,
    };
  }

  /**
   * @param {SwcNode} node
   * @returns {number}
   */
  const startOf = node => /** @type {number} */ (node.start || node.span?.start);
  /**
   * @param {SwcNode} node
   * @returns {number}
   */
  const endOf = node => /** @type {number} */ (node.end || node.span?.end);

  const finalNode = /** @type {SwcNode} */ (finalNodePath.node);

  const sourceFragment = code.slice(startOf(finalNode) - 1 - offset, endOf(finalNode) - 1 - offset);

  return {
    sourceNodeType: finalNode.type,
    sourceFragment,
    // sourceFragment: finalNodePath.node?.raw || finalNodePath.node?.value,
    externalImportSource: null,
  };
}
