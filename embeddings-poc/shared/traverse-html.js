/**
 * @typedef {import('parse5/dist/tree-adapters/default.js').Node} Node
 */

const createdPaths = new WeakMap();

function pathify(node, context) {
  const alreadyCreatedPath = createdPaths.get(node);
  if (alreadyCreatedPath) {
    return alreadyCreatedPath;
  }

  const path = {
    node,
    traverseHtml(obj) {
      traverseHtml(node, obj);
    },
    stop() {
      // eslint-disable-next-line no-param-reassign
      context.stopped = true;
    },
  };
  if (context?.parentNode) {
    path.parent = pathify(context.parentNode);
  }
  createdPaths.set(node, path);
  return path;
}

/**
 * Creates an api similar to Babel traverse for parse5 trees
 * @param {Parse5AstNode} curNode Node to start from. Will loop over its children
 * @param {object} visitor Will be executed for every node
 */
export function traverseHtml(curNode, visitor, context = {}) {
  const allPotentialMatchers = [];
  for (const [visitorKeys, fn] of Object.entries(visitor)) {
    const splitted = visitorKeys.split("|");
    for (const visitorKey of splitted) {
      allPotentialMatchers.push({ fn, visitorKey });
    }
  }
  const applicableFns = allPotentialMatchers.filter(
    ({ visitorKey }) => visitorKey === curNode.nodeName
  );

  // Match...
  for (const applicableFn of applicableFns) {
    applicableFn.fn(pathify(curNode, context));
  }

  let { childNodes } = curNode;
  if (curNode.nodeName === "template") {
    childNodes = curNode.content.childNodes;
  }

  if (!context.stopped && childNodes) {
    childNodes.forEach((childNode) => {
      if (!context.stopped) {
        traverseHtml(childNode, visitor, { ...context, parentNode: curNode });
      }
    });
  }
}
