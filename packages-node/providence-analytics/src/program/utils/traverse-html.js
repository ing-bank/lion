/**
 * @typedef {object} Parse5AstNode
 * @property {string} nodeName
 * @property {Parse5AstNode[]} [childNodes]
 * @property {{ childNodes: Parse5AstNode[] }} content
 * @typedef {object} HtmlAstPath
 * @property {Parse5AstNode} node
 * @property {(processObject: HtmlProcessObject) => void} traverseHtml
 * @property {() => void} stop
 * @typedef {{ [nodeName: string]: ((astPath: HtmlAstPath) => void) }} HtmlProcessObject
 */

/**
 * Creates an api similar to Babel traverse for parse5 trees
 * @param {Parse5AstNode} curNode Node to start from. Will loop over its children
 * @param {HtmlProcessObject} processObject Will be executed for every node
 * @param {{ stopped?: boolean }} [config]
 */
export function traverseHtml(curNode, processObject, config = {}) {
  /**
   * @param {Parse5AstNode} node
   * @returns {HtmlAstPath}
   */
  function pathify(node) {
    return {
      node,
      /**
       * @param {HtmlProcessObject} obj
       */
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
