import { css } from 'lit';
import { LionTabs } from '@lion/ui/tabs.js';

export class LeaTabs extends LionTabs {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background: #222;
          display: block;
          padding: 20px;
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupFeature();
  }

  _setupFeature() {
    // being awesome
  }
}

customElements.define('lea-tabs', LeaTabs);
