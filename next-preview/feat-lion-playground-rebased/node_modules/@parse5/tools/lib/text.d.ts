import type { Node } from './nodeTypes.js';
/**
 * Computes the text content of a given node using a similar
 * algorithm to that of `textContent` in the browser
 * @param {Node} node Node to compute text of
 * @return {string}
 */
export declare function getTextContent(node: Node): string;
/**
 * Sets the text content of the given node
 * @param {Node} node Node to set contents of
 * @param {string} text Text to use as contents
 * @return {void}
 */
export declare function setTextContent(node: Node, text: string): void;
