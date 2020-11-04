/* eslint-disable import/no-extraneous-dependencies */
import { css, html, unsafeCSS } from '@lion/core';
import { LionInput } from '@lion/input';
import { formatNumber, LocalizeMixin } from '@lion/localize';

/**
 * @typedef {import('lit-element').CSSResult} CSSResult
 */

/**
 * LionInputRange: extension of lion-input.
 *
 * @customElement `lion-input-range`
 */
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/40110 + false positive for incompatible static get properties. Lit-element merges super properties already for you.
export class LionInputRange extends LocalizeMixin(LionInput) {
  static get properties() {
    return {
      min: {
        type: Number,
        reflect: true,
      },
      max: {
        type: Number,
        reflect: true,
      },
      unit: {
        type: String,
        reflect: true,
      },
      step: {
        type: Number,
        reflect: true,
      },
      noMinMaxLabels: {
        type: Boolean,
        attribute: 'no-min-max-labels',
      },
    };
  }

  /**
   * @param {CSSResult} scope
   */
  static rangeStyles(scope) {
    return css`
      /* Custom input range styling comes here, be aware that this won't work for polyfilled browsers */
      .${scope} .form-control {
        width: 100%;
        box-shadow: none;
        outline: none;
      }
    `;
  }

  constructor() {
    super();
    this.min = Infinity;
    this.max = Infinity;
    this.step = 1;
    this.unit = '';
    this.type = 'range';
    this.noMinMaxLabels = false;
    /**
     * @param {string} modelValue
     */
    this.parser = modelValue => parseFloat(modelValue);
    this.scopedClass = `${this.localName}-${Math.floor(Math.random() * 10000)}`;
    this.__styleTag = document.createElement('style');
  }

  connectedCallback() {
    super.connectedCallback();
    /* eslint-disable-next-line wc/no-self-class */
    this.classList.add(this.scopedClass);

    this.__setupStyleTag();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__teardownStyleTag();
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('min')) {
      this._inputNode.min = `${this.min}`;
    }

    if (changedProperties.has('max')) {
      this._inputNode.max = `${this.max}`;
    }

    if (changedProperties.has('step')) {
      this._inputNode.step = `${this.step}`;
    }
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (changedProperties.has('modelValue')) {
      // TODO: find out why this hack is needed to display the initial modelValue
      this.updateComplete.then(() => {
        this._inputNode.value = `${this.modelValue}`;
      });
    }
  }

  _inputGroupTemplate() {
    return html`
      <div>
        <span class="input-range__value">${formatNumber(parseFloat(this.formattedValue))}</span>
        <span class="input-range__unit">${this.unit}</span>
      </div>
      <div class="input-group">
        ${this._inputGroupBeforeTemplate()}
        <div class="input-group__container">
          ${this._inputGroupPrefixTemplate()} ${this._inputGroupInputTemplate()}
          ${this._inputGroupSuffixTemplate()}
        </div>
        ${this._inputGroupAfterTemplate()}
      </div>
    `;
  }

  _inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="input"></slot>
        ${!this.noMinMaxLabels
          ? html`
              <div class="input-range__limits">
                <span>${formatNumber(this.min)}</span>
                <span>${formatNumber(this.max)}</span>
              </div>
            `
          : ''}
      </div>
    `;
  }

  __setupStyleTag() {
    this.__styleTag.textContent = /** @type {typeof LionInputRange} */ (this.constructor)
      .rangeStyles(unsafeCSS(this.scopedClass))
      .toString();
    this.insertBefore(this.__styleTag, this.childNodes[0]);
  }

  __teardownStyleTag() {
    this.removeChild(this.__styleTag);
  }
}
