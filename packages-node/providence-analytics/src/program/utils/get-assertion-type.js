/**
 * Swc might have a `with` or `assertions` property
 * @param {SwcNode} node
 * @returns {string | undefined}
 */
export function getAssertionType(node) {
  if (node.with) {
    return node.with.properties[0].value?.value;
  }
  if (node.assertions) {
    return node.assertions.properties[0].value?.value;
  }
  // oxc
  if (node.withClause) {
    return node.withClause.withEntries[0].value?.name;
  }
  return undefined;
}
