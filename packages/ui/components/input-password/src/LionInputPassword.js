/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */

import { MaxLength as LionMaxLength, MinLength as LionMinLength } from '@lion/ui/form-core.js';
import { html } from 'lit';
import { LionInput } from '@lion/ui/input.js';
import { LocalizeMixin } from '@lion/localize';

class MinLength extends LionMinLength {
  /**
  * @param {any} data
  */
  static async getMessage(data) {
    if (!data) return '';
    return `The password should have a minimum length of ${data.formControl?.__minLength} but got length ${data.modelValue?.length}.`;
  }
}

class MaxLength extends LionMaxLength {
  /**
  * @param {any} data
  */
  static async getMessage(data) {
    if (!data) return '';
    return `The password should have a maximum length of ${data.formControl?.__maxLength} but got length ${data.modelValue.length}.`;
  }
}

/**
 * LionInputPassword: extension of LionInput
 *
 * @customElement lion-input-password
 */
export class LionInputPassword extends LocalizeMixin(LionInput) {
  constructor() {
    super();
    this.type = 'password';
    this.maxLength = Infinity;
    this.minLength = 0;
    this.defaultValidators.push(new MaxLength({maxLength: this.maxLength}), new MinLength({minLength: this.minLength}));
    this.showCharCounter = true;
    this.showVisibilityControl = false;
  }

  static get properties() {
    return {
      ...super.properties,
      maxLength: { type: Number },
      minLength: { type: Number },
      showCharCounter: { type: Boolean },
      showVisibilityControl: { type: Boolean },
      type: { type: String },
    };
  }

  get _inputNode() {
    return super._inputNode;
  }

  get charCounter() {
    const maxLength = this.getAttribute('maxLength') || ' no limit';
    return `${this._inputNode.value.length}/${maxLength}`;
  }

  /** @param {import('lit').PropertyValues } changedProperties */ 
  updated(changedProperties) {
    super.updated(changedProperties);
    if (this.showCharCounter && this._inputNode && changedProperties.has('_inputNode')) {
      this.requestUpdate();
    }

    if (this.showVisibilityControl && this._inputNode && changedProperties.has('_inputNode')) {
      this.requestUpdate();
    }

    if (changedProperties.has('minLength')) {
      this.defaultValidators.push(new MinLength(this.minLength));
      this._inputNode.min = `${this.minLength}`;
    }

    if (changedProperties.has('maxLength')) {
      this.defaultValidators.push(new MaxLength(this.maxLength));
      this._inputNode.max = `${this.maxLength}`;
    }
  }

  togglePasswordVisibility() {
    this.type = this.type === 'password' ? 'text' : 'password';
  }

  render() {
    return html`
      ${super.render()}
      ${this.showCharCounter ? html`<div id="char-counter">${this.charCounter}</div>` : null}
      ${this.showVisibilityControl ? html`<button id="visibility-toggler" @click="${this.togglePasswordVisibility}">Toggle Visibility</button>` : ''}
    `;
  }
}
