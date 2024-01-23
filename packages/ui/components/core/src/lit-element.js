/*
 * ING: This file is taken from @open-wc/scoped-elements@v3 and patched to make polyfill not mandatory.
 * All the changes are taken from @open-wc/scoped-elements@v3
 */ 

import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { adoptStyles } from 'lit';
import { ScopedElementsMixin as BaseScopedElementsMixin } from './html-element.js';

/**
 * @typedef {import('./types.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('lit').CSSResultOrNative} CSSResultOrNative
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {typeof import('lit').LitElement} TypeofLitElement
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<LitElement>} LitElementConstructor
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<ScopedElementsHost>} ScopedElementsHostConstructor
 */

// @ts-ignore
const supportsScopedRegistry = !!ShadowRoot.prototype.createElement;

/**
 * @template {LitElementConstructor} T
 * @param {T} superclass
 * @return {T & ScopedElementsHostConstructor}
 */
const ScopedElementsMixinImplementation = superclass =>
  /** @type {ScopedElementsHost} */
  class ScopedElementsHost extends BaseScopedElementsMixin(superclass) {
    createRenderRoot() {
      const { shadowRootOptions, elementStyles } = /** @type {TypeofLitElement} */ (
        this.constructor
      );      

      //const shadowRoot = this.attachShadow(shadowRootOptions);
      const createdRoot = this.attachShadow(shadowRootOptions);
      if (supportsScopedRegistry) {
        // @ts-ignore
        this.renderOptions.creationScope = createdRoot;
      }

      if (createdRoot instanceof ShadowRoot) {
        adoptStyles(createdRoot, elementStyles);
        this.renderOptions.renderBefore = this.renderOptions.renderBefore || createdRoot.firstChild;
      }

      return createdRoot;
    }
  };

export const ScopedElementsMixin = dedupeMixin(ScopedElementsMixinImplementation);
