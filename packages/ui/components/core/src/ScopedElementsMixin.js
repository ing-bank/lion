import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { adoptStyles, isServer } from 'lit';
import { ScopedElementsMixin as OpenWcLitScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

/**
 * @typedef {import('../../form-core/types/validate/ValidateMixinTypes.js').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<ScopedElementsHost>} ScopedElementsHostConstructor
 * @typedef {import('@open-wc/scoped-elements/lit-element.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsHostV2Constructor} ScopedElementsHostV2Constructor
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<LitElement>} LitElementConstructor
 * @typedef {import('lit').CSSResultOrNative} CSSResultOrNative
 * @typedef {typeof import('lit').LitElement} TypeofLitElement
 * @typedef {import('lit').LitElement} LitElement
 */

export function supportsScopedRegistry() {
  return Boolean(
    // @ts-expect-error
    globalThis.ShadowRoot?.prototype.createElement && globalThis.ShadowRoot?.prototype.importNode,
  );
}

/**
 * This file is a combination of '@open-wc/scoped-elements@v3/lit-element.js' and '@open-wc/scoped-elements@v3/html-element.js'.
 * To make the polyfill an opt-in, some code from '@open-wc/scoped-elements@v2' is added as well.
 * This can be a great help for ssr scenarios, allowing elements to be consumed without needing knowledge about internal
 * consumption.
 * (N.B. at this point in time, this is limited to the scenario where there's one version of lion on the page).
 *
 * ## Considerations
 * In its current state, the [scoped-custom-element-registry](https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry) draft spec has uncertainties:
 * - the spec is not yet final; it's not clear how long it will be dependent on a polyfill
 * - the polyfill conflicts with new browser functionality (form-associated custom elements in Safari, ShadowRoot.createElement in Chrome Canary, etc.).
 * - the spsc is not compatible with SSR and it remains unclear if it will be in the future
 *
 * Also see: https://github.com/webcomponents/polyfills/issues?q=scoped-custom-element-registry
 *
 * In previous considerations (last year), we betted on the spec to evolve quickly and the polyfill to be stable.
 * Till this day, little progress has been made. In the meantime. @lit-labs/ssr (incompatible with the spec) is released as well.
 *
 * This file aims to achieve two things:
 * = being up to date with the latest version of @open-wc/scoped-elements (v3)
 * - make the impact of this change for lion as minimal as possible
 *
 * In order to achieve the latter, we keep the ability to opt out of the polyfill.
 * This can be beneficial for performance, bundle size, ease of use and SSR capabilities.
 *
 * We will keep a close eye on developments in spec and polyfill, and will re-evaluate the scoped-elements approach when the time is right.
 *
 * @template {LitElementConstructor} T
 * @param {T} superclass
 * @return {T & ScopedElementsHostConstructor & ScopedElementsHostV2Constructor}
 */
const ScopedElementsMixinImplementation = superclass =>
  /** @type {ScopedElementsHost} */
  class ScopedElementsHost extends OpenWcLitScopedElementsMixin(superclass) {
    constructor() {
      super();

      if (isServer) {
        // We are on the server: this means we can't support scoped registries...
        // So we must treat it like the "no-polyfill scenario", that registers scoped
        // elements used for internal composition on the global registry.
        // On the client that would happen in connectedCallback, so we do it here...
        // N.B. keep in mind that this does not work when we have multiple element (versions)
        // with the same name. (like multiple versions of lion extension layers).
        // If we want to support this, we must re-introduce the shim-behavior of ScopedElementsMixin v1
        // to make this work with ssr as well.
        // @ts-expect-error
        this.registry = customElements;
        // @ts-expect-error
        for (const [name, klass] of Object.entries(this.constructor.scopedElements || {})) {
          this.defineScopedElement(name, klass);
        }
      }
    }

    createScopedElement(/** @type {string} */ tagName) {
      const root = supportsScopedRegistry() ? this.shadowRoot : document;
      // @ts-expect-error polyfill to support createElement on shadowRoot is loaded
      return root.createElement(tagName);
    }

    /**
     * Defines a scoped element.
     *
     * @param {string} tagName
     * @param {typeof HTMLElement} classToBeRegistered
     */
    defineScopedElement(tagName, classToBeRegistered) {
      const registeredClass = this.registry.get(tagName);
      const isNewClassWithSameName = registeredClass && registeredClass !== classToBeRegistered;
      if (!supportsScopedRegistry() && isNewClassWithSameName) {
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
        return this.registry.define(tagName, classToBeRegistered);
      }
      return this.registry.get(tagName);
    }

    /**
     * @param {ShadowRootInit} options
     * @returns {ShadowRoot}
     */
    attachShadow(options) {
      // @ts-expect-error
      const { scopedElements } = /** @type {typeof ScopedElementsHost} */ (this.constructor);

      const shouldCreateRegistry =
        !this.registry ||
        // @ts-expect-error
        (this.registry === this.constructor.__registry &&
          !Object.prototype.hasOwnProperty.call(this.constructor, '__registry'));

      /**
       * Create a new registry if:
       * - the registry is not defined
       * - this class doesn't have its own registry *AND* has no shared registry
       * This is important specifically for superclasses/inheritance
       */
      if (shouldCreateRegistry) {
        this.registry = supportsScopedRegistry() ? new CustomElementRegistry() : customElements;
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

      const createdRoot = this.attachShadow(shadowRootOptions);
      if (supportsScopedRegistry()) {
        // @ts-expect-error
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
