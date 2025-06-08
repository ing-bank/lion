import { LitElement, ReactiveElement } from 'lit';

// Why a controller instead of a @open-wc or @lit mixin?
// - controllers are TS friendly (mixins aren't)
// - we don't want to force a polyfill for simple use cases of a ui lib (also for perf)
// - more lightweight: no extra dep needed
// - note that we still recommend @open-wc mixin v3 for our consumers
// export class ScopedRegistryCtrl {
//   host;
//   registry;
//   /** When polyfill is not loaded, just proceed with one global registry */
//   supportsScopedRegistry = Boolean(globalThis.ShadowRoot?.prototype.createElement);
//
//   constructor(host, scopedElements) {
//     (this.host = host).addController(this);
//
//     if (!scopedElements || !Object.keys(scopedElements).length) {
//       return;
//     }
//
//     if (!this.supportsScopedRegistry) {
//       const alreadyInRegistry = (existingClass, newClass) => existingClass !== newClass;
//       for (const [tagName, klass] of Object.entries(scopedElements)) {
//         const existingClass = customElements.get(tagName);
//         if (!existingClass) {
//           customElements.define(tagName, klass);
//         } else if (alreadyInRegistry(existingClass, klass)) {
//           throw new Error(
//             [
//               `Trying to register multiple classes under name "${tagName}".`,
//               `Load scoped-custom-element-registry polyfill: https://www.npmjs.com/package/@webcomponents/scoped-custom-element-registry`,
//             ].join('\n'),
//           );
//         }
//       }
//       return;
//     }
//
//     this.registry = new CustomElementRegistry();
//     for (const [tagName, klass] of Object.entries(scopedElements)) {
//       console.log(tagName);
//       this.registry.define(tagName, klass);
//     }
//
//     const originalAttachShadow = host.prototype.attachShadow;
//     host.prototype.attachShadow = function (options) {
//       return originalAttachShadow({
//         ...options,
//         // The polyfill currently expects the registry to be passed as `customElements`
//         customElements: this.registry,
//         // But the proposal has moved forward, and renamed it to `registry`
//         // For backwards compatibility, we pass it as both
//         registry: this.registry,
//       });
//     };
//
//     if (!(host instanceof ReactiveElement)) return;
//     host.prototype.createRenderRoot = function () {
//       originalCreateRenderRoot();
//       const { shadowRootOptions, elementStyles } = this.constructor;
//       const shadowRoot = this.attachShadow(shadowRootOptions);
//       this.renderOptions.creationScope = shadowRoot;
//       adoptStyles(shadowRoot, elementStyles);
//       this.renderOptions.renderBefore ??= shadowRoot.firstChild;
//       return shadowRoot;
//     };
//   }
// }

/**
 * This controller allows to switch layouts on different screen sizes.
 * Component authors can easily compose layouts and reuse them in different scenarios
 * For full ssr-support styles will be rendered to container queries.
 */
export class LayoutCtrl {
  host;
  container;
  resizeObserver;
  layouts;
  layoutsContainer;
  currentLayout;

  constructor(host, { layouts, layoutsContainer }) {
    (this.host = host).addController(this);

    if (!layouts || !Object.keys(layouts).length) {
      return;
    }

    this.layouts = layouts;
    this.layoutsContainer = layoutsContainer;
  }

  hostConnected() {
    // We only are interested in width, so we put resizeObserver on body.
    this.resizeObserver = new ResizeObserver(entries => {
      const newWidth = entries[0].contentBoxSize[0].inlineSize;
      const layoutArrayOrdered = Object.entries(this.layouts).sort((a, b) => b[1] - a[1]);
      const newLayout = layoutArrayOrdered.find(([, minWidth]) => newWidth >= minWidth)?.[0];

      // TODO: make nicer/more flexible
      if (newLayout !== this.currentLayout) {
        this.host.setAttribute('data-layout', newLayout);
        this.currentLayout = newLayout;
      }
    });
    this.container =
      (this.layoutsContainer === globalThis ? document?.body : this.layoutsContainer) || this.host;
    this.resizeObserver?.observe(this.container);
  }

  hostDisconnected() {
    this.resizeObserver?.unobserve(this.container);
  }
}

/**
 * @typedef {import('./UIBaseElementTypes').UIBaseElementInterface} UIBaseElementInterface
 */

/**
 * @type {UIBaseElementInterface}
 */
export class UIBaseElement extends LitElement {
  static styles = [];
  static templates = {};
  /** @private */
  static hasStylesAndMarkupProvided = false;
  /** @overridable */
  templates = this.constructor.templates;
  scopedElements = this.constructor.scopedElements;
  layouts = this.constructor.layouts;
  layoutsContainer = this.constructor.layoutsContainer;

  get templateContext() {
    return {
      templates: this.templates,
    };
  }

  constructor() {
    super();

    // if (!this.constructor.hasStylesAndMarkupProvided) {
    //   throw new Error(
    //     `Make sure to initialize "${this.constructor.name}.provideStylesAndTemplates(...)"`,
    //   );
    // }

    this.layoutCtrl = new LayoutCtrl(this, {
      layouts: this.layouts,
      layoutsContainer: this.layoutsContainer,
    });
    // this.scopedRegistryCtrl = new ScopedRegistryCtrl(this, this.scopedElements);
  }

  /**
   * @type {{styles: (currentStyles:CSSResultArray) => CSSResultArray; markup: { templates:(currentTemplates:Record<string,TemplateResult>) => Record<string,TemplateResult>}; scopedElements: () => Record<string, Class>}}
   */
  static provideStylesAndMarkup(provider) {
    this.styles = provider.styles(this.styles);
    this.elementStyles = this.finalizeStyles(this.styles);

    if (provider.markup?.templates) {
      this.templates = provider.markup?.templates(this.templates);
    }
    if (provider.markup?.scopedElements) {
      this.scopedElements = provider.markup?.scopedElements(this.scopedElements);
    }

    if (provider.layouts) {
      this.layouts = provider.layouts(this.layouts);
    }
    if (provider.layoutsContainer) {
      this.layoutsContainer = provider.layoutsContainer(this.layoutsContainer);
    }
    this.constructor.hasStylesAndMarkupProvided = true;
  }

  render() {
    const templates = this.templates;
    if (!templates?.main) {
      return new Error('[UIBaseElement] Provide a main render function');
    }

    return templates.main(this.templateContext);
  }
}
