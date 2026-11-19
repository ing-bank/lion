/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { Readable } from 'stream';
import { RenderResult } from './render-result.js';
import { ThunkedRenderResult } from './render-result.js';
/**
 * A Readable that reads from a RenderResult.
 */
export declare class RenderResultReadable extends Readable {
    /**
     * A stack of open iterators.
     *
     * We need to keep this as instance state because we can pause and resume
     * reading values at any time and can't guarantee to run iterators to
     * completion in any one loop.
     */
    private _iterators;
    private _currentIterator?;
    /**
     * `_waiting` flag is used to prevent multiple concurrent reads.
     *
     * RenderResultReadable handles async RenderResult's, and must await them.
     * While awaiting a result, it's possible for `_read` to be called again.
     * Without this flag, a new read is initiated and the order of the data in the
     * stream becomes inconsistent.
     */
    private _waiting;
    constructor(result: RenderResult | ThunkedRenderResult);
    _read(_size: number): Promise<void>;
}
//# sourceMappingURL=render-result-readable.d.ts.map