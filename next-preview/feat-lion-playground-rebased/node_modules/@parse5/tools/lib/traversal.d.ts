import type { Node } from './nodeTypes.js';
/**
 * Queries the AST for a node which satifies the given condition
 * @param {Node} root Root node to traverse from
 * @param {Function} condition Function to determine if the node matches or not
 * @return {Node|null}
 */
export declare function query<T extends Node = Node>(root: Node, condition: (node: Node) => boolean): T | null;
/**
 * Walks the tree of a node depth-first and yields each discovered node
 * @param {Node} node Node to traverse from
 */
export declare function walkChildren(node: Node): IterableIterator<Node>;
/**
 * Queries the AST for nodes which satifies the given condition
 * @param {Node} root Root node to traverse from
 * @param {Function} condition Function to determine if a node matches or not
 */
export declare function queryAll<T extends Node = Node>(root: Node, condition?: (node: Node) => boolean): IterableIterator<T>;
/**
 * Computes the ancestors of a given node
 * @param {Node} node Node to traverse from
 */
export declare function ancestors(node: Node): IterableIterator<Node>;
/**
 * Computes the previous siblings of a given node
 * @param {Node} node Node to traverse from
 */
export declare function previousSiblings(node: Node): IterableIterator<Node>;
/**
 * Computes the next siblings of a given node
 * @param {Node} node Node to traverse from
 */
export declare function nextSiblings(node: Node): IterableIterator<Node>;
