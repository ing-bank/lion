/* eslint-disable max-classes-per-file */
import { LitElement, ReactiveElement, css, unsafeCSS, isServer } from 'lit';
import { dedupeMixin } from '@open-wc/dedupe-mixin';

import { createPartDirective } from './UIPartDirective.js';
// import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

/**
 * @typedef {import('./UIBaseElementTypes.js').RefCollection} RefCollection
 * @typedef {import('lit').CSSResultOrNative} CSSResultOrNative
 */

/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
export const supportsAdoptingStyleSheets =
  globalThis.ShadowRoot &&
  (globalThis.ShadyCSS === undefined || globalThis.ShadyCSS.nativeShadow) &&
  'adoptedStyleSheets' in Document.prototype &&
  'replace' in CSSStyleSheet.prototype;

/**
 * Applies the given styles to a `shadowRoot`. When Shadow DOM is
 * available but `adoptedStyleSheets` is not, styles are appended to the
 * `shadowRoot` to [mimic spec behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
 * Note, when shimming is used, any styles that are subsequently placed into
 * the shadowRoot should be placed *before* any shimmed adopted styles. This
 * will match spec behavior that gives adopted sheets precedence over styles in
 * shadowRoot.
 *
 * @param {ShadowRoot} renderRoot
 * @param {CSSResultOrNative[]} styles
 */
export function adoptStyles(renderRoot, styles) {
  if (supportsAdoptingStyleSheets && renderRoot.adoptedStyleSheets) {
    renderRoot.adoptedStyleSheets = styles.map(s =>
      s instanceof CSSStyleSheet ? s : s.styleSheet,
    );
  } else if (!isServer) {
    // TODO: fix SSR
    for (const s of styles) {
      const style = document.createElement('style');
      const nonce = globalThis['litNonce'];
      if (nonce !== undefined) {
        style.setAttribute('nonce', nonce);
      }
      style.textContent = s.cssText;
      renderRoot.appendChild(style);
    }
  }
}

// Why a controller instead of a @open-wc or @lit mixin?
// - controllers are TS friendly (mixins aren't)
// - we don't want to force a polyfill for simple use cases of a ui lib (also for perf)
// - we are compatible with lit ssr (right now the mixin fails, coiudl be fixed probably by using globalThis instead of window)
// - more lightweight: no extra dep needed
// - note that we still recommend @open-wc mixin v3 for our consumers
export class ScopedRegistryCtrl {
  host;

  registry;

  /** When polyfill is not loaded, just proceed with one global registry */
  supportsScopedRegistry = false; // Boolean(globalThis.ShadowRoot?.prototype.createElement);

  constructor({ host, scopedElements }) {
    (this.host = host).addController(this);

    const hasScopedElementsConfigured = scopedElements && Object.keys(scopedElements).length;
    if (!hasScopedElementsConfigured) return;

    if (!this.supportsScopedRegistry) {
      const alreadyInRegistry = (existingClass, newClass) => existingClass !== newClass;
      for (const [tagName, klass] of Object.entries(scopedElements)) {
        const existingClass = customElements.get(tagName);
        if (!existingClass) {
          customElements.define(tagName, klass);
        } else if (alreadyInRegistry(existingClass, klass)) {
          throw new Error(
            [
              `Trying to register multiple classes under name "${tagName}".`,
              `Load scoped-custom-element-registry polyfill: https://www.npmjs.com/package/@webcomponents/scoped-custom-element-registry`,
            ].join('\n'),
          );
        }
      }
      return;
    }

    this.registry = new CustomElementRegistry();
    for (const [tagName, klass] of Object.entries(scopedElements)) {
      this.registry.define(tagName, klass);
    }

    const ctor = host.constructor;
    const originalAttachShadow = ctor.prototype.attachShadow;
    // eslint-disable-next-line func-names
    ctor.prototype.attachShadow = function (...args) {
      return originalAttachShadow.call(
        this,
        {
          ...args[0],
          // The polyfill currently expects the registry to be passed as `customElements`
          customElements: this.registry,
          // But the proposal has moved forward, and renamed it to `registry`
          // For backwards compatibility, we pass it as both
          registry: this.registry,
        },
        ...args.slice(1),
      );
    };

    if (!(host instanceof ReactiveElement)) return;
    const originalCreateRenderRoot = ctor.prototype.createRenderRoot;
    // eslint-disable-next-line func-names
    ctor.prototype.createRenderRoot = function (...args) {
      originalCreateRenderRoot.call(this, ...args);
      const { shadowRootOptions, elementStyles } = this.constructor;
      const renderRoot = this.shadowRoot || this.attachShadow(shadowRootOptions);
      this.renderOptions.creationScope = renderRoot;
      adoptStyles(renderRoot, elementStyles);
      this.renderOptions.renderBefore ??= renderRoot.firstChild;
      return renderRoot;
    };
  }
}

/**
 * Css string like '20px' or '20em' will be returned as number value (20)
 * @param {string} cssString
 */
function cssToNum(cssString) {
  return Number(cssString.replace(/[^-\d.]/g, ''));
}

/**
 * This controller allows to switch layouts on different screen sizes.
 * Component authors can easily compose layouts and reuse them in different scenarios
 * For full ssr-support styles will be rendered to container queries/media queries
 */
export class DynamicLayoutCtrl {
  host;
  container;
  resizeObserver;
  dynamicLayouts;
  currentLayout;

  onLayoutChange;

  constructor({ host, dynamicLayouts, onLayoutChange }) {
    (this.host = host).addController(this);

    if (!dynamicLayouts || !Object.keys(dynamicLayouts).length) {
      return;
    }

    this.dynamicLayouts = dynamicLayouts;
    this.onLayoutChange = onLayoutChange;

    // this.setNewLayout({ newWidth: globalThis?.innerWidth || 0 });
    this.host.setAttribute('data-layout-cloak', '');
  }

  // hostUpdate() {
  //   // this.host.setAttribute('data-layout', this.dynamicLayouts[0]);
  // }

  hostConnected() {
    if (!this.dynamicLayouts) return;

    // this.host.setAttribute('data-layout', this.dynamicLayouts[0]);

    // We only are interested in width, so we put resizeObserver on body.
    // this.container =
    //   (this.dynamicLayoutsConfig.container === globalThis
    //     ? document?.body
    //     : this.dynamicLayoutsConfig.container) || this.host;

    this.container = document.body;
    this.resizeObserver = new ResizeObserver(entries => {
      this.setNewLayout({ newWidth: entries[0].contentBoxSize[0].inlineSize });
      this.host.removeAttribute('data-layout-cloak');
    });

    this.resizeObserver?.observe(this.container);
  }

  hostDisconnected() {
    this.resizeObserver?.unobserve(this.container);
  }

  #getLayoutArrayOrdered() {
    return Object.entries(this.dynamicLayouts).sort(
      ([, layoutA], [, layoutB]) => cssToNum(layoutB.breakpoint) - cssToNum(layoutA.breakpoint),
    );
  }

  setNewLayout({ newWidth }) {
    // const newWidth = entries[0].contentBoxSize[0].inlineSize;
    const layoutArrayOrdered = this.#getLayoutArrayOrdered();

    const newLayout = layoutArrayOrdered.find(
      layout => newWidth >= cssToNum(layout[1].breakpoint),
    )?.[0];

    if (newLayout !== this.currentLayout) {
      this.host.setAttribute('data-layout', newLayout);
      this.currentLayout = newLayout;
      this.onLayoutChange?.(this.dynamicLayouts[newLayout]);
    }
  }
}

/**
 * @typedef {import('./UIBaseElementTypes.js').UIBaseElement} _UIBaseElement
 */

/**
 * @template {import('./UIBaseElementTypes.js').Constructor<LitElement>} T
 * @param {T} superclass
 * @return {T & import('./UIBaseElementTypes.js').Constructor<UIBaseElement>}
 */
const UIBaseElementMixinImplementation = superclass =>
  /**
   * @type {UIBaseElement}
   */
  class UIBaseElement extends superclass {
    labels = [];

    static styles = [];

    /** For a11y, we need to be able to add light styles sometimes. We scope them by default to host */
    static lightStyles = [];

    static templates = {};

    static templateContextProcessor;

    /** @overridable */
    templates = this.constructor.templates;

    scopedElements = this.constructor.scopedElements;

    dynamicLayouts = this.constructor.dynamicLayouts;

    templateContextProcessor = this.constructor.templateContextProcessor;

    dynamicLayoutCtrl;

    scopedRegistryCtrl;

    #refCallbacks = {};

    refs = /** @type {RefCollection} */ ({});

    /** @type {WeakMap<UIBaseElement,object>} */
    static contextStore = new WeakMap();

    /** @type {Array<UIBaseElement>} */
    static _instances = [];

    static _partDirective;

    static properties = {
      _rerenderToggle: { type: Boolean, state: true, attribute: false },
    };

    get templateContext() {
      // Note: we don't expose host here, to keep the contract minimal and predictable.
      // All data exposed to the template should be explicitly provided via templateContext.
      return {
        templates: this.templates,
        data: {},
        set: (key, val) => {
          if (key in this.templateContext.data) {
            this[key] = val;
            this.requestUpdate(key);
          }
        },
        registerRef: (name, element, { isPartOfCollection = false } = {}) => {
          if (isPartOfCollection) {
            this.refs[name] = this.refs[name] || [];
            this.refs[name].push(element);
          } else {
            this.refs[name] = element;
          }
          this.#refCallbacks[name]?.forEach(callback => callback(element));
        },
        onRegisterRef: (name, callback) => {
          if (this.refs[name]) {
            callback(this.refs[name]);
          } else {
            this.#refCallbacks[name] = this.#refCallbacks[name] || [];
            this.#refCallbacks[name].push(callback);
          }
        },
        refs: this.refs,
      };
    }

    constructor() {
      super();

      this.dynamicLayoutCtrl = new DynamicLayoutCtrl({
        host: this,
        dynamicLayouts: this.constructor.dynamicLayouts,
        onLayoutChange: () => {
          this._forceRerender();
        },
      });

      this.scopedRegistryCtrl = new ScopedRegistryCtrl({
        host: this,
        scopedElements: this.scopedElements,
      });

      // We need to keep track of all instances, so that we can force a rerender when the design changes
      this.constructor._instances.push(this);
    }

    static _extractDataFromProvider(provider) {
      const stylesFromProvider = [];
      const lightStylesFromProvider = [];

      let templates;
      let scopedElements;
      let dynamicLayouts;

      if (provider.styles) {
        stylesFromProvider.push(...provider.styles(this.styles));
      }

      // TODO: also allow in dynamic layouts, and add @scope({tagName})
      if (provider.lightStyles) {
        lightStylesFromProvider.push(...provider.lightStyles(this.lightStyles));
      }

      const { templateContextProcessor } = provider;

      if (provider.templates) {
        templates = provider.templates(this.templates);
      }

      // Does our template contain other web components?
      // If so, we need to register them in the scoped registry compatible with @open-wc/scoped-elements
      if (provider.scopedElements) {
        scopedElements = provider.scopedElements(this.scopedElements);
      }

      // Do we have a different appearance on different screen sizes? (for instance a main navigation that becomes a side menu on mobile)
      // In this case, we add the styles in a container or media query, so that
      if (provider.dynamicLayouts) {
        dynamicLayouts = provider.dynamicLayouts(this.dynamicLayouts);
        const entries = Object.entries(dynamicLayouts);
        for (let i = 0; i < entries.length; i += 1) {
          const [name, { styles, breakpoint, container, templateContextProcessor }] = entries[i];
          const [nextName, next] = entries[i + 1] || [];
          const queryType = container === globalThis ? 'media' : 'container';

          for (const style of styles || []) {
            stylesFromProvider.push(css`
              @${unsafeCSS(queryType)} (${unsafeCSS(breakpoint)} <= width ${unsafeCSS(
                next?.breakpoint ? `<= ${next?.breakpoint}` : '',
              )}) {
                ${style}
              }
            `);
          }
        }
      }

      return {
        templateContextProcessor,
        lightStylesFromProvider,
        stylesFromProvider,
        scopedElements,
        dynamicLayouts,
        templates,
      };
    }

    static _initInstanceDesign(instance, styles, lightStyles) {
      // Instead of using the inline styles from ssr output, we now use adopted styles (so we remove them now)
      instance.shadowRoot?.querySelectorAll('style').forEach(style => style.remove());
      adoptStyles(instance.shadowRoot, styles);
      if (lightStyles) {
        adoptStyles(instance, lightStyles);
      }
      // TODO: handle ScopedEls changed on the fly...
      // rerender takes care of templates
      instance._forceRerender();
    }

    /**
     * @type {{styles: (currentStyles:CSSResultArray) => CSSResultArray; markup: { templates:(currentTemplates:Record<string,TemplateResult>) => Record<string,TemplateResult>}; scopedElements: () => Record<string, Class>}}
     */
    static provideDesign(provider) {
      const ctor = this;
      const {
        templateContextProcessor,
        lightStylesFromProvider,
        stylesFromProvider,
        scopedElements,
        dynamicLayouts,
        templates,
      } = ctor._extractDataFromProvider(provider);

      ctor.templates = templates || ctor.templates;
      // ctor.scopedElements = scopedElements || ctor.scopedElements;
      Object.defineProperty(ctor, 'scopedElements', {
        // enumerable: false,
        // configurable: false,
        // writable: false,
        value: scopedElements || ctor.scopedElements,
      });

      ctor.templateContextProcessor = templateContextProcessor;
      ctor.dynamicLayouts = dynamicLayouts;

      // ctor.elementStyles = ctor.finalizeStyles([...ctor.styles, ...stylesFromProvider]);

      // // Lit-ssr uses ctor.styles instead of ctor.elementStyles (used on client) for render.
      // // Note that we only update ctor.styles in the server, allowing the client to run provideDesign, having
      // // ctor.styles as a starting point.
      // if (isServer) {
      //   ctor.styles = ctor.elementStyles;
      // }

      // ctor.styles = ctor.elementStyles = ctor.finalizeStyles([...stylesFromProvider]);

      ctor.elementStyles = ctor.finalizeStyles([...stylesFromProvider]);
      Object.defineProperty(ctor, 'styles', { value: ctor.elementStyles });
      // If we call this method after instances have been created, we need to force a rerender for those instances
      for (const instance of Array.from(ctor._instances)) {
        ctor._initInstanceDesign(instance, ctor.elementStyles, lightStylesFromProvider);
      }
    }

    provideDesign(provider) {
      const ctor = this.constructor;
      const {
        templateContextProcessor,
        lightStylesFromProvider,
        stylesFromProvider,
        scopedElements,
        dynamicLayouts,
        templates,
      } = ctor._extractDataFromProvider(provider);
      // 'shadow' on instance level (render method takes care of the rest)
      this.templates = templates || this.templates;
      this.scopedElements = scopedElements || this.scopedElements;
      this.templateContextProcessor = templateContextProcessor;
      this.dynamicLayouts = dynamicLayouts;

      const elementStyles = ctor.finalizeStyles([...ctor.styles, ...stylesFromProvider]);

      ctor._initInstanceDesign(this, elementStyles, lightStylesFromProvider);
    }

    _forceRerender() {
      this._rerenderToggle = !this._rerenderToggle;
    }

    render() {
      const { templates } = this;
      let { templateContext } = this;

      // When layout just changed, it could be that our templateContext is different
      const { currentLayout } = this.dynamicLayoutCtrl;

      if (this.templateContextProcessor) {
        templateContext = this.templateContextProcessor(templateContext);
      }

      if (this.constructor.dynamicLayouts?.[currentLayout]?.templateContextProcessor) {
        templateContext =
          this.dynamicLayouts[currentLayout]?.templateContextProcessor(templateContext);
      }

      // Add an instance of the part directive that has access to the latest
      // updated version of templateContext
      const partDirective = this.constructor._partDirective;
      if (partDirective) {
        templateContext.part = createPartDirective(partDirective, templateContext);
      }
      if (!templates?.root) {
        return new Error('[UIBaseElement] Provide a root render function');
      }

      return templates.root(templateContext);
    }

    #hasSetup = false;

    /**
     * The platform and live have different lifecycle methods related to setting up logic.
     * They run in below order:
     * - `constructor()`: runs on instance creation, before dom connection
     * - `connectedCallback()`: runs right after dom connection, before lit render
     * - `firstUpdated()`: runs after first render
     *
     * For a full overview of lit lifecycle methods, see https://lit.dev/docs/components/lifecycle/
     *
     * It's important that a component that is disconnected from the dom, fully cleans up after itself.
     * When a component is connected again, it should be able to re-setup.
     * Also see:
     * - https://github.com/webcomponents/gold-standard/wiki/Detachment
     * - https://github.com/webcomponents/gold-standard/wiki/Reattachment
     *
     * So, what would be a good candidate for setting up logic?
     * As most setup logic is dom related, it makes sense to run it in `firstUpdated`.
     * This for instance, makes us [better aligned with frameworks like Angular](https://github.com/ing-bank/lion/discussions/1342) as well
     * However, firstUpdated does not run when reconnected.
     *
     * What we need is a callback that runson "connected + render". This is what `onSetup` does.
     *
     * @example
     * ```js
     * class MyComponent extends UIBaseElement {
     *   static properties = {
     *     myProp: { type: String },
     *   };
     *
     *   // In constructor, we set up our initial state
     *   constructor() {
     *    super();
     *    \/** myProp description *\/
     *    this.myProp = 'foo';
     *   }
     *
     *   render() {
     *     return html`<button data-part="my-button">${this.myProp}</button>`;
     *   }
     *
     *   // N.B. make sure event listeners are bound to `this`
     *   #onButtonClick = () => {
     *     this.myProp = 'bar';
     *   };
     *
     *   // In onSetup, we can safely access the dom.
     *   onSetup() {
     *     this.shadowRoot.querySelector('button').addEventListener('click', () => {
     *       this.myProp = 'bar';
     *     });
     *   }
     * }
     * ```
     */
    onSetup() {}

    /**
     * Runs when a component is permanently disconnected from the dom.
     * Where `disconnectedCallback` runs when the component is moved around in the dom,
     * `onTeardown` runs when the component is removed from the dom.
     * See {@link onSetup}
     *
     * @example
     * ```js
     * class MyComponent extends UIBaseElement {
     *   // ...
     *
     *   // N.B. make sure event listeners are bound to `this`
     *   #onWindowBlur = () => {
     *     // close overlay
     *   };
     *
     *   onSetup() {
     *     window.addEventListener('blur', this.#onWindowBlur);
     *   }
     *
     *   // In onTeardown, we are sure we can efficiently free resources
     *   onTeardown() {
     *     window.removeEventListener('blur', this.#onWindowBlur);
     *   }
     * }
     * ```
     */
    onTeardown() {}

    connectedCallback() {
      super.connectedCallback();

      this.updateComplete.then(() => {
        if (this.#hasSetup) return;
        this.onSetup();
        this.#hasSetup = true;
        this.#tempLitSsrHydrationFix();
      });
    }

    /**
     * Temp solution for hydration bug lit-ssr...
     * Lit-ssr sometimes keeps the old dom around: https://github.com/lit/lit/issues/4472
     * @returns {void}
     */
    #tempLitSsrHydrationFix() {
      if (isServer) return;

      window.setTimeout(() => {
        const hasHydrated = this.shadowRoot?.adoptedStyleSheets?.length;
        if (!hasHydrated) return;

        const firstStyle = this.shadowRoot?.querySelector('style');
        const allChildren = Array.from(this.shadowRoot?.childNodes || []);
        const firstStyleIndex = allChildren.indexOf(firstStyle);

        const ssrContentToBeCleanedUp =
          firstStyleIndex !== -1 ? allChildren.slice(firstStyleIndex + 1) : [];
        ssrContentToBeCleanedUp.forEach(el => el.remove());
      });
    }

    async disconnectedCallback() {
      super.disconnectedCallback();

      if (await this.#isPermanentlyDisconnected()) {
        this.onTeardown();
        this.#hasSetup = false;
      }
    }

    /**
     * When we're moving around in dom, disconnectedCallback gets called.
     * Before we decide to teardown, let's wait to see if we were not just moving nodes around.
     * @return {Promise<boolean>}
     */
    async #isPermanentlyDisconnected() {
      await this.updateComplete;
      return !this.isConnected;
    }

    /**
     * As a convention, we expose
     */
    exposedPrivateMembers = {};
  };

export const UIBaseElementMixin = dedupeMixin(UIBaseElementMixinImplementation);

export class UIBaseElement extends UIBaseElementMixin(LitElement) {}

// export function uiBaseRender() {
//   const { templates } = this;
//   let { templateContext } = this;

//   // When layout just changed, it could be that our templateContext is different
//   const { currentLayout } = this.dynamicLayoutCtrl;

//   if (this.templateContextProcessor) {
//     templateContext = this.templateContextProcessor(templateContext);
//   }

//   if (this.constructor.dynamicLayouts?.[currentLayout]?.templateContextProcessor) {
//     templateContext = this.dynamicLayouts[currentLayout]?.templateContextProcessor(templateContext);
//   }

//   // Add an instance of the part directive that has access to the latest
//   // updated version of templateContext
//   const partDirective = this.constructor._partDirective;
//   if (partDirective) {
//     templateContext.part = createPartDirective(partDirective, templateContext);
//   }
//   if (!templates?.root) {
//     return new Error('[UIBaseElement] Provide a root render function');
//   }

//   return templates.root(templateContext);
// }
