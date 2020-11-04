import { DayObject } from './DayObject.js';

/**
 * Abstraction around calendar DOM structure,
 * allows for writing readable, 'DOM structure agnostic' tests
 */
export class CalendarObject {
  /**
   * @param {import('../src/LionCalendar').LionCalendar} calendarEl
   */
  constructor(calendarEl) {
    this.el = calendarEl;
  }

  /**
   * Node references
   */

  get rootEl() {
    return this.el.shadowRoot?.querySelector('.calendar');
  }

  get headerEl() {
    return this.el.shadowRoot?.querySelector('.calendar__navigation');
  }

  get yearHeadingEl() {
    return this.el.shadowRoot?.querySelector('#year');
  }

  get monthHeadingEl() {
    return this.el.shadowRoot?.querySelector('#month');
  }

  get nextYearButtonEl() {
    return /** @type {HTMLElement & { ariaLabel: string }} */ (this.el.shadowRoot?.querySelectorAll(
      '.calendar__next-button',
    )[0]);
  }

  get previousYearButtonEl() {
    return /** @type {HTMLElement & { ariaLabel: string }} */ (this.el.shadowRoot?.querySelectorAll(
      '.calendar__previous-button',
    )[0]);
  }

  get nextMonthButtonEl() {
    return this.el.shadowRoot?.querySelectorAll('.calendar__next-button')[1];
  }

  get previousMonthButtonEl() {
    return this.el.shadowRoot?.querySelectorAll('.calendar__previous-button')[1];
  }

  get gridEl() {
    return this.el.shadowRoot?.querySelector('.calendar__grid');
  }

  get weekdayHeaderEls() {
    return /** @type {HTMLElement[]} */ (Array.from(
      /** @type {ShadowRoot} */ (this.el.shadowRoot).querySelectorAll('.calendar__weekday-header'),
    ));
  }

  get dayEls() {
    return /** @type {HTMLElement[]} */ (Array.from(
      /** @type {ShadowRoot} */ (this.el.shadowRoot).querySelectorAll(
        '.calendar__day-button[current-month]',
      ),
    ));
  }

  get previousMonthDayEls() {
    return /** @type {HTMLElement[]} */ (Array.from(
      /** @type {ShadowRoot} */ (this.el.shadowRoot).querySelectorAll(
        '.calendar__day-button[previous-month]',
      ),
    ));
  }

  get nextMonthDayEls() {
    return /** @type {HTMLElement[]} */ (Array.from(
      /** @type {ShadowRoot} */ (this.el.shadowRoot).querySelectorAll(
        '.calendar__day-button[next-month]',
      ),
    ));
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

  /**
   * @param {number} monthDayNumber
   */
  getDayEl(monthDayNumber) {
    // Relies on the fact that empty cells don't have .calendar__day-button[current-month]
    return /** @type {HTMLElement} */ (this.el.shadowRoot?.querySelectorAll(
      '.calendar__day-button[current-month]',
    )[monthDayNumber - 1]);
  }

  /**
   * @param {number} monthDayNumber
   */
  getDayObj(monthDayNumber) {
    return new DayObject(/** @type{HTMLElement} */ (this.getDayEl(monthDayNumber)));
  }

  get selectedDayObj() {
    return this.dayObjs.find(d => d.isSelected);
  }

  get centralDayObj() {
    return this.dayObjs.find(d => d.isCentral);
  }

  get focusedDayObj() {
    return this.dayObjs.find(d => d.el === this.el.shadowRoot?.activeElement);
  }

  /**
   * @desc Applies condition to all days, or days in filter
   *
   * @param {function} condition : condition that should apply for "filter" days
   * - Example: "(dayObj) => dayObj.selected"
   * @param {number[]|function} [filter] - month day numbers for which condition should apply.
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
  get activeMonth() {
    return this.monthHeadingEl?.textContent?.trim();
  }

  get activeYear() {
    return this.yearHeadingEl?.textContent?.trim();
  }
}
