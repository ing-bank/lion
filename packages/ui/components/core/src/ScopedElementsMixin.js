/*
 * ING: This file is combination of '@open-wc/scoped-elements/lit-element.js' and '@open-wc/scoped-elements/html-element.js'.
 * It extends and modifies the original classes to make polyfill not mandatory.
 */

import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { adoptStyles } from 'lit';
import { ScopedElementsMixin as BaseScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

/**
 * @typedef {import('lit').CSSResultOrNative} CSSResultOrNative
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {typeof import('lit').LitElement} TypeofLitElement
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<LitElement>} LitElementConstructor

 */

// @ts-ignore
const supportsScopedRegistry = !!ShadowRoot.prototype.createElement;

/**
 * @template {LitElementConstructor} T
 * @param {T} superclass
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

      return Element.prototype.attachShadow.call(this, {
        ...options,
        // The polyfill currently expects the registry to be passed as `customElements`
        customElements: this.registry,
        // But the proposal has moved forward, and renamed it to `registry`
        // For backwards compatibility, we pass it as both
        registry: this.registry,
      });
    }

    createRenderRoot() {
      const { shadowRootOptions, elementStyles } = /** @type {TypeofLitElement} */ (
        this.constructor
      );

      // const shadowRoot = this.attachShadow(shadowRootOptions);
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
