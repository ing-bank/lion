import { html, nothing, TemplateResult, css, render, LitElement } from '@lion/core';

const isPromise = action => typeof action === 'object' && Promise.resolve(action) === action;

/**
 * Custom element for rendering SVG icons
 * @polymerElement
 */
export class LionIcon extends LitElement {
  static get properties() {
    return {
      // svg is a property to ensure the setter is called if the property is set before upgrading
      svg: {
        type: Object,
      },
      role: {
        type: String,
        attribute: 'role',
        reflect: true,
      },
      ariaLabel: {
        type: String,
        attribute: 'aria-label',
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
  }

  render() {
    return html`
      <slot></slot>
    `;
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
    if (svg === undefined) {
      this._renderSvg(nothing);
    } else if (isPromise(svg)) {
      this._renderSvg(nothing); // show nothing before resolved
      svg.then(resolvedSvg => {
        // render only if it is still the same and was not replaced after loading started
        if (svg === this.__svg) {
          this._renderSvg(this.constructor.__unwrapSvg(resolvedSvg));
        }
      });
    } else {
      this._renderSvg(this.constructor.__unwrapSvg(svg));
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
    this.constructor.__validateSvg(svgObject);
    render(svgObject, this);
  }

  static __unwrapSvg(wrappedSvgObject) {
    const svgObject =
      wrappedSvgObject && wrappedSvgObject.default ? wrappedSvgObject.default : wrappedSvgObject;
    return typeof svgObject === 'function' ? svgObject(html) : svgObject;
  }

  static __validateSvg(svg) {
    if (!(svg === nothing || svg instanceof TemplateResult)) {
      throw new Error(
        'icon accepts only lit-html templates or functions like "tag => tag`<svg>...</svg>`"',
      );
    }
  }
}
