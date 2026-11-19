/// <reference lib="dom" />
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { escapeHtml } from './util/escape-html.js';
export const getElementRenderer = ({ elementRenderers }, tagName, ceClass = customElements.get(tagName), attributes = new Map()) => {
    if (ceClass === undefined) {
        console.warn(`Custom element ${tagName} was not registered.`);
        return new FallbackRenderer(tagName);
    }
    // TODO(kschaaf): Should we implement a caching scheme, e.g. keyed off of
    // ceClass's base class to prevent O(n) lookups for every element (probably
    // not a concern for the small number of element renderers we'd expect)? Doing
    // so would preclude having cross-cutting renderers to e.g. no-op render all
    // custom elements with a `client-only` attribute, so punting for now.
    for (const renderer of elementRenderers) {
        if (renderer.matchesClass(ceClass, tagName, attributes)) {
            return new renderer(tagName);
        }
    }
    return new FallbackRenderer(tagName);
};
/**
 * An object that renders elements of a certain type.
 *
 * The `render*()` methods return a ThunkedRenderResult, which is an array of
 * strings and/or thunks that return strings or Promises for strings. This allows
 * the renderer to emit content in chunks, and to perform async work (e.g.
 * fetching data) as part of rendering. Renderers can assume that their
 * thunks will be invoked in order, and that any Promises will be awaited before
 * subsequent thunks are invoked.
 *
 * If a renderer does not need to emit content in chunks or perform async work,
 * it can simply return an array of strings.
 */
export class ElementRenderer {
    /**
     * Should be implemented to return true when the given custom element class
     * and/or tagName should be handled by this renderer.
     *
     * @param ceClass - Custom Element class
     * @param tagName - Tag name of custom element instance
     * @param attributes - Map of attribute key/value pairs
     * @returns
     */
    static matchesClass(_ceClass, _tagName, _attributes) {
        return false;
    }
    /**
     * Called when a custom element is instantiated during a server render.
     *
     * An ElementRenderer can actually instantiate the custom element class, or
     * it could emulate the element in some other way.
     */
    constructor(tagName) {
        this.tagName = tagName;
    }
    /**
     * Called when a custom element is "attached" to the server DOM.
     *
     * Because we don't presume a full DOM emulation, this isn't the same as
     * being connected in a real browser. There may not be an owner document,
     * parentNode, etc., depending on the DOM emulation.
     *
     * If this renderer is creating actual element instances, it may forward
     * the call to the element's `connectedCallback()`.
     *
     * The default impementation is a no-op.
     */
    connectedCallback() {
        // do nothing
    }
    /**
     * Called from `setAttribute()` to emulate the browser's
     * `attributeChangedCallback` lifecycle hook.
     *
     * If this renderer is creating actual element instances, it may forward
     * the call to the element's `attributeChangedCallback()`.
     */
    attributeChangedCallback(_name, _old, _value) {
        // do nothing
    }
    /**
     * Handles setting a property on the element.
     *
     * The default implementation sets the property on the renderer's element
     * instance.
     *
     * @param name Name of the property
     * @param value Value of the property
     */
    setProperty(name, value) {
        if (this.element !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[name] = value;
        }
    }
    /**
     * Handles setting an attribute on an element.
     *
     * Default implementation calls `setAttribute` on the renderer's element
     * instance, and calls the abstract `attributeChangedCallback` on the
     * renderer.
     *
     * @param name Name of the attribute
     * @param value Value of the attribute
     */
    setAttribute(name, value) {
        // Browser turns all HTML attributes to lowercase.
        name = name.toLowerCase();
        if (this.element !== undefined) {
            const old = this.element.getAttribute(name);
            this.element.setAttribute(name, value);
            this.attributeChangedCallback(name, old, value);
        }
    }
    /**
     * The shadow root options to write to the declarative shadow DOM <template>,
     * if one is created with `renderShadow()`.
     */
    get shadowRootOptions() {
        return { mode: 'open' };
    }
    /**
     * Render the element's shadow root children.
     *
     * If `renderShadow()` returns undefined, no declarative shadow root is
     * emitted.
     */
    renderShadow(_renderInfo) {
        return undefined;
    }
    /**
     * Render the element's light DOM children.
     */
    renderLight(_renderInfo) {
        return undefined;
    }
    /**
     * Render the element's attributes.
     *
     * The default implementation serializes all attributes on the element
     * instance.
     */
    renderAttributes() {
        const result = [];
        if (this.element !== undefined) {
            const { attributes } = this.element;
            for (let i = 0, name, value; i < attributes.length && ({ name, value } = attributes[i]); i++) {
                if (value === '' || value === undefined || value === null) {
                    result.push(` ${name}`);
                }
                else {
                    result.push(` ${name}="${escapeHtml(value)}"`);
                }
            }
        }
        return result;
    }
}
/**
 * An ElementRenderer used as a fallback in the case where a custom element is
 * either unregistered or has no other matching renderer.
 */
export class FallbackRenderer extends ElementRenderer {
    constructor() {
        super(...arguments);
        this._attributes = {};
    }
    setAttribute(name, value) {
        // Browser turns all HTML attributes to lowercase.
        this._attributes[name.toLowerCase()] = value;
    }
    renderAttributes() {
        const result = [];
        for (const [name, value] of Object.entries(this._attributes)) {
            if (value === '' || value === undefined || value === null) {
                result.push(` ${name}`);
            }
            else {
                result.push(` ${name}="${escapeHtml(value)}"`);
            }
        }
        return result;
    }
}
//# sourceMappingURL=element-renderer.js.map