import { html, LitElement } from '@lion/core';
import '@lion/core/src/differentKeyEventNamesShimIE.js';
import {
  getMonthNames,
  getWeekdayNames,
  localize,
  LocalizeMixin,
  normalizeDateTime,
} from '@lion/localize';
import { calendarStyle } from './calendarStyle.js';
import { createDay } from './utils/createDay.js';
import { createMultipleMonth } from './utils/createMultipleMonth.js';
import { dataTemplate } from './utils/dataTemplate.js';
import { dayTemplate } from './utils/dayTemplate.js';
import { getFirstDayNextMonth } from './utils/getFirstDayNextMonth.js';
import { getLastDayPreviousMonth } from './utils/getLastDayPreviousMonth.js';
import { isSameDate } from './utils/isSameDate.js';

/**
 * @typedef {import('../types/day').Day} Day
 * @typedef {import('../types/day').Week} Week
 * @typedef {import('../types/day').Month} Month
 */

/**
 * @customElement lion-calendar
 */
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/40110
export class LionCalendar extends LocalizeMixin(LitElement) {
  static get localizeNamespaces() {
    return [
      {
        'lion-calendar': /** @param {string} locale */ locale => {
          switch (locale) {
            case 'bg-BG':
              return import('../translations/bg.js');
            case 'cs-CZ':
              return import('../translations/cs.js');
            case 'de-AT':
            case 'de-DE':
              return import('../translations/de.js');
            case 'en-AU':
            case 'en-GB':
            case 'en-PH':
            case 'en-US':
              return import('../translations/en.js');
            case 'es-ES':
              return import('../translations/es.js');
            case 'fr-FR':
            case 'fr-BE':
              return import('../translations/fr.js');
            case 'hu-HU':
              return import('../translations/hu.js');
            case 'it-IT':
              return import('../translations/it.js');
            case 'nl-BE':
            case 'nl-NL':
              return import('../translations/nl.js');
            case 'pl-PL':
              return import('../translations/pl.js');
            case 'ro-RO':
              return import('../translations/ro.js');
            case 'ru-RU':
              return import('../translations/ru.js');
            case 'sk-SK':
              return import('../translations/sk.js');
            case 'uk-UA':
              return import('../translations/uk.js');
            case 'zh-CN':
              return import('../translations/zh.js');
            default:
              return import('../translations/en.js');
          }
        },
      },
      ...super.localizeNamespaces,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Minimum date. All dates before will be disabled
       */ minDate: { attribute: false },

      /**
       * Maximum date. All dates after will be disabled
       */
      maxDate: { attribute: false },

      /**
       * Disable certain dates
       */
      disableDates: { attribute: false },

      /**
       * The selected date, usually synchronized with datepicker-input
       * Not to be confused with the focused date (therefore not necessarily in active month view)
       */
      selectedDate: { attribute: false },

      /**
       * The date that
       * 1. determines the currently visible month
       * 2. will be focused when the month grid gets focused by the keyboard
       */
      centralDate: { attribute: false },

      /**
       * Weekday that will be displayed in first column of month grid.
       * 0: sunday, 1: monday, 2: tuesday, 3: wednesday , 4: thursday, 5: friday, 6: saturday
       * Default is 0
       */
      firstDayOfWeek: { attribute: false },

      /**
       * Weekday header notation, based on Intl DatetimeFormat:
       * - 'long' (e.g., Thursday)
       * - 'short' (e.g., Thu)
       * - 'narrow' (e.g., T).
       * Default is 'short'
       */
      weekdayHeaderNotation: { attribute: false },

      /**
       * Different locale for this component scope
       */
      locale: { attribute: false },

      /**
       * The currently focused date (if any)
       */
      __focusedDate: { attribute: false },

      /**
       * Data to render current month grid
       */
      __data: { attribute: false },
    };
  }

  constructor() {
    super();
    /** @type {{months: Month[]}} */
    this.__data = { months: [] };
    this.minDate = new Date(0);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    this.maxDate = new Date(8640000000000000);
    /** @param {Day} day */
    this.dayPreprocessor = day => day;

    /** @param {Date} day */
    // eslint-disable-next-line no-unused-vars
    this.disableDates = day => false;

    this.firstDayOfWeek = 0;
    this.weekdayHeaderNotation = 'short';
    this.__today = normalizeDateTime(new Date());
    /** @type {Date} */
    this.centralDate = this.__today;
    /** @type {Date | null} */
    this.__focusedDate = null;
    this.__connectedCallbackDone = false;
    this.locale = '';
  }

  static get styles() {
    return [calendarStyle];
  }

  render() {
    return html`
      <div class="calendar" role="application">
        ${this.__renderNavigation()} ${this.__renderData()}
      </div>
    `;
  }

  get focusedDate() {
    return this.__focusedDate;
  }

  goToNextMonth() {
    this.__modifyDate(1, { dateType: 'centralDate', type: 'Month', mode: 'both' });
  }

  goToPreviousMonth() {
    this.__modifyDate(-1, { dateType: 'centralDate', type: 'Month', mode: 'both' });
  }

  goToNextYear() {
    this.__modifyDate(1, { dateType: 'centralDate', type: 'FullYear', mode: 'both' });
  }

  goToPreviousYear() {
    this.__modifyDate(-1, { dateType: 'centralDate', type: 'FullYear', mode: 'both' });
  }

  /**
   * @param {Date} date
   */
  async focusDate(date) {
    this.centralDate = date;
    await this.updateComplete;
    this.focusCentralDate();
  }

  focusCentralDate() {
    const button = /** @type {HTMLElement} */ (this.shadowRoot?.querySelector(
      'button[tabindex="0"]',
    ));
    button.focus();
    this.__focusedDate = this.centralDate;
  }

  async focusSelectedDate() {
    if (this.selectedDate) {
      await this.focusDate(this.selectedDate);
    }
  }

  async connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();

    this.__connectedCallbackDone = true;

    this.__calculateInitialCentralDate();

    // setup data for initial render
    this.__data = this.__createData();

    /**
     * This logic needs to happen on firstUpdated, but every time the DOM node is moved as well
     * since firstUpdated only runs once, this logic is moved here, but after updateComplete
     * this acts as a firstUpdated that runs on every reconnect as well
     */
    await this.updateComplete;
    this.__contentWrapperElement = this.shadowRoot?.getElementById('js-content-wrapper');
    this.__addEventDelegationForClickDate();
    this.__addEventDelegationForFocusDate();
    this.__addEventDelegationForBlurDate();
    this.__addEventForKeyboardNavigation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__removeEventDelegations();
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('__focusedDate') && this.__focusedDate) {
      this.focusCentralDate();
    }
  }

  /**
   * @param {string} name
   * @param {?} oldValue
   */
  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);

    const map = {
      disableDates: () => this.__disableDatesChanged(),
      centralDate: () => this.__centralDateChanged(),
      __focusedDate: () => this.__focusedDateChanged(),
    };
    if (map[name]) {
      map[name]();
    }

    const updateDataOn = ['centralDate', 'minDate', 'maxDate', 'selectedDate', 'disableDates'];

    if (updateDataOn.includes(name) && this.__connectedCallbackDone) {
      this.__data = this.__createData();
    }
  }

  __calculateInitialCentralDate() {
    if (this.centralDate === this.__today && this.selectedDate) {
      // initialised with selectedDate only if user didn't provide another one
      this.centralDate = this.selectedDate;
    } else {
      this.__ensureValidCentralDate();
    }
  }

  /**
   * @param {string} month
   * @param {number} year
   */
  __renderMonthNavigation(month, year) {
    const nextMonth =
      this.centralDate.getMonth() === 11
        ? getMonthNames({ locale: this.__getLocale() })[0]
        : getMonthNames({ locale: this.__getLocale() })[this.centralDate.getMonth() + 1];
    const previousMonth =
      this.centralDate.getMonth() === 0
        ? getMonthNames({ locale: this.__getLocale() })[11]
        : getMonthNames({ locale: this.__getLocale() })[this.centralDate.getMonth() - 1];
    const nextYear = this.centralDate.getMonth() === 11 ? year + 1 : year;
    const previousYear = this.centralDate.getMonth() === 0 ? year - 1 : year;
    return html`
      <div class="calendar__navigation__month">
        ${this.__renderPreviousButton('Month', previousMonth, previousYear)}
        <h2 class="calendar__navigation-heading" id="month" aria-atomic="true">${month}</h2>
        ${this.__renderNextButton('Month', nextMonth, nextYear)}
      </div>
    `;
  }

  /**
   * @param {string} month
   * @param {number} year
   */
  __renderYearNavigation(month, year) {
    const nextYear = year + 1;
    const previousYear = year - 1;

    return html`
      <div class="calendar__navigation__year">
        ${this.__renderPreviousButton('FullYear', month, previousYear)}
        <h2 class="calendar__navigation-heading" id="year" aria-atomic="true">${year}</h2>
        ${this.__renderNextButton('FullYear', month, nextYear)}
      </div>
    `;
  }

  __renderNavigation() {
    const month = getMonthNames({ locale: this.__getLocale() })[this.centralDate.getMonth()];
    const year = this.centralDate.getFullYear();
    return html`
      <div class="calendar__navigation">
        ${this.__renderYearNavigation(month, year)} ${this.__renderMonthNavigation(month, year)}
      </div>
    `;
  }

  __renderData() {
    return dataTemplate(this.__data, {
      monthsLabels: getMonthNames({ locale: this.__getLocale() }),
      weekdaysShort: getWeekdayNames({
        locale: this.__getLocale(),
        style: this.weekdayHeaderNotation,
        firstDayOfWeek: this.firstDayOfWeek,
      }),
      weekdays: getWeekdayNames({
        locale: this.__getLocale(),
        style: 'long',
        firstDayOfWeek: this.firstDayOfWeek,
      }),
      dayTemplate,
    });
  }

  /**
   * @param {string} type
   * @param {string} previousMonth
   * @param {number} previousYear
   */
  __getPreviousDisabled(type, previousMonth, previousYear) {
    let disabled;
    let month = previousMonth;
    if (this.minDate && type === 'Month') {
      disabled = getLastDayPreviousMonth(this.centralDate) < this.minDate;
    } else if (this.minDate) {
      disabled = previousYear < this.minDate.getFullYear();
    }
    if (!disabled && this.minDate && type === 'FullYear') {
      // change the month to the first available month
      if (previousYear === this.minDate.getFullYear()) {
        if (this.centralDate.getMonth() < this.minDate.getMonth()) {
          month = getMonthNames({ locale: this.__getLocale() })[this.minDate.getMonth()];
        }
      }
    }
    return { disabled, month };
  }

  /**
   * @param {string} type
   * @param {string} nextMonth
   * @param {number} nextYear
   */
  __getNextDisabled(type, nextMonth, nextYear) {
    let disabled;
    let month = nextMonth;
    if (this.maxDate && type === 'Month') {
      disabled = getFirstDayNextMonth(this.centralDate) > this.maxDate;
    } else if (this.maxDate) {
      disabled = nextYear > this.maxDate.getFullYear();
    }
    if (!disabled && this.maxDate && type === 'FullYear') {
      // change the month to the first available month
      if (nextYear === this.maxDate.getFullYear()) {
        if (this.centralDate.getMonth() >= this.maxDate.getMonth()) {
          month = getMonthNames({ locale: this.__getLocale() })[this.maxDate.getMonth()];
        }
      }
    }
    return { disabled, month };
  }

  /**
   * @param {string} type
   * @param {string} previousMonth
   * @param {number} previousYear
   */
  __renderPreviousButton(type, previousMonth, previousYear) {
    const { disabled, month } = this.__getPreviousDisabled(type, previousMonth, previousYear);
    const previousButtonTitle = this.__getNavigationLabel('previous', type, month, previousYear);
    const clickDateDelegation = () => {
      if (type === 'FullYear') {
        this.goToPreviousYear();
      } else {
        this.goToPreviousMonth();
      }
    };

    return html`
      <button
        class="calendar__previous-button"
        aria-label=${previousButtonTitle}
        title=${previousButtonTitle}
        @click=${clickDateDelegation}
        ?disabled=${disabled}
      >
        &lt;
      </button>
    `;
  }

  /**
   * @param {string} type
   * @param {string} nextMonth
   * @param {number} nextYear
   */
  __renderNextButton(type, nextMonth, nextYear) {
    const { disabled, month } = this.__getNextDisabled(type, nextMonth, nextYear);
    const nextButtonTitle = this.__getNavigationLabel('next', type, month, nextYear);
    const clickDateDelegation = () => {
      if (type === 'FullYear') {
        this.goToNextYear();
      } else {
        this.goToNextMonth();
      }
    };

    return html`
      <button
        class="calendar__next-button"
        aria-label=${nextButtonTitle}
        title=${nextButtonTitle}
        @click=${clickDateDelegation}
        ?disabled=${disabled}
      >
        &gt;
      </button>
    `;
  }

  /**
   *
   * @param {string} mode
   * @param {string} type
   * @param {string} month
   * @param {number} year
   */
  __getNavigationLabel(mode, type, month, year) {
    return `${this.msgLit(`lion-calendar:${mode}${type}`)}, ${month} ${year}`;
  }

  /**
   *
   * @param {Day} _day
   * @param {*} param1
   */
  __coreDayPreprocessor(_day, { currentMonth = false } = {}) {
    const day = createDay(new Date(_day.date), _day);
    const today = normalizeDateTime(new Date());
    day.central = isSameDate(day.date, this.centralDate);
    day.previousMonth = currentMonth && day.date.getMonth() < currentMonth.getMonth();
    day.currentMonth = currentMonth && day.date.getMonth() === currentMonth.getMonth();
    day.nextMonth = currentMonth && day.date.getMonth() > currentMonth.getMonth();
    day.selected = this.selectedDate ? isSameDate(day.date, this.selectedDate) : false;
    day.past = day.date < today;
    day.today = isSameDate(day.date, today);
    day.future = day.date > today;
    day.disabled = this.disableDates(day.date);
    day.tabindex = day.central ? '0' : '-1';
    day.ariaPressed = day.selected ? 'true' : 'false';
    day.ariaCurrent = day.today ? 'date' : undefined;

    if (this.minDate && normalizeDateTime(day.date) < normalizeDateTime(this.minDate)) {
      day.disabled = true;
    }

    if (this.maxDate && normalizeDateTime(day.date) > normalizeDateTime(this.maxDate)) {
      day.disabled = true;
    }

    return this.dayPreprocessor(day);
  }

  /**
   * @param {Day} [options]
   */
  __createData(options) {
    const data = createMultipleMonth(this.centralDate, {
      firstDayOfWeek: this.firstDayOfWeek,
      ...options,
    });
    data.months.forEach((month, monthi) => {
      month.weeks.forEach((week, weeki) => {
        week.days.forEach((day, dayi) => {
          // eslint-disable-next-line no-unused-vars
          const currentDay = data.months[monthi].weeks[weeki].days[dayi];
          const currentMonth = data.months[monthi].weeks[0].days[6].date;
          data.months[monthi].weeks[weeki].days[dayi] = this.__coreDayPreprocessor(currentDay, {
            currentMonth,
          });
        });
      });
    });
    return data;
  }

  __disableDatesChanged() {
    if (this.__connectedCallbackDone) {
      this.__ensureValidCentralDate();
    }
  }

  /**
   * @param {Date} selectedDate
   */
  __dateSelectedByUser(selectedDate) {
    this.selectedDate = selectedDate;
    this.__focusedDate = selectedDate;
    this.dispatchEvent(
      new CustomEvent('user-selected-date-changed', {
        detail: {
          selectedDate,
        },
      }),
    );
  }

  __centralDateChanged() {
    if (this.__connectedCallbackDone) {
      this.__ensureValidCentralDate();
    }
  }

  __focusedDateChanged() {
    if (this.__focusedDate) {
      this.centralDate = this.__focusedDate;
    }
  }

  __ensureValidCentralDate() {
    if (!this.__isEnabledDate(this.centralDate)) {
      this.centralDate = this.__findBestEnabledDateFor(this.centralDate);
    }
  }

  /**
   * @param {Date} date
   */
  __isEnabledDate(date) {
    const processedDay = this.__coreDayPreprocessor({ date });
    return !processedDay.disabled;
  }

  /**
   * @param {Date} date
   * @param {Object} opts
   * @param {String} [opts.mode] Find best date in `future/past/both`
   */
  __findBestEnabledDateFor(date, { mode = 'both' } = {}) {
    const futureDate =
      this.minDate && this.minDate > date ? new Date(this.minDate) : new Date(date);
    const pastDate = this.maxDate && this.maxDate < date ? new Date(this.maxDate) : new Date(date);

    if (this.minDate && this.minDate > date) {
      futureDate.setDate(futureDate.getDate() - 1);
    }
    if (this.maxDate && this.maxDate < date) {
      pastDate.setDate(pastDate.getDate() + 1);
    }

    let i = 0;
    do {
      i += 1;
      if (mode === 'both' || mode === 'future') {
        futureDate.setDate(futureDate.getDate() + 1);
        if (this.__isEnabledDate(futureDate)) {
          return futureDate;
        }
      }
      if (mode === 'both' || mode === 'past') {
        pastDate.setDate(pastDate.getDate() - 1);
        if (this.__isEnabledDate(pastDate)) {
          return pastDate;
        }
      }
    } while (i < 750); // 2 years+

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    throw new Error(
      `Could not find a selectable date within +/- 750 day for ${year}/${month}/${day}`,
    );
  }

  __addEventDelegationForClickDate() {
    const isDayButton = /** @param {HTMLElement} el */ el =>
      el.classList.contains('calendar__day-button');

    this.__clickDateDelegation = /** @param {Event} ev */ ev => {
      const el = /** @type {HTMLElement & { date: Date }} */ (ev.target);
      if (isDayButton(el)) {
        this.__dateSelectedByUser(el.date);
      }
    };

    const contentWrapper = /** @type {HTMLButtonElement} */ (this.__contentWrapperElement);
    contentWrapper.addEventListener('click', this.__clickDateDelegation);
  }

  __addEventDelegationForFocusDate() {
    const isDayButton = /** @param {HTMLElement} el */ el =>
      el.classList.contains('calendar__day-button');

    this.__focusDateDelegation = () => {
      if (
        !this.__focusedDate &&
        isDayButton(/** @type {HTMLElement} el */ (this.shadowRoot?.activeElement))
      ) {
        this.__focusedDate = /** @type {HTMLButtonElement & { date: Date }} */ (this.shadowRoot
          ?.activeElement).date;
      }
    };

    const contentWrapper = /** @type {HTMLButtonElement} */ (this.__contentWrapperElement);
    contentWrapper.addEventListener('focus', this.__focusDateDelegation, true);
  }

  __addEventDelegationForBlurDate() {
    const isDayButton = /** @param {HTMLElement} el */ el =>
      el.classList.contains('calendar__day-button');

    this.__blurDateDelegation = () => {
      setTimeout(() => {
        if (
          this.shadowRoot?.activeElement &&
          !isDayButton(/** @type {HTMLElement} el */ (this.shadowRoot?.activeElement))
        ) {
          this.__focusedDate = null;
        }
      }, 1);
    };

    const contentWrapper = /** @type {HTMLButtonElement} */ (this.__contentWrapperElement);
    contentWrapper.addEventListener('blur', this.__blurDateDelegation, true);
  }

  __removeEventDelegations() {
    if (!this.__contentWrapperElement) {
      return;
    }
    this.__contentWrapperElement.removeEventListener(
      'click',
      /** @type {EventListener} */ (this.__clickDateDelegation),
    );
    this.__contentWrapperElement.removeEventListener(
      'focus',
      /** @type {EventListener} */ (this.__focusDateDelegation),
    );
    this.__contentWrapperElement.removeEventListener(
      'blur',
      /** @type {EventListener} */ (this.__blurDateDelegation),
    );
    this.__contentWrapperElement.removeEventListener(
      'keydown',
      /** @type {EventListener} */ (this.__keyNavigationEvent),
    );
  }

  __addEventForKeyboardNavigation() {
    this.__keyNavigationEvent = /** @param {KeyboardEvent} ev */ ev => {
      const preventedKeys = ['ArrowUp', 'ArrowDown', 'PageDown', 'PageUp'];

      if (preventedKeys.includes(ev.key)) {
        ev.preventDefault();
      }

      switch (ev.key) {
        case 'ArrowUp':
          this.__modifyDate(-7, { dateType: '__focusedDate', type: 'Date', mode: 'past' });
          break;
        case 'ArrowDown':
          this.__modifyDate(7, { dateType: '__focusedDate', type: 'Date', mode: 'future' });
          break;
        case 'ArrowLeft':
          this.__modifyDate(-1, { dateType: '__focusedDate', type: 'Date', mode: 'past' });
          break;
        case 'ArrowRight':
          this.__modifyDate(1, { dateType: '__focusedDate', type: 'Date', mode: 'future' });
          break;
        case 'PageDown':
          if (ev.altKey === true) {
            this.__modifyDate(1, { dateType: '__focusedDate', type: 'FullYear', mode: 'future' });
          } else {
            this.__modifyDate(1, { dateType: '__focusedDate', type: 'Month', mode: 'future' });
          }
          break;
        case 'PageUp':
          if (ev.altKey === true) {
            this.__modifyDate(-1, { dateType: '__focusedDate', type: 'FullYear', mode: 'past' });
          } else {
            this.__modifyDate(-1, { dateType: '__focusedDate', type: 'Month', mode: 'past' });
          }
          break;
        case 'Tab':
          this.__focusedDate = null;
          break;
        // no default
      }
    };

    const contentWrapper = /** @type {HTMLButtonElement} */ (this.__contentWrapperElement);
    contentWrapper.addEventListener('keydown', this.__keyNavigationEvent);
  }

  /**
   *
   * @param {number} modify
   * @param {Object} opts
   * @param {string} opts.dateType
   * @param {string} opts.type
   * @param {string} opts.mode
   */
  __modifyDate(modify, { dateType, type, mode }) {
    let tmpDate = new Date(this.centralDate);
    // if we're not working with days, reset
    // day count to first day of the month
    if (type !== 'Date') {
      tmpDate.setDate(1);
    }
    tmpDate[`set${type}`](tmpDate[`get${type}`]() + modify);
    // if we've reset the day count,
    // restore day count as best we can
    if (type !== 'Date') {
      const maxDays = new Date(tmpDate.getFullYear(), tmpDate.getMonth() + 1, 0).getDate();
      tmpDate.setDate(Math.min(this.centralDate.getDate(), maxDays));
    }
    if (!this.__isEnabledDate(tmpDate)) {
      tmpDate = this.__findBestEnabledDateFor(tmpDate, { mode });
    }
    this[dateType] = tmpDate;
  }

  __getLocale() {
    return this.locale || localize.locale;
  }
}
