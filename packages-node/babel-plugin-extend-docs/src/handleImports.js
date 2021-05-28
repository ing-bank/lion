/* eslint-disable no-param-reassign */

function getImportAs(specifier, newImportName) {
  if (specifier.local && specifier.local.name && specifier.local.name !== specifier.imported.name) {
    return specifier.local.name;
  }
  return newImportName;
}

function renameAndStoreImports({ path, state, opts, types: t }) {
  for (const specifier of path.node.specifiers) {
    let managed = false;

    if (t.isIdentifier(specifier.imported) && specifier.type === 'ImportSpecifier') {
      for (const change of opts.changes) {
        if (change.variable && specifier.imported.name === change.variable.from) {
          for (const { from, to } of change.variable.paths) {
            if (managed === false && from === path.node.source.value) {
              const importAs = getImportAs(specifier, change.variable.to);

              // rename so it replaces all occurrences
              path.scope.rename(specifier.local.name, importAs);
              if (specifier.imported && specifier.imported.name) {
                specifier.imported.name = change.variable.to;
              }
              state.importedStorage.push({
                action: 'change',
                specifier,
                path: to,
              });
              managed = true;
            }
          }
        }
      }
    }

    if (managed === false) {
      state.importedStorage.push({
        action: 'keep',
        specifier,
        path: path.node.source.value,
      });
    }
  }
  path.remove();
}

function generateImportStatements({ state, types: t }) {
  const statements = {};
  for (const imp of state.importedStorage) {
    if (!statements[imp.path]) {
      statements[imp.path] = [];
    }
    statements[imp.path].push(imp.specifier);
  }
  const res = [];
  for (const path of Object.keys(statements)) {
    const importSpecifiers = statements[path];
    const source = t.stringLiteral(path);
    res.push(t.importDeclaration(importSpecifiers, source));
  }
  return res;
}

function replaceTagImports({ path, opts, types: t }) {
  for (const change of opts.changes) {
    if (change.tag && Array.isArray(change.tag.paths) && change.tag.paths.length > 0) {
      for (const { from, to } of change.tag.paths) {
        if (from === path.node.source.value) {
          path.node.source = t.stringLiteral(to);
        }
      }
    }
  }
}

module.exports = {
  renameAndStoreImports,
  generateImportStatements,
  replaceTagImports,
};
