import { isCommentNode, isTextNode, isParentNode } from './typeGuards.js';
import { appendChild } from './treeMutation.js';
import { createTextNode } from './creation.js';
import { queryAll } from './traversal.js';
/**
 * Computes the text content of a given node using a similar
 * algorithm to that of `textContent` in the browser
 * @param {Node} node Node to compute text of
 * @return {string}
 */
export function getTextContent(node) {
    if (isCommentNode(node)) {
        return node.data;
    }
    if (isTextNode(node)) {
        return node.value;
    }
    let content = '';
    const children = queryAll(node, (node) => isTextNode(node) || isCommentNode(node));
    for (const child of children) {
        content += getTextContent(child);
    }
    return content;
}
/**
 * Sets the text content of the given node
 * @param {Node} node Node to set contents of
 * @param {string} text Text to use as contents
 * @return {void}
 */
export function setTextContent(node, text) {
    if (isCommentNode(node)) {
        node.data = text;
    }
    else if (isTextNode(node)) {
        node.value = text;
    }
    else if (isParentNode(node)) {
        const textNode = createTextNode(text);
        appendChild(node, textNode);
    }
}
