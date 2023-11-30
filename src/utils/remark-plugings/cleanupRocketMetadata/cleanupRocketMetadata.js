// eslint-disable-next-line import/no-extraneous-dependencies
const { init } = require('es-module-lexer');

let isToBeConcatenated;
let visit;
(async () => {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const result = await import('unist-util-visit');
  visit = result.visit;

  const config = await import('../../../../config.mjs');
  isToBeConcatenated = config.isToBeConcatenated;
})();

function cleanupRocketMetadata() {
  /**
   * @param {Node} tree
   */
  async function transformer(tree, file) {
    /**
     * @param {UnistNode} _node
     */
    async function nodeCodeVisitor(_node, index, parent) {
      if (parent.type === 'heading' && isToBeConcatenated(file.history[0])) {
        if (parent.depth === 1) {
          const splitByOrder = _node.value.split('||');
          if (splitByOrder.length === 1) {
            return;
          }
          const order = splitByOrder[1].trim();
          if (!order) {
            return;
          }
          const splitByArrows = splitByOrder[0].split('>>');
          const title = splitByArrows[splitByArrows.length - 1].trim();
          // eslint-disable-next-line no-param-reassign
          _node.value = title;
        }
        // eslint-disable-next-line no-param-reassign
        parent.depth += 1;
      }
    }

    // unifiedjs expects node changes to be made on the given node...
    await init;
    visit(tree, 'text', nodeCodeVisitor);

    return tree;
  }

  return transformer;
}

module.exports = {
  cleanupRocketMetadata,
};
