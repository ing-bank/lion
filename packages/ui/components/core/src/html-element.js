/*
 * ING: This file is taken from @open-wc/scoped-elements@v3 and patched to make polyfill not mandatory.
 * All the changes are taken from @open-wc/scoped-elements@v3
 */

import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { ScopedElementsMixin as BaseScopedElementsMixin } from '@open-wc/scoped-elements/html-element.js';

/**
 * @typedef {import('./types.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsMap} ScopedElementsMap
 */

// @ts-ignore
const supportsScopedRegistry = !!ShadowRoot.prototype.createElement;

/**
 * @template {import('./types.js').Constructor<HTMLElement>} T
 * @param {T} superclass
 * @return {T & import('./types.js').Constructor<ScopedElementsHost>}
 */
const ScopedElementsMixinImplementation = superclass =>
  /** @type {ScopedElementsHost} */
  class ScopedElementsHost extends BaseScopedElementsMixin(superclass) {
    createScopedElement(tagName) {
      const root = supportsScopedRegistry ? this.shadowRoot : document;
      // @ts-ignore polyfill to support createElement on shadowRoot is loaded
      return root.createElement(tagName);
    }

    /**
     * Defines a scoped element.
     *
     * @param {string} tagName
     * @param {typeof HTMLElement} klass
     */
    defineScopedElement(tagName, klass) {
      const registeredClass = this.registry.get(tagName);
      if (registeredClass && supportsScopedRegistry === false && registeredClass !== klass) {
        // eslint-disable-next-line no-console
        console.error(
          [
            `You are trying to re-register the "${tagName}" custom element with a different class via ScopedElementsMixin.`,
            'This is only possible with a CustomElementRegistry.',
            'Your browser does not support this feature so you will need to load a polyfill for it.',
            'Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.',
            'e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>" as your first script tag.',
            'For more details you can visit https://open-wc.org/docs/development/scoped-elements/',
          ].join('\n'),
        );
      }
      if (!registeredClass) {
        return this.registry.define(tagName, klass);
      }
      return this.registry.get(tagName);
    }

    /**
     * @param {ShadowRootInit} options
     * @returns {ShadowRoot}
     */
    attachShadow(options) {
      const { scopedElements } = /** @type {typeof ScopedElementsHost} */ (this.constructor);

      const shouldCreateRegistry =
        !this.registry ||
        // @ts-ignore
        (this.registry === this.constructor.__registry &&
          !Object.prototype.hasOwnProperty.call(this.constructor, '__registry'));

      /**
       * Create a new registry if:
       * - the registry is not defined
       * - this class doesn't have its own registry *AND* has no shared registry
       * This is important specifically for superclasses/inheritance
       */
      if (shouldCreateRegistry) {
        this.registry = supportsScopedRegistry ? new CustomElementRegistry() : customElements;
        for (const [tagName, klass] of Object.entries(scopedElements ?? {})) {
          this.defineScopedElement(tagName, klass);
        }
      }

      return super.attachShadow({
        ...options,
        // The polyfill currently expects the registry to be passed as `customElements`
        customElements: this.registry,
        // But the proposal has moved forward, and renamed it to `registry`
        // For backwards compatibility, we pass it as both
        registry: this.registry,
      });
    }
  };

export const ScopedElementsMixin = dedupeMixin(ScopedElementsMixinImplementation);
