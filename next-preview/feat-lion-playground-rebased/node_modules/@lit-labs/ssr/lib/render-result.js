/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Joins a RenderResult or ThunkedRenderResult into a string.
 */
export const collectResult = async (result) => {
    let str = '';
    for (const chunk of result) {
        let value = chunk;
        // This inner loop lets us repeatedly resolve thunks and Promises
        // until we get to a string, array, or iterator.
        while (value !== undefined) {
            while (typeof value === 'function') {
                value = value();
            }
            if (value === undefined) {
                break;
            }
            if (typeof value === 'string') {
                str += value;
                break;
            }
            if (Array.isArray(value) ||
                typeof value[Symbol.iterator] === 'function') {
                str += await collectResult(value);
                break;
            }
            // Must be a Promise
            if (typeof value.then !== 'function') {
                throw new Error(`Unexpected value in RenderResult: ${value} (${typeof value})`);
            }
            value = await value;
        }
    }
    return str;
};
/**
 * Joins a RenderResult or ThunkedRenderResult into a string synchronously.
 *
 * This function throws if a RenderResult contains a Promise.
 */
export const collectResultSync = (result) => {
    let str = '';
    for (const chunk of result) {
        let value = chunk;
        while (typeof value === 'function') {
            value = value();
        }
        if (typeof value === 'string') {
            str += value;
        }
        else if (Array.isArray(value)) {
            str += collectResultSync(value);
        }
        else if (value !== undefined) {
            throw new Error('Promises not supported in collectResultSync. ' +
                'Please use collectResult.');
        }
    }
    return str;
};
//# sourceMappingURL=render-result.js.map