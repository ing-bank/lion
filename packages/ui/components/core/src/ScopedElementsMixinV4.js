import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { adoptStyles, isServer } from 'lit';

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

/**
 * The version of this mixin implementation. `@open-wc/scoped-elements` v3 exposed the same marker
 * through `ScopedElementsMixin.scopedElementsVersion` (and registered it on
 * `window.scopedElementsVersions`), and Lion's exported mixin inherited both, so consumers may read
 * either. The mechanism is kept; the value advances with the implementation, which is what a version
 * marker is for: this is the v4 candidate, and it is the one that talks to both contracts.
 */
const version = '4.0.0';
const versions = /** @type {string[]} */ (
  /** @type {any} */ (globalThis).scopedElementsVersions ||
    /** @type {any} */ (globalThis.scopedElementsVersions = [])
);
if (!versions.includes(version)) {
  versions.push(version);
}

/**
 * The next version of the scoped elements mixin: this implementation is the candidate for
 * `@open-wc/scoped-elements` v4 (it no longer extends that package at runtime, and it talks
 * to both versions of the scoped registry proposal). Lion uses this internally, and
 * `ScopedElementsMixin` — the name everything else, including extension layers, imports —
 * re-exports it, so both names resolve to the very same deduped mixin.
 */

/**
 * A `Document`-like creation scope that resolves custom elements from a scoped
 * registry, as needed by lit-html <= 3.x, which only knows how to ask a scope for
 * `importNode`.
 *
 * @param {CustomElementRegistry | null} registry
 */
function scopedCreationScope(registry) {
  return {
    /** @param {string} tagName */
    createElement(tagName) {
      return document.createElement(tagName, { customElementRegistry: registry });
    },
    /**
     * lit-html calls this as `importNode(node, true)`; the DOM API signature is
     * `importNode(node, options)` (the boolean and the dictionary are mutually
     * exclusive).
     *
     * @param {Node} node
     * @param {boolean} [deep]
     */
    importNode(node, deep = true) {
      return document.importNode(
        node,
        /** @type {any} */ (
          deep
            ? { customElementRegistry: registry }
            : { selfOnly: true, customElementRegistry: registry }
        ),
      );
    },
  };
}

/**
 * The `attachShadow` option that hands the registry over, in the spelling of the
 * version of the proposal that the environment implements.
 *
 * Deliberately version specific: a browser with native support for the spec 1.x
 * option *validates* it, and a registry created by the 0.x polyfill is not a
 * native `CustomElementRegistry`, so sending both spellings makes it throw
 * `Failed to convert value to 'CustomElementRegistry'`.
 *
 * @param {CustomElementRegistry} registry
 * @returns {object}
 */
function scopedRegistryInit(registry) {
  // eslint-disable-next-line no-use-before-define
  if (supportsScopedRegistryV1()) {
    // Spec 1.x, https://github.com/whatwg/html/pull/12000.
    return { customElementRegistry: registry };
  }
  // eslint-disable-next-line no-use-before-define
  if (supportsScopedRegistryV0()) {
    return {
      // Spec 0.x (and the polyfill that is on npm today) expects the spelling
      // `customElements`; the redesigned polyfill also accepts `registry` as an alias
      // (and, for compatibility, sets both on the shadow root itself).
      customElements: registry,
      registry,
    };
  }
  return {};
}

/**
 * Version 0 of the proposal: the shadow root *is* the scope. Creation methods live
 * on the `ShadowRoot` itself (`shadowRoot.createElement`, `shadowRoot.importNode`)
 * and the registry is handed over with the `customElements` option of
 * `attachShadow`. Implemented by `@webcomponents/scoped-custom-element-registry@0.0.x`
 * (the version that is still published on npm today).
 */
export function supportsScopedRegistryV0() {
  return Boolean(
    // @ts-expect-error property is provided by the polyfill
    globalThis.ShadowRoot?.prototype.createElement &&
      // @ts-expect-error property is provided by the polyfill
      globalThis.ShadowRoot?.prototype.importNode,
  );
}

/**
 * Version 1 of the proposal (https://github.com/whatwg/html/pull/12000): the registry
 * is a first class object. It is read back from `customElementRegistry` on elements,
 * documents and shadow roots, and passed as the `customElementRegistry` option of
 * `attachShadow`, `document.createElement`, `document.createElementNS` and
 * `document.importNode`. Implemented natively (Chromium 133+, elsewhere behind a flag)
 * and by the redesigned polyfill (webcomponents/polyfills#668).
 *
 * Note that the 0.x polyfill takes precedence: it replaces `window.customElements` and
 * `window.CustomElementRegistry` with its own classes, while it leaves the native 1.x
 * accessors in place. So a browser that has native support *and* the old polyfill is
 * still a version 0 environment, and its registries cannot be handed to the native
 * `customElementRegistry` option (that throws a `TypeError`).
 */
export function supportsScopedRegistryV1() {
  if (supportsScopedRegistryV0()) {
    return false;
  }
  const proto = globalThis.Element?.prototype;
  return Boolean(
    proto &&
      typeof Object.getOwnPropertyDescriptor(proto, 'customElementRegistry')?.get === 'function',
  );
}

/**
 * Whether the current environment supports scoped custom element registries,
 * whichever version of the proposal it implements.
 */
export function supportsScopedRegistry() {
  return supportsScopedRegistryV0() || supportsScopedRegistryV1();
}

/**
 * This file is our own implementation of the scoped elements mixin. It is compatible
 * with both versions of the 'scoped custom element registries' proposal that exist in
 * the wild, so a consumer can move to version 1 of the spec/polyfill in their own time
 * while we (and they) keep working on version 0:
 *
 * - version 0 (what basically everybody runs today): the old
 *   `@open-wc/scoped-elements` and `@webcomponents/scoped-custom-element-registry`
 *   contract, where creation happens through the shadow root and the registry is
 *   passed as `customElements`;
 * - version 1 (webcomponents/polyfills#668, and native browser support): the registry
 *   is created with `new CustomElementRegistry()` and passed as the
 *   `customElementRegistry` option of the document level creation APIs.
 *
 * The version in use is detected at runtime; both are exercised by the tests.
 *
 * ## Considerations
 * In its current state, the [scoped-custom-element-registry](https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry) draft spec has uncertainties:
 * - the spec is not yet final; it's not clear how long it will be dependent on a polyfill
 * - the polyfill conflicts with new browser functionality (form-associated custom elements in Safari, ShadowRoot.createElement in Chrome Canary, etc.).
 * - the spec is not compatible with SSR and it remains unclear if it will be in the future
 *
 * Also see: https://github.com/webcomponents/polyfills/issues?q=scoped-custom-element-registry
 *
 * In previous considerations, we betted on the spec to evolve quickly and the polyfill to be stable.
 * Till this day, little progress has been made. In the meantime @lit-labs/ssr (incompatible with the spec) is released as well.
 *
 * This file aims to achieve two things:
 * - being compatible with both versions of the proposal, so a consumer can load either
 *   the old or the new polyfill (or run on a browser with native support) without
 *   changing a single line of application code;
 * - make the impact of this change for lion as minimal as possible, by keeping the
 *   ability to opt out of the polyfill entirely. This can be beneficial for performance,
 *   bundle size, ease of use and SSR capabilities.
 *
 * We will keep a close eye on developments in spec and polyfill, and will re-evaluate
 * the scoped-elements approach when the time is right.
 *
 * @template {LitElementConstructor} T
 * @param {T} superclass
 * @return {T & ScopedElementsHostConstructor & ScopedElementsHostV2Constructor}
 */
const ScopedElementsMixinV4Implementation = superclass =>
  /** @type {ScopedElementsHost} */
  class ScopedElementsHost extends superclass {
    /**
     * Obtains the scoped elements definitions map if specified.
     *
     * @type {ScopedElementsMap=}
     */
    static scopedElements;

    /**
     * The version of this mixin implementation, as `@open-wc/scoped-elements` v3 exposed it.
     *
     * @returns {string}
     */
    static get scopedElementsVersion() {
      return version;
    }

    /** @type {CustomElementRegistry=} */
    static __registry;

    /**
     * Obtains the CustomElementRegistry associated to the ShadowRoot.
     *
     * @returns {CustomElementRegistry=}
     */
    get registry() {
      return /** @type {typeof ScopedElementsHost} */ (this.constructor).__registry;
    }

    /**
     * Set the CustomElementRegistry associated to the ShadowRoot.
     *
     * @param {CustomElementRegistry} registry
     */
    set registry(registry) {
      /** @type {typeof ScopedElementsHost} */ (this.constructor).__registry = registry;
    }

    /**
     * A mixin class that extends a type parameter must forward its arguments like this
     * (TS2545), even though we have nothing to add here.
     *
     * @param {...any} args
     */
    constructor(...args) {
      super(...args);

      if (isServer) {
        // We are on the server: this means we can't support scoped registries...
        // So we must treat it like the "no-polyfill scenario", that registers scoped
        // elements used for internal composition on the global registry.
        // On the client that would happen in connectedCallback, so we do it here...
        // N.B. keep in mind that this does not work when we have multiple element (versions)
        // with the same name. (like multiple versions of lion extension layers).
        // If we want to support this, we must re-introduce the shim-behavior of ScopedElementsMixin v1
        // to make this work with ssr as well.
        this.registry = customElements;
        const ctor = /** @type {typeof ScopedElementsHost} */ (this.constructor);
        for (const [name, klass] of Object.entries(ctor.scopedElements || {})) {
          this.defineScopedElement(name, klass);
        }
      }
    }

    createScopedElement(/** @type {string} */ tagName) {
      const { registry } = /** @type {{ registry: CustomElementRegistry }} */ (this);
      if (supportsScopedRegistryV1()) {
        // Spec 1.x: defining the element on the registry is enough, the element is
        // resolved against the registry we pass along explicitly.
        return document.createElement(tagName, { customElementRegistry: registry });
      }
      if (supportsScopedRegistryV0()) {
        // Spec 0.x: creation is scoped through the shadow root, which then needs to exist.
        // @ts-expect-error createElement is provided by the polyfill
        return /** @type {ShadowRoot} */ (this.shadowRoot).createElement(tagName);
      }
      return document.createElement(tagName);
    }

    /**
     * Defines a scoped element.
     *
     * @param {string} tagName
     * @param {typeof HTMLElement} classToBeRegistered
     */
    defineScopedElement(tagName, classToBeRegistered) {
      const { registry } = /** @type {{ registry: CustomElementRegistry }} */ (this);
      const registeredClass = registry.get(tagName);
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
        return registry.define(tagName, classToBeRegistered);
      }
      return registry.get(tagName);
    }

    /**
     * @param {ShadowRootInit} options
     * @returns {ShadowRoot}
     */
    attachShadow(options) {
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
        ...scopedRegistryInit(
          /** @type {CustomElementRegistry} */ (/** @type {unknown} */ (this.registry)),
        ),
      });
    }

    createRenderRoot() {
      const { shadowRootOptions, elementStyles } = /** @type {TypeofLitElement} */ (
        this.constructor
      );

      const createdRoot = this.attachShadow(shadowRootOptions);
      if (supportsScopedRegistryV1()) {
        // Spec 1.x has no `createElement`/`importNode` on the shadow root anymore, so the
        // creation scope lit-html clones the template into becomes an explicit
        // document + registry pair.
        this.renderOptions.creationScope = /** @type {Document} */ (
          /** @type {unknown} */ (scopedCreationScope(this.registry ?? null))
        );
      } else if (supportsScopedRegistryV0()) {
        // The spec 0.x shadow root is a creation scope in its own right.
        this.renderOptions.creationScope = /** @type {any} */ (createdRoot);
      }

      if (createdRoot instanceof ShadowRoot) {
        adoptStyles(createdRoot, elementStyles);
        this.renderOptions.renderBefore = this.renderOptions.renderBefore || createdRoot.firstChild;
      }

      return createdRoot;
    }
  };

export const ScopedElementsMixinV4 = dedupeMixin(ScopedElementsMixinV4Implementation);
