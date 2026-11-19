/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { Readable } from 'stream';
/**
 * A Readable that reads from a RenderResult.
 */
export class RenderResultReadable extends Readable {
    constructor(result) {
        super();
        /**
         * `_waiting` flag is used to prevent multiple concurrent reads.
         *
         * RenderResultReadable handles async RenderResult's, and must await them.
         * While awaiting a result, it's possible for `_read` to be called again.
         * Without this flag, a new read is initiated and the order of the data in the
         * stream becomes inconsistent.
         */
        this._waiting = false;
        this._iterators = [result[Symbol.iterator]()];
    }
    async _read(_size) {
        if (this._waiting) {
            return;
        }
        // This implementation reads values from the RenderResult and pushes them
        // into the base class's Readable implementation. It tries to be as
        // efficient as possible, which means:
        //   1. Avoid microtasks and Promise allocations. Read and write values
        //      synchronously when possible.
        //   2. Write as many values to the Readable per call to _read() as
        //      possible.
        //
        // To do this correctly we must adhere to the Readable contract for
        // _read(), which states that:
        //
        // - The size parameter can be safely ignored
        // - _read() should call `this.push()` as many times as it can until
        //   `this.push()` returns false, which means the underlying Readable
        //   does not want any more values.
        // - `this.push(null)` ends the stream
        //
        // This means that we cannot use for/of loops to iterate on the render
        // result, because we must be able to return in the middle of the loop
        // and resume on the next call to _read().
        // Get the current iterator, only if we don't already have one from the
        // previous call to _read()
        this._currentIterator ??= this._iterators.pop();
        while (this._currentIterator !== undefined) {
            const next = this._currentIterator.next();
            if (next.done === true) {
                // Restore the outer iterator
                this._currentIterator = this._iterators.pop();
                continue;
            }
            let value = next.value;
            // This inner loop lets us repeatedly resolve thunks and Promises
            // until we get to a string, array, or iterator.
            while (value !== undefined) {
                // Trampoline in case of nested thunks
                while (typeof value === 'function') {
                    value = value();
                }
                if (value === undefined) {
                    // Just continue to the next value from the iterator
                    break;
                }
                if (typeof value === 'string') {
                    if (this.push(value) === false) {
                        // Backpressure: The consumer doesn't want any more values. Return
                        // for now and we may get a new call to _read()
                        return;
                    }
                    break;
                }
                if (Array.isArray(value) ||
                    typeof value[Symbol.iterator] ===
                        'function') {
                    // If it's an array or iterable, iterate over it by pushing the
                    // current iterator on the stack and making the new one current. The
                    // next loop of the outer while() will call next() on it.
                    this._iterators.push(this._currentIterator);
                    this._currentIterator = value[Symbol.iterator]();
                    break;
                }
                else {
                    // Must be a Promise. Await it can continue the inner loop to handle
                    // whatever it resolves to.
                    if (typeof value.then !== 'function') {
                        throw new Error(`Unexpected value in RenderResult: ${value} (${typeof value})`);
                    }
                    this._waiting = true;
                    value = await value;
                    this._waiting = false;
                }
            }
        }
        // Pushing `null` ends the stream
        this.push(null);
    }
}
//# sourceMappingURL=render-result-readable.js.map