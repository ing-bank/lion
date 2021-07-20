/* eslint-disable no-param-reassign */

function getImportAs(specifier, newImportName) {
  if (specifier.local && specifier.local.name && specifier.local.name !== specifier.imported.name) {
    return specifier.local.name;
  }
  return newImportName;
}

function renameAndStoreImports({ path, state, opts, types: t }) {
  for (const specifier of path.node.specifiers) {
    const { assertions } = path.node;
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
                assertions,
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
        assertions,
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
      statements[imp.path] = { specifier: [] };
    }
    statements[imp.path].specifier.push(imp.specifier);
    statements[imp.path].assertions = imp.assertions;
  }
  const res = [];
  for (const path of Object.keys(statements)) {
    const { specifier, assertions } = statements[path];
    const source = t.stringLiteral(path);
    const dec = t.importDeclaration(specifier, source);
    dec.assertions = assertions;
    res.push(dec);
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
