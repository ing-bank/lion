/**
 * Sets the given attribute on the specified node
 * @param {Element} node Node to set attribute on
 * @param {string} name Name of the attribute to set
 * @param {string} value Value of the attribute
 * @return {void}
 */
export function setAttribute(node, name, value) {
    node.attrs.push({
        name,
        value
    });
}
/**
 * Gets an attribute from a given node
 * @param {Element} node Node to retrieve attribute from
 * @param {string} name Name of the attribute to get
 * @return {string|null}
 */
export function getAttribute(node, name) {
    return node.attrs.find((attr) => attr.name === name)?.value ?? null;
}
/**
 * Determines if the node has the specified attribute
 * @param {Element} node Node to test
 * @param {string} name Attribute to look for
 * @return {boolean}
 */
export function hasAttribute(node, name) {
    return node.attrs.some((attr) => attr.name === name);
}
/**
 * Removes an attribute from a given node
 * @param {Element} node Node to retrieve attribute from
 * @param {string} name Name of the attribute to remove
 * @return {void}
 */
export function removeAttribute(node, name) {
    const index = getAttributeIndex(node, name);
    if (index > -1) {
        node.attrs.splice(index, 1);
    }
}
/**
 * Gets the index of an attribute from a given node
 * @param {Element} node Node to retrieve attribute from
 * @param {string} name Name of the attribute to retrieve index of
 * @return {number}
 */
export function getAttributeIndex(node, name) {
    return node.attrs.findIndex((attr) => attr.name === name);
}
