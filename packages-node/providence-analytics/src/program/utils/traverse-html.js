/**
 * @typedef {import('parse5/dist/tree-adapters/default.js').Node} Node
 */

/**
 * Creates an api similar to Babel traverse for parse5 trees
 * @param {Parse5AstNode} curNode Node to start from. Will loop over its children
 * @param {object} processObject Will be executed for every node
 */
export function traverseHtml(curNode, processObject, config = {}) {
  function pathify(node) {
    return {
      node,
      traverseHtml(obj) {
        traverseHtml(node, obj);
      },
      stop() {
        // eslint-disable-next-line no-param-reassign
        config.stopped = true;
      },
    };
  }

  // Match...
  if (processObject[curNode.nodeName]) {
    processObject[curNode.nodeName](pathify(curNode));
  }

  let { childNodes } = curNode;
  if (curNode.nodeName === 'template') {
    childNodes = curNode.content.childNodes;
  }

  if (!config.stopped && childNodes) {
    childNodes.forEach(childNode => {
      if (!config.stopped) {
        traverseHtml(childNode, processObject, config);
      }
    });
  }
}
