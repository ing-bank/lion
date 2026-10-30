const path = require('path');
const nodeModule = require('module');
const { ResolverFactory } = require('oxc-resolver');
const { camelcase } = require('./rules/camelcase.js');
const { RULES: coreRules } = require('./rules/core-rules.js');

/**
 * Oxlint loads this file through the `jsPlugins` option:
 *   { "jsPlugins": ["eslint-plugin-lion"], "rules": { "lion/no-unresolved": "error" } }
 *
 * It holds the rules the repo needs that oxlint has no native equivalent for:
 *
 * - `no-unresolved` (eslint-plugin-import's rule, backed by oxc-resolver - the resolver oxc
 *   already ships, so the resolution semantics match what Node does for the specifiers here)
 * - ports of the eslint core rules from `rules/core-rules.js` and `rules/camelcase.js`, kept
 *   under their eslint names so the mapping stays greppable (`camelcase` -> `lion/camelcase`).
 *
 * Loading these through oxlint's JS bridge costs roughly 10x a native rule, but they are
 * AST-only and only run on files they match; the whole-repo run stays far below the eslint
 * baseline it replaces.
 */
const resolver = new ResolverFactory({
  conditionNames: ['node', 'import', 'default', 'require'],
  extensions: ['.js', '.mjs', '.cjs', '.json'],
  mainFields: ['module', 'main'],
});

/**
 * @param {string} dir
 * @param {string} specifier
 * @returns {boolean} whether Node can resolve the specifier from `dir`
 */
function canResolve(dir, specifier) {
  try {
    const result = resolver.sync(dir, specifier);
    return Boolean(result && result.path);
  } catch (err) {
    // A malformed specifier is a parse-level problem, not an unresolved import.
    return true;
  }
}

const noUnresolved = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow imports of modules that cannot be resolved',
    },
    schema: [],
    messages: {
      unresolved: "Unable to resolve path to module '{{specifier}}'.",
    },
  },
  create(context) {
    const filename = context.getFilename ? context.getFilename() : context.filename;
    const dir = path.dirname(filename);

    function check(node, specifier) {
      if (nodeModule.isBuiltin(specifier)) return;
      if (canResolve(dir, specifier)) return;
      context.report({ node, messageId: 'unresolved', data: { specifier } });
    }

    return {
      ImportDeclaration(node) {
        check(node, node.source.value);
      },
      ExportNamedDeclaration(node) {
        if (node.source) check(node, node.source.value);
      },
      ExportAllDeclaration(node) {
        check(node, node.source.value);
      },
    };
  },
};

module.exports = {
  rules: {
    'no-unresolved': noUnresolved,
    camelcase,
    ...coreRules,
  },
};
