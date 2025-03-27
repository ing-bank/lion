// unified works my modifying the original passed node
/* eslint-disable no-param-reassign */
const visit = require('unist-util-visit');
const { select } = require('unist-util-select');
const unified = require('unified');
const markdown = require('remark-parse');
const gfm = require('remark-gfm');
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
 * @param {string} src
 * @param {string} filename
 * @returns {object}
 */
function requireFromString(src, filename = 'tmp.js') {
  const srcWithPath = `const path = require('path');\n${src}`;
  // @ts-expect-error
  const m = new module.constructor();
  // @ts-expect-error
  m.paths = module.paths;
  m._compile(srcWithPath, filename);
  return m.exports;
}

/**
 * Frontmatter is problematic when traversing md files with
 * unist-util-select: https://github.com/syntax-tree/unist-util-select/blob/main/index.js.
 * So we remove it before parsing
 * @param {string} mdFileString
 * @returns {string}
 */
function stripFrontMatter(mdFileString) {
  return mdFileString.replace(/^\s*---(.|\n)*?---/, '');
}

let toInsertNodes = [];

function handleImportedFile({
  startSelector,
  endSelector,
  userFunction,
  globalReplaceFunction,
  filePath,
  missingEndSelectorMeansUntilEndOfFile = false,
  currentFile,
}) {
  return tree => {
    const start = select(startSelector, tree);
    if (!start) {
      const msg = `The start selector "${startSelector}", imported in "${currentFile}", could not find a matching node in "${filePath}".`;
      throw new Error(msg);
    }
    const startIsNode = { ...start };
    delete startIsNode.children; // unified is comparison does not support children

    let endIsNode;
    if (endSelector !== ':end-of-file') {
      const end = select(endSelector, tree);
      if (!end) {
        if (missingEndSelectorMeansUntilEndOfFile === false) {
          const msg = `The end selector "${endSelector}", imported in "${currentFile}", could not find a matching node in "${filePath}".`;
          throw new Error(msg);
        }
      } else {
        endIsNode = { ...end };
        delete endIsNode.children; // unified is comparison does not support children
      }
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
        if (globalReplaceFunction) {
          node = globalReplaceFunction(node, { index, parent, tree });
        }
        if (userFunction) {
          node = userFunction(node, { index, parent, tree });
        }
      }

      if (insertIt && parent && parent.type === 'root') {
        toInsertNodes.push(node);
      }
    });
  };
}

// unified expect direct
// eslint-disable-next-line consistent-return
function remarkExtend({ rootDir = process.cwd(), page, globalReplaceFunction } = {}) {
  const currentFile = path.resolve(rootDir, page.inputPath);

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
        let missingEndSelectorMeansUntilEndOfFile = false;
        try {
          filePath = require.resolve(fileImport);
        } catch (err) {
          filePath = path.resolve(path.join(rootDir, fileImport));
        }

        if (!fs.existsSync(filePath)) {
          const inputPath = page ? page.inputPath : 'no page.inputPath given';
          throw new Error(
            `The import "${fileImport}" in "${inputPath}" does not exist. Resolved to "${filePath}".`,
          );
        }
        const importFileContent = fs.readFileSync(filePath);

        if (
          node.meta.startsWith('::importBlock(') ||
          node.meta.startsWith('::importBlockContent(') ||
          node.meta.startsWith('::importSmallBlock(') ||
          node.meta.startsWith('::importSmallBlockContent(')
        ) {
          missingEndSelectorMeansUntilEndOfFile = true;
          const [identifier] = node.meta.split('(');
          if (!startSelector.startsWith('#')) {
            throw new Error(
              `${identifier} only works for headlines like "## My Headline" but "${startSelector}" was given`,
            );
          }
          const [hashes, ...headline] = startSelector.split(' ');
          switch (identifier) {
            case '::importBlock':
              startSelector = `heading[depth=${hashes.length}]:has([value=${headline.join(' ')}])`;
              endSelector = `${startSelector} ~ heading[depth=${hashes.length}]`;
              break;
            case '::importBlockContent':
              startSelector = `heading[depth=${hashes.length}]:has([value=${headline.join(
                ' ',
              )}]) ~ *`;
              endSelector = `${startSelector} ~ heading[depth=${hashes.length}]`;
              break;
            case '::importSmallBlock':
              startSelector = `heading[depth=${hashes.length}]:has([value=${headline.join(' ')}])`;
              endSelector = `${startSelector} ~ heading`;
              break;
            case '::importSmallBlockContent':
              startSelector = `heading[depth=${hashes.length}]:has([value=${headline.join(
                ' ',
              )}]) ~ *`;
              endSelector = `${startSelector} ~ heading`;
            /* no default */
          }
        }

        let userFunction;
        if (node.value !== '') {
          const inputPath = page ? page.inputPath : 'no page.inputPath given';
          const resolvedInputPath = path.resolve(inputPath);
          if (!resolvedInputPath) {
            throw new Error(
              `The page.inputPath "${inputPath}" could not be resolved. Tried to resolve with "${resolvedInputPath}".`,
            );
          }
          const virtualMod = requireFromString(node.value, resolvedInputPath);
          const keys = Object.keys(virtualMod);
          userFunction = virtualMod[keys[0]];
        }

        toInsertNodes = [];
        const parser = unified()
          .use(markdown)
          .use(gfm)
          .use(handleImportedFile, {
            startSelector,
            endSelector,
            userFunction,
            globalReplaceFunction,
            filePath,
            fileImport,
            missingEndSelectorMeansUntilEndOfFile,
            currentFile,
          })
          .use(function plugin() {
            this.Compiler = () => '';
          });
        parser.processSync(stripFrontMatter(importFileContent.toString()));

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
