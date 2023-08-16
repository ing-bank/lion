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
 * @param {Record<string,function>} visitor Will be executed for every node
 */
export function traverseHtml(curNode, visitor, context = {}) {
  /**
   * Prepare multiple potential visitor matches...
   * Say, we have a visitor object like this:
   * {
   *   h1: function fnA(p5Path) {...},
   *   'h1|h2': function fnB((p5Path) {...},
   * }
   * Our curNode.nodeName is 'h1', so we need to match both 'h1' and 'h1|h2'.
   *
   * We will end up with an array like this: [{nodeName: 'h1', fn: fnA}, {nodeName: 'h1', fn: fnB}, {nodeName: 'h2', fn: fnB}}]
   * In this traversal round, we will execute fnA and fnB once, bceause curNode.nodeName is 'h1'.
   * @type {{fn: function, nodeName: string}[]}
   */
  const visitorFnsByNodeName = [];
  for (const [visitorKeys, fn] of Object.entries(visitor)) {
    const nodeNames = visitorKeys.split('|');
    for (const nodeName of nodeNames) {
      visitorFnsByNodeName.push({ fn, nodeName });
    }
  }

  // Match...
  for (const { nodeName, fn } of visitorFnsByNodeName) {
    if (nodeName === curNode.nodeName) {
      fn(pathify(curNode, context));
    }
  }

  const { childNodes } = curNode;
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
