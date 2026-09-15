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

const LAYOUT_METHODS = new Set([
  'getBoundingClientRect',
  'getClientRects',
  'getComputedStyle',
]);

const noForcedLayoutReadsRule = {
  meta: {
    docs: {
      category: 'Performance',
      description: 'Disallow forced synchronous layouts and layout thrashing caused by reading geometry properties after style writes or inside loops',
      recommended: true,
      url: 'https://developer.chrome.com/docs/devtools/rendering/forced-synchronous-layouts',
    },
    messages: {
      inLoop: 'Layout thrashing: Reading geometry property/method "{{ name }}" inside a loop forces synchronous layout re-calculations on every iteration. Use ResizeObserver, IntersectionObserver, or read values prior to the loop.',
      postMutation: 'Forced synchronous layout: Reading geometry property/method "{{ name }}" after a style or DOM mutation forces browser style re-calculation. Batch reads before writes or use requestAnimationFrame / ResizeObserver.',
    },
    schema: [],
    type: 'problem',
  },

  create(context) {
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

    function hasPrecedingStyleMutation(node) {
      let scopeBlock = node.parent;
      while (scopeBlock && scopeBlock.type !== 'BlockStatement' && scopeBlock.type !== 'Program') {
        scopeBlock = scopeBlock.parent;
      }
      if (!scopeBlock || !scopeBlock.body) return false;

      const nodeIndex = scopeBlock.body.findIndex(stmt => stmt === node || (stmt.range && node.range && stmt.range[0] <= node.range[0] && stmt.range[1] >= node.range[1]));
      if (nodeIndex <= 0) return false;

      for (let i = 0; i < nodeIndex; i += 1) {
        const stmt = scopeBlock.body[i];
        let foundMutation = false;
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'AssignmentExpression') {
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
        } else if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'CallExpression') {
          const { callee } = stmt.expression;
          if (callee.type === 'MemberExpression' && callee.object.type === 'MemberExpression') {
            if (callee.object.property.name === 'classList' || callee.object.property.name === 'style') {
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
            if (node.parent && node.parent.type === 'CallExpression' && node.parent.callee === node) {
              return;
            }
            checkMemberAccess(node, propName);
          }
        }
      },
    };
  },
};

const preferCheckVisibilityRule = {
  meta: {
    docs: {
      category: 'Performance',
      description: 'Prefer element.checkVisibility() over offsetWidth/offsetHeight or getClientRects() for checking element visibility to avoid forced layout flushes',
      recommended: true,
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/checkVisibility',
    },
    messages: {
      preferCheckVisibility: 'Prefer element.checkVisibility() over geometry check "{{ name }}" when evaluating element visibility to avoid forced layout flushes.',
    },
    schema: [],
    type: 'suggestion',
  },

  create(context) {
    const TARGET_PROPERTIES = new Set(['offsetWidth', 'offsetHeight']);

    function isVisibilityCheckContext(node) {
      const { parent } = node;
      if (!parent) return false;

      if (parent.type === 'UnaryExpression' && parent.operator === '!') {
        return true;
      }
      if (parent.type === 'IfStatement' && parent.test === node) {
        return true;
      }
      if (parent.type === 'LogicalExpression' && (parent.operator === '&&' || parent.operator === '||')) {
        return true;
      }
      if (parent.type === 'BinaryExpression' && ['>', '>=', '!=', '!==', '==', '==='].includes(parent.operator)) {
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

const preferCssContainmentRule = {
  meta: {
    docs: {
      category: 'Performance',
      description: 'Enforce CSS containment (e.g. contain: layout/paint/content) on Web Component containers and overlay styles to isolate layout and rendering',
      recommended: true,
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/contain',
    },
    messages: {
      missingContainment: 'Overlay/Container style in class "{{ className }}" is missing CSS containment (e.g. contain: layout, contain: content, contain: paint). CSS containment isolates rendering and prevents page-wide layout thrashing.',
    },
    schema: [],
    type: 'suggestion',
  },

  create(context) {
    const COMPONENT_PATTERN = /(Overlay|Dropdown|Popover|Modal|Dialog|Drawer|Listbox|Select|Option|Collapsible|Accordion)/;

    return {
      ClassDeclaration(node) {
        if (!node.id || !COMPONENT_PATTERN.test(node.id.name)) {
          return;
        }

        const stylesMember = node.body.body.find(
          member =>
            member.type === 'MethodDefinition' &&
            member.static &&
            member.key.name === 'styles',
        );

        if (!stylesMember) return;

        let hasContain = false;
        let foundCssTag = false;

        function traverseNode(n) {
          if (!n) return;
          if (
            n.type === 'TaggedTemplateExpression' &&
            n.tag.type === 'Identifier' &&
            n.tag.name === 'css'
          ) {
            foundCssTag = true;
            const cssText = n.quasi.quasis.map(q => q.value.raw).join(' ');
            if (/\bcontain\s*:/.test(cssText)) {
              hasContain = true;
            }
          }
          for (const key of Object.keys(n)) {
            if (key !== 'parent') {
              const val = n[key];
              if (val && typeof val === 'object') {
                if (Array.isArray(val)) {
                  val.forEach(traverseNode);
                } else {
                  traverseNode(val);
                }
              }
            }
          }
        }

        traverseNode(stylesMember);

        if (foundCssTag && !hasContain) {
          context.report({
            data: { className: node.id.name },
            messageId: 'missingContainment',
            node: stylesMember,
          });
        }
      },
    };
  },
};

const rules = {
  'no-forced-layout-reads': noForcedLayoutReadsRule,
  'prefer-check-visibility': preferCheckVisibilityRule,
  'prefer-css-containment': preferCssContainmentRule,
};

module.exports = {
  rules,
};
