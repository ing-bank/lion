import { LitElement, html } from 'lit';
import { LightRenderMixin } from '@lion/ui/core.js';

/**
 * Example for the LightRenderMixin docs: the input and its label live in the light dom, so the
 * relation between them (and with anything a consumer renders around this component) works.
 */
export class MyAccessibleControl extends LightRenderMixin(LitElement) {
  static properties = {
    label: { type: String },
    type: { type: String },
  };

  get slots() {
    return [
      { name: 'input', template: this.renderInput },
      { name: 'label', template: this.renderLabel },
    ];
  }

  constructor() {
    super();
    this.label = 'Default label';
    this.type = 'text';
  }

  render() {
    return html`<div class="wrapper">${this.renderInput()}${this.renderLabel()}</div>`;
  }

  renderInput() {
    return html`<input type=${this.type} />`;
  }

  renderLabel() {
    return html`<label>${this.label}</label>`;
  }
}

customElements.define('my-accessible-control', MyAccessibleControl);
