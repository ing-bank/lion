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
 * `js import` block more than once (see handleImportedFile below). mdjs joins the code blocks
 * of a page into a single module (@mdjs/core: mdjsParse collects `script`/`client` code into
 * file.data.jsCode and mdjsStoryParse collects `story`/`preview-story` code into
 * file.data.stories, mdjsSetupCode concatenates both), and in that module a second declaration
 * of the same binding is a SyntaxError: "Identifier 'html' has already been declared".
 *
 * So those statements are deduped per rendered page. Which block is touched matters: a
 * `script`/`client`/`story` block is only executed, while a `preview-story` is also shown to
 * the reader in the preview's code slot, so between those two the invisible one is the one
 * that gets renamed and the reader keeps seeing the code as it was written. A plain `js` block
 * is a code sample that is never concatenated into the module and is left alone entirely.
 */
const MODULE_CODE_META = ['script', 'client', 'story', 'preview-story'];
const DISPLAYED_CODE_META = ['preview-story'];
/** Origin of a block the page declares itself, as opposed to one copied out of a file. */
const PAGE_ORIGIN = '<page>';

/**
 * @param {object} node
 * @returns {boolean}
 */
function isModuleJsCodeBlock(node) {
  return (
    node.type === 'code' &&
    node.lang === 'js' &&
    typeof node.meta === 'string' &&
    MODULE_CODE_META.includes(node.meta)
  );
}

/**
 * @param {object} node
 * @returns {boolean} whether the reader sees this block's code
 */
function isDisplayedJsCodeBlock(node) {
  return typeof node.meta === 'string' && DISPLAYED_CODE_META.includes(node.meta);
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
 * A statement runs from its `import` line to the line that closes it - the first `;` at the
 * end of a line, or, for a single-line side effect import, the line that ends with its
 * specifier. There is no line budget: a named import spread over many lines is still one
 * statement. Returns null for the block when a statement never closes, because rewriting
 * lines we did not delimit correctly would delete code instead of a duplicate.
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
      while (end < lines.length) {
        const line = lines[end].trimEnd();
        if (/;\s*$/.test(line) || (end === start && /['"]\s*;?$/.test(line))) {
          terminated = true;
          break;
        }
        end += 1;
      }
      if (!terminated) {
        return null;
      }
      ranges.push([start, end]);
      index = end + 1;
    }
  }
  return ranges;
}

/**
 * Two statements that declare the same local name break a page module even when they name
 * different specifiers: `import { html } from '@mdjs/mdjs-preview';` followed by
 * `import { html } from 'lit';` is the same `SyntaxError: Identifier 'html' has already
 * been declared`. Dropping one of them would silently change what the page renders, so the
 * colliding declaration is renamed locally instead - `import { html as html1 } from 'lit';`
 * - and the occurrences of `html` in that block are rewritten to `html1`.
 *
 * Which one yields: the page's own declaration keeps the plain name. An imported block is a
 * fragment, so it may be renamed freely - the page it was written on still has it under its
 * own name, and code elsewhere on the constructed page that leans on the page's own import
 * keeps resolving. Between two imported blocks the later one yields.
 */
const IMPORT_FROM_STATEMENT = /^import\s+([\s\S]*?)\s+from\s*(['"])([^'"]+)\2\s*;?$/;
const IMPORT_SIDE_EFFECT_STATEMENT = /^import\s*(['"])([^'"]+)\1\s*;?$/;
const IDENTIFIER_START = /[A-Za-z_$]/;
const IDENTIFIER_PART = /[A-Za-z0-9_$]/;
const REGEX_PRECEDING_CHARS = '([{,;:=!&|?+-*%~^<>';

/**
 * @typedef {Object} ParsedImportStatement
 * @property {string[]} bindings all local names the statement declares
 * @property {Array<{ imported: string, local: string, raw: string }>} named the `{ }` specifiers
 * @property {string} defaultBinding
 * @property {string} namespaceBinding
 * @property {string} quote
 * @property {string} specifier
 */

/**
 * @param {string} statement
 * @returns {ParsedImportStatement | null} null for a shape we do not reason about
 */
function parseImportStatement(statement) {
  if (IMPORT_SIDE_EFFECT_STATEMENT.test(statement)) {
    return {
      bindings: [],
      named: [],
      defaultBinding: '',
      namespaceBinding: '',
      quote: '',
      specifier: '',
    };
  }
  const from = statement.match(IMPORT_FROM_STATEMENT);
  if (!from) {
    return null;
  }
  const [, head, quote, specifier] = from;
  const braceStart = head.indexOf('{');
  const braceEnd = head.lastIndexOf('}');
  const hasBraces = braceStart !== -1 && braceEnd !== -1;
  const beforeBrace = (hasBraces ? head.slice(0, braceStart) : head).replace(/,\s*$/, '').trim();
  const named = hasBraces
    ? head
        .slice(braceStart + 1, braceEnd)
        .split(',')
        .map(part => part.trim())
        .filter(Boolean)
        .map(part => {
          const [imported, local] = part.split(/\s+as\s+/);
          return { imported: imported.trim(), local: (local || imported).trim(), raw: part };
        })
    : [];
  let defaultBinding = '';
  let namespaceBinding = '';
  if (beforeBrace.startsWith('*')) {
    namespaceBinding = beforeBrace.replace(/^\*\s*as\s*/, '').trim();
  } else {
    defaultBinding = beforeBrace;
  }
  return {
    bindings: [defaultBinding, namespaceBinding, ...named.map(spec => spec.local)].filter(Boolean),
    named,
    defaultBinding,
    namespaceBinding,
    quote,
    specifier,
  };
}

/**
 * Rewrites the local names of an import statement and keeps the imported names as they are.
 * @param {ParsedImportStatement} parsed
 * @param {Array<{ from: string, to: string }>} renames
 * @returns {string}
 */
function rewriteImportStatementBindings(parsed, renames) {
  const renamed = new Map(renames.map(({ from, to }) => [from, to]));
  const localName = name => renamed.get(name) || name;
  const parts = [];
  if (parsed.defaultBinding) {
    parts.push(localName(parsed.defaultBinding));
  }
  if (parsed.namespaceBinding) {
    parts.push(`* as ${localName(parsed.namespaceBinding)}`);
  }
  if (parsed.named.length > 0) {
    const specs = parsed.named.map(spec => {
      const local = localName(spec.local);
      return local === spec.imported ? spec.imported : `${spec.imported} as ${local}`;
    });
    parts.push(`{ ${specs.join(', ')} }`);
  }
  return `import ${parts.join(', ')} from ${parsed.quote}${parsed.specifier}${parsed.quote};`;
}

/**
 * @param {string} name
 * @param {Set<string>} usedNames
 * @returns {string} the first `name1`, `name2`, ... the page does not use yet
 */
function nextFreeName(name, usedNames) {
  let counter = 1;
  while (usedNames.has(`${name}${counter}`)) {
    counter += 1;
  }
  return `${name}${counter}`;
}

/**
 * Replaces whole identifiers in js source and leaves strings, template literals, comments,
 * regular expressions and the `skipRanges` alone: a block that renders the word `html`
 * inside a template literal has to keep that text, only the code around it may be renamed.
 * @param {string} code
 * @param {Map<string, string>} renames
 * @param {Array<[number, number]>} skipRanges
 * @returns {string}
 */
function rewriteIdentifiers(code, renames, skipRanges) {
  let out = '';
  let index = 0;
  let mode = 'code';
  let lastSignificant = '';
  let inRegexClass = false;
  const templateExpressions = [];
  const skipRangeAt = offset => skipRanges.find(([start, end]) => offset >= start && offset <= end);

  while (index < code.length) {
    const skipped = skipRangeAt(index);
    const char = code[index];
    const next = code[index + 1];

    if (skipped) {
      out += code.slice(index, skipped[1] + 1);
      index = skipped[1] + 1;
    } else if (mode === 'code') {
      if (char === '/' && next === '/') {
        mode = 'lineComment';
        out += '//';
        index += 2;
      } else if (char === '/' && next === '*') {
        mode = 'blockComment';
        out += '/*';
        index += 2;
      } else if (
        char === '/' &&
        (lastSignificant === '' || REGEX_PRECEDING_CHARS.includes(lastSignificant))
      ) {
        mode = 'regex';
        inRegexClass = false;
        out += char;
        index += 1;
      } else if (char === "'" || char === '"') {
        mode = char === "'" ? 'single' : 'double';
        out += char;
        index += 1;
      } else if (char === '`') {
        mode = 'template';
        out += char;
        index += 1;
      } else if (IDENTIFIER_START.test(char)) {
        let end = index + 1;
        while (end < code.length && IDENTIFIER_PART.test(code[end])) {
          end += 1;
        }
        const identifier = code.slice(index, end);
        out += renames.get(identifier) || identifier;
        lastSignificant = 'a';
        index = end;
      } else {
        if (char === '{' && templateExpressions.length > 0) {
          templateExpressions[templateExpressions.length - 1] += 1;
        }
        if (char === '}' && templateExpressions.length > 0) {
          if (templateExpressions[templateExpressions.length - 1] === 0) {
            templateExpressions.pop();
            mode = 'template';
          } else {
            templateExpressions[templateExpressions.length - 1] -= 1;
          }
        }
        if (!/\s/.test(char)) {
          lastSignificant = char;
        }
        out += char;
        index += 1;
      }
    } else if (mode === 'single' || mode === 'double') {
      if (char === '\\') {
        out += code.slice(index, index + 2);
        index += 2;
      } else {
        if (char === (mode === 'single' ? "'" : '"') || char === '\n') {
          mode = 'code';
        }
        out += char;
        index += 1;
      }
    } else if (mode === 'template') {
      if (char === '\\') {
        out += code.slice(index, index + 2);
        index += 2;
      } else if (char === '`') {
        mode = 'code';
        out += char;
        index += 1;
      } else if (char === '$' && next === '{') {
        templateExpressions.push(0);
        mode = 'code';
        out += '${';
        index += 2;
      } else {
        out += char;
        index += 1;
      }
    } else if (mode === 'lineComment') {
      if (char === '\n') {
        mode = 'code';
      }
      out += char;
      index += 1;
    } else if (mode === 'blockComment') {
      if (char === '*' && next === '/') {
        mode = 'code';
        out += '*/';
        index += 2;
      } else {
        out += char;
        index += 1;
      }
    } else if (char === '\\') {
      out += code.slice(index, index + 2);
      index += 2;
    } else if (char === '[') {
      inRegexClass = true;
      out += char;
      index += 1;
    } else if (char === ']') {
      inRegexClass = false;
      out += char;
      index += 1;
    } else {
      if (char === '/' && !inRegexClass) {
        mode = 'code';
      }
      out += char;
      index += 1;
    }
  }
  return out;
}

/**
 * @param {string[]} lines
 * @param {number} lineIndex
 * @returns {number} character offset of the start of that line
 */
function lineOffset(lines, lineIndex) {
  let offset = 0;
  for (let line = 0; line < lineIndex; line += 1) {
    offset += lines[line].length + 1;
  }
  return offset;
}

/**
 * Gives every import statement of a page module one declaration per local name: an exact
 * duplicate statement is dropped, and a name a second statement also declares is renamed on
 * the declaration that yields (and in the code of that block). A block that loses all of its
 * content is removed.
 * @param {object} tree
 */
function dedupePageLevelImportStatements(tree) {
  const seenBlockValues = new Set();
  const blocks = [];

  visit(tree, node => {
    if (!isModuleJsCodeBlock(node) || !node.value) {
      return;
    }
    const displayed = isDisplayedJsCodeBlock(node);
    const normalizedBlockValue = normalizeCode(node.value);
    // Dropping a block is only safe when nobody sees it: a reader may well want the same
    // preview twice.
    if (!displayed && seenBlockValues.has(normalizedBlockValue)) {
      // eslint-disable-next-line no-param-reassign
      node.__remarkExtendRemove = true;
      return;
    }
    seenBlockValues.add(normalizedBlockValue);

    const lines = node.value.split('\n');
    const ranges = importStatementLineRanges(lines);
    const statements = (ranges || []).map(([start, end]) => {
      const text = normalizeCode(lines.slice(start, end + 1).join('\n'));
      return { start, end, text, parsed: parseImportStatement(text), drop: false, renames: [] };
    });
    blocks.push({
      node,
      lines,
      statements,
      displayed,
      origin: node.__remarkExtendImportedFrom || PAGE_ORIGIN,
      imported: typeof node.__remarkExtendImportedFrom === 'string',
      order: blocks.length,
      declaredNames: new Set(
        statements.flatMap(statement => (statement.parsed ? statement.parsed.bindings : [])),
      ),
    });
  });

  const seenStatements = new Set();
  const declarations = new Map();
  const usedNames = new Set();
  // A rename is applied to the whole file the renamed block came from - every block of that
  // file keeps naming the import it declared, so its usages move with it. That is what the
  // page it was written on still does.
  const renamesByOrigin = new Map();
  const registerRename = (block, from, to) => {
    if (!renamesByOrigin.has(block.origin)) {
      renamesByOrigin.set(block.origin, new Map());
    }
    renamesByOrigin.get(block.origin).set(from, to);
  };

  /**
   * A block yields its name to the one it collides with: an invisible block before a displayed
   * one (the reader keeps the code as written), an imported block before the page's own (an
   * imported block is a fragment, its own page still has the name), and the later one before
   * the earlier one.
   * @param {{ displayed: boolean, imported: boolean, order: number }} a
   * @param {{ displayed: boolean, imported: boolean, order: number }} b
   * @returns {boolean}
   */
  const yieldsFirst = (a, b) => {
    const rank = block => (block.displayed ? 2 : 0) + (block.imported ? 0 : 1);
    return rank(a) < rank(b);
  };

  for (const block of blocks) {
    for (const statement of block.statements) {
      if (!block.displayed && seenStatements.has(statement.text)) {
        statement.drop = true;
      } else {
        seenStatements.add(statement.text);
        const { parsed } = statement;
        if (parsed) {
          parsed.bindings.forEach(name => usedNames.add(name));
          for (const name of parsed.bindings) {
            const previous = declarations.get(name);
            if (!previous) {
              declarations.set(name, { block, statement });
            } else if (yieldsFirst(previous.block, block)) {
              const renamedTo = nextFreeName(name, usedNames);
              usedNames.add(renamedTo);
              previous.statement.renames.push({ from: name, to: renamedTo });
              registerRename(previous.block, name, renamedTo);
              declarations.set(renamedTo, previous);
              declarations.set(name, { block, statement });
            } else {
              const renamedTo = nextFreeName(name, usedNames);
              usedNames.add(renamedTo);
              statement.renames.push({ from: name, to: renamedTo });
              registerRename(block, name, renamedTo);
              declarations.set(renamedTo, { block, statement });
            }
          }
        }
      }
    }
  }

  for (const block of blocks) {
    const renames = new Map();
    const originRenames = renamesByOrigin.get(block.origin);
    if (originRenames) {
      for (const [from, to] of originRenames) {
        // Only the invisible blocks of that file move with the rename: a block that declares
        // the name itself keeps its own usages on its own declaration, and a displayed block
        // keeps the code the reader sees coherent on its own.
        if (!block.displayed && !block.declaredNames.has(from)) {
          renames.set(from, to);
        }
      }
    }
    for (const statement of block.statements) {
      for (const { from, to } of statement.renames) {
        renames.set(from, to);
      }
    }

    let rewrittenLines = block.lines;
    if (renames.size > 0) {
      const skipRanges = block.statements.map(statement => [
        lineOffset(block.lines, statement.start),
        lineOffset(block.lines, statement.end) + block.lines[statement.end].length,
      ]);
      rewrittenLines = rewriteIdentifiers(block.lines.join('\n'), renames, skipRanges).split('\n');
    }

    const outputLines = [];
    let cursor = 0;
    for (const statement of block.statements) {
      for (let line = cursor; line < statement.start; line += 1) {
        outputLines.push(rewrittenLines[line]);
      }
      if (!statement.drop) {
        if (statement.renames.length > 0) {
          outputLines.push(rewriteImportStatementBindings(statement.parsed, statement.renames));
        } else {
          for (let line = statement.start; line <= statement.end; line += 1) {
            outputLines.push(rewrittenLines[line]);
          }
        }
      }
      cursor = statement.end + 1;
    }
    for (let line = cursor; line < rewrittenLines.length; line += 1) {
      outputLines.push(rewrittenLines[line]);
    }

    const newBlockValue = outputLines.join('\n');
    if (newBlockValue !== block.node.value) {
      // eslint-disable-next-line no-param-reassign
      block.node.value = newBlockValue;
      if (normalizeCode(newBlockValue) === '') {
        // eslint-disable-next-line no-param-reassign
        block.node.__remarkExtendRemove = true;
      }
    }
  }

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

        // Mark where the inserted blocks were written: a binding may be renamed freely at the
        // level of the file it came from, because that file keeps its own name - so a rename
        // has to be carried into the other blocks of the same file as well, and a block can be
        // told apart from one the page itself declares (see dedupePageLevelImportStatements).
        toInsertNodes.forEach(insertedNode => {
          insertedNode.__remarkExtendImportedFrom = filePath;
        });

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
