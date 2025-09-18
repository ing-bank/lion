import { LitElement } from 'lit';
import { LayoutCtrl } from './LayoutCtrl.js';

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
    const { templates } = this;
    if (!templates?.main) {
      return new Error('[UIBaseElement] Provide a main render function');
    }

    return templates.main(this.templateContext);
  }
}
