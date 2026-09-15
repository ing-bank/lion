/**
 * ESLint rule checking for CSS containment in Web Component / Lit styles.
 * Reference:
 * - Chrome Dev Tools: "CSS Containment" (https://developer.chrome.com/docs/css-ui/css-containment)
 */
export const preferCssContainmentRule = {
  meta: {
    docs: {
      category: 'Performance',
      description:
        'Enforce CSS containment (e.g. contain: layout/paint/content) on Web Component containers and overlay styles to isolate layout and rendering',
      recommended: true,
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/contain',
    },
    messages: {
      missingContainment:
        'Overlay/Container style in class "{{ className }}" is missing CSS containment (e.g. contain: layout, contain: content, contain: paint). CSS containment isolates rendering and prevents page-wide layout thrashing.',
    },
    schema: [],
    type: 'suggestion',
  },

  create(context) {
    const COMPONENT_PATTERN =
      /(Overlay|Dropdown|Popover|Modal|Dialog|Drawer|Listbox|Select|Option|Collapsible|Accordion)/;

    return {
      ClassDeclaration(node) {
        if (!node.id || !COMPONENT_PATTERN.test(node.id.name)) {
          return;
        }

        const stylesMember = node.body.body.find(
          member =>
            member.type === 'MethodDefinition' && member.static && member.key.name === 'styles',
        );

        if (!stylesMember) return;

        // Inspect template literals inside css`...`
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
