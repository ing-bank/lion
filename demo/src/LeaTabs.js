import { css } from 'lit-element';
import { LionTabs } from '@lion/tabs';

export class LeaTabs extends LionTabs {
  static get styles() {
    return [
      super.styles,
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
