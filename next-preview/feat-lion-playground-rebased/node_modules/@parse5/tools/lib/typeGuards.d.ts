import type { DefaultTreeAdapterMap, TreeAdapter } from 'parse5';
import type { ParentNode, ChildNode, Template, DocumentFragment, Document, Node } from './nodeTypes.js';
type DefaultTreeAdapterLike = TreeAdapter<DefaultTreeAdapterMap>;
/**
 * Determines if a given node is a document or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export declare function isDocument(node: Node): node is Document;
/**
 * Determines if a given node is a document fragment or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export declare function isDocumentFragment(node: Node): node is DocumentFragment;
/**
 * Determines if a given node is a template node or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export declare function isTemplateNode(node: Node): node is Template;
export declare const isElementNode: DefaultTreeAdapterLike['isElementNode'];
export declare const isCommentNode: DefaultTreeAdapterLike['isCommentNode'];
export declare const isDocumentTypeNode: DefaultTreeAdapterLike['isDocumentTypeNode'];
export declare const isTextNode: DefaultTreeAdapterLike['isTextNode'];
/**
 * Determines if a given node is a parent or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export declare function isParentNode(node: Node): node is ParentNode;
/**
 * Determines if a given node is a child or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export declare function isChildNode(node: Node): node is ChildNode;
export {};
