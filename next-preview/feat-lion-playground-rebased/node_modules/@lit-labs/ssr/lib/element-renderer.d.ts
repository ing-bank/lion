import type { RenderInfo } from './render-value.js';
import type { ThunkedRenderResult } from './render-result.js';
type Interface<T> = {
    [P in keyof T]: T[P];
};
export type ElementRendererConstructor = (new (tagName: string) => Interface<ElementRenderer>) & typeof ElementRenderer;
type AttributesMap = Map<string, string>;
export declare const getElementRenderer: ({ elementRenderers }: RenderInfo, tagName: string, ceClass?: typeof HTMLElement | undefined, attributes?: AttributesMap) => ElementRenderer;
/**
 * @deprecated Use ShadowRootInit instead
 */
export type ShadowRootOptions = ShadowRootInit;
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
export declare abstract class ElementRenderer {
    element?: HTMLElement;
    tagName: string;
    /**
     * Should be implemented to return true when the given custom element class
     * and/or tagName should be handled by this renderer.
     *
     * @param ceClass - Custom Element class
     * @param tagName - Tag name of custom element instance
     * @param attributes - Map of attribute key/value pairs
     * @returns
     */
    static matchesClass(_ceClass: typeof HTMLElement, _tagName: string, _attributes: AttributesMap): boolean;
    /**
     * Called when a custom element is instantiated during a server render.
     *
     * An ElementRenderer can actually instantiate the custom element class, or
     * it could emulate the element in some other way.
     */
    constructor(tagName: string);
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
    connectedCallback(): void;
    /**
     * Called from `setAttribute()` to emulate the browser's
     * `attributeChangedCallback` lifecycle hook.
     *
     * If this renderer is creating actual element instances, it may forward
     * the call to the element's `attributeChangedCallback()`.
     */
    attributeChangedCallback(_name: string, _old: string | null, _value: string | null): void;
    /**
     * Handles setting a property on the element.
     *
     * The default implementation sets the property on the renderer's element
     * instance.
     *
     * @param name Name of the property
     * @param value Value of the property
     */
    setProperty(name: string, value: unknown): void;
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
    setAttribute(name: string, value: string): void;
    /**
     * The shadow root options to write to the declarative shadow DOM <template>,
     * if one is created with `renderShadow()`.
     */
    get shadowRootOptions(): ShadowRootInit;
    /**
     * Render the element's shadow root children.
     *
     * If `renderShadow()` returns undefined, no declarative shadow root is
     * emitted.
     */
    renderShadow(_renderInfo: RenderInfo): ThunkedRenderResult | undefined;
    /**
     * Render the element's light DOM children.
     */
    renderLight(_renderInfo: RenderInfo): ThunkedRenderResult | undefined;
    /**
     * Render the element's attributes.
     *
     * The default implementation serializes all attributes on the element
     * instance.
     */
    renderAttributes(): ThunkedRenderResult;
}
/**
 * An ElementRenderer used as a fallback in the case where a custom element is
 * either unregistered or has no other matching renderer.
 */
export declare class FallbackRenderer extends ElementRenderer {
    private readonly _attributes;
    setAttribute(name: string, value: string): void;
    renderAttributes(): ThunkedRenderResult;
}
export {};
//# sourceMappingURL=element-renderer.d.ts.map