import { MaxLength, MinLength } from '@lion/ui/form-core.js';
import { html } from 'lit';
import { LionTextarea } from '@lion/ui/textarea.js';
import { LocalizeMixin } from '@lion/localize';

export class LionTextareaCount extends LocalizeMixin(LionTextarea) {
  static get properties() {
    return {
      ...super.properties,
      maxLength: { type: Number },
      minLength: { type: Number },
      showCharCounter: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.maxLength = Infinity;
    this.minLength = 0;
    this.showCharCounter = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this._inputListener = this._limitInput.bind(this);
    this._inputNode.addEventListener('input', this._inputListener);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._inputListener = this._limitInput.bind(this);
    this._inputNode.removeEventListener('input', this._inputListener);
  }

  _limitInput() {
    if (this._inputNode.value.length > this.maxLength) {
      this._inputNode.value = this._inputNode.value.slice(0, this._inputNode.value.length - 1);
    }
  }

  get charCounter() {
    const maxLength = this.getAttribute('maxLength') || ' no limit';
    return `${this._inputNode.value.length}/${maxLength}`;
  }

  /**
   * @param {import('lit').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (this.showCharCounter && this._inputNode && changedProperties.has('_inputNode')) {
      this.requestUpdate();
    }

    if (changedProperties.has('minLength')) {
      this.defaultValidators.push(new MinLength(this.minLength));
    }

    if (changedProperties.has('maxLength')) {
      this.defaultValidators.push(new MaxLength(this.maxLength));
    }
  }

  render() {
    return html`
      ${super.render()}
      ${this.showCharCounter ? html`<div id="char-counter">${this.charCounter}</div>` : ''}
    `;
  }
}
