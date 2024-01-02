import { LitElement, ReactiveElement, css, unsafeCSS, adoptStyles } from 'lit';
import { createPartDirective } from './UIPartDirective.js';
// import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

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

    if (!scopedElements || !Object.keys(scopedElements).length) {
      return;
    }

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
    });

    this.resizeObserver?.observe(this.container);
  }

  hostDisconnected() {
    this.resizeObserver?.unobserve(this.container);
  }

  setNewLayout({ newWidth }) {
    // const newWidth = entries[0].contentBoxSize[0].inlineSize;
    const layoutArrayOrdered = Object.entries(this.dynamicLayouts).sort(
      ([, layoutA], [, layoutB]) => cssToNum(layoutB.breakpoint) - cssToNum(layoutA.breakpoint),
    );

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
 * @typedef {import('./UIBaseElementTypes').UIBaseElementInterface} UIBaseElementInterface
 */

/**
 * @type {UIBaseElementInterface}
 */
export class UIBaseElement extends LitElement {
  static styles = [];
  static templates = {};
  /** @overridable */
  templates = this.constructor.templates;
  scopedElements = this.constructor.scopedElements;
  dynamicLayouts = this.constructor.dynamicLayouts;
  dynamicLayoutCtrl;
  scopedRegistryCtrl;
  refs = {};
  /** @type {WeakMap<UIBaseElement,object>} */
  static contextStore = new WeakMap();

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
  }

  /**
   * @type {{styles: (currentStyles:CSSResultArray) => CSSResultArray; markup: { templates:(currentTemplates:Record<string,TemplateResult>) => Record<string,TemplateResult>}; scopedElements: () => Record<string, Class>}}
   */
  static provideDesign(provider) {
    console.log('styles', provider.styles);

    if (provider.styles) {
      this.styles = provider.styles(this.styles);
    }

    if (provider.templates) {
      this.templates = provider.templates(this.templates);
    }

    // Does our template contain other web components?
    // If so, we need to register them in the scoped registry compatible with @open-wc/scoped-elements
    if (provider.scopedElements) {
      this.scopedElements = provider.scopedElements(this.scopedElements);
    }

    // Do we have a different appearance on different screen sizes? (for instance a main navigation that becomes a side menu on mobile)
    // In this case, we add the styles in a container or media query, so that
    if (provider.dynamicLayouts) {
      this.dynamicLayouts = provider.dynamicLayouts(this.dynamicLayouts);
      const entries = Object.entries(this.dynamicLayouts);
      for (let i = 0; i < entries.length; i += 1) {
        const [name, { styles, breakpoint, container, templateContext }] = entries[i];
        const [nextName, next] = entries[i + 1] || [];
        const queryType = container === globalThis ? 'media' : 'container';

        this.styles.push(css`
          @${unsafeCSS(queryType)} (${unsafeCSS(breakpoint)} <= width ${unsafeCSS(
            next?.breakpoint ? `<= ${next?.breakpoint}` : '',
          )}) {
            ${styles}
          }
        `);
      }
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }

  _forceRerender() {
    this._rerenderToggle = !this._rerenderToggle;
  }

  render() {
    const { templates } = this;
    let { templateContext } = this;

    // When layout just changed, it could be that our templateContext is different
    const { currentLayout } = this.dynamicLayoutCtrl;

    if (this.constructor.dynamicLayouts?.[currentLayout]?.templateContext) {
      templateContext = this.dynamicLayouts[currentLayout]?.templateContext(templateContext);
    }

    // Add an instance of the part directive that has access to the latest
    // updated version of templateContext
    const partDirective = this.constructor._partDirective;
    if (partDirective) {
      templateContext.part = createPartDirective(partDirective, templateContext);
    }
    if (!templates?.main) {
      return new Error('[UIBaseElement] Provide a main render function');
    }

    return templates.main(templateContext);
  }
}
