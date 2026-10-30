/**
 * Adapter that makes eslint plugins written for eslint 8/9 work under oxlint's JS plugin
 * bridge (`jsPlugins`).
 *
 * Two things oxlint 1.90 does not offer, which the plugins in this repo need:
 *
 * 1. `sourceCode.getJSDocComment(node)` throws ("not supported at present"), while
 *    eslint-plugin-wc's `isCustomElement()` calls it for every class it checks.
 * 2. `sourceCode.parserServices` is a frozen `{}`, while eslint-plugin-lit-a11y's
 *    `HasLitHtmlImportRuleExtension` *writes* the lit-html tag/namespace bookkeeping into it
 *    and reads it back from the template visitors of the same file.
 *
 * Both are behaviour of the objects handed to a rule, so they can be provided from JS:
 * the wrapped rule gets a context whose `sourceCode` inherits from oxlint's real one, with a
 * writable `parserServices` bag (one per file, so the lit-a11y write/read within a file still
 * works) and a `getJSDocComment` implementation with the same semantics as eslint's.
 *
 * That keeps the plugins usable without patching oxlint itself (see compat/README.md).
 */

/**
 * The JSDoc comment attached to a node, mirroring eslint's `sourceCode.getJSDocComment()`.
 *
 * @param {{ jsDoc?: unknown, leadingComments?: Array<{ value?: unknown }>, parent?: { leadingComments?: Array<{ value?: unknown }> } }} node
 * @returns {{ value: string } | null} the JSDoc comment, or `null` when the node has none
 */
function getJSDocComment(node) {
  if (!node) return null;
  if (node.jsDoc) return node.jsDoc;
  const comments = node.leadingComments || (node.parent && node.parent.leadingComments);
  if (!comments) return null;
  for (let i = comments.length - 1; i >= 0; i -= 1) {
    const comment = comments[i];
    // A block comment's `value` keeps its leading `*`, which is how eslint's own
    // getJSDocComment tells a JSDoc block comment from a plain block comment.
    if (comment && typeof comment.value === 'string' && comment.value.startsWith('*')) {
      return comment;
    }
  }
  return null;
}

/**
 * Wrap a rule so the context it receives carries the two shims above.
 *
 * @param {{ create: Function, meta?: object }} rule an eslint rule (plugin.rules entry)
 * @returns {object} the same rule, with an adapted `create()`
 */
function adaptRule(rule) {
  if (!rule || typeof rule.create !== 'function') return rule;
  return {
    ...rule,
    create(context) {
      const sourceCode = context.sourceCode || context.getSourceCode();
      // One bag per file: lit-a11y fills it in on ImportDeclaration and reads it from the
      // template visitors of that same file.
      const parserServices = {};
      const adaptedSourceCode = Object.create(sourceCode, {
        parserServices: { value: parserServices, writable: true, configurable: true },
        getJSDocComment: { value: getJSDocComment, writable: true, configurable: true },
      });
      const adaptedContext = Object.create(context, {
        sourceCode: { value: adaptedSourceCode, writable: true, configurable: true },
        parserServices: { value: parserServices, writable: true, configurable: true },
        getSourceCode: { value: () => adaptedSourceCode, writable: true, configurable: true },
      });
      return rule.create(adaptedContext);
    },
  };
}

/**
 * Adapt a whole eslint plugin: every rule is wrapped, the ids stay `<plugin>/<rule>`.
 *
 * @param {{ rules: Record<string, object> }} plugin
 * @returns {{ rules: Record<string, object> }}
 */
function adaptPlugin(plugin) {
  const rules = {};
  for (const [name, rule] of Object.entries(plugin.rules)) {
    rules[name] = adaptRule(rule);
  }
  return { rules };
}

module.exports = { adaptPlugin, adaptRule, getJSDocComment };
