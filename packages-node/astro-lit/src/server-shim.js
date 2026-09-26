/**
 * @license
 * Copyright 2026 ING Bank N.V.
 * SPDX-License-Identifier: MIT
 *
 * Server-side DOM shim for the Astro + Lit integration.
 *
 * Astro runs server rendering in a Node environment that either has no DOM
 * globals at all, or has partial shims. Lit SSR needs `customElements` and
 * `HTMLElement` to behave like the browser shims in `@lit-labs/ssr-dom-shim`.
 */
import {
  customElements as litCustomElements,
  HTMLElement as LitHTMLElement,
} from '@lit-labs/ssr-dom-shim';

// Something at build time injects `document.currentScript = undefined` instead
// of `null`. Sass fails on that because it expects `=== null`.
if (globalThis.document) {
  document.currentScript = null;
}

if (globalThis.HTMLElement) {
  // Astro's Element shim does nothing when `.setAttribute` is called and
  // subsequently `.getAttribute` is called, which makes Lit not serialize
  // attributes during SSR.
  globalThis.HTMLElement = LitHTMLElement;
}

// Astro has its own DOM shim; the important difference is that the Lit DOM shim
// reads `HTMLElement.observedAttributes`, which triggers
// `ReactiveElement.finalize()`.
globalThis.customElements = litCustomElements;

const litDefine = customElements.define;

// Patch `customElements.define` to remember the tag name on the class itself,
// so that a custom element class can be turned into a declarative-shadow-DOM
// string on the server (there is no other way to get a tag name from a class).
// Only a problem for `client:only`, where the browser can append a class
// instance to the DOM directly.
customElements.define = function define(tagName, ctor) {
  /* eslint-disable-next-line no-param-reassign */
  ctor[Symbol.for('tagName')] = tagName;
  return litDefine.call(this, tagName, ctor);
};

export {};
