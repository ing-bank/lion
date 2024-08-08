import { LitElement, html } from 'lit';
import { LightRenderMixin } from '@lion/ui/core.js';

export class MyAccessibleControl extends LightRenderMixin(LitElement) {
    slots = [
      { name: 'input', template: this.renderInput },
    ];

    render() {
      return html` <div>${this.renderInput()}</div> `;
    }

    renderInput() {
      return html`<input />`;
    }
  }
  customElements.define('my-control', MyAccessibleControl);