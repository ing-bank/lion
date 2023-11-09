/**
 * @typedef {import('@swc/core').Module} SwcAstModule
 * @typedef {import('@swc/core').Node} SwcNode
 * @typedef {import('@swc/core').VariableDeclarator} SwcVariableDeclarator
 * @typedef {import('@swc/core').Identifier} SwcIdentifierNode
 * @typedef {import('../../../types/index.js').SwcPath} SwcPath
 * @typedef {import('../../../types/index.js').SwcScope} SwcScope
 * @typedef {import('../../../types/index.js').SwcVisitor} SwcVisitor
 * @typedef {import('../../../types/index.js').SwcBinding} SwcBinding
 * @typedef {import('../../../types/index.js').SwcTraversalContext} SwcTraversalContext
 */

/**
 * Contains all node info, to create paths from
 * @type {WeakMap<SwcNode,SwcPath>}
 */
const swcPathCache = new WeakMap();

const fnTypes = [
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
  'ClassMethod',
  'Constructor',
];

const nonBlockParentTypes = [...fnTypes, 'SwitchStatement', 'ClassDeclaration'];

/**
 * @param {SwcPath} swcPath
 * @param {SwcScope} currentScope
 * @param {SwcTraversalContext} traversalContext
 * @returns {SwcScope|null}
 */
function getNewScope(swcPath, currentScope, traversalContext) {
  const { node, parent } = swcPath;
  // const hasNonBlockParent = (/** @type {SwcNode} */ nd) => nonBlockParentTypes.includes(nd.type);
  const isFn = (/** @type {SwcNode} */ nd) => nd && fnTypes.includes(nd.type);

  const isIsolatedBlockStatement = !isFn(parent) && node.type === 'BlockStatement';

  // Create new scope...
  if (nonBlockParentTypes.includes(node.type) || isIsolatedBlockStatement) {
    // eslint-disable-next-line no-param-reassign
    traversalContext.scopeId += 1;
    return {
      id: traversalContext.scopeId,
      parentScope: currentScope,
      path: swcPath,
      bindings: {},
      _pendingRefsWithoutBinding: [],
      _isIsolatedBlockStatement: isIsolatedBlockStatement,
    };
  }

  return null;
}

/**
 * @param {SwcNode} node
 */
export function getPathFromNode(node) {
  return swcPathCache.get(node);
}

/**
 * @param {SwcNode} node
 * @param {SwcNode|null} parent
 * @param {Function} stop
 * @param {SwcScope} [scope]
 * @returns {SwcPath}
 */
function createSwcPath(node, parent, stop, scope) {
  /** @type {SwcPath} */
  const swcPath = {
    node,
    parent,
    stop,
    // TODO: "pre-traverse" the missing scope parts instead via getter that adds refs and bindings for current scope
    scope,
    parentPath: parent ? getPathFromNode(parent) : null,
    get(/** @type {string} */ id) {
      const swcPathForNode = getPathFromNode(node[id]);
      if (node[id] && !swcPathForNode) {
        // throw new Error(
        //   `[swcTraverse]: Use {needsAdvancedPaths: true} to find path for node: ${node[name]}`,
        // );
        // TODO: "pre-traverse" the missing path parts instead
      }
      return swcPathForNode;
    },
    get type() {
      return node.type;
    },
  };
  swcPathCache.set(node, swcPath);
  return swcPath;
}

/**
 * Is the node:
 * - a declaration (like "const a = 1")?
 * - an import specifier (like "import { a } from 'b'")?
 * Handy to know if the parents of Identifiers mark a binding
 * @param {SwcNode} parent
 * @param {string} identifierValue
 */
function isBindingNode(parent, identifierValue) {
  if (parent.type === 'VariableDeclarator') {
    // @ts-ignore
    return parent.id.value === identifierValue;
  }
  return [
    'ClassDeclaration',
    'FunctionDeclaration',
    'ArrowFunctionExpression',
    'ImportSpecifier',
    'ImportDefaultSpecifier',
  ].includes(parent.type);
}

/**
 * Is the node:
 * - a declaration (like "const a = 1")?
 * - an import specifier (like "import { a } from 'b'")?
 * Handy to know if the parents of Identifiers mark a binding
 * @param {SwcNode} parent
 */
function isBindingRefNode(parent) {
  return ![
    'ClassMethod',
    'Constructor',
    'MemberExpression',
    'KeyValueProperty',
    'SwitchStatement',
    'MethodProperty',
  ].includes(parent.type);
}

/**
 * @param {SwcPath} swcPathForIdentifier
 * @returns {void}
 */
function addPotentialBindingOrRefToScope(swcPathForIdentifier) {
  const { node, parent, scope, parentPath } = swcPathForIdentifier;

  if (node.type !== 'Identifier') {
    return;
  }

  // const parentPath = getPathFromNode(parent);
  if (isBindingNode(parent, node.value)) {
    /** @type {SwcBinding} */
    const binding = {
      identifier: parent,
      // kind: 'var',
      refs: [],
      path: swcPathForIdentifier.parentPath,
    };
    let scopeBindingBelongsTo = scope;
    const isVarInIsolatedBlock =
      scope._isIsolatedBlockStatement &&
      swcPathForIdentifier.parentPath.parentPath.node.kind === 'var';
    const hasNonBlockParent = nonBlockParentTypes.includes(parent.type);

    if (isVarInIsolatedBlock || hasNonBlockParent) {
      scopeBindingBelongsTo = scope.parentScope || scope;
    }
    if (scopeBindingBelongsTo._pendingRefsWithoutBinding.includes(parentPath)) {
      binding.refs.push(parentPath);
      scopeBindingBelongsTo._pendingRefsWithoutBinding.splice(
        scopeBindingBelongsTo._pendingRefsWithoutBinding.indexOf(parentPath),
        1,
      );
    }
    const idName = node.value || node.local?.value || node.orig?.value;
    // eslint-disable-next-line no-param-reassign
    scopeBindingBelongsTo.bindings[idName] = binding;

    // Align with Babel... => in example `class Q {}`, Q has binding to root scope and ClassDeclaration scope
    if (parent.type === 'ClassDeclaration') {
      scope.bindings[idName] = binding;
    }
  }
  // In other cases, we are dealing with a reference that must be bound to a binding
  else if (isBindingRefNode(parent)) {
    const binding = scope.bindings[node.value];
    if (binding) {
      binding.refs.push(parentPath);
    } else {
      // we are referencing a variable that is not declared in this scope or any parent scope
      // It might be hoisted, so we might find it later. For now, store it as a pending reference
      scope._pendingRefsWithoutBinding.push(parentPath);
    }
  }
}

/**
 * Is the node is the root of the ast?
 * in Babel, this is the equivalent of Program
 * @param {SwcNode} node
 * @returns {boolean}
 */
function isRootNode(node) {
  return node.type === 'Module' || node.type === 'Script';
}

/**
 * @param {{node: SwcNode; }} node
 * @param {(data:{child:SwcNode}) => void} callback
 */
const loopChildren = ({ node }, callback) => {
  for (const [childKey, childVal] of Object.entries(node)) {
    if (childKey === 'span') {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (Array.isArray(childVal)) {
      for (const childValElem of childVal) {
        callback({ child: childValElem });
      }
    } else if (typeof childVal === 'object') {
      callback({ child: childVal });
    }
  }
};

/**
 * @param {SwcPath} swcPath
 * @param {SwcVisitor} visitor
 * @param {SwcTraversalContext} traversalContext
 */
function visit(swcPath, visitor, traversalContext) {
  if (visitor.enter) {
    // @ts-expect-error
    visitor.enter(swcPath);
  }

  if (isRootNode(swcPath.node) && visitor.root) {
    // @ts-expect-error
    visitor.root(swcPath);
  }

  // Later, consider https://github.com/babel/babel/blob/b1e73d6f961065c56427ffa89c130beea8321d3b/packages/babel-traverse/src/traverse-node.ts#L28
  if (typeof visitor[swcPath.node.type] === 'function') {
    // @ts-expect-error
    visitor[swcPath.node.type](swcPath);
  }
  // @ts-expect-error
  else if (visitor[swcPath.node.type]?.enter) {
    // @ts-expect-error
    visitor[swcPath.node.type].enter(swcPath);
  }
  // @ts-expect-error
  if (visitor[swcPath.node.type]?.exit) {
    // Let visitTree know that we should visit on exit
    // @ts-expect-error
    traversalContext.visitOnExitFns.push(() => visitor[swcPath.node.type].exit(swcPath));
  }
}

/**
 * Simple traversal for swc ast.
 * @param {SwcAstModule} swcAst
 * @param {SwcVisitor} visitor
 * @param {object} config
 * @param {boolean} [config.needsAdvancedPaths] needs a full traversal before starting the visitor, which is less performant. Only enable when path.get() is used
 */
export function swcTraverse(swcAst, visitor, { needsAdvancedPaths = false } = {}) {
  /**
   * For performance, the author of a visitor can call this to stop further traversal
   */
  let isStopped = false;
  const stop = () => {
    isStopped = true;
  };

  /**
   * @param {SwcNode} node
   * @param {SwcNode|null} parent
   * @param {SwcScope} scope
   * @param {boolean} hasPreparedTree
   * @param {SwcTraversalContext} traversalContext
   */
  const handlePathAndScope = (node, parent, scope, hasPreparedTree, traversalContext) => {
    if (hasPreparedTree) {
      const swcPath = /** @type {SwcPath} */ (swcPathCache.get(node));
      return {
        swcPath,
        newOrCurScope: getNewScope(swcPath, scope, traversalContext) || scope,
      };
    }
    // `needsAdvancedPaths` was false
    const swcPath = createSwcPath(node, parent, stop);
    // We create scopes ourselves, since paths are not prepared yet...
    const newOrCurScope = getNewScope(swcPath, scope, traversalContext) || scope;
    swcPath.scope = newOrCurScope;
    addPotentialBindingOrRefToScope(swcPath);
    return { newOrCurScope, swcPath };
  };

  /**
   * @param {SwcNode} node
   * @param {SwcNode|null} parent
   * @param {SwcScope} scope
   * @param {SwcTraversalContext} traversalContext
   * @param {{haltCondition?: (node: SwcNode) => boolean;}} [config]
   */
  const prepareTree = (node, parent, scope, traversalContext, { haltCondition } = {}) => {
    if (!node?.type) {
      return;
    }

    const { newOrCurScope } = handlePathAndScope(node, parent, scope, false, traversalContext);
    loopChildren({ node }, ({ child }) => {
      prepareTree(child, node, newOrCurScope, traversalContext, { haltCondition });
    });
  };

  /**
   * @param {SwcNode} node
   * @param {SwcNode|null} parent
   * @param {SwcScope} scope
   * @param {{hasPreparedTree?: boolean;}} config
   * @param {SwcTraversalContext} traversalContext
   */
  const visitTree = (node, parent, scope, config, traversalContext) => {
    if (!node?.type || isStopped) {
      return;
    }

    const { hasPreparedTree = false } = config || {};

    const { swcPath } = handlePathAndScope(node, parent, scope, hasPreparedTree, traversalContext);
    visit(swcPath, visitor, traversalContext);
    loopChildren({ node }, ({ child }) => {
      visitTree(child, node, swcPath.scope, config, traversalContext);
    });
  };

  const traversalContext = { visitOnExitFns: [], scopeId: 0 };
  // https://developer.mozilla.org/en-US/docs/Glossary/Scope
  /** @type {SwcScope} */
  const initialScope = {
    id: traversalContext.scopeId,
    bindings: {},
    path: null,
    _pendingRefsWithoutBinding: [],
    _isIsolatedBlockStatement: false,
  };
  if (needsAdvancedPaths) {
    // Do one full traversal to prepare advanced path functionality like path.get() and path.scope.bindings
    // TODO: improve with on the fly, partial tree traversal for best performance
    prepareTree(swcAst, null, initialScope, traversalContext);
  }
  visitTree(swcAst, null, initialScope, { hasPreparedTree: needsAdvancedPaths }, traversalContext);
  // @ts-ignore
  traversalContext.visitOnExitFns.reverse().forEach(fn => fn());
}
