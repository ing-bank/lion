import type { Element, ParentNode, CommentNode, TextNode, Template, DocumentFragment, Document, DocumentType, Node } from './nodeTypes.js';
export interface Visitor {
    'pre:node'?: (node: Node, parent?: ParentNode) => boolean | void;
    node?: (node: Node, parent?: ParentNode) => void;
    document?: (node: Document) => void;
    documentFragment?: (node: DocumentFragment, parent?: ParentNode) => void;
    element?: (node: Element, parent?: ParentNode) => void;
    comment?: (node: CommentNode, parent?: ParentNode) => void;
    template?: (node: Template, parent?: ParentNode) => void;
    text?: (node: TextNode, parent?: ParentNode) => void;
    documentType?: (node: DocumentType, parent?: ParentNode) => void;
}
/**
 * Traverses the tree of a given node
 * @param {Node} node Node to traverse
 * @param {Visitor} visitor Visitor to apply
 * @param {ParentNode=} parent Parent node of the current node
 * @return {void}
 */
export declare function traverse(node: Node, visitor: Visitor, parent?: ParentNode): void;
