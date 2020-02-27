/* eslint-disable import/no-extraneous-dependencies */
import { LocalizeMixin, formatNumber } from '@lion/localize';
import { LionInput } from '@lion/input';
import { html, css, unsafeCSS } from '@lion/core';

/**
 * LionInputRange: extension of lion-input
 *
 * @customElement `lion-input-range`
 * @extends LionInput
 */
export class LionInputRange extends LocalizeMixin(LionInput) {
  static get properties() {
    return {
      min: Number,
      max: Number,
      unit: String,
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

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
    this.type = 'range';
    /* eslint-disable-next-line wc/no-self-class */
    this.classList.add(this.scopedClass);

    this.__setupStyleTag();
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) super.disconnectedCallback();
    this.__teardownStyleTag();
  }

  constructor() {
    super();
    this.parser = modelValue => parseFloat(modelValue);
    this.scopedClass = `${this.localName}-${Math.floor(Math.random() * 10000)}`;
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('min')) {
      this._inputNode.min = this.min;
    }

    if (changedProperties.has('max')) {
      this._inputNode.max = this.max;
    }

    if (changedProperties.has('step')) {
      this._inputNode.step = this.step;
    }
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (changedProperties.has('modelValue')) {
      // TODO: find out why this hack is needed to display the initial modelValue
      this.updateComplete.then(() => {
        this._inputNode.value = this.modelValue;
      });
    }
  }

  _inputGroupTemplate() {
    return html`
      <div>
        <span class="input-range__value">${formatNumber(this.formattedValue)}</span>
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
    this.__styleTag = document.createElement('style');
    this.__styleTag.innerHTML = this.constructor.rangeStyles(unsafeCSS(this.scopedClass));
    this.insertBefore(this.__styleTag, this.childNodes[0]);
  }

  __teardownStyleTag() {
    this.removeChild(this.__styleTag);
  }
}
