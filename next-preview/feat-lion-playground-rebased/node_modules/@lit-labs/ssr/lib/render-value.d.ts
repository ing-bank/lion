import { ElementRenderer, ElementRendererConstructor } from './element-renderer.js';
import type { ThunkedRenderResult } from './render-result.js';
declare module 'parse5/dist/tree-adapters/default.js' {
    interface Element {
        isDefinedCustomElement?: boolean;
    }
}
export type RenderInfo = {
    /**
     * Element renderers to use
     */
    elementRenderers: ElementRendererConstructor[];
    /**
     * Stack of open custom elements (in light dom or shadow dom)
     */
    customElementInstanceStack: Array<ElementRenderer | undefined>;
    /**
     * Stack of open host custom elements (n-1 will be n's host)
     */
    customElementHostStack: Array<ElementRenderer | undefined>;
    /**
     * Stack of open event target instances.
     */
    eventTargetStack: Array<EventTarget | undefined>;
    /**
     * Stack of current slot context.
     */
    slotStack: Array<string | undefined>;
    /**
     * An optional callback to notify when a custom element has been rendered.
     *
     * This allows servers to know what specific tags were rendered for a given
     * template, even in the case of conditional templates.
     */
    customElementRendered?: (tagName: string) => void;
    /**
     * Flag to defer hydration of top level custom element. Defaults to false.
     */
    deferHydration: boolean;
};
declare global {
    interface Array<T> {
        flat(depth: number): Array<T>;
    }
}
export declare function renderValue(value: unknown, renderInfo: RenderInfo, hydratable?: boolean): ThunkedRenderResult;
//# sourceMappingURL=render-value.d.ts.map