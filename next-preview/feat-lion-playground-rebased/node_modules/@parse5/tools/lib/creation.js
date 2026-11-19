import { defaultTreeAdapter, html } from 'parse5';
const namespaceMap = {
    HTML: html.NS.HTML,
    XML: html.NS.XML,
    MATHML: html.NS.MATHML,
    SVG: html.NS.SVG,
    XLINK: html.NS.XLINK,
    XMLNS: html.NS.XMLNS
};
/**
 * Creates an element node
 * @param {string} tagName Name of the tag to create
 * @param {Record<string, string>|Attribute[]} attrs Attributes for the element
 * @param {NS} namespaceURI Namespace of the element
 * @return {Element}
 */
export function createElement(tagName, attrs = [], namespaceURI = html.NS.HTML) {
    const normalisedAttrs = [];
    const normalisedNamespace = namespaceMap[namespaceURI.toUpperCase()] ?? namespaceURI;
    if (Array.isArray(attrs)) {
        for (const attr of attrs) {
            normalisedAttrs.push(attr);
        }
    }
    else {
        for (const name in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, name)) {
                normalisedAttrs.push({
                    name,
                    value: attrs[name]
                });
            }
        }
    }
    return defaultTreeAdapter.createElement(tagName, normalisedNamespace, normalisedAttrs);
}
/**
 * Creates a text node
 * @param {string} value Text contents of the new node
 * @return {TextNode}
 */
export function createTextNode(value) {
    return {
        nodeName: '#text',
        value,
        parentNode: null
    };
}
/**
 * Creates a document fragment
 * @return {DocumentFragment}
 */
export function createDocumentFragment() {
    return defaultTreeAdapter.createDocumentFragment();
}
/**
 * Creates a template element
 * @param {DocumentFragment=} content Content of the template, if any
 * @return {Template}
 */
export function createTemplateNode(content) {
    return {
        nodeName: 'template',
        tagName: 'template',
        content: content ?? createDocumentFragment(),
        parentNode: null,
        attrs: [],
        namespaceURI: html.NS.HTML,
        childNodes: []
    };
}
/**
 * Creates a document
 * @return {Document}
 */
export function createDocument() {
    return defaultTreeAdapter.createDocument();
}
/**
 * Creates a comment node
 * @param {string} data Contents of the comment
 * @return {CommentNode}
 */
export function createCommentNode(data) {
    return defaultTreeAdapter.createCommentNode(data);
}
