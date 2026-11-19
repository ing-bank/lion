import type { DefaultTreeAdapterMap, TreeAdapter } from 'parse5';
import type { ChildNode, Node } from './nodeTypes.js';
type DefaultTreeAdapterLike = TreeAdapter<DefaultTreeAdapterMap>;
/**
 * Attempts to remove the given node from the AST
 * @param {Node} node Node to remove
 * @return {void}
 */
export declare function removeNode(node: Node): void;
export declare const appendChild: DefaultTreeAdapterLike['appendChild'];
/**
 * Performs a splice on the children of the given node
 * @param {Node} node Node to splice children of
 * @param {number} start Index to begin removing nodes from
 * @param {number} deleteCount Number of nodes to delete
 * @param {...ChildNode} children Children to add
 * @return {void}
 */
export declare function spliceChildren(node: Node, start: number, deleteCount: number, ...children: ChildNode[]): ChildNode[];
/**
 * Replaces the given node with a set of nodes
 * @param {ChildNode} node Node to be replaced
 * @param {...ChildNode} replacements Nodes to be used as replacements
 * @return {void}
 */
export declare function replaceWith(node: ChildNode, ...replacements: ChildNode[]): void;
export {};
