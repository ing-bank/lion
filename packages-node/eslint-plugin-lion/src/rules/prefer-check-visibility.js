/**
 * ESLint rule suggesting `element.checkVisibility()` instead of forced layout reads (`offsetWidth`, `offsetHeight`, `getClientRects()`)
 * when checking element visibility.
 * Reference:
 * - Chrome Dev Tools & Web.dev: element.checkVisibility() API (https://developer.chrome.com/blog/checkvisibility)
 */
export const preferCheckVisibilityRule = {
  meta: {
    docs: {
      category: 'Performance',
      description:
        'Prefer element.checkVisibility() over offsetWidth/offsetHeight or getClientRects() for checking element visibility to avoid forced layout flushes',
      recommended: true,
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/checkVisibility',
    },
    messages: {
      preferCheckVisibility:
        'Prefer element.checkVisibility() over geometry check "{{ name }}" when evaluating element visibility to avoid forced layout flushes.',
    },
    schema: [],
    type: 'suggestion',
  },

  create(context) {
    const TARGET_PROPERTIES = new Set(['offsetWidth', 'offsetHeight']);

    /**
     * Checks if a node is in a boolean context (e.g. `if (el.offsetWidth)`, `!!el.offsetWidth`, `el.offsetWidth > 0`)
     * @param {import('estree').Node} node
     */
    function isVisibilityCheckContext(node) {
      const { parent } = node;
      if (!parent) return false;

      if (parent.type === 'UnaryExpression' && parent.operator === '!') {
        return true;
      }
      if (parent.type === 'IfStatement' && parent.test === node) {
        return true;
      }
      if (
        parent.type === 'LogicalExpression' &&
        (parent.operator === '&&' || parent.operator === '||')
      ) {
        return true;
      }
      if (
        parent.type === 'BinaryExpression' &&
        ['>', '>=', '!=', '!==', '==', '==='].includes(parent.operator)
      ) {
        return true;
      }
      return false;
    }

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'getClientRects' &&
          isVisibilityCheckContext(node)
        ) {
          context.report({
            data: { name: 'getClientRects()' },
            messageId: 'preferCheckVisibility',
            node,
          });
        }
      },
      MemberExpression(node) {
        if (
          node.property.type === 'Identifier' &&
          TARGET_PROPERTIES.has(node.property.name) &&
          isVisibilityCheckContext(node)
        ) {
          context.report({
            data: { name: node.property.name },
            messageId: 'preferCheckVisibility',
            node,
          });
        }
      },
    };
  },
};
