/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import type { ThunkedRenderResult, RenderResult } from './render-result.js';
import type { RenderInfo } from './render-value.js';
export type { RenderResult } from './render-result.js';
export type { RenderInfo } from './render-value.js';
/**
 * Renders a lit-html renderable, usually a template result, to an iterable.
 *
 * When consuming the result, Promises *must* be awaited before retrieving
 * subsequent values. If Promises are not awaited, or not awaited in the correct
 * order, the output will be incorrect.
 *
 * @param value Value to render
 * @param renderInfo Optional render context object that should be passed to any
 *   reentrant calls to `render`, e.g. from a `renderShadow` callback on an
 *   ElementRenderer.
 */
export declare function render(value: unknown, renderInfo?: Partial<RenderInfo>): RenderResult;
/**
 * Renders a lit-html template (or any renderable lit-html value) to a thunk
 * array. Any custom elements encountered will be rendered if a matching
 * ElementRenderer is found.
 *
 * This method is suitable for streaming the contents of the element.
 *
 * When consuming the result, thunks *must* be called in order to obtain their
 * values. If thunks are not called, or not called in the correct order, the
 * output will be incorrect.
 *
 * @param value Value to render
 * @param renderInfo Optional render context object that should be passed to any
 *   reentrant calls to `render`, e.g. from a `renderShadow` callback on an
 *   ElementRenderer.
 */
export declare function renderThunked(value: unknown, renderInfo?: Partial<RenderInfo>): ThunkedRenderResult;
/**
 * Wraps a ThunkedRenderResult to implement a RenderResult.
 */
export declare class RenderResultIterator implements IterableIterator<string | Promise<RenderResult>> {
    /**
     * A stack of open iterators.
     *
     * As the ThunkedRenderResult thunks are called, they may yield new arrays of
     * strings and/or thunks. We push the iterators for these arrays onto the
     * stack and consume them depth-first.
     */
    private _iterators;
    private _waiting;
    constructor(result: ThunkedRenderResult);
    next(): IteratorResult<string | Promise<RenderResult>, unknown>;
    [Symbol.iterator](): IterableIterator<string | Promise<RenderResult>>;
}
//# sourceMappingURL=render.d.ts.map