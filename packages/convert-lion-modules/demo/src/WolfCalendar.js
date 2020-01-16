/* eslint-disable import/no-extraneous-dependencies */

import { css } from '@lion/core';
import { LionCalendar } from '@lion/calendar';

export class WolfCalendar extends LionCalendar {
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
