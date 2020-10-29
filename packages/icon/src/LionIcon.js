import { css, html, LitElement, nothing, render, TemplateResult } from '@lion/core';
import { icons } from './icons.js';

function unwrapSvg(wrappedSvgObject) {
  const svgObject =
    wrappedSvgObject && wrappedSvgObject.default ? wrappedSvgObject.default : wrappedSvgObject;
  return typeof svgObject === 'function' ? svgObject(html) : svgObject;
}

function validateSvg(svg) {
  if (!(svg === nothing || svg instanceof TemplateResult)) {
    throw new Error(
      'icon accepts only lit-html templates or functions like "tag => tag`<svg>...</svg>`"',
    );
  }
}

/**
 * Custom element for rendering SVG icons
 */
export class LionIcon extends LitElement {
  static get properties() {
    return {
      ...super.properties,
      /**
       * @desc When icons are not loaded as part of an iconset defined on iconManager,
       * it's possible to directly load an svg.
       * @type {TemplateResult|function}
       */
      svg: {
        type: Object,
      },
      /**
       * @desc The iconId allows to access icons that are registered to the IconManager
       * For instance, "lion:space:alienSpaceship"
       * @type {string}
       */
      ariaLabel: {
        type: String,
        attribute: 'aria-label',
        reflect: true,
      },
      /**
       * @desc The iconId allows to access icons that are registered to the IconManager
       * For instance, "lion:space:alienSpaceship"
       * @type {string}
       */
      iconId: {
        type: String,
        attribute: 'icon-id',
      },
      /**
       * @private
       */
      role: {
        type: String,
        attribute: 'role',
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          width: 1em;
          height: 1em;
        }

        :host([hidden]) {
          display: none;
        }

        :host:first-child {
          margin-left: 0;
        }

        :host:last-child {
          margin-right: 0;
        }

        ::slotted(svg) {
          display: block;
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.role = 'img';
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('ariaLabel')) {
      this._onLabelChanged(changedProperties);
    }

    if (changedProperties.has('iconId')) {
      this._onIconIdChanged(changedProperties.get('iconId'));
    }
  }

  render() {
    return html`<slot></slot>`;
  }

  connectedCallback() {
    // ensures that aria-hidden is set if there is no aria-label attribute
    this._onLabelChanged();
    super.connectedCallback();
  }

  /**
   * On IE11, svgs without focusable false appear in the tab order
   * so make sure to have <svg focusable="false"> in svg files
   */
  set svg(svg) {
    this.__svg = svg;
    if (svg === undefined || svg === null) {
      this._renderSvg(nothing);
    } else {
      this._renderSvg(unwrapSvg(svg));
    }
  }

  get svg() {
    return this.__svg;
  }

  _onLabelChanged() {
    if (this.ariaLabel) {
      this.setAttribute('aria-hidden', 'false');
    } else {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('aria-label');
    }
  }

  _renderSvg(svgObject) {
    validateSvg(svgObject);
    render(svgObject, this);
    if (this.firstElementChild) {
      this.firstElementChild.setAttribute('aria-hidden', 'true');
    }
  }

  async _onIconIdChanged(prevIconId) {
    if (!this.iconId) {
      // clear if switching from iconId to no iconId
      if (prevIconId) {
        this.svg = null;
      }
    } else {
      const iconIdBeforeResolve = this.iconId;
      const svg = await icons.resolveIconForId(iconIdBeforeResolve);

      // update SVG if it did not change in the meantime to avoid race conditions
      if (this.iconId === iconIdBeforeResolve) {
        this.svg = svg;
      }
    }
  }
}
