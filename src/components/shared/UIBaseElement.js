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

  constructor(host, scopedElements) {
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
      // console.log('this.renderOptions', this.renderOptions);
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
 * For full ssr-support styles will be rendered to container queries.
 */
export class LayoutCtrl {
  host;
  container;
  resizeObserver;
  layouts;
  currentLayout;
  onLayoutChange;

  constructor(host, layouts, { onLayoutChange }) {
    (this.host = host).addController(this);

    if (!layouts || !Object.keys(layouts).length) {
      return;
    }

    this.layouts = layouts;
    this.onLayoutChange = onLayoutChange;
  }

  // hostUpdate() {
  //   // this.host.setAttribute('data-layout', this.layouts[0]);
  // }

  hostConnected() {
    // this.host.setAttribute('data-layout', this.layouts[0]);

    // We only are interested in width, so we put resizeObserver on body.
    // this.container =
    //   (this.layoutsConfig.container === globalThis
    //     ? document?.body
    //     : this.layoutsConfig.container) || this.host;

    this.container = document.body;
    this.resizeObserver = new ResizeObserver(entries => {
      const newWidth = entries[0].contentBoxSize[0].inlineSize;
      const layoutArrayOrdered = Object.entries(this.layouts).sort(
        (layoutA, layoutB) => cssToNum(layoutB[1].breakpoint) - cssToNum(layoutA[1].breakpoint),
      );
      const newLayout = layoutArrayOrdered.find(
        layout => newWidth >= cssToNum(layout[1].breakpoint),
      )?.[0];
      if (newLayout !== this.currentLayout) {
        this.host.setAttribute('data-layout', newLayout);
        this.currentLayout = newLayout;
        this.onLayoutChange?.(this.layouts[newLayout]);
      }
    });

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
  layoutCtrl;
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

    this.layoutCtrl = new LayoutCtrl(this, this.layouts, {
      onLayoutChange: () => {
        this._rerenderToggle = !this._rerenderToggle;
      },
    });
    this.scopedRegistryCtrl = new ScopedRegistryCtrl(this, this.scopedElements);
  }

  /**
   * @type {{styles: (currentStyles:CSSResultArray) => CSSResultArray; markup: { templates:(currentTemplates:Record<string,TemplateResult>) => Record<string,TemplateResult>}; scopedElements: () => Record<string, Class>}}
   */
  static provideStylesAndMarkup(provider) {
    this.styles = provider.styles(this.styles);

    if (provider.markup?.templates) {
      this.templates = provider.markup?.templates(this.templates);
    }

    if (provider.markup?.scopedElements) {
      this.scopedElements = provider.markup?.scopedElements(this.scopedElements);
    }

    if (provider.layouts) {
      this.layouts = provider.layouts(this.layouts);
      const entries = Object.entries(this.layouts);
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

  render() {
    const { templates } = this;
    let { templateContext } = this;

    // When layout just changed, it could be that our templateContext is different
    const { currentLayout } = this.layoutCtrl;
    if (this.layouts[currentLayout]?.templateContext) {
      templateContext = this.layouts[currentLayout]?.templateContext(templateContext);
    }

    // Add an instance of the part directive that has access to the latest
    // updated version of templateContext
    templateContext.part = createPartDirective(this.constructor._partDirective, templateContext);
    if (!templates?.main) {
      return new Error('[UIBaseElement] Provide a main render function');
    }

    return templates.main(templateContext);
  }
}
