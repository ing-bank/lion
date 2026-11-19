/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { ElementRenderer } from './element-renderer.js';
import { LitElement } from 'lit';
import type { RenderInfo } from './render-value.js';
import type { ThunkedRenderResult } from './render-result.js';
export type Constructor<T> = {
    new (): T;
};
/**
 * The render options for a specific element in LitElementRenderer.
 */
export interface LitElementRendererRenderOptions {
    /**
     * Whether to call connectedCallback during SSR.
     * @default false
     */
    connectedCallback?: boolean;
    /**
     * Whether to disable SSR for the element.
     * @default false
     */
    disableSsr?: boolean;
}
/**
 * ElementRenderer implementation for LitElements
 */
export declare class LitElementRenderer extends ElementRenderer {
    element: LitElement;
    private _disabled;
    static matchesClass(ctor: typeof HTMLElement): boolean;
    /**
     * Configure options for specific elements.
     * Callbacks are called in order for each element being rendered and can be
     * used to configure options such as whether to call connectedCallback for
     * a given element or to disable SSR.
     *
     * @example
     *
     * ```ts
     * import {LitElementRenderer} from '@lit-labs/ssr';
     *
     * // Disable SSR for `my-element`.
     * LitElementRenderer.renderOptions.push(
     *   (element) => element.localName === 'my-element' ? {disableSsr: true} : undefined
     * );
     *
     * // Call connectedCallback for `my-element` by returning an options object with `connectedCallback` set to true.
     * LitElementRenderer.renderOptions.push(
     *   (element) => element.localName === 'my-element' ? {connectedCallback: true} : undefined
     * );
     * ```
     */
    static readonly renderOptions: ((element: LitElement) => LitElementRendererRenderOptions | undefined)[];
    constructor(tagName: string);
    get shadowRootOptions(): ShadowRootInit;
    connectedCallback(): void;
    attributeChangedCallback(name: string, _old: string | null, value: string | null): void;
    renderShadow(renderInfo: RenderInfo): ThunkedRenderResult | undefined;
    renderLight(renderInfo: RenderInfo): ThunkedRenderResult;
}
//# sourceMappingURL=lit-element-renderer.d.ts.map