/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
const MutationObserverShim = class MutationObserver {
    constructor(_callback) { }
    disconnect() { }
    observe(_target, _options) { }
    takeRecords() {
        return [];
    }
};
const MutationObserverShimWithRealType = MutationObserverShim;
export { MutationObserverShimWithRealType as MutationObserver };
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 */
const ResizeObserverShim = class ResizeObserver {
    constructor(_callback) { }
    disconnect() { }
    observe(_target, _options) { }
    unobserve(_target) { }
};
const ResizeObserverShimWithRealType = ResizeObserverShim;
export { ResizeObserverShimWithRealType as ResizeObserver };
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 */
const IntersectionObserverShim = class IntersectionObserver {
    constructor(_callback, __options) {
        this.__options = __options;
    }
    get root() {
        return this.__options?.root ?? null;
    }
    get rootMargin() {
        return this.__options?.rootMargin ?? '0px 0px 0px 0px';
    }
    get thresholds() {
        return Array.isArray(this.__options?.threshold)
            ? this.__options.threshold
            : [this.__options?.threshold ?? 0];
    }
    disconnect() { }
    observe(_target) { }
    takeRecords() {
        return [];
    }
    unobserve(_target) { }
};
const IntersectionObserverShimWithRealType = IntersectionObserverShim;
export { IntersectionObserverShimWithRealType as IntersectionObserver };
//# sourceMappingURL=observers.js.map