/**
 * ESLint's `camelcase` with the repo's options (`properties: "always"`,
 * `ignoreDestructuring: false`, `ignoreImports: false`, `ignoreGlobals: false`).
 *
 * Behaviour pinned against eslint 8.57 on a fixture (see test-node/camelcase.test.js):
 *   flagged:  foo_bar, method_under, Static_Under, snake_key (object literal key),
 *             export specifier names, __proto_ish (underscores on one side only)
 *   allowed:  FooBar (PascalCase), API_CLIENT (UPPER_CASE), __proto__ (underscored
 *             on both sides), names wrapped in arrays/destructuring holes
 * Computed keys (`['computed_key']`) are not checked, matching eslint.
 */
function isUnderscored(name) {
  return /^_+$/u.test(name);
}

function isCamelCase(name, allow) {
  if (typeof name !== 'string') return true;
  if (allow.includes(name)) return true;
  if (isUnderscored(name)) return true;
  // Names underscored on both sides (__proto__, __defineGetter__) are exempt.
  if (name.startsWith('__') && name.endsWith('__')) return true;
  const stripped = name.replace(/^_+/u, '').replace(/_+$/u, '');
  if (stripped === '') return true;
  // Only inner underscores are a problem: camelCase and PascalCase both pass.
  if (!stripped.includes('_')) return true;
  // UPPER_CASE constants are allowed (eslint's isUpperCase branch).
  if (name === name.toUpperCase()) return true;
  return false;
}

function isAssignmentTarget(node) {
  const { parent } = node;
  if (!parent) return false;
  switch (parent.type) {
    case 'AssignmentExpression':
    case 'AssignmentPattern':
      return parent.left === node;
    case 'Property':
      return parent.parent && parent.parent.type === 'ObjectPattern' && parent.value === node;
    case 'ArrayPattern':
    case 'RestElement':
      return true;
    default:
      return false;
  }
}

const camelcase = {
  meta: {
    type: 'suggestion',
    schema: [
      {
        type: 'object',
        properties: {
          allow: { type: 'array', items: { type: 'string' } },
          properties: { enum: ['always', 'never'] },
          ignoreDestructuring: { type: 'boolean' },
          ignoreImports: { type: 'boolean' },
          ignoreGlobals: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: { notCamelCase: "Identifier '{{name}}' is not in camel case." },
  },
  create(context) {
    const options = (context.options && context.options[0]) || {};
    const allow = options.allow || [];
    const checkProperties = options.properties !== 'never';
    const report = node => {
      if (node && node.type === 'Identifier' && !isCamelCase(node.name, allow)) {
        context.report({ node, messageId: 'notCamelCase', data: { name: node.name } });
      }
    };
    return {
      VariableDeclarator(node) {
        report(node.id);
      },
      FunctionDeclaration(node) {
        report(node.id);
      },
      ClassDeclaration(node) {
        report(node.id);
      },
      // eslint checks method/property-definition keys and object-literal keys.
      MethodDefinition(node) {
        if (!node.computed) report(node.key);
      },
      PropertyDefinition(node) {
        if (!node.computed) report(node.key);
      },
      Property(node) {
        if (checkProperties && !node.computed) report(node.key);
      },
      // eslint only checks member properties that are assignment targets; a read-only
      // access like `process.env.npm_execpath` is deliberately not reported.
      MemberExpression(node) {
        if (checkProperties && !node.computed && isAssignmentTarget(node.property))
          report(node.property);
      },
      // Import bindings (`ignoreImports: false` means an aliased import is checked too).
      ImportDefaultSpecifier(node) {
        report(node.local);
      },
      ImportNamespaceSpecifier(node) {
        report(node.local);
      },
      ImportSpecifier(node) {
        report(node.local);
      },
    };
  },
};

module.exports = { camelcase };
