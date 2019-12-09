import { css } from '@lion/core';
import { LionCalendar } from '@lion/calendar';

class DemoCalendar extends LionCalendar {
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

customElements.define('demo-calendar', DemoCalendar);
