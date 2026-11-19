/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * This module *minimally* implements the DOM interfaces needed for lit-html and
 * LitElement to boot. Since most of the implementation of lit-html and
 * LitElement are not actually used, we mostly just need to defining base
 * classes for extension, etc. We will have a roughly functioning
 * CustomElementRegistry however.
 */
import fetch from 'node-fetch';
import { Document, document, HTMLElement, Element, Event, CustomEvent, EventTarget, CSSStyleSheet, CustomElementRegistry, ShadowRoot, IntersectionObserver, MutationObserver, ResizeObserver, } from '@lit-labs/ssr-dom-shim';
/**
 * Constructs a fresh instance of the "window" vm context to use for evaluating
 * user SSR code. Includes a minimal shim of DOM APIs.
 *
 * @param includeJSBuiltIns Whether certain standard JS context globals like
 *  `console` and `setTimeout` should also be added to the global. Should
 *  generally only be true when adding window to a fresh VM context that
 *  starts with nothing.
 * @param props Additional properties to add to the window global
 */
export const getWindow = ({ includeJSBuiltIns = false, props = {}, }) => {
    const window = {
        EventTarget,
        Event: globalThis.Event ?? Event,
        CustomEvent: globalThis.CustomEvent ?? CustomEvent,
        Element,
        HTMLElement,
        Document,
        document,
        CSSStyleSheet,
        ShadowRoot,
        CustomElementRegistry,
        customElements: new CustomElementRegistry(),
        atob(s) {
            return Buffer.from(s, 'base64').toString('binary');
        },
        btoa(s) {
            return Buffer.from(s, 'binary').toString('base64');
        },
        fetch: (url, init) => 
        // TODO(aomarks) The typings from node-fetch are wrong because they don't
        // allow URL.
        fetch(url, init),
        location: new URL('http://localhost'),
        IntersectionObserver,
        MutationObserver,
        ResizeObserver,
        // No-op any async tasks
        requestAnimationFrame() { },
        // Set below
        window: undefined,
        // User-provided globals, like `require`
        ...props,
    };
    if (includeJSBuiltIns) {
        Object.assign(window, {
            // No-op any async tasks
            setTimeout() { },
            clearTimeout() { },
            // Required for node-fetch
            Buffer,
            URL,
            URLSearchParams,
            console: {
                log(...args) {
                    console.log(...args);
                },
                info(...args) {
                    console.info(...args);
                },
                warn(...args) {
                    console.warn(...args);
                },
                debug(...args) {
                    console.debug(...args);
                },
                error(...args) {
                    console.error(...args);
                },
                assert(bool, msg) {
                    if (!bool) {
                        throw new Error(msg);
                    }
                },
            },
        });
    }
    return window;
};
export const installWindowOnGlobal = (props = {}) => {
    // Avoid installing the DOM shim if one already exists
    if (globalThis.window === undefined) {
        const window = getWindow({ props });
        // Copy initial window globals to node global
        Object.assign(globalThis, window);
    }
};
//# sourceMappingURL=dom-shim.js.map