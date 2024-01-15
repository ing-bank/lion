import { html, nothing } from 'lit';
import { UIBaseElement } from '../shared/UIBaseElement.js';
import { UIPartDirective } from '../shared/UIPartDirective.js';
import {
  assertBannerLandmark,
  assertMainLandmark,
  assertContentinfoLandmark,
  assertAnchor,
  assertPresentation,
} from '../shared/element-assertions.js';

export class UIPortalCardPartDirective extends UIPartDirective {
  setup(part, [context, name, localContext]) {
    const ctor = this.constructor;
    switch (name) {
      case 'root':
        ctor._setupRoot(part, { context, localContext });
        break;
      case 'anchor':
        ctor._setupAnchor(part, { context, localContext });
        break;
      case 'body':
        ctor._setupBody(part, { context, localContext });
        break;
      case 'image':
        ctor._setupImage(part, { context, localContext });
        break;
      default:
        throw new Error(`Unknown part ${name}`);
    }
  }

  static _setupRoot({ element }, { context, localContext }) {
    assertPresentation(element);
    element.setAttribute('data-part', 'root');
    context.registerRef('root', element);

    element.setAttribute('data-img-placement', localContext.imagePlacement);
  }

  static _setupAnchor({ element }, { context, localContext }) {
    assertAnchor(element);
    element.setAttribute('data-part', 'anchor');
    context.registerRef('anchor', element);

    const rel = localContext.target === '_blank' ? 'noopener noreferrer' : undefined;
    if (rel) {
      element.setAttribute('rel', rel);
    }
    element.setAttribute('target', localContext.target);
    element.setAttribute('href', localContext.href);
    element.setAttribute('aria-label', localContext.label);
  }

  static _setupBody({ element }, { context }) {
    assertPresentation(element);
    element.setAttribute('data-part', 'body');
    context.registerRef('body', element);
  }

  static _setupImage({ element }, { context, localContext }) {
    // assertPresentation(element);
    element.setAttribute('data-part', 'image');
    context.registerRef('image', element);

    element.setAttribute('style', `background-image: url(${localContext.imageUrl});`);
    element.setAttribute('role', localContext.imageDescription ? 'img' : 'presentation');
    element.setAttribute('aria-label', localContext.label);
  }
}

/**
 * Accessible page layout with relevant page landmarks.
 * See https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/banner.html
 * TODO: put all in directives...
 */
export class UIPortalCard extends UIBaseElement {
  static _partDirective = UIPortalCardPartDirective;

  static tagName = 'ui-portal-card';

  /** @type {any} */
  static properties = {
    href: { type: String },
    target: { type: String },
    anchorLabel: { type: String, attribute: 'anchor-label' },
    imageUrl: { type: String, attribute: 'image-url' },
    imagePlacement: { type: String, attribute: 'image-placement' },
    imageDescription: { type: String, attribute: 'image-description' },
  };

  constructor() {
    super();
    this.href = '';
    if (!this.target) {
      this.target = '_self';
    }
    /**
     * @type {String | undefined}
     */
    this.anchorLabel = undefined;
    this.imagePlacement = 'top';
    /**
     * @type {String | undefined}
     */
    this.imageUrl = undefined;
    /**
     * @type {String | undefined}
     */
    this.imageDescription = undefined;
  }

  getAnchorLabel() {
    if (this.anchorLabel) {
      return this.anchorLabel;
    }
    const headingNode = this.querySelector?.('[slot="heading"]');
    if (headingNode?.textContent) {
      return headingNode.textContent;
    }
    const contentNode = this.querySelector?.('[slot="content"]');
    if (contentNode?.textContent) {
      return contentNode.textContent;
    }
    return '';
  }

  /**
   * Which data are we going to expose to our template?
   */
  get templateContext() {
    const { refs } = this;

    return {
      ...super.templateContext,
      data: {
        href: this.href,
        target: this.target,
        imageUrl: this.imageUrl,
        imagePlacement: this.imagePlacement,
        imageDescription: this.imageDescription,
      },
      fns: {
        getAnchorLabel: this.getAnchorLabel,
      },
    };
  }

  static templates = {
    root(context) {
      const { templates, data, fns, part } = context;

      const shouldPlaceBottom =
        (data.imageUrl && data.imagePlacement === 'bottom') || data.imagePlacement === 'right';

      const shouldPlaceTop =
        (data.imageUrl && data.imagePlacement === 'top') || data.imagePlacement === 'left';

      return html`
        <div
          ${part('root', { imagePlacement: data.imagePlacement })}
          class="card card--img-${data.imagePlacement}"
        >
          ${shouldPlaceTop ? templates.image(context) : nothing}
          <div ${part('body')} class="card__content">
            <slot name="heading"></slot>
            <slot name="content"></slot>
          </div>
          ${shouldPlaceBottom ? templates.image(context) : nothing}
          ${data.href
            ? html`
                <a
                  ${part('anchor', { ...data, label: fns.getAnchorLabel() })}
                  class="card__anchor"
                ></a>
              `
            : ''}
        </div>
      `;
    },
    image(context) {
      const { templates, data, fns, part } = context;

      return html` <div ${part('image', data)} class="card__img-bg"></div> `;
    },
  };
}
