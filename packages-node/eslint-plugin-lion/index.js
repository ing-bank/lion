const path = require('path');
const nodeModule = require('module');
const { ResolverFactory } = require('oxc-resolver');

/**
 * Oxlint loads this file through the `jsPlugins` option:
 *   { "jsPlugins": ["eslint-plugin-lion"], "rules": { "lion/no-unresolved": "error" } }
 *
 * It exists because oxlint has no native replacement for the rules that need real module
 * resolution (eslint-plugin-import's `no-unresolved`). oxc-resolver is the resolver oxc already
 * ships, so the resolution semantics match what Node itself does for the specifiers used here.
 *
 * Known divergence from the eslint setup it replaces: `#`-prefixed specifiers that resolve only
 * through a package.json `imports` map are resolved against oxc-resolver/Node semantics, while the
 * eslint resolver chain also accepts targets that Node itself rejects. See the note in the PR.
 */
const resolver = new ResolverFactory({
  conditionNames: ['node', 'import', 'default', 'require'],
  extensions: ['.js', '.mjs', '.cjs', '.json'],
  mainFields: ['module', 'main'],
});

/**
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

module.exports = {
  rules: {
    'no-unresolved': {
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
    },
  },
};
