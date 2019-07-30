import { DayObject } from './DayObject.js';

/**
 * Abstraction around calendar DOM structure,
 * allows for writing readable, 'DOM structure agnostic' tests
 */
export class CalendarObject {
  constructor(calendarEl) {
    this.el = calendarEl;
  }

  /**
   * Node references
   */

  get rootEl() {
    return this.el.shadowRoot.querySelector('.calendar');
  }

  get headerEl() {
    return this.el.shadowRoot.querySelector('.calendar__header');
  }

  get monthHeadingEl() {
    return this.el.shadowRoot.querySelector('.calendar__month-heading');
  }

  get nextMonthButtonEl() {
    return this.el.shadowRoot.querySelector('.calendar__next-month-button');
  }

  get previousMonthButtonEl() {
    return this.el.shadowRoot.querySelector('.calendar__previous-month-button');
  }

  get gridEl() {
    return this.el.shadowRoot.querySelector('.calendar__grid');
  }

  get weekdayHeaderEls() {
    return [].slice.call(this.el.shadowRoot.querySelectorAll('.calendar__weekday-header'));
  }

  get dayEls() {
    return [].slice.call(
      this.el.shadowRoot.querySelectorAll('.calendar__day-button[current-month]'),
    );
  }

  get previousMonthDayEls() {
    return [].slice.call(
      this.el.shadowRoot.querySelectorAll('.calendar__day-button[previous-month]'),
    );
  }

  get nextMonthDayEls() {
    return [].slice.call(this.el.shadowRoot.querySelectorAll('.calendar__day-button[next-month]'));
  }

  get dayObjs() {
    return this.dayEls.map(d => new DayObject(d));
  }

  get previousMonthDayObjs() {
    return this.previousMonthDayEls.map(d => new DayObject(d));
  }

  get nextMonthDayObjs() {
    return this.nextMonthDayEls.map(d => new DayObject(d));
  }

  getDayEl(monthDayNumber) {
    // Relies on the fact that empty cells don't have .calendar__day-button[current-month]
    return this.el.shadowRoot.querySelectorAll('.calendar__day-button[current-month]')[
      monthDayNumber - 1
    ];
  }

  getDayObj(monthDayNumber) {
    return new DayObject(this.getDayEl(monthDayNumber));
  }

  get selectedDayObj() {
    return this.dayObjs.find(d => d.selected);
  }

  get centralDayObj() {
    return this.dayObjs.find(d => d.isCentral);
  }

  get focusedDayObj() {
    return this.dayObjs.find(d => d.el === this.el.shadowRoot.activeElement);
  }

  /**
   * @desc Applies condition to all days, or days in filter
   *
   * @param {function} condition : condition that should apply for "filter" days
   * - Example: "(dayObj) => dayObj.selected"
   * @param {array|function} filter - month day numbers for which condition should apply.
   * - Example 1: "[15, 20]"
   * - Example 2: "(dayNumber) => dayNumber === 15" (1 based ,not zero based)
   */
  checkForAllDayObjs(condition, filter) {
    return this.dayEls.every(d => {
      const dayObj = new DayObject(d);
      const dayNumber = dayObj.monthday;
      let shouldApply = true;
      if (filter !== undefined) {
        shouldApply = filter instanceof Array ? filter.includes(dayNumber) : filter(dayNumber);
      }
      // for instance, should be 'disabled' for the 15th and 20th day
      return !shouldApply || (condition(dayObj) && shouldApply);
    });
  }

  /**
   * States
   */
  get activeMonthAndYear() {
    return this.monthHeadingEl.textContent.trim();
  }

  get activeMonth() {
    return this.activeMonthAndYear.split(' ')[0];
  }

  get activeYear() {
    return this.activeMonthAndYear.split(' ')[1];
  }
}
