/**
 * @typedef {import('../../../types/index.js').SwcTraversalContext} SwcTraversalContext
 * @typedef {import('@swc/core').VariableDeclarator} SwcVariableDeclarator
 * @typedef {import('../../../types/index.js').SwcVisitor} SwcVisitor
 * @typedef {import('../../../types/index.js').SwcBinding} SwcBinding
 * @typedef {import('../../../types/index.js').SwcScope} SwcScope
 * @typedef {import('../../../types/index.js').SwcPath} SwcPath
 * @typedef {import("oxc-parser").ParseResult} OxcParseResult
 * @typedef {import('@swc/core').Identifier} SwcIdentifierNode
 * @typedef {import('oxc-parser').ParseResult} OxcNode
 * @typedef {import('@swc/core').Module} SwcAstModule
 * @typedef {import('@swc/core').Node} SwcNode
 */

/**
 * @param {SwcNode|undefined} node
 * @returns {boolean}
 */
export function isLiteral(node) {
  return node?.type === 'Literal' || node?.type === 'StringLiteral';
}

/**
 * @param {SwcNode|OxcNode} node
 */
export function nameOf(node) {
  // @ts-expect-error
  return node?.value || node?.name;
}

/**
 * @param {SwcNode|OxcNode} node
 */
export function idOf(node) {
  // @ts-expect-error
  return node?.id || node?.identifier;
}

/**
 * @param {SwcNode|OxcNode} node
 */
export function importedOf(node) {
  // @ts-expect-error
  // babel/oxc vs swc
  return node?.imported || node?.orig || node?.local;
}

/**
 * @param {SwcNode|OxcNode} node
 */
export function isProperty(node) {
  if (!node) return false;

  switch (node.type) {
    case 'ObjectProperty':
    case 'ClassProperty':
    case 'ClassAccessorProperty':
    case 'ClassPrivateProperty':
      break;
    default:
      return false;
  }

  return false;
}

/**
 * @param {{ kind: string; }} node
 */
export function isSetter(node) {
  return node?.kind === 'set' || node?.kind === 'setter';
}

/**
 * @param {{ kind: string; }} node
 */
export function isGetter(node) {
  return node?.kind === 'get' || node?.kind === 'getter';
}

/**
 * @param {{ static?: boolean; isStatic?: boolean; }} node
 */
export function isStatic(node) {
  return node?.static || node?.isStatic;
}

/**
 * Swc wraps `.callee` or arguments in expressions... Normalize...
 * @param {SwcNode|OxcNode} node
 * @returns {SwcNode|OxcNode}
 */
export function expressionOf(node) {
  // @ts-expect-error
  return node.expression || node;
}

/**
 * @param {SwcNode|OxcNode} node
 * @returns {boolean}
 */
export function isConstructor(node) {
  return (
    // @ts-expect-error
    // for swc
    node?.type === 'Constructor' ||
    // @ts-expect-error
    (node?.type === 'MethodDefinition' && nameOf(node?.key) === 'constructor')
  );
}
