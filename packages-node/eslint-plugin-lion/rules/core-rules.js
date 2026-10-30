/**
 * Ports of the ESLint core rules the repo relies on that oxlint has no native
 * equivalent for. Each rule keeps ESLint's name so the mapping stays greppable
 * (`camelcase` -> `lion/camelcase`), and mirrors ESLint's messages so a diff
 * between the two engines is readable.
 *
 * These run through oxlint's `jsPlugins` bridge; they are deliberately small and
 * dependency free.
 */

const RULES = {
  /**
   * ESLint's `no-new-symbol`: `new Symbol()` throws at runtime.
   */
  'no-new-symbol': {
    meta: {
      type: 'problem',
      schema: [],
      messages: { unexpected: '`Symbol` cannot be called as a constructor.' },
    },
    create(context) {
      return {
        NewExpression(node) {
          if (node.callee.type === 'Identifier' && node.callee.name === 'Symbol') {
            context.report({ node: node.callee, messageId: 'unexpected' });
          }
        },
      };
    },
  },

  /**
   * ESLint's `no-new-object`: `new Object()` where an object literal will do.
   */
  'no-new-object': {
    meta: {
      type: 'suggestion',
      schema: [],
      messages: { unexpected: 'The object literal notation {} is preferable.' },
    },
    create(context) {
      return {
        NewExpression(node) {
          if (node.callee.type === 'Identifier' && node.callee.name === 'Object') {
            context.report({ node: node.callee, messageId: 'unexpected' });
          }
        },
      };
    },
  },

  /**
   * ESLint's `no-undef-init`: `let x = undefined;` is redundant.
   */
  'no-undef-init': {
    meta: {
      type: 'suggestion',
      schema: [],
      messages: {
        unnecessaryUndefined: "It's not necessary to initialize '{{name}}' to undefined.",
      },
    },
    create(context) {
      return {
        VariableDeclarator(node) {
          // eslint exempts `const`; the declarator kind is on the parent declaration.
          const isConst = node.parent && node.parent.kind === 'const';
          if (
            !isConst &&
            node.init &&
            node.init.type === 'Identifier' &&
            node.init.name === 'undefined' &&
            node.id.type === 'Identifier'
          ) {
            context.report({
              node: node.init,
              messageId: 'unnecessaryUndefined',
              data: { name: node.id.name },
            });
          }
        },
      };
    },
  },

  /**
   * ESLint's `no-buffer-constructor`: `new Buffer()` / `Buffer()` are deprecated.
   * Covers the two spellings ESLint covers: the global and `require('buffer').Buffer`.
   */
  'no-buffer-constructor': {
    meta: {
      type: 'problem',
      schema: [],
      messages: {
        useBufferFrom:
          'Use of the {{name}} constructor is disallowed. Use Buffer.from(), Buffer.alloc(), or Buffer.allocUnsafe() instead.',
      },
    },
    create(context) {
      function isBufferIdentifier(node) {
        if (node.type === 'Identifier') return node.name === 'Buffer';
        if (node.type === 'MemberExpression' && !node.computed) {
          return node.property.type === 'Identifier' && node.property.name === 'Buffer';
        }
        return false;
      }
      function check(node, name) {
        if (isBufferIdentifier(node.callee))
          context.report({ node: node.callee, messageId: 'useBufferFrom', data: { name } });
      }
      return {
        NewExpression(node) {
          check(node, 'new Buffer()');
        },
        CallExpression(node) {
          check(node, 'Buffer()');
        },
      };
    },
  },

  /**
   * ESLint's `strict` with `["error", "never"]` (the repo's setting): no
   * 'use strict' directives, neither global nor in function scope.
   */
  strict: {
    meta: {
      type: 'suggestion',
      // ESLint accepts 'safe' | 'global' | 'function' | 'never'; the repo uses 'never',
      // which is also what this port implements (the other modes would narrow the scope).
      schema: [{ enum: ['safe', 'global', 'function', 'never'] }],
      messages: { never: 'Use of strict mode directives, no matter which value, is disallowed.' },
    },
    create(context) {
      const mode = (context.options && context.options[0]) || 'never';
      if (mode !== 'never') return {};
      return {
        ExpressionStatement(node) {
          const { expression } = node;
          if (
            expression.type === 'Literal' &&
            typeof expression.value === 'string' &&
            (expression.value === 'use strict' || expression.value === 'use asm')
          ) {
            context.report({ node, messageId: 'never' });
          }
        },
      };
    },
  },

  /**
   * ESLint's `lines-around-directive` with `["error", "always"]`: a directive
   * prologue must be surrounded by blank lines.
   */
  'lines-around-directive': {
    meta: {
      type: 'layout',
      // ESLint: 'always' | 'never', or an object with { before, after }.
      schema: [
        {
          anyOf: [
            { enum: ['always', 'never'] },
            {
              type: 'object',
              properties: {
                before: { enum: ['always', 'never'] },
                after: { enum: ['always', 'never'] },
              },
              additionalProperties: false,
            },
          ],
        },
      ],
      messages: {
        before: 'Expected 1 empty line before directive.',
        after: 'Expected 1 empty line after directive.',
      },
    },
    create(context) {
      const option = (context.options && context.options[0]) || 'always';
      const before = typeof option === 'string' ? option : option.before || 'always';
      const after = typeof option === 'string' ? option : option.after || 'always';
      const sourceCode = context.sourceCode || (context.getSourceCode && context.getSourceCode());
      return {
        Program(node) {
          const directives = node.body.filter(
            statement =>
              statement.type === 'ExpressionStatement' &&
              statement.expression.type === 'Literal' &&
              typeof statement.expression.value === 'string',
          );
          if (directives.length === 0) return;
          const first = directives[0];
          const last = directives[directives.length - 1];
          const lineOf = offset => sourceCode.getLocFromIndex(offset).line;
          if (
            before === 'always' &&
            lineOf(first.range[0]) !== 1 &&
            lineOf(sourceCode.text.lastIndexOf('\n', first.range[0] - 1)) ===
              lineOf(first.range[0]) - 1
          ) {
            context.report({ node: first, messageId: 'before' });
          }
          const afterLast = node.body[directives.length];
          if (
            after === 'always' &&
            afterLast &&
            lineOf(afterLast.range[0]) - lineOf(last.range[1]) < 2
          ) {
            context.report({ node: afterLast, messageId: 'after' });
          }
        },
      };
    },
  },

  /**
   * ESLint's `spaced-comment`: `//comment` -> `// comment`. Only the two checks the repo's
   * option object enables are implemented (`line.markers`, `block.markers`, `balanced` are
   * not, so a marker comment without a space is not reported).
   */
  'spaced-comment': {
    meta: {
      type: 'layout',
      schema: [
        { enum: ['always', 'never'] },
        {
          type: 'object',
          properties: {
            line: { type: 'object' },
            block: { type: 'object' },
            markers: { type: 'array' },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        expectedSpaceAfter: "Expected space or tab after '{{marker}}' in comment.",
        unexpectedSpaceAfter: "Unexpected space or tab after '{{marker}}' in comment.",
      },
    },
    create(context) {
      const mode = (context.options && context.options[0]) || 'always';
      const sourceCode = context.sourceCode || (context.getSourceCode && context.getSourceCode());
      const check = comment => {
        if (comment.type !== 'Line' && comment.type !== 'Block') return;
        const marker = comment.type === 'Line' ? '//' : '/*';
        const rest = comment.value;
        if (rest === '') return;
        const hasSpace = /^\s|^\*+\s|^\*+$/u.test(rest) || rest.startsWith('*');
        if (mode === 'always' && !hasSpace) {
          context.report({
            node: null,
            loc: comment.loc,
            messageId: 'expectedSpaceAfter',
            data: { marker },
          });
        }
      };
      return {
        Program() {
          for (const comment of sourceCode.getAllComments()) check(comment);
        },
      };
    },
  },

  /**
   * ESLint's `lines-between-class-members` with `["always", { exceptAfterSingleLine: false }]`:
   * class members must be separated by a blank line.
   */
  'lines-between-class-members': {
    meta: {
      type: 'layout',
      schema: [
        { enum: ['always', 'never'] },
        {
          type: 'object',
          properties: { exceptAfterSingleLine: { type: 'boolean' } },
          additionalProperties: false,
        },
      ],
      messages: { expected: 'Expected blank line between class members.' },
    },
    create(context) {
      const mode = (context.options && context.options[0]) || 'always';
      if (mode !== 'always') return {};
      const sourceCode = context.sourceCode || (context.getSourceCode && context.getSourceCode());
      return {
        ClassBody(node) {
          for (let i = 1; i < node.body.length; i += 1) {
            const previous = node.body[i - 1];
            const current = node.body[i];
            const lineOf = offset => sourceCode.getLocFromIndex(offset).line;
            if (lineOf(current.range[0]) - lineOf(previous.range[1]) < 2) {
              context.report({ node: current, messageId: 'expected' });
            }
          }
        },
      };
    },
  },

  /**
   * ESLint's `no-restricted-syntax`, hardcoded to the repo's three selectors
   * (`ForInStatement`, `LabeledStatement`, `WithStatement`) with ESLint's
   * messages, so the config keeps the same intent without a selector engine.
   */
  'no-restricted-syntax': {
    meta: {
      type: 'suggestion',
      // ESLint takes a variadic list of { selector, message } objects. Only the three
      // selectors this port implements are honoured.
      // Same shape as ESLint's own meta: a single array schema, so the options are variadic.
      schema: {
        type: 'array',
        items: {
          oneOf: [
            { type: 'string' },
            {
              type: 'object',
              properties: { selector: { type: 'string' }, message: { type: 'string' } },
              additionalProperties: false,
            },
          ],
        },
      },
      messages: {
        restricted: '{{message}}',
        unsupported:
          'Unsupported selector {{selector}}: the oxlint port of `no-restricted-syntax` implements ForInStatement, LabeledStatement and WithStatement only.',
      },
    },
    create(context) {
      const configured = Array.isArray(context.options) ? context.options : [];
      const messagesByType = {
        ForInStatement:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        LabeledStatement:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        WithStatement:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      };
      const messageFor = type => {
        const entry = configured.find(option => option && option.selector === type);
        return (entry && entry.message) || messagesByType[type];
      };
      const visitors = {};
      for (const type of Object.keys(messagesByType)) {
        visitors[type] = node =>
          context.report({ node, messageId: 'restricted', data: { message: messageFor(type) } });
      }
      return visitors;
    },
  },
};

module.exports = { RULES };
