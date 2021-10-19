/**
 * @typedef {import('../../../types/shadow-cast').SCNode} SCNode
 * @typedef {import('../../../types/shadow-cast').MatchConditionMeta} MatchConditionMeta
 */

/**
 * @param {SCNode} traversedSelector
 * @param {SCNode} hostSelector
 * @returns {MatchConditionMeta|boolean}
 */
function bemAdditionalHostMatcher(traversedSelector, hostSelector) {
  const hostModifierMatch =
    traversedSelector.type === hostSelector.type &&
    traversedSelector.name.startsWith(`${hostSelector.name}--`);
  if (hostModifierMatch) {
    return { partialHostMatchNode: traversedSelector };
  }
  return false;
}

/**
 * @param {string} statePart for instance '.comp__feedback--invalid'
 * @returns {string}  for instance '.comp__feedback'
 */
function bemCreateCompoundFromStatePart(statePart) {
  return statePart.split('--')[0];
}

module.exports = {
  bemAdditionalHostMatcher,
  bemCreateCompoundFromStatePart,
};
