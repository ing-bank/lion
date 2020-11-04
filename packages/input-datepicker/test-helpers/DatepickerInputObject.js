import { CalendarObject } from '@lion/calendar/test-helpers.js';

export class DatepickerInputObject {
  /** @param {import('../src/LionInputDatepicker').LionInputDatepicker} el */
  constructor(el) {
    this.el = el;
  }

  /**
   * Methods mimicing User Interaction
   */

  async openCalendar() {
    // Make sure the calendar is opened, not closed/toggled;
    this.overlayController.hide();
    this.invokerEl.click();
    const completePromises = [];
    if (this.overlayEl) {
      completePromises.push(this.overlayEl.updateComplete);
    }
    if (this.calendarEl) {
      completePromises.push(this.calendarEl.updateComplete);
    }
    return Promise.all(completePromises);
  }

  async closeCalendar() {
    this.overlayCloseButtonEl.click();
  }

  /**
   * @param {number} day
   */
  async selectMonthDay(day) {
    this.overlayController.show();
    await this.calendarEl.updateComplete;
    this.calendarObj.getDayEl(day).click();
    return true;
  }

  /**
   * Node references
   */

  get invokerEl() {
    return this.el._invokerNode;
  }

  get overlayEl() {
    // @ts-expect-error not supposed to call _overlayCtrl publicly here on this.el
    return /** @type {LitElement} */ (this.el._overlayCtrl.contentNode);
  }

  get overlayHeadingEl() {
    return /** @type {HTMLElement} */ (this.overlayEl &&
      this.overlayEl.shadowRoot?.querySelector('.calendar-overlay__heading'));
  }

  get overlayCloseButtonEl() {
    return /** @type {HTMLElement} */ (this.calendarEl &&
      this.overlayEl.shadowRoot?.querySelector('#close-button'));
  }

  get calendarEl() {
    return /** @type {import('@lion/calendar').LionCalendar} */ (this.el && this.el._calendarNode);
  }

  /**
   * @property {CalendarObject}
   */
  get calendarObj() {
    return this.calendarEl && new CalendarObject(this.calendarEl);
  }

  /**
   * Object references
   */

  get overlayController() {
    // @ts-expect-error not supposed to call _overlayCtrl publicly here on this.el
    return this.el._overlayCtrl;
  }
}
