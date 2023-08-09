/**
 * @typedef {import('parse5/dist/tree-adapters/default.js').Node} Node
 */

const createdPaths = new WeakMap();

function pathify(node, context) {
  const alreadyCreatedPath = createdPaths.get(node);
  console.log("//// pathify running..nodeName:", node.nodeName);
  if (alreadyCreatedPath) {
    console.log(">>", alreadyCreatedPath);
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
    console.log("context.parentNode.nodeName-->", context.parentNode.nodeName);
    path.parent = pathify(context.parentNode);
  }
  createdPaths.set(node, path);
  console.log("CREATED PATHS:", createdPaths);

  return path;
}

/**
 * Creates an api similar to Babel traverse for parse5 trees
 * @param {Parse5AstNode} curNode Node to start from. Will loop over its children
 * @param {object} visitor Will be executed for every node
 */
export function traverseHtml(curNode, visitor, context = {}) {
  // Match...
  if (visitor[curNode.nodeName]) {
    visitor[curNode.nodeName](pathify(curNode, context));
  }

  let { childNodes } = curNode;
  if (curNode.nodeName === 'template') {
    childNodes = curNode.content.childNodes;
  }

  if (!context.stopped && childNodes) {
    childNodes.forEach(childNode => {
      if (!context.stopped) {
        traverseHtml(childNode, visitor, { ...context, parentNode: curNode });
      }
    });
  }
}
