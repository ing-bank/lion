/* eslint-disable import/no-extraneous-dependencies */
import { css, html } from 'lit';
import { LocalizeMixin, formatNumber } from '@lion/ui/localize-no-side-effects.js';
import { ScopedStylesController } from '@lion/ui/core.js';
import { LionInput } from '@lion/ui/input.js';
import { localizeNamespaceLoader } from './localizeNamespaceLoader.js';

/**
 * @typedef {import('lit').CSSResult} CSSResult
 */

/**
 * LionInputRange: extension of lion-input.
 *
 * @customElement `lion-input-range`
 */
export class LionInputRange extends LocalizeMixin(LionInput) {
  /** @type {any} */
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
      minLabel: {
        type: String,
        attribute: 'min-label',
      },
      maxLabel: {
        type: String,
        attribute: 'max-label',
      },
    };
  }

  static localizeNamespaces = [
    { 'lion-input-range': localizeNamespaceLoader },
    ...super.localizeNamespaces,
  ];

  /**
   * @param {CSSResult} scope
   */
  static scopedStyles(scope) {
    return css`
      /* Custom input range styling comes here, be aware that this won't work for polyfilled browsers */
      .${scope} .form-control {
        width: 100%;
        box-shadow: none;
        outline: none;
      }
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(100%);
          clip: rect(1px, 1px, 1px, 1px);
          white-space: nowrap;
          border: 0;
          margin: 0;
          padding: 0;
        }
      `,
    ];
  }

  get _inputNode() {
    return /** @type {HTMLInputElement} */ (super._inputNode);
  }

  /**
   * Get the display info for the current value
   * @protected
   * @returns {{ text: string, showUnit: boolean }}
   */
  get _valueDisplay() {
    const currentValue = parseFloat(/** @type {string} */ (this.formattedValue));

    if (this.minLabel && currentValue === this.min) {
      return { text: this.minLabel, showUnit: false };
    }

    if (this.maxLabel && currentValue === this.max) {
      return { text: this.maxLabel, showUnit: false };
    }

    return { text: formatNumber(currentValue), showUnit: true };
  }

  constructor() {
    super();
    /** @type {ScopedStylesController} */
    this.scopedStylesController = new ScopedStylesController(this);
    this.min = Infinity;
    this.max = Infinity;
    this.step = 1;
    this.unit = '';
    this.type = 'range';
    this.noMinMaxLabels = false;
    this.minLabel = '';
    this.maxLabel = '';
    /**
     * @param {string} modelValue
     */
    this.parser = modelValue => parseFloat(modelValue);
  }

  /** @param {import('lit').PropertyValues } changedProperties */
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

  /** @param {import('lit').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (changedProperties.has('modelValue')) {
      // TODO: find out why this hack is needed to display the initial modelValue
      this.updateComplete.then(() => {
        this._inputNode.value = `${this.modelValue}`;
      });
    }
  }

  /** @protected */
  _inputGroupTemplate() {
    const display = this._valueDisplay;

    return html`
      <div>
        <span class="input-range__value">${display.text}</span>
        ${display.showUnit ? html`<span class="input-range__unit">${this.unit}</span>` : ''}
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

  /** @protected */
  _inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="input"></slot>
        ${!this.noMinMaxLabels
          ? html`
              <div class="input-range__limits">
                <div>
                  <span class="sr-only">${this.msgLit('lion-input-range:minimum')} </span>${this
                    .minLabel
                    ? this.minLabel
                    : formatNumber(this.min)}
                </div>
                <div>
                  <span class="sr-only">${this.msgLit('lion-input-range:maximum')} </span>${this
                    .maxLabel
                    ? this.maxLabel
                    : formatNumber(this.max)}
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }
}
