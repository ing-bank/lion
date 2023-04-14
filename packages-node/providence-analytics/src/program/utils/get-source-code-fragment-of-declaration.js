const fs = require('fs');
const path = require('path');
const babelTraversePkg = require('@babel/traverse');
const { AstService } = require('../services/AstService.js');
const { trackDownIdentifier } = require('../analyzers/helpers/track-down-identifier.js');
const { toPosixPath } = require('./to-posix-path.js');

function getFilePathOrExternalSource({ rootPath, localPath }) {
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
 *  - getReferencedDeclaration is called with { referencedIdentifierName: 'y', ... }
 *  - now we will look in globalScopeBindings, till we find declaration of 'y'
 *    - Is it a ref? Call ourselves with referencedIdentifierName ('x' in example above)
 *    - is it a non ref declaration? Return the path of the node
 * @param {{ referencedIdentifierName:string, globalScopeBindings:BabelBinding; }} opts
 * @returns {BabelNodePath}
 */
function getReferencedDeclaration({ referencedIdentifierName, globalScopeBindings }) {
  const [, refDeclaratorBinding] = Object.entries(globalScopeBindings).find(
    ([key]) => key === referencedIdentifierName,
  );

  if (
    refDeclaratorBinding.path.type === 'ImportSpecifier' ||
    refDeclaratorBinding.path.type === 'ImportDefaultSpecifier'
  ) {
    return refDeclaratorBinding.path;
  }

  if (refDeclaratorBinding.path.node.init.type === 'Identifier') {
    return getReferencedDeclaration({
      referencedIdentifierName: refDeclaratorBinding.path.node.init.name,
      globalScopeBindings,
    });
  }

  return refDeclaratorBinding.path.get('init');
}

/**
 *
 * @param {{ filePath: string; exportedIdentifier: string; }} opts
 */
async function getSourceCodeFragmentOfDeclaration({
  filePath,
  exportedIdentifier,
  projectRootPath,
}) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = AstService.getAst(code, 'babel');

  let finalNodePath;

  babelTraversePkg.default(ast, {
    Program(babelPath) {
      babelPath.stop();

      // Situations
      // - Identifier is part of default export (in this case 'exportedIdentifier' is '[default]' )
      //   - declared right away (for instance a class)
      //   - referenced (possibly recursively) by other declaration
      // - Identifier is part of a named export
      //   - declared right away
      //   - referenced (possibly recursively) by other declaration

      const globalScopeBindings = babelPath.get('body')[0].scope.bindings;

      if (exportedIdentifier === '[default]') {
        const defaultExportPath = babelPath
          .get('body')
          .find(child => child.node.type === 'ExportDefaultDeclaration');
        const isReferenced = defaultExportPath.node.declaration?.type === 'Identifier';

        if (!isReferenced) {
          finalNodePath = defaultExportPath.get('declaration');
        } else {
          finalNodePath = getReferencedDeclaration({
            referencedIdentifierName: defaultExportPath.node.declaration.name,
            globalScopeBindings,
          });
        }
      } else {
        const variableDeclaratorPath = babelPath.scope.getBinding(exportedIdentifier).path;
        const varDeclNode = variableDeclaratorPath.node;
        const isReferenced = varDeclNode.init?.type === 'Identifier';
        const contentPath = varDeclNode.init
          ? variableDeclaratorPath.get('init')
          : variableDeclaratorPath;

        const name = varDeclNode.init
          ? varDeclNode.init.name
          : varDeclNode.id?.name || varDeclNode.imported.name;

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
  });

  if (finalNodePath.type === 'ImportSpecifier') {
    const importDeclNode = finalNodePath.parentPath.node;
    const source = importDeclNode.source.value;
    const identifierName = finalNodePath.node.imported.name;
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
    sourceFragment: code.slice(finalNodePath.node?.start, finalNodePath.node?.end),
    externalImportSource: null,
  };
}

module.exports = {
  getSourceCodeFragmentOfDeclaration,
  getFilePathOrExternalSource,
  getReferencedDeclaration,
};
