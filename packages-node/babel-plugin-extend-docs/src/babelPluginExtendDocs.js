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

function replaceTagName(tagName, opts) {
  for (const change of opts.changes) {
    if (change.tag && change.tag.from === tagName) {
      return change.tag.to;
    }
  }
  return tagName;
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
    ClassMethod(path, state) {
      // replace keys (= tag names) in static get scopedElements()
      if (path.node.static === true && path.node.key.name === 'scopedElements') {
        if (
          path.node.body.type === 'BlockStatement' &&
          path.node.body.body[0].type === 'ReturnStatement'
        ) {
          const { argument } = path.node.body.body[0];
          for (const prop of argument.properties) {
            prop.key.value = replaceTagName(prop.key.value, state.opts);
          }
        }
      }
    },
    ClassProperty(path, state) {
      // replace keys (= tag names) in scopedElements =
      if (path.node.static === true && path.node.key.name === 'scopedElements') {
        if (path.node.value.type === 'ObjectExpression') {
          for (const prop of path.node.value.properties) {
            prop.key.value = replaceTagName(prop.key.value, state.opts);
          }
        }
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
