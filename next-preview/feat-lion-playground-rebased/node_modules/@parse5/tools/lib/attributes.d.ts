import type { Element } from './nodeTypes.js';
/**
 * Sets the given attribute on the specified node
 * @param {Element} node Node to set attribute on
 * @param {string} name Name of the attribute to set
 * @param {string} value Value of the attribute
 * @return {void}
 */
export declare function setAttribute(node: Element, name: string, value: string): void;
/**
 * Gets an attribute from a given node
 * @param {Element} node Node to retrieve attribute from
 * @param {string} name Name of the attribute to get
 * @return {string|null}
 */
export declare function getAttribute(node: Element, name: string): string | null;
/**
 * Determines if the node has the specified attribute
 * @param {Element} node Node to test
 * @param {string} name Attribute to look for
 * @return {boolean}
 */
export declare function hasAttribute(node: Element, name: string): boolean;
/**
 * Removes an attribute from a given node
 * @param {Element} node Node to retrieve attribute from
 * @param {string} name Name of the attribute to remove
 * @return {void}
 */
export declare function removeAttribute(node: Element, name: string): void;
/**
 * Gets the index of an attribute from a given node
 * @param {Element} node Node to retrieve attribute from
 * @param {string} name Name of the attribute to retrieve index of
 * @return {number}
 */
export declare function getAttributeIndex(node: Element, name: string): number;
