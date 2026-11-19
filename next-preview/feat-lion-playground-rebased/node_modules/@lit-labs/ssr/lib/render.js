/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { isTemplateResult } from 'lit-html/directive-helpers.js';
import { LitElementRenderer } from './lit-element-renderer.js';
import { renderValue } from './render-value.js';
import { isHydratable } from './server-template.js';
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
export function render(value, renderInfo) {
    return new RenderResultIterator(renderThunked(value, renderInfo));
}
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
export function renderThunked(value, renderInfo) {
    const defaultRenderInfo = {
        elementRenderers: [LitElementRenderer],
        customElementInstanceStack: [],
        customElementHostStack: [],
        eventTargetStack: [],
        slotStack: [],
        deferHydration: false,
    };
    renderInfo = { ...defaultRenderInfo, ...renderInfo };
    let hydratable = true;
    if (isTemplateResult(value)) {
        hydratable = isHydratable(value);
    }
    return renderValue(value, renderInfo, hydratable);
}
/**
 * Wraps a ThunkedRenderResult to implement a RenderResult.
 */
export class RenderResultIterator {
    constructor(result) {
        this._waiting = false;
        this._iterators = [result[Symbol.iterator]()];
    }
    next() {
        if (this._waiting) {
            throw new Error('Cannot call next() while waiting for a Promise to resolve');
        }
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const iterator = this._iterators.at(-1);
            if (iterator === undefined) {
                return { done: true, value: undefined };
            }
            // Get the next value from the current iterator
            const result = iterator.next();
            if (result.done) {
                this._iterators.pop();
                continue;
            }
            let value = result.value;
            // If the value is a string, return the result as-is:
            if (typeof value === 'string') {
                return result;
            }
            // Otherwise, it's a thunk. Trampoline to fully evaluate thunks:
            while (typeof value === 'function') {
                value = value();
            }
            // If the value is undefined, return the next value:
            if (value === undefined) {
                continue;
            }
            // If the value is a string, return a new iterator result:
            if (typeof value === 'string') {
                return { done: false, value };
            }
            // If the value is an array, push a new iterator for it onto the stack, and
            // recurse to start consuming it:
            if (Array.isArray(value)) {
                this._iterators.push(value[Symbol.iterator]());
                continue;
            }
            // The value is a Promise. Convert to a Promise<RenderResult>:
            this._waiting = true;
            return {
                done: false,
                value: value.then((r) => {
                    this._waiting = false;
                    if (typeof r === 'string') {
                        return r;
                    }
                    // Instead of returning a new iterator, flatten the array into our
                    // iterator stack:
                    this._iterators.push(r[Symbol.iterator]());
                    return this;
                }),
            };
        }
    }
    // Make the iterator itself iterable
    [Symbol.iterator]() {
        return this;
    }
}
//# sourceMappingURL=render.js.map