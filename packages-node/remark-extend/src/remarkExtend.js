// unified works my modifying the original passed node
/* eslint-disable no-param-reassign */
const { visit } = require('unist-util-visit');
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

/**
 * Rewrites relative local import/require specifiers (e.g. './foo.js', '../foo.js')
 * found in a js code block so they keep resolving correctly once the block is
 * moved from the imported file's location to the importing file's location.
 * Bare specifiers (e.g. 'my-lib') are left untouched, since there is no
 * reliable way to know their public import path from a file path alone.
 * @param {string} value
 * @param {{ fromFile: string; toFile: string }} options
 * @returns {string}
 */
function rewriteLocalImportSpecifiers(value, { fromFile, toFile }) {
  const fromDir = path.dirname(fromFile);
  const toDir = path.dirname(toFile);
  return value.replace(
    /(\bfrom\s+|\brequire\(\s*|\bimport\s+)(['"])(\.\.?\/[^'"]+)\2/g,
    (match, prefix, quote, specifier) => {
      const absolute = path.resolve(fromDir, specifier);
      let rel = path.relative(toDir, absolute).split(path.sep).join('/');
      if (!rel.startsWith('.')) {
        rel = `./${rel}`;
      }
      return `${prefix}${quote}${rel}${quote}`;
    },
  );
}

/**
 * A page that imports several sections of the same file receives the same preceding
 * `js import` block more than once (see handleImportedFile below). mdjs joins every
 * `js script` and `js client` block of a page into a single module (@mdjs/core:
 * mdjsParse collects them into file.data.jsCode, mdjsSetupCode concatenates them), and
 * a module cannot declare the same binding twice, so a repeated
 * `import { html } from 'lit';` turns that page module into a SyntaxError:
 * "Identifier 'html' has already been declared".
 *
 * So those statements are deduped per rendered page: the first occurrence is kept and
 * later identical ones are dropped. Only the blocks that end up in the page module are
 * touched - a plain `js` block is a code sample shown to the reader, it is never
 * concatenated into the page, so its own preview keeps its import.
 */
const PAGE_LEVEL_CODE_META = ['script', 'client'];

/**
 * @param {object} node
 * @returns {boolean}
 */
function isPageLevelJsCodeBlock(node) {
  return (
    node.type === 'code' &&
    node.lang === 'js' &&
    typeof node.meta === 'string' &&
    PAGE_LEVEL_CODE_META.includes(node.meta)
  );
}

/**
 * @param {string} text
 * @returns {string}
 */
function normalizeCode(text) {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Line ranges (inclusive) of the top level import statements in `lines`.
 * Returns null when a statement does not terminate within 10 lines: removing lines of a
 * statement we did not delimit correctly would delete code instead of a duplicate, so
 * in that case we refuse to guess.
 * @param {string[]} lines
 * @returns {Array<[number, number]> | null}
 */
function importStatementLineRanges(lines) {
  const ranges = [];
  let index = 0;
  while (index < lines.length) {
    if (!/^\s*import\b(?!\s*\()/.test(lines[index])) {
      index += 1;
    } else {
      const start = index;
      let end = index;
      let terminated = false;
      while (end < lines.length && end - start <= 10) {
        const line = lines[end].trimEnd();
        if (/;\s*$/.test(line) || (end === start && /['"]\s*;?$/.test(line))) {
          terminated = true;
          break;
        }
        end += 1;
      }
      if (!terminated || end >= lines.length) {
        return null;
      }
      ranges.push([start, end]);
      index = end + 1;
    }
  }
  return ranges;
}

/**
 * Drops every `js script`/`js client` statement (or whole block) that the page already
 * declared earlier, in document order.
 * @param {object} tree
 */
function dedupePageLevelImportStatements(tree) {
  const seenBlockValues = new Set();
  const seenStatements = new Set();

  visit(tree, node => {
    if (!isPageLevelJsCodeBlock(node) || !node.value) {
      return;
    }
    const normalizedBlockValue = normalizeCode(node.value);
    if (seenBlockValues.has(normalizedBlockValue)) {
      // eslint-disable-next-line no-param-reassign
      node.__remarkExtendRemove = true;
      return;
    }
    seenBlockValues.add(normalizedBlockValue);

    const lines = node.value.split('\n');
    const ranges = importStatementLineRanges(lines);
    if (!ranges || ranges.length === 0) {
      return;
    }

    const duplicateLines = new Set();
    for (const [start, end] of ranges) {
      const statement = normalizeCode(lines.slice(start, end + 1).join('\n'));
      if (seenStatements.has(statement)) {
        for (let line = start; line <= end; line += 1) {
          duplicateLines.add(line);
        }
      } else {
        seenStatements.add(statement);
      }
    }

    if (duplicateLines.size === 0) {
      return;
    }
    const remainingLines = lines.filter((line, index) => !duplicateLines.has(index));
    // eslint-disable-next-line no-param-reassign
    node.value = remainingLines.join('\n');
    if (normalizeCode(node.value) === '') {
      // eslint-disable-next-line no-param-reassign
      node.__remarkExtendRemove = true;
    }
  });

  visit(
    tree,
    (node, index, parent) => {
      if (node.__remarkExtendRemove) {
        parent.children.splice(index, 1);
      }
    },
    true,
  );
}

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
    // js code blocks (plain, not ::import directives) seen at root level
    // BEFORE the start selector matches. When a section is imported via a
    // selector (e.g. ::importBlock), these "dependency" blocks live outside
    // the selected range but are still needed by it, so we carry them along.
    const precedingImportNodes = [];
    let precedingImportNodesInserted = false;

    visit(tree, (node, index, parent) => {
      if (
        !insertIt &&
        parent &&
        parent.type === 'root' &&
        node.type === 'code' &&
        node.lang === 'js' &&
        !(node.meta && node.meta.startsWith('::import'))
      ) {
        precedingImportNodes.push(node);
      }

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
        if (!precedingImportNodesInserted) {
          precedingImportNodesInserted = true;
          for (const importNode of precedingImportNodes) {
            importNode.value = rewriteLocalImportSpecifiers(importNode.value, {
              fromFile: filePath,
              toFile: currentFile,
            });
          }
          toInsertNodes.push(...precedingImportNodes);
        }
        if (node.type === 'code' && node.lang === 'js') {
          node.value = rewriteLocalImportSpecifiers(node.value, {
            fromFile: filePath,
            toFile: currentFile,
          });
        }
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

    // The module mdjs builds from a page's `js script`/`js client` blocks can declare each
    // import binding only once, so imports that reached this page more than once (the
    // preceding blocks carried along above) are deduped here, per rendered page.
    dedupePageLevelImportStatements(tree);

    return tree;
  };
}

module.exports = {
  remarkExtend,
};
