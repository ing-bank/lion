// unified works my modifying the original passed node
/* eslint-disable no-param-reassign */
const visit = require('unist-util-visit');
const { select } = require('unist-util-select');
const unified = require('unified');
const markdown = require('remark-parse');
const is = require('unist-util-is');
const fs = require('fs');
const path = require('path');

/**
 * Allows to execute an actual node module code block.
 * Supports imports (via require) within those code blocks.
 *
 * @example
 *   const virtualMod = requireFromString('module.export = { a: "a value", fn: () => {} }');
 *   console.log(virtualMod.a); // a value
 *   // execute function
 *   virtualMod.fn();
 *
 * @param {*} src
 * @param {*} filename
 */
function requireFromString(src, filename = 'tmp.js') {
  const m = new module.constructor();
  m.paths = module.paths;
  m._compile(src, filename);
  return m.exports;
}

let toInsertNodes = [];

function handleImportedFile({ startSelector, endSelector, userFunction, filePath, fileImport }) {
  return tree => {
    const start = select(startSelector, tree);
    if (!start) {
      const msg = `The start selector "${startSelector}" could not find a matching node in "${filePath}".`;
      throw new Error(msg);
    }
    const startIsNode = { ...start };
    delete startIsNode.children; // unified is comparison does not support children

    let endIsNode;
    if (endSelector !== ':end-of-file') {
      const end = select(endSelector, tree);
      if (!end) {
        const msg = `The end selector "${endSelector}" could not find a matching node in "${filePath}".`;
        throw new Error(msg);
      }
      endIsNode = { ...end };
      delete endIsNode.children; // unified is comparison does not support children
    }

    let insertIt = false;
    visit(tree, (node, index, parent) => {
      if (is(node, startIsNode)) {
        insertIt = true;
      }

      if (endIsNode && is(node, endIsNode)) {
        insertIt = false;
      }

      if (insertIt) {
        if (userFunction) {
          node = userFunction(node, { index, parent, tree });
        }
      }

      if (insertIt && parent && parent.type === 'root') {
        toInsertNodes.push(node);
      }

      if (node.type === 'image') {
        node.url = path.join(path.dirname(fileImport), node.url);
      }
    });
  };
}

// unified expect direct
// eslint-disable-next-line consistent-return
function remarkExtend({ rootDir = process.cwd(), sourceInfo } = {}) {
  return tree => {
    visit(tree, (node, index, parent) => {
      if (
        node.type === 'code' &&
        node.lang === 'js' &&
        node.meta &&
        node.meta.startsWith('::import')
      ) {
        // eslint-disable-next-line prefer-const
        let [fileImport, startSelector = ':root', endSelector = ':end-of-file'] = node.meta
          .substring(node.meta.indexOf("('") + 2, node.meta.indexOf("')"))
          .split("', '")
          .map(paramPart => paramPart.trim());

        let filePath;
        try {
          filePath = require.resolve(fileImport);
        } catch (err) {
          filePath = path.resolve(path.join(rootDir, fileImport));
        }

        if (!fs.existsSync(filePath)) {
          throw new Error(
            `The import "${fileImport}" in "${sourceInfo}" does not exist. Resolved to "${filePath}".`,
          );
        }
        const importFileContent = fs.readFileSync(filePath);

        if (node.meta.startsWith('::importBlock(')) {
          if (!startSelector.startsWith('#')) {
            throw new Error(
              `::importBlock only works for headlines like "## My Headline" but "${startSelector}" was given`,
            );
          }
          const [hashes, ...headline] = startSelector.split(' ');
          startSelector = `heading[depth=${hashes.length}]:has([value=${headline.join(' ')}])`;
          endSelector = `${startSelector} ~ heading[depth=${hashes.length}]`;
        }

        let userFunction;
        if (node.value !== '') {
          const virtualMod = requireFromString(node.value);
          const keys = Object.keys(virtualMod);
          userFunction = virtualMod[keys[0]];
        }

        toInsertNodes = [];
        const parser = unified()
          .use(markdown)
          .use(handleImportedFile, {
            startSelector,
            endSelector,
            userFunction,
            filePath,
            fileImport,
          })
          .use(function plugin() {
            this.Compiler = () => '';
          });
        parser.processSync(importFileContent.toString());

        if (node.type === 'root') {
          node.children.splice(0, 0, ...toInsertNodes);
        } else {
          parent.children[index].__remarkExtendRemove = true;
          parent.children.splice(index + 1, 0, ...toInsertNodes);
        }
      }
    });

    // another pass to remove nodes
    visit(
      tree,
      (node, index, parent) => {
        if (node.__remarkExtendRemove) {
          parent.children.splice(index, 1);
        }
      },
      true,
    );
    return tree;
  };
}

module.exports = {
  remarkExtend,
};
