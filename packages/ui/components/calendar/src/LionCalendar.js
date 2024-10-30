/* eslint-disable import/no-extraneous-dependencies */
import { html, LitElement } from 'lit';
import {
  getMonthNames,
  getWeekdayNames,
  LocalizeMixin,
  normalizeDateTime,
} from '@lion/ui/localize-no-side-effects.js';

import { calendarStyle } from './calendarStyle.js';
import { createDay } from './utils/createDay.js';
import { createMultipleMonth } from './utils/createMultipleMonth.js';
import { dataTemplate } from './utils/dataTemplate.js';
import { dayTemplate } from './utils/dayTemplate.js';
import { getFirstDayNextMonth } from './utils/getFirstDayNextMonth.js';
import { getLastDayPreviousMonth } from './utils/getLastDayPreviousMonth.js';
import { isSameDate } from './utils/isSameDate.js';
import { getDayMonthYear } from './utils/getDayMonthYear.js';

/**
 * @typedef {import('../types/day.js').Day} Day
 * @typedef {import('../types/day.js').Week} Week
 * @typedef {import('../types/day.js').Month} Month
 */

const isDayButton = /** @param {HTMLElement} el */ el =>
  el.classList.contains('calendar__day-button');

/**
 * @param {HTMLElement} el
 * @returns {boolean}
 */
function isDisabledDayButton(el) {
  return el.getAttribute('aria-disabled') === 'true';
}

/**
 * @customElement lion-calendar
 */
export class LionCalendar extends LocalizeMixin(LitElement) {
  static get localizeNamespaces() {
    return [
      {
        'lion-calendar': /** @param {string} locale */ locale => {
          switch (locale) {
            case 'bg-BG':
            case 'bg':
              return import('@lion/ui/calendar-translations/bg.js');
            case 'cs-CZ':
            case 'cs':
              return import('@lion/ui/calendar-translations/cs.js');
            case 'de-AT':
            case 'de-DE':
            case 'de':
              return import('@lion/ui/calendar-translations/de.js');
            case 'en-AU':
            case 'en-GB':
            case 'en-PH':
            case 'en-US':
            case 'en':
              return import('@lion/ui/calendar-translations/en.js');
            case 'es-ES':
            case 'es':
              return import('@lion/ui/calendar-translations/es.js');
            case 'fr-FR':
            case 'fr-BE':
            case 'fr':
              return import('@lion/ui/calendar-translations/fr.js');
            case 'hu-HU':
            case 'hu':
              return import('@lion/ui/calendar-translations/hu.js');
            case 'it-IT':
            case 'it':
              return import('@lion/ui/calendar-translations/it.js');
            case 'nl-BE':
            case 'nl-NL':
            case 'nl':
              return import('@lion/ui/calendar-translations/nl.js');
            case 'pl-PL':
            case 'pl':
              return import('@lion/ui/calendar-translations/pl.js');
            case 'ro-RO':
            case 'ro':
              return import('@lion/ui/calendar-translations/ro.js');
            case 'ru-RU':
            case 'ru':
              return import('@lion/ui/calendar-translations/ru.js');
            case 'sk-SK':
            case 'sk':
              return import('@lion/ui/calendar-translations/sk.js');
            case 'uk-UA':
            case 'uk':
              return import('@lion/ui/calendar-translations/uk.js');
            case 'zh-CN':
            case 'zh':
              return import('@lion/ui/calendar-translations/zh.js');
            default:
              return import('@lion/ui/calendar-translations/en.js');
          }
        },
      },
      ...super.localizeNamespaces,
    ];
  }

  static get properties() {
    return {
      /**
       * Minimum date. All dates before will be disabled
       */
      minDate: { attribute: false },

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
    /** @type {{months: Month[]}}
     * @private
     */
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
    /** @private */
    this.__today = normalizeDateTime(new Date());
    /** @type {Date} */
    this.centralDate = this.__today;
    /**
     * @type {Date | null}
     * @private
     */
    this.__focusedDate = null;
    /** @private */
    this.__connectedCallbackDone = false;
    /** @private */
    this.__eventsAdded = false;
    this.locale = '';
    /** @private */
    this.__boundKeyboardNavigationEvent = this.__keyboardNavigationEvent.bind(this);
    /** @private */
    this.__boundClickDateDelegation = this.__clickDateDelegation.bind(this);
    /** @private */
    this.__boundFocusDateDelegation = this.__focusDateDelegation.bind(this);
    /** @private */
    this.__boundBlurDateDelegation = this.__focusDateDelegation.bind(this);
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
    this.__modifyDate(1, { dateType: 'centralDate', type: 'Month' });
  }

  goToPreviousMonth() {
    this.__modifyDate(-1, { dateType: 'centralDate', type: 'Month' });
  }

  goToNextYear() {
    this.__modifyDate(1, { dateType: 'centralDate', type: 'FullYear' });
  }

  goToPreviousYear() {
    this.__modifyDate(-1, { dateType: 'centralDate', type: 'FullYear' });
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
    const datesTable = /** @type {HTMLElement} */ (
      this.shadowRoot?.querySelector('#js-content-wrapper')
    );
    const button = /** @type {HTMLElement} */ (datesTable.querySelector('[tabindex="0"]'));
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

    /**
     * This logic needs to happen on firstUpdated, but every time the DOM node is moved as well
     * since firstUpdated only runs once, this logic is moved here, but after updateComplete
     * this acts as a firstUpdated that runs on every reconnect as well
     */
    await this.updateComplete;

    /**
     * Flow goes like:
     * 1) first connectedCallback before updateComplete
     * 2) disconnectedCallback
     * 3) second connectedCallback before updateComplete
     * 4) first connectedCallback after updateComplete
     * 5) second connectedCallback after updateComplete
     *
     * The __eventsAdded property tracks whether events are added / removed and here
     * we can guard against adding events twice
     */
    if (!this.__eventsAdded) {
      this.__contentWrapperElement = /** @type {HTMLButtonElement} */ (
        this.shadowRoot?.getElementById('js-content-wrapper')
      );
      this.__contentWrapperElement.addEventListener('click', this.__boundClickDateDelegation);
      this.__contentWrapperElement.addEventListener('focus', this.__boundFocusDateDelegation);
      this.__contentWrapperElement.addEventListener('blur', this.__boundBlurDateDelegation);
      this.__contentWrapperElement.addEventListener('keydown', this.__boundKeyboardNavigationEvent);
      this.__eventsAdded = true;
    }
  }

  /** @param {import('lit').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__calculateInitialCentralDate();

    // setup data for initial render
    this.__data = this.__createData();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.__contentWrapperElement) {
      this.__contentWrapperElement.removeEventListener('click', this.__boundClickDateDelegation);
      this.__contentWrapperElement.removeEventListener('focus', this.__boundFocusDateDelegation);
      this.__contentWrapperElement.removeEventListener('blur', this.__boundBlurDateDelegation);
      this.__contentWrapperElement.removeEventListener(
        'keydown',
        this.__boundKeyboardNavigationEvent,
      );

      this.__eventsAdded = false;
    }
  }

  /** @param {import('lit').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('__focusedDate') && this.__focusedDate) {
      this.focusCentralDate();
    }
  }

  /**
   * @param {string} [name]
   * @param {unknown} [oldValue]
   * @param {import('lit').PropertyDeclaration} [options]
   * @returns {void}
   */
  requestUpdate(name, oldValue, options) {
    super.requestUpdate(name, oldValue, options);

    if (name === undefined) {
      return;
    }

    if (name === '__focusedDate') {
      this.__focusedDateChanged();
    }

    const updateDataOn = ['centralDate', 'minDate', 'maxDate', 'selectedDate', 'disableDates'];

    if (updateDataOn.includes(name) && this.__connectedCallbackDone) {
      this.__data = this.__createData();
    }
  }

  /**
   * This exposes an interface for datepickers that want to
   * reinitialize when calendar is opened
   */
  initCentralDate() {
    if (this.selectedDate) {
      this.focusSelectedDate();
    } else {
      this.centralDate = /** @type {Date} */ (this.__initialCentralDate);
      this.focusCentralDate();
    }
  }

  /**
   * // TODO: check if this is a false positive or if we can improve
   * @configure ReactiveElement
   */
  static enabledWarnings = super.enabledWarnings?.filter(w => w !== 'change-in-update') || [];

  /**
   * @private
   */
  __calculateInitialCentralDate() {
    if (this.centralDate === this.__today && this.selectedDate) {
      // initialized with selectedDate only if user didn't provide another one
      this.centralDate = this.selectedDate;
    } else if (!this.__isEnabledDate(this.centralDate)) {
      this.centralDate = this.findNearestEnabledDate(this.centralDate);
    }
    /** @type {Date} */
    this.__initialCentralDate = this.centralDate;
  }

  /**
   * @param {string} month
   * @param {number} year
   * @private
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
   * @private
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

  /**
   * @private
   */
  __renderNavigation() {
    const month = getMonthNames({ locale: this.__getLocale() })[this.centralDate.getMonth()];
    const year = this.centralDate.getFullYear();
    return html`
      <div class="calendar__navigation">
        ${this.__renderYearNavigation(month, year)} ${this.__renderMonthNavigation(month, year)}
      </div>
    `;
  }

  /**
   * @private
   */
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
   * @private
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
   * @private
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
   * @protected
   */
  // TODO: rename to _previousButtonTemplate in v1. Also see: https://github.com/ing-bank/lion/discussions/591
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
        ${this._previousIconTemplate()}
      </button>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _previousIconTemplate() {
    return html`&lt;`;
  }

  /**
   * @param {string} type
   * @param {string} nextMonth
   * @param {number} nextYear
   * @protected
   */
  // TODO: rename to _nextButtonTemplate in v1. Also see: https://github.com/ing-bank/lion/discussions/591
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
        ${this._nextIconTemplate()}
      </button>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _nextIconTemplate() {
    return html`&gt;`;
  }

  /**
   *
   * @param {string} mode
   * @param {string} type
   * @param {string} month
   * @param {number} year
   * @private
   */
  __getNavigationLabel(mode, type, month, year) {
    return `${this.msgLit(`lion-calendar:${mode}${type}`)}, ${month} ${year}`;
  }

  /**
   *
   * @private
   */
  __getSelectableDateRange() {
    const newMinDate = createDay(new Date(this.minDate));
    const newMaxDate = createDay(new Date(this.maxDate));

    const getSelectableDate = (/** @type {import("../types/day.js").Day} */ date) => {
      const { dayNumber, monthName, year } = getDayMonthYear(
        date,
        getWeekdayNames({
          locale: this.__getLocale(),
          style: 'long',
          firstDayOfWeek: this.firstDayOfWeek,
        }),
      );
      return `${dayNumber} ${monthName} ${year}`;
    };

    const earliestSelectableDate = getSelectableDate(newMinDate);
    const latestSelectableDate = getSelectableDate(newMaxDate);

    return {
      earliestSelectableDate,
      latestSelectableDate,
    };
  }

  /**
   *
   * @param {Day} _day
   * @param {*} param1
   * @private
   */
  __coreDayPreprocessor(_day, { currentMonth = false } = {}) {
    const day = createDay(new Date(_day.date), _day);
    const today = normalizeDateTime(new Date());
    day.central = isSameDate(day.date, this.centralDate);
    const dayYearMonth = `${day.date.getFullYear()}${`0${day.date.getMonth() + 1}`.slice(-2)}`;
    const currentYearMonth =
      currentMonth && `${currentMonth.getFullYear()}${`0${currentMonth.getMonth() + 1}`.slice(-2)}`;
    day.previousMonth = currentMonth && dayYearMonth < currentYearMonth;
    day.currentMonth = currentMonth && dayYearMonth === currentYearMonth;
    day.nextMonth = currentMonth && dayYearMonth > currentYearMonth;
    day.selected = this.selectedDate ? isSameDate(day.date, this.selectedDate) : false;
    day.past = day.date < today;
    day.today = isSameDate(day.date, today);
    day.future = day.date > today;
    day.disabled = this.disableDates(day.date);
    day.tabindex = day.central ? '0' : '-1';
    day.ariaPressed = day.selected ? 'true' : 'false';
    day.ariaCurrent = day.today ? 'date' : undefined;
    day.disabledInfo = '';

    if (this.minDate && normalizeDateTime(day.date) < normalizeDateTime(this.minDate)) {
      day.disabled = true;
      // TODO: turn this into a translated string
      day.disabledInfo = `This date is unavailable. Earliest date to select is ${
        this.__getSelectableDateRange().earliestSelectableDate
      }. Please select another date.`;
    }

    if (this.maxDate && normalizeDateTime(day.date) > normalizeDateTime(this.maxDate)) {
      day.disabled = true;
      // TODO: turn this into a translated string
      day.disabledInfo = `This date is unavailable. Latest date to select is ${
        this.__getSelectableDateRange().latestSelectableDate
      }. Please select another date.`;
    }

    if (day.disabled) {
      // TODO: turn this into a translated string
      day.disabledInfo = `This date is unavailable. Please select another date`;
    }

    return this.dayPreprocessor(day);
  }

  /**
   * @param {Day} [options]
   * @private
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

  /**
   * @param {Date} selectedDate
   * @private
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

  /**
   * @private
   */
  __focusedDateChanged() {
    if (this.__focusedDate) {
      this.centralDate = this.__focusedDate;
    }
  }

  /**
   * @param {Date} [date]
   * @returns
   */
  findNextEnabledDate(date) {
    const _date = date || this.centralDate;
    return this.__findBestEnabledDateFor(_date, { mode: 'future' });
  }

  /**
   * @param {Date} [date]
   * @returns
   */
  findPreviousEnabledDate(date) {
    const _date = date || this.centralDate;
    return this.__findBestEnabledDateFor(_date, { mode: 'past' });
  }

  /**
   * @param {Date} [date]
   * @returns
   */
  findNearestEnabledDate(date) {
    const _date = date || this.centralDate;
    return this.__findBestEnabledDateFor(_date, { mode: 'both' });
  }

  /**
   * @param {Date} date
   * @private
   */
  __isEnabledDate(date) {
    const processedDay = this.__coreDayPreprocessor({ date });
    return !processedDay.disabled;
  }

  /**
   * @param {Date} date
   * @param {Object} opts
   * @param {String} [opts.mode] Find best date in `future/past/both`
   * @private
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

  /**
   * @param {Event} ev
   * @private
   */
  __clickDateDelegation(ev) {
    const el = /** @type {HTMLElement & { date: Date }} */ (ev.composedPath()[0]);
    if (isDayButton(el) && !isDisabledDayButton(el)) {
      this.__dateSelectedByUser(el.date);
    }
  }

  /**
   * @private
   */
  __focusDateDelegation() {
    if (
      !this.__focusedDate &&
      isDayButton(/** @type {HTMLElement} el */ (this.shadowRoot?.activeElement))
    ) {
      this.__focusedDate = /** @type {HTMLButtonElement & { date: Date }} */ (
        this.shadowRoot?.activeElement
      )?.date;
    }
  }

  /**
   * @private
   */
  __blurDateDelegation() {
    setTimeout(() => {
      if (
        this.shadowRoot?.activeElement &&
        !isDayButton(/** @type {HTMLElement} el */ (this.shadowRoot?.activeElement))
      ) {
        this.__focusedDate = null;
      }
    }, 1);
  }

  /**
   * @param {HTMLElement & { date: Date }} el
   * @private
   */
  __dayButtonSelection(el) {
    if (isDayButton(el) && !isDisabledDayButton(el)) {
      this.__dateSelectedByUser(el.date);
    }
  }

  /**
   * @param {KeyboardEvent} ev
   * @private
   */
  __keyboardNavigationEvent(ev) {
    const preventedKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'PageDown',
      'PageUp',
      ' ',
      'Enter',
    ];

    if (preventedKeys.includes(ev.key)) {
      ev.preventDefault();
    }

    switch (ev.key) {
      case ' ':
      case 'Enter':
        this.__dayButtonSelection(
          /** @type {HTMLElement & { date: Date }} */ (ev.composedPath()[0]),
        );
        break;
      case 'ArrowUp':
        this.__modifyDate(-7, { dateType: '__focusedDate', type: 'Date' });
        break;
      case 'ArrowDown':
        this.__modifyDate(7, { dateType: '__focusedDate', type: 'Date' });
        break;
      case 'ArrowLeft':
        this.__modifyDate(-1, { dateType: '__focusedDate', type: 'Date' });
        break;
      case 'ArrowRight':
        this.__modifyDate(1, { dateType: '__focusedDate', type: 'Date' });
        break;
      case 'PageDown':
        if (ev.altKey === true) {
          this.__modifyDate(1, { dateType: '__focusedDate', type: 'FullYear' });
        } else {
          this.__modifyDate(1, { dateType: '__focusedDate', type: 'Month' });
        }
        break;
      case 'PageUp':
        if (ev.altKey === true) {
          this.__modifyDate(-1, { dateType: '__focusedDate', type: 'FullYear' });
        } else {
          this.__modifyDate(-1, { dateType: '__focusedDate', type: 'Month' });
        }
        break;
      case 'Tab':
        this.__focusedDate = null;
        break;
      // no default
    }
  }

  /**
   *
   * @param {number} modify
   * @param {Object} opts
   * @param {string} opts.dateType
   * @param {string} opts.type
   * @private
   */
  __modifyDate(modify, { dateType, type }) {
    const tmpDate = new Date(this.centralDate);
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
    this[dateType] = tmpDate;
  }

  /**
   * @private
   */
  __getLocale() {
    return this.locale || this._localizeManager.locale;
  }
}
