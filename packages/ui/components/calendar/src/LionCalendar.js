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

/** Number of months in a year */
const MONTHS_IN_YEAR = 12;

/** Number of years displayed in the year selection grid */
const YEAR_GRID_SIZE = 12;

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
            case 'tr-TR':
            case 'tr':
              return import('@lion/ui/calendar-translations/tr.js');
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

      /**
       * Current view mode: 'month' | 'month-selection' | 'year-selection'
       * @private
       */
      __viewMode: { attribute: false },

      /**
       * First year in the current year selection grid
       * @private
       */
      __yearRangeStart: { attribute: false },

      /**
       * Focused month index (0-11) in month selection view
       * @private
       */
      __focusedMonthIndex: { attribute: false },

      /**
       * Focused year index (0-11) in year selection view
       * @private
       */
      __focusedYearIndex: { attribute: false },
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

    // Month/Year selection state
    /** @type {'month' | 'month-selection' | 'year-selection'} @private */
    this.__viewMode = 'month';
    /** @type {number} @private */
    this.__yearRangeStart = new Date().getFullYear() - 4;
    /** @type {number} @private */
    this.__focusedMonthIndex = 0;
    /** @type {number} @private */
    this.__focusedYearIndex = 0;
    /**
     * Cache for month disabled state computation (disableDates)
     * @type {Map<string, boolean> | null}
     * @private
     */
    this.__monthDisabledCache = null;

    /** @private */
    this.__boundHandleClickOutside = this.__handleClickOutside.bind(this);
  }

  static get styles() {
    return [calendarStyle];
  }

  render() {
    const isSelectionActive = this.__viewMode !== 'month';
    return html`
      <div
        class="calendar${isSelectionActive ? ' calendar--selection-active' : ''}"
        role="application"
      >
        ${this.__renderNavigation()} ${this.__renderData()}
        ${this.__viewMode === 'month-selection' ? this.__renderMonthSelectionView() : ''}
        ${this.__viewMode === 'year-selection' ? this.__renderYearSelectionView() : ''}
        <div
          aria-live="polite"
          aria-atomic="true"
          class="u-sr-only"
          id="calendar-live-region"
        ></div>
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
    if (!datesTable) return;
    const button = /** @type {HTMLElement} */ (datesTable.querySelector('[tabindex="0"]'));
    if (button) {
      button.focus();
      this.__focusedDate = this.centralDate;
    }
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
      if (this.__contentWrapperElement) {
        this.__contentWrapperElement.addEventListener('click', this.__boundClickDateDelegation);
        this.__contentWrapperElement.addEventListener('focus', this.__boundFocusDateDelegation);
        this.__contentWrapperElement.addEventListener('blur', this.__boundBlurDateDelegation);
        this.__contentWrapperElement.addEventListener(
          'keydown',
          this.__boundKeyboardNavigationEvent,
        );
      }
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
    // Clean up click outside listener if active
    this.__removeClickOutsideListener();
  }

  /** @param {import('lit').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('__focusedDate') && this.__focusedDate) {
      this.focusCentralDate();
    }
    // Manage click-outside listener based on view mode
    if (changedProperties.has('__viewMode')) {
      if (this.__viewMode !== 'month') {
        this.__setupClickOutsideListener();
      } else {
        this.__removeClickOutsideListener();
      }
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
      // Invalidate month disabled cache when constraints change
      if (['minDate', 'maxDate', 'disableDates'].includes(name)) {
        this.__monthDisabledCache = null;
      }
      this.__data = this.__createData();
    }
  }

  /**
   * This exposes an interface for datepickers that want to
   * reinitialize when calendar is opened
   */
  initCentralDate() {
    // Reset view mode when calendar is re-opened (e.g. from datepicker overlay)
    this.__viewMode = 'month';
    if (this.selectedDate) {
      if (this.__isEnabledDate(this.selectedDate)) {
        // Selected date is valid and within range — navigate to it
        this.focusSelectedDate();
      } else {
        // Selected date exists but is outside min/max range (e.g. user typed an out-of-range
        // date in the input). Navigate to the nearest selectable date instead so the user can
        // pick from a valid range.
        this.centralDate = this.findNearestEnabledDate(this.selectedDate);
        this.focusCentralDate();
      }
    } else {
      if (!this.__isEnabledDate(/** @type {Date} */ (this.__initialCentralDate))) {
        this.centralDate = this.findNearestEnabledDate(this.__initialCentralDate);
      } else {
        this.centralDate = /** @type {Date} */ (this.__initialCentralDate);
      }
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
        <button
          id="month-heading"
          class="calendar__navigation-heading calendar__navigation-heading--interactive"
          aria-label="${month}, ${this.msgLit('lion-calendar:selectMonth')}"
          aria-atomic="true"
          @click=${this.__toggleMonthSelection}
          @keydown=${this.__monthHeadingKeydown}
        >
          ${month}
          <span class="calendar__heading-indicator" aria-hidden="true">▾</span>
        </button>
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
        <button
          id="year-heading"
          class="calendar__navigation-heading calendar__navigation-heading--interactive"
          aria-label="${year}, ${this.msgLit('lion-calendar:selectYear')}"
          @click=${this.__toggleYearSelection}
          @keydown=${this.__yearHeadingKeydown}
        >
          ${year}
          <span class="calendar__heading-indicator" aria-hidden="true">▾</span>
        </button>
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
   * Renders the month selection grid (3x4, 12 months)
   * @private
   */
  __renderMonthSelectionView() {
    const months = getMonthNames({ locale: this.__getLocale() });
    const currentMonth = this.centralDate.getMonth();

    return html`
      <div
        id="month-selection-grid"
        class="calendar__month-selection"
        role="grid"
        aria-label="${this.msgLit('lion-calendar:selectMonth')}"
        @keydown=${this.__monthSelectionKeydownHandler}
      >
        ${months.map((monthName, index) => {
          const isDisabled = this.__isMonthDisabled(index);
          const isCurrent = index === currentMonth;
          const isFocused = index === this.__focusedMonthIndex;
          return html`
            <button
              class="calendar__month-button${isCurrent ? ' calendar__month-button--current' : ''}"
              role="gridcell"
              aria-disabled="${isDisabled}"
              aria-selected="${isCurrent}"
              tabindex="${isFocused ? '0' : '-1'}"
              data-month-index="${index}"
              @click=${() => this.__selectMonth(index)}
            >
              ${monthName}
            </button>
          `;
        })}
      </div>
    `;
  }

  /**
   * Renders the year selection grid (4x3, 12 years) with range navigation
   * @private
   */
  __renderYearSelectionView() {
    const years = this.__getYearsForCurrentRange();
    const currentYear = this.centralDate.getFullYear();
    const rangeEnd = this.__yearRangeStart + YEAR_GRID_SIZE - 1;

    return html`
      <div class="calendar__year-selection">
        <div class="calendar__year-selection-header">
          <button
            class="calendar__year-range-prev"
            @click=${this.__previousYearRange}
            ?disabled=${this.__isPreviousRangeDisabled()}
            aria-label="${this.msgLit('lion-calendar:previousYearRange')}"
          >
            ${this._previousIconTemplate()}
          </button>
          <span class="calendar__year-range-label">
            ${this.__yearRangeStart}&nbsp;–&nbsp;${rangeEnd}
          </span>
          <button
            class="calendar__year-range-next"
            @click=${this.__nextYearRange}
            ?disabled=${this.__isNextRangeDisabled()}
            aria-label="${this.msgLit('lion-calendar:nextYearRange')}"
          >
            ${this._nextIconTemplate()}
          </button>
        </div>
        <div
          id="year-selection-grid"
          class="calendar__year-grid"
          role="grid"
          aria-label="${this.msgLit('lion-calendar:selectYear')}"
          @keydown=${this.__yearSelectionKeydownHandler}
        >
          ${years.map((year, index) => {
            const isDisabled = this.__isYearDisabled(year);
            const isCurrent = year === currentYear;
            const isFocused = index === this.__focusedYearIndex;
            return html`
              <button
                class="calendar__year-button${isCurrent ? ' calendar__year-button--current' : ''}"
                role="gridcell"
                aria-disabled="${isDisabled}"
                aria-selected="${isCurrent}"
                tabindex="${isFocused ? '0' : '-1'}"
                data-year="${year}"
                @click=${() => this.__selectYear(year)}
              >
                ${year}
              </button>
            `;
          })}
        </div>
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
   * Toggle the month selection view
   * @private
   */
  __toggleMonthSelection() {
    if (this.__viewMode === 'month-selection') {
      this.__closeSelectionView('month-heading');
    } else {
      this.__openMonthSelection();
    }
  }

  /**
   * Toggle the year selection view
   * @private
   */
  __toggleYearSelection() {
    if (this.__viewMode === 'year-selection') {
      this.__closeSelectionView('year-heading');
    } else {
      this.__openYearSelection();
    }
  }

  /**
   * Open month selection view and set initial focus
   * @private
   */
  async __openMonthSelection() {
    this.__focusedMonthIndex = this.centralDate.getMonth();
    this.__viewMode = 'month-selection';
    await this.updateComplete;
    this.__announceToScreenReader(this.msgLit('lion-calendar:monthSelectionOpened'));
    this.__focusMonthInSelection(this.__focusedMonthIndex);
  }

  /**
   * Open year selection view and set initial focus
   * @private
   */
  async __openYearSelection() {
    const currentYear = this.centralDate.getFullYear();
    this.__initializeYearRange(currentYear);
    // Set focused index to the current year position in range
    this.__focusedYearIndex = currentYear - this.__yearRangeStart;
    if (this.__focusedYearIndex < 0 || this.__focusedYearIndex >= YEAR_GRID_SIZE) {
      this.__focusedYearIndex = 0;
    }
    this.__viewMode = 'year-selection';
    await this.updateComplete;
    const rangeEnd = this.__yearRangeStart + YEAR_GRID_SIZE - 1;
    this.__announceToScreenReader(
      this.msgLit('lion-calendar:yearSelectionOpened', {
        startYear: this.__yearRangeStart,
        endYear: rangeEnd,
      }),
    );
    this.__focusYearInSelection(this.__focusedYearIndex);
  }

  /**
   * Close the current selection view and return focus to heading
   * @param {string} headingId
   * @private
   */
  __closeSelectionView(headingId) {
    this.__viewMode = 'month';
    // Return focus to heading after DOM update
    requestAnimationFrame(() => {
      const heading = /** @type {HTMLElement | null} */ (
        this.shadowRoot?.getElementById(headingId)
      );
      heading?.focus();
    });
  }

  /**
   * Select a month from the month selection view
   * @param {number} monthIndex - 0-11
   * @private
   */
  async __selectMonth(monthIndex) {
    if (this.__isMonthDisabled(monthIndex)) {
      return;
    }
    const newDate = new Date(this.centralDate);
    newDate.setMonth(monthIndex);
    // Clamp day to valid range for the new month
    const maxDays = new Date(newDate.getFullYear(), monthIndex + 1, 0).getDate();
    newDate.setDate(Math.min(this.centralDate.getDate(), maxDays));
    // Clamp to minDate/maxDate
    this.centralDate = this.__clampDateToRange(newDate);
    this.__viewMode = 'month';
    await this.updateComplete;
    this.__announceToScreenReader(
      `${getMonthNames({ locale: this.__getLocale() })[this.centralDate.getMonth()]} ${this.centralDate.getFullYear()}`,
    );
    this.__focusFirstEnabledDay();
  }

  /**
   * Keyboard handler for month heading button
   * @param {KeyboardEvent} ev
   * @private
   */
  __monthHeadingKeydown(ev) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.__toggleMonthSelection();
    }
  }

  /**
   * Keyboard handler inside month selection grid
   * @param {KeyboardEvent} ev
   * @private
   */
  __monthSelectionKeydownHandler(ev) {
    const preventedKeys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Enter',
      ' ',
      'Escape',
      'Tab',
    ];
    if (preventedKeys.includes(ev.key)) {
      ev.preventDefault();
    }

    const COLS = 3;
    let newIndex = this.__focusedMonthIndex;

    switch (ev.key) {
      case 'ArrowRight':
        newIndex = this.__findNextEnabledMonthFrom(this.__focusedMonthIndex, 1);
        break;
      case 'ArrowLeft':
        newIndex = this.__findNextEnabledMonthFrom(this.__focusedMonthIndex, -1);
        break;
      case 'ArrowDown':
        newIndex = this.__findNextEnabledMonthFrom(this.__focusedMonthIndex, COLS);
        break;
      case 'ArrowUp':
        newIndex = this.__findNextEnabledMonthFrom(this.__focusedMonthIndex, -COLS);
        break;
      case 'Enter':
      case ' ':
        this.__selectMonth(this.__focusedMonthIndex);
        return;
      case 'Escape':
        this.__closeSelectionView('month-heading');
        return;
      case 'Tab':
        // Allow tab to exit the grid naturally
        this.__viewMode = 'month';
        return;
      // no default
    }

    if (newIndex !== -1 && newIndex !== this.__focusedMonthIndex) {
      this.__focusedMonthIndex = newIndex;
      this.__focusMonthInSelection(newIndex);
    }
  }

  /**
   * Find the next enabled month from a given index, moving by `step`
   * Wraps within 0-11 range
   * @param {number} currentIndex
   * @param {number} step
   * @returns {number} next enabled month index, or currentIndex if none
   * @private
   */
  __findNextEnabledMonthFrom(currentIndex, step) {
    const wrapMonth = n => ((n % MONTHS_IN_YEAR) + MONTHS_IN_YEAR) % MONTHS_IN_YEAR;
    const direction = step > 0 ? 1 : -1;
    const startIndex = wrapMonth(currentIndex + step);
    const candidate = Array.from({ length: MONTHS_IN_YEAR }, (_, i) =>
      wrapMonth(startIndex + direction * i),
    ).find(idx => !this.__isMonthDisabled(idx));
    return candidate ?? currentIndex;
  }

  /**
   * Focus a month button in the selection view
   * @param {number} monthIndex
   * @private
   */
  async __focusMonthInSelection(monthIndex) {
    await this.updateComplete;
    const buttons = /** @type {NodeListOf<HTMLElement>} */ (
      this.shadowRoot?.querySelectorAll('.calendar__month-button')
    );
    if (buttons && buttons[monthIndex] && !this.__isMonthDisabled(monthIndex)) {
      buttons[monthIndex].focus();
    } else if (buttons) {
      // Find first enabled month
      const enabledIndex = Array.from({ length: MONTHS_IN_YEAR }, (_, i) => i).find(
        i => !this.__isMonthDisabled(i),
      );
      if (enabledIndex !== undefined) {
        this.__focusedMonthIndex = enabledIndex;
        buttons[enabledIndex]?.focus();
      }
    }
  }

  /**
   * Select a year from the year selection view
   * @param {number} year
   * @private
   */
  async __selectYear(year) {
    if (this.__isYearDisabled(year)) {
      return;
    }
    const newDate = new Date(this.centralDate);
    newDate.setFullYear(year);
    // Adjust month if the new year causes out-of-range
    this.centralDate = this.__clampDateToRange(newDate);
    this.__viewMode = 'month';
    await this.updateComplete;
    this.__announceToScreenReader(
      `${getMonthNames({ locale: this.__getLocale() })[this.centralDate.getMonth()]} ${this.centralDate.getFullYear()}`,
    );
    this.__focusFirstEnabledDay();
  }

  /**
   * Keyboard handler for year heading button
   * @param {KeyboardEvent} ev
   * @private
   */
  __yearHeadingKeydown(ev) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.__toggleYearSelection();
    }
  }

  /**
   * Keyboard handler inside year selection grid
   * @param {KeyboardEvent} ev
   * @private
   */
  __yearSelectionKeydownHandler(ev) {
    const preventedKeys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Enter',
      ' ',
      'Escape',
      'PageUp',
      'PageDown',
      'Tab',
    ];
    if (preventedKeys.includes(ev.key)) {
      ev.preventDefault();
    }

    const COLS = 4;
    let newIndex = this.__focusedYearIndex;

    switch (ev.key) {
      case 'ArrowRight':
        newIndex = this.__findNextEnabledYearFrom(this.__focusedYearIndex, 1);
        break;
      case 'ArrowLeft':
        newIndex = this.__findNextEnabledYearFrom(this.__focusedYearIndex, -1);
        break;
      case 'ArrowDown':
        newIndex = this.__findNextEnabledYearFrom(this.__focusedYearIndex, COLS);
        break;
      case 'ArrowUp':
        newIndex = this.__findNextEnabledYearFrom(this.__focusedYearIndex, -COLS);
        break;
      case 'Enter':
      case ' ': {
        const years = this.__getYearsForCurrentRange();
        this.__selectYear(years[this.__focusedYearIndex]);
        return;
      }
      case 'Escape':
        this.__closeSelectionView('year-heading');
        return;
      case 'PageDown':
        this.__nextYearRange();
        return;
      case 'PageUp':
        this.__previousYearRange();
        return;
      case 'Tab':
        this.__viewMode = 'month';
        return;
      // no default
    }

    if (newIndex !== this.__focusedYearIndex) {
      this.__focusedYearIndex = newIndex;
      this.__focusYearInSelection(newIndex);
    }
  }

  /**
   * Find next enabled year index from current index, moving by `step`
   * Stays within the 0-(YEAR_GRID_SIZE-1) range
   * @param {number} currentIndex
   * @param {number} step
   * @returns {number}
   * @private
   */
  __findNextEnabledYearFrom(currentIndex, step) {
    const years = this.__getYearsForCurrentRange();
    const total = years.length;
    const startIndex = Math.max(0, Math.min(total - 1, currentIndex + step));
    const direction = step > 0 ? 1 : -1;
    const candidate = Array.from({ length: total }, (_, i) => startIndex + direction * i).find(
      idx => idx >= 0 && idx < total && !this.__isYearDisabled(years[idx]),
    );
    return candidate ?? currentIndex;
  }

  /**
   * Focus a year button in the year selection grid
   * @param {number} yearIndex
   * @private
   */
  async __focusYearInSelection(yearIndex) {
    await this.updateComplete;
    const buttons = /** @type {NodeListOf<HTMLElement>} */ (
      this.shadowRoot?.querySelectorAll('.calendar__year-button')
    );
    const years = this.__getYearsForCurrentRange();
    if (buttons && buttons[yearIndex] && !this.__isYearDisabled(years[yearIndex])) {
      buttons[yearIndex].focus();
    } else if (buttons) {
      // Find first enabled year
      const enabledIndex = years.findIndex(year => !this.__isYearDisabled(year));
      if (enabledIndex !== -1) {
        this.__focusedYearIndex = enabledIndex;
        buttons[enabledIndex]?.focus();
      }
    }
  }

  /**
   * Returns array of years for the current range
   * @returns {number[]}
   * @private
   */
  __getYearsForCurrentRange() {
    return Array.from({ length: YEAR_GRID_SIZE }, (_, i) => this.__yearRangeStart + i);
  }

  /**
   * Initialize year range centered on targetYear
   * @param {number} targetYear
   * @private
   */
  __initializeYearRange(targetYear) {
    // Center the range: show 4 years before, 7 after (0-indexed)
    const clampedYear = Math.max(5, Math.min(9988, targetYear));
    this.__yearRangeStart = clampedYear - 4;
  }

  /**
   * Navigate to the previous year range
   * @private
   */
  async __previousYearRange() {
    if (this.__isPreviousRangeDisabled()) return;
    this.__yearRangeStart -= YEAR_GRID_SIZE;
    // Focus first enabled year in new range
    this.__focusedYearIndex = 0;
    await this.updateComplete;
    const rangeEnd = this.__yearRangeStart + YEAR_GRID_SIZE - 1;
    this.__announceYearRange(this.__yearRangeStart, rangeEnd);
    this.__focusYearInSelection(0);
  }

  /**
   * Navigate to the next year range
   * @private
   */
  async __nextYearRange() {
    if (this.__isNextRangeDisabled()) return;
    this.__yearRangeStart += YEAR_GRID_SIZE;
    this.__focusedYearIndex = 0;
    await this.updateComplete;
    const rangeEnd = this.__yearRangeStart + YEAR_GRID_SIZE - 1;
    this.__announceYearRange(this.__yearRangeStart, rangeEnd);
    this.__focusYearInSelection(0);
  }

  /**
   * Checks if the previous year range button should be disabled
   * @returns {boolean}
   * @private
   */
  __isPreviousRangeDisabled() {
    if (!this.__hasMinDateConstraint()) return false;
    // Disabled when the last year in the previous range would still be before minDate
    return this.__yearRangeStart - 1 < this.minDate.getFullYear();
  }

  /**
   * Checks if the next year range button should be disabled
   * @returns {boolean}
   * @private
   */
  __isNextRangeDisabled() {
    if (!this.__hasMaxDateConstraint()) return false;
    // Disabled when the first year in the next range would be after maxDate
    return this.__yearRangeStart + YEAR_GRID_SIZE > this.maxDate.getFullYear();
  }

  /**
   * Returns true when minDate is set to something other than the epoch default.
   * @returns {boolean}
   * @private
   */
  __hasMinDateConstraint() {
    return this.minDate != null && this.minDate.getTime() !== new Date(0).getTime();
  }

  /**
   * Returns true when maxDate is set to something other than the max-date-value default.
   * @returns {boolean}
   * @private
   */
  __hasMaxDateConstraint() {
    return this.maxDate != null && this.maxDate.getTime() !== new Date(8640000000000000).getTime();
  }

  /**
   * Determines if a month is entirely disabled based on constraints.
   * A month is disabled if it's before minDate month (in minDate year) or
   * after maxDate month (in maxDate year), or all its days are disabled.
   * @param {number} monthIndex - 0-11
   * @returns {boolean}
   * @private
   */
  __isMonthDisabled(monthIndex) {
    const year = this.centralDate.getFullYear();

    if (this.__hasMinDateConstraint()) {
      const minYear = this.minDate.getFullYear();
      const minMonth = this.minDate.getMonth();
      if (year < minYear || (year === minYear && monthIndex < minMonth)) {
        return true;
      }
    }

    if (this.__hasMaxDateConstraint()) {
      const maxYear = this.maxDate.getFullYear();
      const maxMonth = this.maxDate.getMonth();
      if (year > maxYear || (year === maxYear && monthIndex > maxMonth)) {
        return true;
      }
    }

    // Check if all days in month are disabled by disableDates
    return this.__isMonthFullyDisabledByDisableDates(year, monthIndex);
  }

  /**
   * Checks if the disableDates function disables all days in a month.
   * Results are cached per year/month combination.
   * @param {number} year
   * @param {number} monthIndex
   * @returns {boolean}
   * @private
   */
  __isMonthFullyDisabledByDisableDates(year, monthIndex) {
    // Skip if disableDates is the default no-op function
    if (this.disableDates === /** @type {any} */ (LionCalendar.prototype.disableDates)) {
      return false;
    }

    const cacheKey = `${year}-${monthIndex}`;
    if (this.__monthDisabledCache?.has(cacheKey)) {
      return /** @type {boolean} */ (this.__monthDisabledCache.get(cacheKey));
    }

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const isFullyDisabled = Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, monthIndex, i + 1),
    ).every(date => this.disableDates(date));

    if (!this.__monthDisabledCache) {
      this.__monthDisabledCache = new Map();
    }
    this.__monthDisabledCache.set(cacheKey, isFullyDisabled);

    return isFullyDisabled;
  }

  /**
   * Determines if a year is disabled based on minDate/maxDate constraints
   * @param {number} year
   * @returns {boolean}
   * @private
   */
  __isYearDisabled(year) {
    if (this.__hasMinDateConstraint() && year < this.minDate.getFullYear()) return true;
    if (this.__hasMaxDateConstraint() && year > this.maxDate.getFullYear()) return true;
    return false;
  }

  /**
   * Clamp a date to the minDate/maxDate range
   * @param {Date} date
   * @returns {Date}
   * @private
   */
  __clampDateToRange(date) {
    let result = new Date(date);
    if (this.__hasMinDateConstraint() && result < this.minDate) {
      result = new Date(this.minDate);
    }
    if (this.__hasMaxDateConstraint() && result > this.maxDate) {
      result = new Date(this.maxDate);
    }
    return result;
  }

  /**
   * Focus the first enabled day in the current month
   * @private
   */
  async __focusFirstEnabledDay() {
    await this.updateComplete;
    const buttons = /** @type {NodeListOf<HTMLElement>} */ (
      this.shadowRoot?.querySelectorAll('.calendar__day-button:not([aria-disabled="true"])')
    );
    if (buttons && buttons.length > 0) {
      /** @type {HTMLElement} */ (buttons[0]).focus();
    } else {
      // Fallback to central date
      this.focusCentralDate();
    }
  }

  // ==========================================
  // PRIVATE: Screen Reader Announcements
  // ==========================================

  /**
   * Announce a message via the ARIA live region
   * @param {string} message
   * @private
   */
  __announceToScreenReader(message) {
    const liveRegion = /** @type {HTMLElement | null} */ (
      this.shadowRoot?.getElementById('calendar-live-region')
    );
    if (liveRegion) {
      // Clear then set to ensure announcement fires even for identical messages
      liveRegion.textContent = '';
      requestAnimationFrame(() => {
        liveRegion.textContent = message;
      });
    }
  }

  /**
   * Announce a year range change to screen readers
   * @param {number} startYear
   * @param {number} endYear
   * @private
   */
  __announceYearRange(startYear, endYear) {
    this.__announceToScreenReader(
      this.msgLit('lion-calendar:yearsRange', {
        startYear,
        endYear,
      }),
    );
  }

  /**
   * Set up document-level click listener to close selection views
   * @private
   */
  __setupClickOutsideListener() {
    // Use setTimeout to avoid immediately closing on the click that opened the view
    this.__clickOutsideTimeoutId = setTimeout(() => {
      document.addEventListener('click', this.__boundHandleClickOutside, { capture: true });
      this.__clickOutsideTimeoutId = null;
    }, 0);
  }

  /**
   * Remove the document-level click listener
   * @private
   */
  __removeClickOutsideListener() {
    if (this.__clickOutsideTimeoutId) {
      clearTimeout(this.__clickOutsideTimeoutId);
      this.__clickOutsideTimeoutId = null;
    }
    document.removeEventListener('click', this.__boundHandleClickOutside, { capture: true });
  }

  /**
   * Handle clicks outside the calendar to close selection views
   * @param {MouseEvent} ev
   * @private
   */
  __handleClickOutside(ev) {
    const path = ev.composedPath();
    const isInsideCalendar = path.some(el => el === this);
    if (!isInsideCalendar && this.__viewMode !== 'month') {
      const headingId = this.__viewMode === 'month-selection' ? 'month-heading' : 'year-heading';
      this.__closeSelectionView(headingId);
    }
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

    if (day.disabled) {
      day.disabledInfo = `${this.msgLit(`lion-calendar:defaultDisabledDate`)}`;
    }
    if (this.minDate && normalizeDateTime(day.date) < normalizeDateTime(this.minDate)) {
      day.disabled = true;
      day.disabledInfo = `${this.msgLit(`lion-calendar:beforeDisabledDate`, { params: this.__getSelectableDateRange().earliestSelectableDate })}`;
    }
    if (this.maxDate && normalizeDateTime(day.date) > normalizeDateTime(this.maxDate)) {
      day.disabled = true;
      day.disabledInfo = `${this.msgLit(`lion-calendar:afterDisabledDate`, { params: this.__getSelectableDateRange().latestSelectableDate })}`;
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

  // ==========================================
  // PRIVATE: Event Delegation (Day Grid)
  // ==========================================

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
