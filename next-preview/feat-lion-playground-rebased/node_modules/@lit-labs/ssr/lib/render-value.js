/// <reference lib="dom" />
import { nothing, noChange } from 'lit';
import { PartType } from 'lit/directive.js';
import { isPrimitive, isTemplateResult, getDirectiveClass, TemplateResultType, isCompiledTemplateResult, } from 'lit/directive-helpers.js';
import { _$LH } from 'lit-html/private-ssr-support.js';
const { getTemplateHtml, marker, markerMatch, boundAttributeSuffix, patchDirectiveResolve, getAttributePartCommittedValue, resolveDirective, AttributePart, PropertyPart, BooleanAttributePart, EventPart, connectedDisconnectable, isIterable, } = _$LH;
import { digestForTemplateResult } from '@lit-labs/ssr-client';
import { HTMLSlotElement } from '@lit-labs/ssr-dom-shim';
import { getElementRenderer, } from './element-renderer.js';
import { escapeHtml } from './util/escape-html.js';
import { parseFragment, parse } from 'parse5';
import { isElementNode, isCommentNode, traverse, isTextNode, isTemplateNode, } from '@parse5/tools';
import { isRenderLightDirective } from '@lit-labs/ssr-client/directives/render-light.js';
import { reflectedAttributeName } from './reflected-attributes.js';
import { isHydratable } from './server-template.js';
function ssrResolve(_part, values) {
    // Since the return value may also be a directive result in the case of nested
    // directives, we may need to patch that as well.
    return patchIfDirective(this.render(...values));
}
/**
 * Looks for values of type `DirectiveResult` and patches its Directive class
 * such that it calls `render` rather than `update`.
 */
const patchIfDirective = (value) => {
    const directiveCtor = getDirectiveClass(value);
    if (directiveCtor !== undefined) {
        patchDirectiveResolve(directiveCtor, ssrResolve);
    }
    return value;
};
/**
 * Patches `DirectiveResult` `Directive` classes for AttributePart values, which
 * may be an array
 */
const patchAnyDirectives = (part, value, valueIndex) => {
    if (part.strings !== undefined) {
        for (let i = 0; i < part.strings.length - 1; i++) {
            patchIfDirective(value[valueIndex + i]);
        }
    }
    else {
        patchIfDirective(value);
    }
};
const templateCache = new WeakMap();
/**
 * Any of these top level tags will be removed by parse5's `parseFragment` and
 * will cause part errors if there are any part bindings. For only the `html`,
 * `head`, and `body` tags, we use a page-level template `parse`.
 */
const REGEXP_TEMPLATE_HAS_TOP_LEVEL_PAGE_TAG = /^(\s|<!--[^(-->)]*-->)*(<(!doctype|html|head|body))/i;
/**
 * For a given TemplateResult, generates and/or returns a cached list of opcodes
 * for the associated Template.  Opcodes are designed to allow emitting
 * contiguous static text from the template as much as possible, with specific
 * non-`text` opcodes interleaved to perform dynamic work, such as emitting
 * values for ChildParts or AttributeParts, and handling custom elements.
 *
 * For the following example template, an opcode list may look like this:
 *
 * ```js
 * html`<div><span>Hello</span><span class=${'bold'}>${template()}</span></div>`
 * ```
 *
 * - `text`
 *   - Emit run of static text: `<div><span>Hello</span>`
 * - `possible-node-marker`
 *   - Emit `<!--lit-node n-->` marker since there are attribute parts
 * - `text`
 *   - Emit run of static text: `<span`
 * - `attribute-part`
 *   - Emit an AttributePart's value, e.g. ` class="bold"`
 * - `text`
 *   - Emit run of static text: `>`
 * - `child-part`
 *   - Emit the ChildPart's value, in this case a TemplateResult, thus we
 *     recurse into that template's opcodes
 * - `text`
 *   - Emit run of static text: `/span></div>`
 *
 * When a custom-element is encountered, the flow looks like this:
 *
 * ```js
 * html`<x-foo staticAttr dynamicAttr=${value}><div>child</div>...</x-foo>`
 * ```
 *
 * - `possible-node-marker`
 *   - Emit `<!--lit-node n-->` marker since there are attribute parts and we
 *      may emit the `defer-hydration` attribute on the node that follows
 * - `text`
 *   - Emit open tag `<x-foo`
 * - `custom-element-open`
 *   - Create the CE `instance`+`renderer` and put on
 *     `customElementInstanceStack`
 *   - Call `renderer.setAttribute()` for any `staticAttributes` (e.g.
 *     'staticAttr`)
 * - `attribute-part`(s)
 *   - Call `renderer.setAttribute()` or `renderer.setProperty()` for
 *     `AttributePart`/`PropertyPart`s (e.g. for `dynamicAttr`)
 * - `custom-element-attributes`
 *   - Call `renderer.connectedCallback()`
 *   - Emit `renderer.renderAttributes()`
 * - `text`
 *   - Emit end of open tag `>`
 * - `custom-element-shadow`
 *   - Emit `renderer.renderShadow()` (emits `<template shadowroot>` +
 *     recurses to emit `render()`)
 * - `text`
 *   - Emit run of static text within tag: `<div>child</div>...`
 * - ...(recurse to render more parts/children)...
 * - `custom-element-close`
 *   - Pop the CE `instance`+`renderer` off the `customElementInstanceStack`
 */
const getTemplateOpcodes = (result) => {
    const template = templateCache.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const [html, attrNames] = getTemplateHtml(result.strings, 
    // SVG TemplateResultType functionality is only required on the client,
    // which instantiates SVG elements within a svg namespace. Using SVG
    // on the server results in unneccesary svg containers being emitted.
    TemplateResultType.HTML);
    const hydratable = isHydratable(result);
    const htmlString = String(html);
    // Only server templates can use top level document tags such as `<html>`,
    // `<body>`, and `<head>`.
    const isPageLevelTemplate = !hydratable && REGEXP_TEMPLATE_HAS_TOP_LEVEL_PAGE_TAG.test(htmlString);
    /**
     * The html string is parsed into a parse5 AST with source code information
     * on; this lets us skip over certain ast nodes by string character position
     * while walking the AST.
     *
     * Server Templates may need to use `parse` as they may contain document tags such
     * as `<html>`.
     */
    const ast = (isPageLevelTemplate ? parse : parseFragment)(htmlString, {
        sourceCodeLocationInfo: true,
    });
    const ops = [];
    /* The last offset of html written to the stream */
    let lastOffset = 0;
    /* Current attribute part index, for indexing attrNames */
    let attrIndex = 0;
    /**
     * Sets `lastOffset` to `offset`, skipping a range of characters. This is
     * useful for skipping and re-writing lit-html marker nodes, bound attribute
     * suffix, etc.
     */
    const skipTo = (offset) => {
        if (lastOffset === undefined) {
            throw new Error('lastOffset is undefined');
        }
        if (offset < lastOffset) {
            throw new Error(`offset must be greater than lastOffset.
        offset: ${offset}
        lastOffset: ${lastOffset}
      `);
        }
        lastOffset = offset;
    };
    /**
     * Records the given string to the output, either by appending to the current
     * opcode (if already `text`) or by creating a new `text` opcode (if the
     * previous opcode was not `text)
     */
    const flush = (value) => {
        const op = ops.at(-1);
        if (op !== undefined && op.type === 'text') {
            op.value += value;
        }
        else {
            ops.push({
                type: 'text',
                value,
            });
        }
    };
    /**
     * Creates or appends to a text opcode with a substring of the html from the
     * `lastOffset` flushed to `offset`.
     */
    const flushTo = (offset) => {
        if (lastOffset === undefined) {
            throw new Error('lastOffset is undefined');
        }
        const previousLastOffset = lastOffset;
        lastOffset = offset;
        const value = String(html).substring(previousLastOffset, offset);
        flush(value);
    };
    // Depth-first node index, counting only comment and element nodes, to match
    // client-side lit-html.
    let nodeIndex = 0;
    // TODO (justinfagnani): Replace with template parser from @lit-labs/analyzer
    traverse(ast, {
        'pre:node'(node, parent) {
            if (isCommentNode(node)) {
                if (node.data === markerMatch) {
                    flushTo(node.sourceCodeLocation.startOffset);
                    skipTo(node.sourceCodeLocation.endOffset);
                    ops.push({
                        type: 'child-part',
                        index: nodeIndex,
                        useCustomElementInstance: parent && isElementNode(parent) && parent.isDefinedCustomElement,
                    });
                }
                nodeIndex++;
            }
            else if (isElementNode(node)) {
                let boundAttributesCount = 0;
                const tagName = node.tagName;
                if (node.parentNode &&
                    isElementNode(node.parentNode) &&
                    node.parentNode.isDefinedCustomElement) {
                    // When the parent node is a custom element we check for the presence
                    // or absence of the slot attribute. This allows us to track the
                    // event tree with the association of the slot path.
                    ops.push({
                        type: 'slotted-element-open',
                        name: node.attrs.find((a) => a.name === 'slot')?.value,
                    });
                }
                if (tagName.indexOf('-') !== -1) {
                    // Looking up the constructor here means that custom elements must be
                    // registered before rendering the first template that contains them.
                    const ctor = customElements.get(tagName);
                    if (ctor !== undefined) {
                        // Mark that this is a custom element
                        node.isDefinedCustomElement = true;
                        ops.push({
                            type: 'custom-element-open',
                            tagName,
                            ctor,
                            staticAttributes: new Map(node.attrs
                                .filter((attr) => !attr.name.endsWith(boundAttributeSuffix))
                                .map((attr) => [attr.name, attr.value])),
                        });
                    }
                }
                else if (tagName === 'slot') {
                    ops.push({
                        type: 'slot-element-open',
                        // Name is either assigned the slot name or undefined for
                        // an unnamed slot.
                        name: node.attrs.find((a) => a.name === 'name')?.value,
                    });
                }
                const attrInfo = node.attrs.map((attr) => {
                    const isAttrBinding = attr.name.endsWith(boundAttributeSuffix);
                    const isElementBinding = attr.name.startsWith(marker);
                    if (isAttrBinding || isElementBinding) {
                        boundAttributesCount += 1;
                    }
                    return [isAttrBinding, isElementBinding, attr];
                });
                if (boundAttributesCount > 0 || node.isDefinedCustomElement) {
                    // We (may) need to emit a `<!-- lit-node -->` comment marker to
                    // indicate the following node needs to be identified during
                    // hydration when it has bindings or if it is a custom element (and
                    // thus may need its `defer-hydration` to be removed, depending on
                    // the `deferHydration` setting). The marker is emitted as a
                    // previous sibling before the node in question, to avoid issues
                    // with void elements (which do not have children) and raw text
                    // elements (whose children are intepreted as text).
                    flushTo(node.sourceCodeLocation.startTag.startOffset);
                    ops.push({
                        type: 'possible-node-marker',
                        boundAttributesCount,
                        nodeIndex,
                    });
                }
                for (const [isAttrBinding, isElementBinding, attr] of attrInfo) {
                    if (isAttrBinding || isElementBinding) {
                        // Note that although we emit a lit-node comment marker for any
                        // nodes with bindings, we don't account for it in the nodeIndex because
                        // that will not be injected into the client template
                        const strings = attr.value.split(marker);
                        const attrSourceLocation = node.sourceCodeLocation.attrs[attr.name];
                        const attrNameStartOffset = attrSourceLocation.startOffset;
                        const attrEndOffset = attrSourceLocation.endOffset;
                        flushTo(attrNameStartOffset);
                        if (isAttrBinding) {
                            // We store the case-sensitive name from `attrNames` (generated
                            // while parsing the template strings); note that this assumes
                            // parse5 attribute ordering matches string ordering
                            const name = attrNames[attrIndex++];
                            const [, prefix, caseSensitiveName] = /([.?@])?(.*)/.exec(name);
                            if (!hydratable) {
                                if (prefix === '.') {
                                    throw new Error(`Server-only templates can't bind to properties. Bind to attributes instead, as they can be serialized when the template is rendered and sent to the browser.`);
                                }
                                else if (prefix === '@') {
                                    throw new Error(`Server-only templates can't bind to events. There's no way to serialize an event listener when generating HTML and sending it to the browser.`);
                                }
                            }
                            ops.push({
                                type: 'attribute-part',
                                index: nodeIndex,
                                name: caseSensitiveName,
                                ctor: prefix === '.'
                                    ? PropertyPart
                                    : prefix === '?'
                                        ? BooleanAttributePart
                                        : prefix === '@'
                                            ? EventPart
                                            : AttributePart,
                                strings,
                                tagName: tagName.toUpperCase(),
                                useCustomElementInstance: node.isDefinedCustomElement,
                            });
                        }
                        else {
                            if (!hydratable) {
                                throw new Error(`Server-only templates don't support element parts, as their API does not currently give them any way to render anything on the server. Found in template:
    ${displayTemplateResult(result)}`);
                            }
                            ops.push({
                                type: 'element-part',
                                index: nodeIndex,
                            });
                        }
                        skipTo(attrEndOffset);
                    }
                    else if (node.isDefinedCustomElement) {
                        // For custom elements, all static attributes are stored along
                        // with the `custom-element-open` opcode so that we can set them
                        // into the custom element instance, and then serialize them back
                        // out along with any manually-reflected attributes. As such, we
                        // skip over static attribute text here.
                        const attrSourceLocation = node.sourceCodeLocation.attrs[attr.name];
                        flushTo(attrSourceLocation.startOffset);
                        skipTo(attrSourceLocation.endOffset);
                    }
                }
                if (node.isDefinedCustomElement) {
                    // For custom elements, add an opcode to write out attributes,
                    // close the tag, and then add an opcode to write the shadow
                    // root
                    flushTo(node.sourceCodeLocation.startTag.endOffset - 1);
                    ops.push({
                        type: 'custom-element-attributes',
                    });
                    flush('>');
                    skipTo(node.sourceCodeLocation.startTag.endOffset);
                    ops.push({
                        type: 'custom-element-shadow',
                    });
                }
                else if (!hydratable &&
                    /^(title|textarea|script|style)$/.test(node.tagName)) {
                    const dangerous = isJavaScriptScriptTag(node);
                    // Marker comments in a rawtext element will be parsed as text,
                    // so we need to look at the text value of childnodes to try to
                    // find them and render child-part opcodes.
                    for (const child of node.childNodes) {
                        if (!isTextNode(child)) {
                            throw new Error(`Internal error: Unexpected child node inside raw text node, a ${node.tagName} should only contain text nodes, but found a ${node.nodeName} (tagname: ${node.tagName})`);
                        }
                        const text = child.value;
                        const textStart = child.sourceCodeLocation.startOffset;
                        flushTo(textStart);
                        const markerRegex = new RegExp(marker.replace(/\$/g, '\\$'), 'g');
                        for (const mark of text.matchAll(markerRegex)) {
                            flushTo(textStart + mark.index);
                            if (dangerous) {
                                throw new Error(`Found binding inside an executable <script> tag in a server-only template. For security reasons, this is not supported, as it could allow an attacker to execute arbitrary JavaScript. If you do need to create a script element with dynamic contents, you can use the unsafeHTML directive to make one, as that way the code is clearly marked as unsafe and needing careful handling. The template with the dangerous binding is:

    ${displayTemplateResult(result)}`);
                            }
                            if (node.tagName === 'style') {
                                throw new Error(`Found binding inside a <style> tag in a server-only template. For security reasons, this is not supported, as it could allow an attacker to exfiltrate information from the page. If you do need to create a style element with dynamic contents, you can use the unsafeHTML directive to make one, as that way the code is clearly marked as unsafe and needing careful handling. The template with the dangerous binding is:

    ${displayTemplateResult(result)}`);
                            }
                            ops.push({
                                type: 'child-part',
                                index: nodeIndex,
                                useCustomElementInstance: false,
                            });
                            skipTo(textStart + mark.index + mark[0].length);
                        }
                        flushTo(textStart + text.length);
                    }
                }
                else if (!hydratable && isTemplateNode(node)) {
                    // Server-only templates look inside of <template> nodes, because
                    // we can afford the complexity and cost, and there's way more
                    // benefit to be gained from it
                    traverse(node.content, this, node);
                }
                nodeIndex++;
            }
        },
        node(node) {
            if (!isElementNode(node)) {
                return;
            }
            if (node.isDefinedCustomElement) {
                ops.push({
                    type: 'custom-element-close',
                });
            }
            else if (node.tagName === 'slot') {
                ops.push({
                    type: 'slot-element-close',
                });
            }
            if (node.parentNode &&
                isElementNode(node.parentNode) &&
                node.parentNode.isDefinedCustomElement) {
                ops.push({
                    type: 'slotted-element-close',
                });
            }
        },
    });
    // Flush remaining static text in the template (e.g. closing tags)
    flushTo();
    templateCache.set(result.strings, ops);
    return ops;
};
export function renderValue(value, renderInfo, hydratable = true) {
    if (renderInfo.customElementHostStack.length === 0) {
        // If the SSR root event target is not at the start of the event target
        // stack, we add it to the beginning of the array.
        // This only applies if we are in the top level document and not in a
        // Shadow DOM.
        const rootEventTarget = renderInfo.eventTargetStack[0];
        if (rootEventTarget !== litServerRoot) {
            renderInfo.eventTargetStack.unshift(litServerRoot);
            if (rootEventTarget) {
                // If an entry in the event target stack was provided and it was not
                // the event root target, we need to connect the given event target
                // to the root event target.
                rootEventTarget.__eventTargetParent =
                    rootEventTarget;
            }
        }
    }
    patchIfDirective(value);
    if (isRenderLightDirective(value)) {
        // If a value was produced with renderLight(), we want to call and render
        // the renderLight() method.
        const instance = renderInfo.customElementInstanceStack.at(-1);
        if (instance !== undefined) {
            const renderLightResult = instance.renderLight(renderInfo);
            if (renderLightResult !== undefined) {
                return renderLightResult;
            }
        }
        value = null;
    }
    else {
        value = resolveDirective(connectedDisconnectable({ type: PartType.CHILD }), value);
    }
    const result = [];
    if (value != null && isTemplateResult(value)) {
        if (hydratable) {
            result.push(`<!--lit-part ${digestForTemplateResult(value)}-->`);
        }
        result.push(() => renderTemplateResult(value, renderInfo));
        if (hydratable) {
            result.push(`<!--/lit-part-->`);
        }
    }
    else {
        if (hydratable) {
            result.push(`<!--lit-part-->`);
        }
        if (value === undefined ||
            value === null ||
            value === nothing ||
            value === noChange) {
            // add nothing
        }
        else if (!isPrimitive(value) && isIterable(value)) {
            // Check that value is not a primitive, since strings are iterable
            for (const item of value) {
                result.push(() => renderValue(item, renderInfo, hydratable));
            }
        }
        else {
            result.push(escapeHtml(typeof value === 'string' ? value : String(value)));
        }
        if (hydratable) {
            result.push(`<!--/lit-part-->`);
        }
    }
    return result;
}
function renderTemplateResult(result, renderInfo) {
    // In order to render a TemplateResult we have to handle and stream out
    // different parts of the result separately:
    //   - Literal sections of the template
    //   - Defined custom element within the literal sections
    //   - Values in the result
    //
    // This means we can't just iterate through the template literals and values,
    // we must parse and traverse the template's HTML. But we don't want to pay
    // the cost of serializing the HTML node-by-node when we already have the
    // template in string form. So we parse with location info turned on and use
    // that to index into the HTML string generated by TemplateResult.getHTML().
    // During the tree walk we will handle expression marker nodes and custom
    // elements. For each we will record the offset of the node, and output the
    // previous span of HTML.
    const hydratable = isHydratable(result);
    const ops = getTemplateOpcodes(result);
    /* The next value in result.values to render */
    let partIndex = 0;
    const renderResult = [];
    for (const op of ops) {
        switch (op.type) {
            case 'text':
                renderResult.push(op.value);
                break;
            case 'child-part': {
                renderResult.push(() => {
                    const value = result.values[partIndex++];
                    let isValueHydratable = hydratable;
                    if (isTemplateResult(value)) {
                        isValueHydratable = isHydratable(value);
                        if (!isValueHydratable && hydratable) {
                            throw new Error(`A server-only template can't be rendered inside an ordinary, hydratable template. A server-only template can only be rendered at the top level, or within other server-only templates. The outer template was:
    ${displayTemplateResult(result)}

And the inner template was:
    ${displayTemplateResult(value)}
              `);
                        }
                    }
                    return renderValue(value, renderInfo, isValueHydratable);
                });
                break;
            }
            case 'attribute-part': {
                renderResult.push(() => {
                    const statics = op.strings;
                    const part = new op.ctor(
                    // Passing only object with tagName for the element is fine since the
                    // directive only gets PartInfo without the node available in the
                    // constructor
                    { tagName: op.tagName }, op.name, statics, connectedDisconnectable(), {});
                    const value = part.strings === undefined
                        ? result.values[partIndex]
                        : result.values;
                    patchAnyDirectives(part, value, partIndex);
                    let committedValue = noChange;
                    // Values for EventParts are never emitted
                    if (!(part.type === PartType.EVENT)) {
                        committedValue = getAttributePartCommittedValue(part, value, partIndex);
                    }
                    let attributeResult = undefined;
                    // We don't emit anything on the server when value is `noChange`
                    if (committedValue !== noChange) {
                        const instance = op.useCustomElementInstance
                            ? renderInfo.customElementInstanceStack.at(-1)
                            : undefined;
                        if (part.type === PartType.PROPERTY) {
                            attributeResult = renderPropertyPart(instance, op, committedValue);
                        }
                        else if (part.type === PartType.BOOLEAN_ATTRIBUTE) {
                            // Boolean attribute binding
                            attributeResult = renderBooleanAttributePart(instance, op, committedValue);
                        }
                        else {
                            attributeResult = renderAttributePart(instance, op, committedValue);
                        }
                    }
                    partIndex += statics.length - 1;
                    return attributeResult;
                });
                break;
            }
            case 'element-part': {
                // We don't emit anything for element parts (since we only support
                // directives for now; since they can't render, we don't even bother
                // running them), but we still need to advance the part index
                renderResult.push(() => {
                    partIndex++;
                });
                break;
            }
            case 'custom-element-open': {
                // Even though we don't emit anything for the custom element open, we
                // need to return a thunk function so that we mutate the renderInfo
                // state at the right time during the render.
                renderResult.push(() => {
                    // Instantiate the element and its renderer
                    const instance = getElementRenderer(renderInfo, op.tagName, op.ctor, op.staticAttributes);
                    if (instance.element) {
                        addElementToEventPath(instance.element, renderInfo);
                        renderInfo.eventTargetStack.push(instance.element);
                    }
                    // Set static attributes to the element renderer
                    for (const [name, value] of op.staticAttributes) {
                        instance.setAttribute(name, value);
                    }
                    renderInfo.customElementInstanceStack.push(instance);
                    renderInfo.customElementRendered?.(op.tagName);
                });
                break;
            }
            case 'custom-element-attributes': {
                renderResult.push(() => {
                    const instance = renderInfo.customElementInstanceStack.at(-1);
                    if (instance === undefined) {
                        throw new Error(`Internal error: ${op.type} outside of custom element context`);
                    }
                    // Perform any connect-time work via the renderer (e.g. reflecting any
                    // properties to attributes, for example)
                    instance?.connectedCallback();
                    // Render out any attributes on the instance (both static and those
                    // that may have been dynamically set by the renderer)
                    let result = instance.renderAttributes();
                    // If deferHydration flag is true or if this element is nested in
                    // another, add the `defer-hydration` attribute, so that it does not
                    // enable before the host element hydrates
                    if (renderInfo.deferHydration ||
                        renderInfo.customElementHostStack.length > 0) {
                        result = result.concat(' defer-hydration');
                    }
                    return result;
                });
                break;
            }
            case 'possible-node-marker': {
                renderResult.push(() => {
                    // Add a node marker if this element had attribute bindings or if it
                    // was nested in another and we rendered the `defer-hydration` attribute
                    // since the hydration node walk will need to stop at this element
                    // to hydrate it
                    if ((op.boundAttributesCount > 0 ||
                        renderInfo.customElementHostStack.length > 0) &&
                        hydratable) {
                        return `<!--lit-node ${op.nodeIndex}-->`;
                    }
                    return undefined;
                });
                break;
            }
            case 'custom-element-shadow': {
                renderResult.push(() => {
                    const instance = renderInfo.customElementInstanceStack.at(-1);
                    if (instance === undefined) {
                        throw new Error(`Internal error: ${op.type} outside of custom element context`);
                    }
                    renderInfo.customElementHostStack.push(instance);
                    const shadowContents = instance.renderShadow(renderInfo);
                    // Only emit a DSR if renderShadow() emitted something (returning
                    // undefined allows effectively no-op rendering the element)
                    const shadowResult = [];
                    if (shadowContents !== undefined) {
                        const { mode = 'open', delegatesFocus } = instance.shadowRootOptions ?? {};
                        // `delegatesFocus` is intentionally allowed to coerce to boolean to
                        // match web platform behavior.
                        const delegatesfocusAttr = delegatesFocus
                            ? ' shadowrootdelegatesfocus'
                            : '';
                        shadowResult.push(`<template shadowroot="${mode}" shadowrootmode="${mode}"${delegatesfocusAttr}>`);
                        shadowResult.push(() => shadowContents);
                        shadowResult.push('</template>');
                        shadowResult.push(() => {
                            renderInfo.customElementHostStack.pop();
                        });
                    }
                    return shadowResult;
                });
                break;
            }
            case 'custom-element-close':
                renderResult.push(() => {
                    renderInfo.customElementInstanceStack.pop();
                    renderInfo.eventTargetStack.pop();
                });
                break;
            case 'slot-element-open': {
                renderResult.push(() => {
                    const host = renderInfo.customElementHostStack.at(-1);
                    if (host === undefined) {
                        throw new Error(`Internal error: ${op.type} outside of custom element context`);
                    }
                    else if (host.element) {
                        // We need to track which element has which slots. This is necessary
                        // to calculate the correct event path by connecting children of the
                        // host element to the corresponding slot.
                        const slots = (host.element.__slots ??=
                            new Map());
                        // op.name is either the slot name or undefined, which represents
                        // the unnamed slot case.
                        const element = new HTMLSlotElement();
                        element.name = op.name ?? '';
                        addElementToEventPath(element, renderInfo);
                        if (!slots.has(op.name)) {
                            slots.set(op.name, element);
                        }
                        renderInfo.eventTargetStack.push(element);
                    }
                });
                break;
            }
            case 'slot-element-close':
                renderResult.push(() => {
                    renderInfo.eventTargetStack.pop();
                });
                break;
            case 'slotted-element-open':
                renderResult.push(() => {
                    renderInfo.slotStack.push(op.name);
                });
                break;
            case 'slotted-element-close':
                renderResult.push(() => {
                    renderInfo.slotStack.pop();
                });
                break;
            default:
                throw new Error('internal error');
        }
    }
    renderResult.push(() => {
        if (partIndex !== result.values.length) {
            throwErrorForPartIndexMismatch(partIndex, result);
        }
    });
    return renderResult;
}
function throwErrorForPartIndexMismatch(partIndex, result) {
    const errorMsg = `
    Unexpected final partIndex: ${partIndex} !== ${result.values.length} while processing the following template:

    ${displayTemplateResult(result)}

    This could be because you're attempting to render an expression in an invalid location. See
    https://lit.dev/docs/templates/expressions/#invalid-locations for more information about invalid expression
    locations.
  `;
    throw new Error(errorMsg);
}
function renderPropertyPart(instance, op, value) {
    value = value === nothing ? undefined : value;
    // Property should be reflected to attribute
    const reflectedName = reflectedAttributeName(op.tagName, op.name);
    if (instance !== undefined) {
        instance.setProperty(op.name, value);
    }
    return reflectedName !== undefined
        ? `${reflectedName}="${escapeHtml(typeof value === 'string' ? value : String(value))}"`
        : undefined;
}
function renderBooleanAttributePart(instance, op, value) {
    if (value && value !== nothing) {
        if (instance !== undefined) {
            instance.setAttribute(op.name, '');
        }
        else {
            return op.name;
        }
    }
    return undefined;
}
function renderAttributePart(instance, op, value) {
    if (value !== nothing) {
        value =
            typeof value === 'string'
                ? value
                : value == null || value === noChange
                    ? ''
                    : String(value);
        if (instance !== undefined) {
            instance.setAttribute(op.name, value);
        }
        else {
            return `${op.name}="${escapeHtml(value)}"`;
        }
    }
    return undefined;
}
/**
 * Returns a debug string suitable for an error message describing a
 * TemplateResult.
 */
function displayTemplateResult(result) {
    if (isCompiledTemplateResult(result)) {
        return result._$litType$.h.join('${...}');
    }
    return result.strings.join('${...}');
}
/**
 * Returns true if the given node is a <script> node that the browser will
 * automatically execute if it's rendered on server-side, outside of a
 * <template> tag.
 */
function isJavaScriptScriptTag(node) {
    function isScriptTag(node) {
        return /script/i.test(node.tagName);
    }
    if (!isScriptTag(node)) {
        return false;
    }
    let safeTypeSeen = false;
    for (const attr of node.attrs) {
        if (attr.name !== 'type') {
            continue;
        }
        switch (attr.value) {
            // see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#textjavascript
            case null:
            case undefined:
            case '':
            case 'module':
            case 'text/javascript':
            case 'application/javascript':
            case 'application/ecmascript':
            case 'application/x-ecmascript':
            case 'application/x-javascript':
            case 'text/ecmascript':
            case 'text/javascript1.0':
            case 'text/javascript1.1':
            case 'text/javascript1.2':
            case 'text/javascript1.3':
            case 'text/javascript1.4':
            case 'text/javascript1.5':
            case 'text/jscript':
            case 'text/livescript':
            case 'text/x-ecmascript':
            case 'text/x-javascript':
                // If we see a dangerous type, we can stop looking
                return true;
            default:
                safeTypeSeen = true;
        }
    }
    // So, remember that attributes can be repeated. If we saw a dangerous type,
    // then we would have returned early. However, if there's no type, then
    // that's dangerous.
    // It's only if all types seen were safe, and we saw at least one type, that
    // we can return false.
    const willExecute = !safeTypeSeen;
    return willExecute;
}
/**
 * To add the element to the event path, we need to set the host of the element
 * (if the element is inside a shadow root) and the event target parent.
 * Our EventTarget polyfill uses these values to calculate the composedPath of a dispatched event.
 *
 * The event target parent is either the unnamed/named slot to which the current element
 * is assigned to, the host of the current element or the event target from the stack
 * (which can be a parent element, a custom root event target or our litServerRoot instance).
 *
 * See packages/labs/ssr-dom-shim/src/index.ts for more details about the EventTarget
 * polyfill and how the event path is calculated.
 */
function addElementToEventPath(element, renderInfo) {
    const eventTarget = renderInfo.eventTargetStack.at(-1);
    const slotName = renderInfo.slotStack.at(-1);
    element.__host = renderInfo.customElementHostStack.at(-1)?.element;
    const assignedSlot = eventTarget?.__slots?.get(slotName);
    if (assignedSlot) {
        element.__eventTargetParent = assignedSlot;
    }
    else if (element.__host === eventTarget) {
        element.__eventTargetParent = element.getRootNode() ?? eventTarget;
    }
    else {
        element.__eventTargetParent = eventTarget;
    }
}
//# sourceMappingURL=render-value.js.map