import { html, Token } from 'parse5';
import type { CommentNode, TextNode, Element, Template, DocumentFragment, Document } from './nodeTypes.js';
/**
 * Creates an element node
 * @param {string} tagName Name of the tag to create
 * @param {Record<string, string>|Attribute[]} attrs Attributes for the element
 * @param {NS} namespaceURI Namespace of the element
 * @return {Element}
 */
export declare function createElement(tagName: string, attrs?: Record<string, string> | Token.Attribute[], namespaceURI?: html.NS | string): Element;
/**
 * Creates a text node
 * @param {string} value Text contents of the new node
 * @return {TextNode}
 */
export declare function createTextNode(value: string): TextNode;
/**
 * Creates a document fragment
 * @return {DocumentFragment}
 */
export declare function createDocumentFragment(): DocumentFragment;
/**
 * Creates a template element
 * @param {DocumentFragment=} content Content of the template, if any
 * @return {Template}
 */
export declare function createTemplateNode(content?: DocumentFragment): Template;
/**
 * Creates a document
 * @return {Document}
 */
export declare function createDocument(): Document;
/**
 * Creates a comment node
 * @param {string} data Contents of the comment
 * @return {CommentNode}
 */
export declare function createCommentNode(data: string): CommentNode;
