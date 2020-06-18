/**
 * @param {ASTNode} curNode Node to start from. Will loop over its children
 * @param {object} processObject Will be executed for every node
 * @param {ASTNode} [parentNode] parent of curNode
 */
function traverseHtml(curNode, processObject) {
  function pathify(node) {
    return {
      node,
      traverse(obj) {
        traverseHtml(node, obj);
      },
    };
  }

  // let done = processFn(curNode, parentNode);
  if (processObject[curNode.nodeName]) {
    processObject[curNode.nodeName](pathify(curNode));
  }

  if (curNode.childNodes) {
    curNode.childNodes.forEach(childNode => {
      traverseHtml(childNode, processObject, curNode);
    });
  }
}

module.exports = traverseHtml;
