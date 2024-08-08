import { LitElement, html } from 'lit';
import { LightRenderMixin } from '@lion/ui/core.js';

// It shoyld be possible to externally provide templa
const templates = {
    // eslint-disable-next-line class-methods-use-this
    renderInput() {
      return html`<input />`;
    }
};

export class MyAccessibleControl extends LightRenderMixin(LitElement) {
    static properties = {
      label: { type: String },
      type: { type: String },
    };

    slots = [
      { name: 'label', template: this.renderLabel },
      { name: 'input', template: templates.renderInput, host: templates },
    ];

    constructor() {
      super();

      this.label = 'default label';
    }

    render() {
      return html` ${this.renderLabel()}${templates.renderInput()} `;
    }

    // eslint-disable-next-line class-methods-use-this
    renderLabel() {
      return html`<label>${this.label}</label>`;
    }
    
  }
  customElements.define('my-control', MyAccessibleControl);