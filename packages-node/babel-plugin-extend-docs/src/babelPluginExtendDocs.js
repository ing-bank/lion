/* eslint-disable no-param-reassign */
const {
  renameAndStoreImports,
  generateImportStatements,
  replaceTagImports,
} = require('./handleImports.js');
const { validateOptions } = require('./validateOptions.js');

function replaceTemplateElements({ path, opts }) {
  const replaceTag = (value, from, to) =>
    value
      .replace(new RegExp(`<${from}(?=\\s|>)`, 'g'), `<${to}`) // positive lookahead for '>' or ' ' after the tagName
      .replace(new RegExp(`/${from}>`, 'g'), `/${to}>`);
  path.node.quasi.quasis.forEach(quasi => {
    opts.changes.forEach(change => {
      if (change.tag && quasi.value.raw.match(change.tag.from)) {
        quasi.value.raw = replaceTag(quasi.value.raw, change.tag.from, change.tag.to);
        if (typeof quasi.value.cooked === 'string') {
          quasi.value.cooked = replaceTag(quasi.value.cooked, change.tag.from, change.tag.to);
        }
      }
    });
  });
}

function insertImportStatements({ imports, path }) {
  path.node.body = [...imports, ...path.node.body];
}

module.exports = ({ types: t }) => ({
  visitor: {
    ImportDeclaration(path, state) {
      if (path.node.specifiers.length > 0) {
        renameAndStoreImports({ path, state, opts: state.opts, types: t });
      } else {
        replaceTagImports({ path, state, opts: state.opts, types: t });
      }
    },
    TaggedTemplateExpression(path, state) {
      if (t.isIdentifier(path.node.tag) && path.node.tag.name === 'html') {
        replaceTemplateElements({ path, opts: state.opts });
      }
    },
    Program: {
      enter: (path, state) => {
        validateOptions(state.opts);

        state.importedStorage = [];
      },
      exit: (path, state) => {
        const imports = generateImportStatements({ state, types: t });
        insertImportStatements({ imports, path });
      },
    },
  },
});
