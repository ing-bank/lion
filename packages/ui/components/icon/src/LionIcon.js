import { css, html, LitElement, nothing, render } from 'lit';
import { isTemplateResult } from 'lit/directive-helpers.js';
import { icons } from './icons.js';

/**
 * @typedef {(tag: (strings: TemplateStringsArray, ... expr: string[]) => string) => string} TagFunction
 */

/**
 * @param {?} wrappedSvgObject
 */
function unwrapSvg(wrappedSvgObject) {
  const svgObject =
    wrappedSvgObject && wrappedSvgObject.default ? wrappedSvgObject.default : wrappedSvgObject;
  return typeof svgObject === 'function' ? svgObject(html) : svgObject;
}

/**
 * @param {TemplateResult|nothing} svg
 */
function validateSvg(svg) {
  if (!(svg === nothing || isTemplateResult(svg))) {
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
      /**
       * @desc When icons are not loaded as part of an iconset defined on iconManager,
       * it's possible to directly load an svg.
       */
      svg: {
        attribute: false,
      },
      /**
       * @desc The iconId allows to access icons that are registered to the IconManager
       * For instance, "lion:space:alienSpaceship"
       */
      ariaLabel: {
        type: String,
        attribute: 'aria-label',
        reflect: true,
      },
      /**
       * @desc The iconId allows to access icons that are registered to the IconManager
       * For instance, "lion:space:alienSpaceship"
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
    this.ariaLabel = '';
    this.iconId = '';
    /**
     * @private
     * @type {TemplateResult|nothing|TagFunction}
     */
    this.__svg = nothing;
  }

  /** @param {PropertyValues} changedProperties */
  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('ariaLabel')) {
      this._onLabelChanged();
    }

    if (changedProperties.has('iconId')) {
      this._onIconIdChanged(/** @type {string} */ (changedProperties.get('iconId')));
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
   * @param {TemplateResult|nothing|TagFunction} svg
   */
  set svg(svg) {
    this.__svg = svg;
    if (svg === undefined || svg === null) {
      this._renderSvg(nothing);
    } else {
      this._renderSvg(unwrapSvg(svg));
    }
  }

  /**
   * @type {TemplateResult|nothing|TagFunction}
   */
  get svg() {
    return this.__svg;
  }

  /** @protected */
  _onLabelChanged() {
    if (this.ariaLabel) {
      this.setAttribute('aria-hidden', 'false');
    } else {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('aria-label');
    }
  }

  /**
   * @param {TemplateResult | nothing} svgObject
   * @protected
   */
  _renderSvg(svgObject) {
    validateSvg(svgObject);
    render(svgObject, this);
    if (this.firstElementChild) {
      this.firstElementChild.setAttribute('aria-hidden', 'true');
    }
  }

  /** @protected */
  // eslint-disable-next-line class-methods-use-this
  get _iconManager() {
    return icons;
  }

  /**
   * @param {string} prevIconId
   * @protected
   */
  async _onIconIdChanged(prevIconId) {
    if (!this.iconId) {
      // clear if switching from iconId to no iconId
      if (prevIconId) {
        this.svg = nothing;
      }
    } else {
      const iconIdBeforeResolve = this.iconId;

      // Wrap in try-catch so error is non-fatal.
      // Failure to load an icon (asset) should not crash the entire app.
      try {
        const svg = await this._iconManager.resolveIconForId(iconIdBeforeResolve);
        // update SVG if it did not change in the meantime to avoid race conditions
        if (this.iconId === iconIdBeforeResolve) {
          this.svg = svg;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }
}
