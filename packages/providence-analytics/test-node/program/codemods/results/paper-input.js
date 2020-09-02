/* eslint-disable import/no-unresolved */
import { LitElement, html, css } from 'lit-element';
import { IronFormElementBehavior } from 'iron-form-element-behavior/iron-form-element-behavior.js';
import 'iron-input/iron-input.js';
import { PaperInputBehavior } from './paper-input-behavior.js';
import './paper-input-char-counter.js';
import './paper-input-container.js';
import './paper-input-error.js';

class PaperInput extends PaperInputBehavior(IronFormElementBehavior(LitElement)) {
  static get properties() {
    return {
      value: { type: String, reflect: true },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([focused]) {
          outline: none;
        }

        :host([hidden]) {
          display: none !important;
        }

        input {
          /* Firefox sets a min-width on the input, which can cause layout issues */
          min-width: 0;
        }

        /* In 1.x, the <input> is distributed to paper-input-container, which styles it.
      In 2.x the <iron-input> is distributed to paper-input-container, which styles
      it, but in order for this to work correctly, we need to reset some
      of the native input's properties to inherit (from the iron-input) */
        iron-input > input {
          @apply --paper-input-container-shared-input-style;
          font-family: inherit;
          font-weight: inherit;
          font-size: inherit;
          letter-spacing: inherit;
          word-spacing: inherit;
          line-height: inherit;
          text-shadow: inherit;
          color: inherit;
          cursor: inherit;
        }

        input:disabled {
          @apply --paper-input-container-input-disabled;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          @apply --paper-input-container-input-webkit-spinner;
        }

        input::-webkit-clear-button {
          @apply --paper-input-container-input-webkit-clear;
        }

        input::-webkit-calendar-picker-indicator {
          @apply --paper-input-container-input-webkit-calendar-picker-indicator;
        }

        input::-webkit-input-placeholder {
          color: var(--paper-input-container-color, var(--secondary-text-color));
        }

        input:-moz-placeholder {
          color: var(--paper-input-container-color, var(--secondary-text-color));
        }

        input::-moz-placeholder {
          color: var(--paper-input-container-color, var(--secondary-text-color));
        }

        input::-ms-clear {
          @apply --paper-input-container-ms-clear;
        }

        input::-ms-reveal {
          @apply --paper-input-container-ms-reveal;
        }

        input:-ms-input-placeholder {
          color: var(--paper-input-container-color, var(--secondary-text-color));
        }

        label {
          pointer-events: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <paper-input-container
        id="container"
        .noLabelFloat="${this.noLabelFloat}"
        .alwaysFloatLabel="${this._computeAlwaysFloatLabel(
          this.alwaysFloatLabel,
          this.placeholder,
        )}"
        auto-validate="${this.autoValidate}"
        disabled="${this.disabled}"
        .invalid="${this.invalid}"
      >
        <slot name="prefix" slot="prefix"> </slot>
        <label hidden="${!this.label}" aria-hidden="true" for="${this._inputId}" slot="label">
          ${this.label}
        </label>
        <span id="template-placeholder"> </span>
        <slot name="suffix" slot="suffix"> </slot>
        ${this.errorMessage
          ? html`
              <paper-input-error aria-live="assertive" slot="add-on">
                ${this.errorMessage}
              </paper-input-error>
            `
          : ''}
        ${this.charCounter
          ? html` <paper-input-char-counter slot="add-on"> </paper-input-char-counter> `
          : ''}
      </paper-input-container>
    `;
  }

  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);

    const notEqual = (value, old) => {
      // This ensures (old==NaN, value==NaN) always returns false
      return old !== value && (old === old || value === value);
    };

    if (name === 'value' && notEqual(this.value, oldValue)) {
      this._activeChanged(this.value, oldValue);
    }
  }

  /**
   *
   * Returns a reference to the focusable element. Overridden from
   * PaperInputBehavior to correctly focus the native input.
   *
   * @return {!HTMLElement}
   */
  get _focusableElement() {
    return Polymer.Element ? this.inputElement._inputElement : this.inputElement;
  }

  beforeRegister() {
    // We need to tell which kind of of template to stamp based on
    // what kind of `iron-input` we got, but because of polyfills and
    // custom elements differences between v0 and v1, the safest bet is
    // to check a particular method we know the iron-input#2.x can have.
    // If it doesn't have it, then it's an iron-input#1.x.
    var ironInput = document.createElement('iron-input');
    var version = typeof ironInput._initSlottedInput == 'function' ? 'v1' : 'v0';
    var template = Polymer.DomModule.import('paper-input', 'template');
    var inputTemplate = Polymer.DomModule.import('paper-input', 'template#' + version);
    var inputPlaceholder = template.content.querySelector('#template-placeholder');

    if (inputPlaceholder) {
      inputPlaceholder.parentNode.replaceChild(inputTemplate.content, inputPlaceholder);
    } // else it's already been processed, probably in superclass
  }

  _onIronInputReady() {
    // Even though this is only used in the next line, save this for
    // backwards compatibility, since the native input had this ID until 2.0.5.
    if (!this.$.nativeInput) {
      this.$.nativeInput = this.$$('input');
    }

    if (this.inputElement && this._typesThatHaveText.indexOf(this.$.nativeInput.type) !== -1) {
      this.alwaysFloatLabel = true;
    } // Only validate when attached if the input already has a value.

    if (!!this.inputElement.bindValue) {
      this.$.container._handleValueAndAutoValidate(this.inputElement);
    }
  }
}
customElements.define('paper-input', PaperInput);
