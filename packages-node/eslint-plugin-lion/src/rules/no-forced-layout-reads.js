const LAYOUT_PROPERTIES = new Set([
  'offsetWidth',
  'offsetHeight',
  'clientWidth',
  'clientHeight',
  'scrollWidth',
  'scrollHeight',
  'offsetTop',
  'offsetLeft',
  'scrollTop',
  'scrollLeft',
]);

const LAYOUT_METHODS = new Set(['getBoundingClientRect', 'getClientRects', 'getComputedStyle']);

/**
 * ESLint rule checking for forced synchronous layouts and layout thrashing.
 * References:
 * - Jake Archibald: "What forces layout / reflow" (https://gist.github.com/paulirish/5d52fb081b31370fa851)
 * - Chrome Dev Tools: "Avoid Large, Complex Layouts and Layout Thrashing" (https://developer.chrome.com/docs/devtools/rendering/forced-synchronous-layouts)
 */
export const noForcedLayoutReadsRule = {
  meta: {
    docs: {
      category: 'Performance',
      description:
        'Disallow forced synchronous layouts and layout thrashing caused by reading geometry properties after style writes or inside loops',
      recommended: true,
      url: 'https://developer.chrome.com/docs/devtools/rendering/forced-synchronous-layouts',
    },
    messages: {
      inLoop:
        'Layout thrashing: Reading geometry property/method "{{ name }}" inside a loop forces synchronous layout re-calculations on every iteration. Use ResizeObserver, IntersectionObserver, or read values prior to the loop.',
      postMutation:
        'Forced synchronous layout: Reading geometry property/method "{{ name }}" after a style or DOM mutation forces browser style re-calculation. Batch reads before writes or use requestAnimationFrame / ResizeObserver.',
    },
    schema: [],
    type: 'problem',
  },

  create(context) {
    /**
     * @param {import('estree').Node} node
     * @returns {boolean}
     */
    function isInsideLoop(node) {
      let curr = node.parent;
      while (curr) {
        if (
          curr.type === 'ForStatement' ||
          curr.type === 'ForInStatement' ||
          curr.type === 'ForOfStatement' ||
          curr.type === 'WhileStatement' ||
          curr.type === 'DoWhileStatement'
        ) {
          return true;
        }
        if (
          curr.type === 'CallExpression' &&
          curr.callee.type === 'MemberExpression' &&
          ['forEach', 'map', 'filter', 'reduce'].includes(curr.callee.property.name)
        ) {
          return true;
        }
        curr = curr.parent;
      }
      return false;
    }

    /**
     * Checks if there was a style mutation (e.g., `el.style.width = ...` or `el.classList.add(...)`)
     * prior to this read within the same function scope.
     * @param {import('estree').Node} node
     */
    function hasPrecedingStyleMutation(node) {
      let scopeBlock = node.parent;
      while (scopeBlock && scopeBlock.type !== 'BlockStatement' && scopeBlock.type !== 'Program') {
        scopeBlock = scopeBlock.parent;
      }
      if (!scopeBlock || !scopeBlock.body) return false;

      const nodeIndex = scopeBlock.body.findIndex(
        stmt =>
          stmt === node ||
          (stmt.range &&
            node.range &&
            stmt.range[0] <= node.range[0] &&
            stmt.range[1] >= node.range[1]),
      );
      if (nodeIndex <= 0) return false;

      for (let i = 0; i < nodeIndex; i += 1) {
        const stmt = scopeBlock.body[i];
        let foundMutation = false;
        // Check for style or classList assignments/calls
        if (
          stmt.type === 'ExpressionStatement' &&
          stmt.expression.type === 'AssignmentExpression'
        ) {
          const { left } = stmt.expression;
          if (left.type === 'MemberExpression') {
            if (
              (left.object.type === 'MemberExpression' && left.object.property.name === 'style') ||
              left.property.name === 'className' ||
              left.property.name === 'classList'
            ) {
              foundMutation = true;
            }
          }
        } else if (
          stmt.type === 'ExpressionStatement' &&
          stmt.expression.type === 'CallExpression'
        ) {
          const { callee } = stmt.expression;
          if (callee.type === 'MemberExpression' && callee.object.type === 'MemberExpression') {
            if (
              callee.object.property.name === 'classList' ||
              callee.object.property.name === 'style'
            ) {
              foundMutation = true;
            }
          }
        }
        if (foundMutation) return true;
      }
      return false;
    }

    function checkMemberAccess(node, propertyName) {
      if (LAYOUT_PROPERTIES.has(propertyName) || LAYOUT_METHODS.has(propertyName)) {
        if (isInsideLoop(node)) {
          context.report({
            data: { name: propertyName },
            messageId: 'inLoop',
            node,
          });
        } else if (hasPrecedingStyleMutation(node)) {
          context.report({
            data: { name: propertyName },
            messageId: 'postMutation',
            node,
          });
        }
      }
    }

    return {
      CallExpression(node) {
        if (node.callee.type === 'MemberExpression') {
          const propName = node.callee.property.name;
          if (LAYOUT_METHODS.has(propName)) {
            checkMemberAccess(node, propName);
          }
        } else if (node.callee.type === 'Identifier' && node.callee.name === 'getComputedStyle') {
          checkMemberAccess(node, 'getComputedStyle');
        }
      },
      MemberExpression(node) {
        if (node.property.type === 'Identifier') {
          const propName = node.property.name;
          if (LAYOUT_PROPERTIES.has(propName)) {
            // Avoid double reporting if called as a method
            if (
              node.parent &&
              node.parent.type === 'CallExpression' &&
              node.parent.callee === node
            ) {
              return;
            }
            checkMemberAccess(node, propName);
          }
        }
      },
    };
  },
};
