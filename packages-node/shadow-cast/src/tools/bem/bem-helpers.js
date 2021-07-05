/**
 * @typedef {import('../../../types/shadow-cast').SCNode} SCNode
 */

/**
 * @param {SCNode} traversedSelector
 * @param {SCNode} hostSelector
 */
function bemAdditionalHostMatcher(traversedSelector, hostSelector) {
  return (
    traversedSelector.type === hostSelector.type &&
    traversedSelector.name.startsWith(`${hostSelector.name}--`)
  );
}

module.exports = {
  bemAdditionalHostMatcher,
};
