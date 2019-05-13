import { css } from '@lion/core';
import { LionCalendar } from '../../index.js';

class TwoMonth extends LionCalendar {
  static get styles() {
    return [
      super.styles,
      css`
        .calendar__day-button[previous-month],
        .calendar__day-button[next-month] {
          display: none;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.__futureMonths = 1;
    this.__pastMonths = 0;
  }

  __createData() {
    return super.__createData({ futureMonths: this.__futureMonths, pastMonths: this.__pastMonths });
  }

  __modifyDate(modify, { dateType, type, mode } = {}) {
    let tmpDate = new Date(this.centralDate);
    tmpDate[`set${type}`](tmpDate[`get${type}`]() + modify);

    if (!this.__isEnabledDate(tmpDate)) {
      tmpDate = this.__findBestEnabledDateFor(tmpDate, { mode });
    }

    if (mode === 'future' && tmpDate.getMonth() === this.centralDate.getMonth() + 1) {
      this.__futureMonths = 0;
      this.__pastMonths = 1;
    }

    if (mode === 'past' && tmpDate.getMonth() === this.centralDate.getMonth() - 1) {
      this.__futureMonths = 1;
      this.__pastMonths = 0;
    }

    this[dateType] = tmpDate;
  }
}

customElements.define('two-month', TwoMonth);
