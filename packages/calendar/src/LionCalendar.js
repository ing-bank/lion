import { html, LitElement } from '@lion/core';
import { localize, getWeekdayNames, getMonthNames, LocalizeMixin } from '@lion/localize';
import '@lion/core/src/differentKeyEventNamesShimIE.js';
import { createMultipleMonth } from './utils/createMultipleMonth.js';
import { dayTemplate } from './utils/dayTemplate.js';
import { dataTemplate } from './utils/dataTemplate.js';
import { getFirstDayNextMonth } from './utils/getFirstDayNextMonth.js';
import { getLastDayPreviousMonth } from './utils/getLastDayPreviousMonth.js';
import { isSameDate } from './utils/isSameDate.js';
import { calendarStyle } from './calendarStyle.js';
import { createDay } from './utils/createDay.js';
import { normalizeDateTime } from './utils/normalizeDateTime.js';

/**
 * @customElement
 */
export class LionCalendar extends LocalizeMixin(LitElement) {
  static get localizeNamespaces() {
    return [
      {
        'lion-calendar': locale => {
          switch (locale) {
            case 'bg-BG':
            case 'bg':
              return import('../translations/bg.js');
            case 'cs-CZ':
            case 'cs':
              return import('../translations/cs.js');
            case 'de-AT':
            case 'de-DE':
            case 'de':
              return import('../translations/de.js');
            case 'en-AU':
            case 'en-GB':
            case 'en-PH':
            case 'en-US':
            case 'en':
              return import('../translations/en.js');
            case 'es-ES':
            case 'es':
              return import('../translations/es.js');
            case 'fr-FR':
            case 'fr-BE':
            case 'fr':
              return import('../translations/fr.js');
            case 'hu-HU':
            case 'hu':
              return import('../translations/hu.js');
            case 'it-IT':
            case 'it':
              return import('../translations/it.js');
            case 'nl-BE':
            case 'nl-NL':
            case 'nl':
              return import('../translations/nl.js');
            case 'pl-PL':
            case 'pl':
              return import('../translations/pl.js');
            case 'ro-RO':
            case 'ro':
              return import('../translations/ro.js');
            case 'ru-RU':
            case 'ru':
              return import('../translations/ru.js');
            case 'sk-SK':
            case 'sk':
              return import('../translations/sk.js');
            case 'uk-UA':
            case 'uk':
              return import('../translations/uk.js');
            case 'zh-CN':
            case 'zh':
              return import('../translations/zh.js');
            default:
              return import(`../translations/${locale}.js`);
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
      minDate: { type: Date },

      /**
       * Maximum date. All dates after will be disabled
       */
      maxDate: { type: Date },

      /**
       * Disable certain dates
       */
      disableDates: { type: Function },

      /**
       * The selected date, usually synchronized with datepicker-input
       * Not to be confused with the focused date (therefore not necessarily in active month view)
       */
      selectedDate: { type: Date },

      /**
       * The date that
       * 1. determines the currently visible month
       * 2. will be focused when the month grid gets focused by the keyboard
       */
      centralDate: { type: Date },

      /**
       * Weekday that will be displayed in first column of month grid.
       * 0: sunday, 1: monday, 2: tuesday, 3: wednesday , 4: thursday, 5: friday, 6: saturday
       * Default is 0
       */
      firstDayOfWeek: { type: Number },

      /**
       * Weekday header notation, based on Intl DatetimeFormat:
       * - 'long' (e.g., Thursday)
       * - 'short' (e.g., Thu)
       * - 'narrow' (e.g., T).
       * Default is 'short'
       */
      weekdayHeaderNotation: { type: String },

      /**
       * Different locale for this component scope
       */
      locale: { type: String },

      /**
       * The currently focused date (if any)
       */
      __focusedDate: { type: Date },

      /**
       * Data to render current month grid
       */
      __data: { type: Object },
    };
  }

  constructor() {
    super();
    // Defaults
    this.__data = {};
    this.minDate = null;
    this.maxDate = null;
    this.dayPreprocessor = day => day;
    this.disableDates = () => false;
    this.firstDayOfWeek = 0;
    this.weekdayHeaderNotation = 'short';
    this.__today = normalizeDateTime(new Date());
    this.centralDate = this.__today;
    this.__focusedDate = null;
    this.__connectedCallbackDone = false;
  }

  static get styles() {
    return [calendarStyle];
  }

  render() {
    return html`
      <div class="calendar" role="application">
        ${this.__renderHeader()} ${this.__renderData()}
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

  async focusDate(date) {
    this.centralDate = date;
    await this.updateComplete;
    this.focusCentralDate();
  }

  focusCentralDate() {
    const button = this.shadowRoot.querySelector('button[tabindex="0"]');
    button.focus();
    this.__focusedDate = this.centralDate;
  }

  async focusSelectedDate() {
    await this.focusDate(this.selectedDate);
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();

    this.__connectedCallbackDone = true;

    this.__calculateInitialCentralDate();

    // setup data for initial render
    this.__data = this.__createData();
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.__removeEventDelegations();
  }

  firstUpdated() {
    super.firstUpdated();
    this.__contentWrapperElement = this.shadowRoot.getElementById('js-content-wrapper');

    this.__addEventDelegationForClickDate();
    this.__addEventDelegationForFocusDate();
    this.__addEventDelegationForBlurDate();
    this.__addEventForKeyboardNavigation();
  }

  updated(changed) {
    if (changed.has('__focusedDate') && this.__focusedDate) {
      this.focusCentralDate();
    }
  }

  /**
   * @override
   */
  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);

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

  __renderHeader() {
    const month = getMonthNames({ locale: this.__getLocale() })[this.centralDate.getMonth()];
    const year = this.centralDate.getFullYear();
    return html`
      <div class="calendar__header">
        ${this.__renderPreviousButton()}
        <h2
          class="calendar__month-heading"
          id="month_and_year"
          aria-live="polite"
          aria-atomic="true"
        >
          ${month} ${year}
        </h2>
        ${this.__renderNextButton()}
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

  __renderPreviousButton() {
    return html`
      <button
        class="calendar__previous-month-button"
        aria-label=${this.msgLit('lion-calendar:previousMonth')}
        title=${this.msgLit('lion-calendar:previousMonth')}
        @click=${this.goToPreviousMonth}
        ?disabled=${this.isPreviousMonthDisabled}
      >
        &lt;
      </button>
    `;
  }

  __renderNextButton() {
    return html`
      <button
        class="calendar__next-month-button"
        aria-label=${this.msgLit('lion-calendar:nextMonth')}
        title=${this.msgLit('lion-calendar:nextMonth')}
        @click=${this.goToNextMonth}
        ?disabled=${this.isNextMonthDisabled}
      >
        &gt;
      </button>
    `;
  }

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

    if (this.minDate && normalizeDateTime(day.date) < normalizeDateTime(this.minDate)) {
      day.disabled = true;
    }

    if (this.maxDate && normalizeDateTime(day.date) > normalizeDateTime(this.maxDate)) {
      day.disabled = true;
    }

    return this.dayPreprocessor(day);
  }

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

    this.isNextMonthDisabled =
      this.maxDate && getFirstDayNextMonth(this.centralDate) > this.maxDate;
    this.isPreviousMonthDisabled =
      this.minDate && getLastDayPreviousMonth(this.centralDate) < this.minDate;

    return data;
  }

  __disableDatesChanged() {
    if (this.__connectedCallbackDone) {
      this.__ensureValidCentralDate();
    }
  }

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
    const isDayButton = el => el.classList.contains('calendar__day-button');
    this.__clickDateDelegation = this.__contentWrapperElement.addEventListener('click', ev => {
      const el = ev.target;
      if (isDayButton(el)) {
        this.__dateSelectedByUser(el.date);
      }
    });
  }

  __addEventDelegationForFocusDate() {
    const isDayButton = el => el.classList.contains('calendar__day-button');
    this.__focusDateDelegation = this.__contentWrapperElement.addEventListener(
      'focus',
      () => {
        if (!this.__focusedDate && isDayButton(this.shadowRoot.activeElement)) {
          this.__focusedDate = this.shadowRoot.activeElement.date;
        }
      },
      true,
    );
  }

  __addEventDelegationForBlurDate() {
    const isDayButton = el => el.classList.contains('calendar__day-button');
    this.__blurDateDelegation = this.__contentWrapperElement.addEventListener(
      'blur',
      () => {
        setTimeout(() => {
          if (this.shadowRoot.activeElement && !isDayButton(this.shadowRoot.activeElement)) {
            this.__focusedDate = null;
          }
        }, 1);
      },
      true,
    );
  }

  __removeEventDelegations() {
    this.__contentWrapperElement.removeEventListener('click', this.__clickDateDelegation);
    this.__contentWrapperElement.removeEventListener('focus', this.__focusDateDelegation);
    this.__contentWrapperElement.removeEventListener('blur', this.__blurDateDelegation);
    this.__contentWrapperElement.removeEventListener('keydown', this.__keyNavigationEvent);
  }

  __addEventForKeyboardNavigation() {
    this.__keyNavigationEvent = this.__contentWrapperElement.addEventListener('keydown', ev => {
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
    });
  }

  __modifyDate(modify, { dateType, type, mode } = {}) {
    let tmpDate = new Date(this.centralDate);
    tmpDate[`set${type}`](tmpDate[`get${type}`]() + modify);

    if (!this.__isEnabledDate(tmpDate)) {
      tmpDate = this.__findBestEnabledDateFor(tmpDate, { mode });
    }

    this[dateType] = tmpDate;
  }

  __getLocale() {
    return this.locale || localize.locale;
  }
}
