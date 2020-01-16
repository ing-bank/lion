/* eslint-disable import/no-extraneous-dependencies */

import { css } from '@lion/core';
import { LionButton } from '@lion/button';

export class WolfButton extends LionButton {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          border-color: green !important;
          color: red;
        }
      `,
    ];
  }
}
