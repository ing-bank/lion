import { defaultTreeAdapter } from 'parse5';
/**
 * Determines if a given node is a document or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export function isDocument(node) {
    return node.nodeName === '#document';
}
/**
 * Determines if a given node is a document fragment or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export function isDocumentFragment(node) {
    return node.nodeName === '#document-fragment';
}
/**
 * Determines if a given node is a template node or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export function isTemplateNode(node) {
    return node.nodeName === 'template';
}
export const isElementNode = defaultTreeAdapter.isElementNode;
export const isCommentNode = defaultTreeAdapter.isCommentNode;
export const isDocumentTypeNode = defaultTreeAdapter.isDocumentTypeNode;
export const isTextNode = defaultTreeAdapter.isTextNode;
/**
 * Determines if a given node is a parent or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export function isParentNode(node) {
    return (isDocument(node) ||
        isDocumentFragment(node) ||
        isElementNode(node) ||
        isTemplateNode(node));
}
/**
 * Determines if a given node is a child or not
 * @param {Node} node Node to test
 * @return {boolean}
 */
export function isChildNode(node) {
    return (isElementNode(node) ||
        isTemplateNode(node) ||
        isCommentNode(node) ||
        isTextNode(node) ||
        isDocumentTypeNode(node));
}
