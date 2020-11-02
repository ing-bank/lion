import { LionCalendar } from '@lion/calendar/src/LionCalendar';
import { html, ifDefined, ScopedElementsMixin } from '@lion/core';
import { LionInputDate } from '@lion/input-date';
import {
  OverlayMixin,
  withBottomSheetConfig,
  withModalDialogConfig,
  ArrowMixin,
} from '@lion/overlays';
import { LionCalendarOverlayFrame } from './LionCalendarOverlayFrame.js';

/**
 * @customElement lion-input-datepicker
 */
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/40110
export class LionInputDatepicker extends ScopedElementsMixin(
  ArrowMixin(OverlayMixin(LionInputDate)),
) {
  static get scopedElements() {
    return {
      ...super.scopedElements,
      'lion-calendar': LionCalendar,
      'lion-calendar-overlay-frame': LionCalendarOverlayFrame,
    };
  }

  static get properties() {
    return {
      /**
       * The heading to be added on top of the calendar overlay.
       * Naming chosen from an Application Developer perspective.
       * For a Subclasser 'calendarOverlayHeading' would be more appropriate.
       */
      calendarHeading: {
        type: String,
        attribute: 'calendar-heading',
      },
      /**
       * The slot to put the invoker button in. Can be 'prefix', 'suffix', 'before' and 'after'.
       * Default will be 'suffix'.
       */
      _calendarInvokerSlot: {
        attribute: false,
      },

      __calendarMinDate: {
        attribute: false,
      },

      __calendarMaxDate: {
        attribute: false,
      },

      __calendarDisableDates: {
        attribute: false,
      },
    };
  }

  get slots() {
    return {
      ...super.slots,
      [this._calendarInvokerSlot]: () => {
        const renderParent = document.createElement('div');
        /** @type {typeof LionInputDatepicker} */ (this.constructor).render(
          this._invokerTemplate(),
          renderParent,
          {
            scopeName: this.localName,
            eventContext: this,
          },
        );
        return renderParent.firstElementChild;
      },
    };
  }

  static get localizeNamespaces() {
    return [
      {
        'lion-input-datepicker': /** @param {string} locale */ locale => {
          switch (locale) {
            case 'bg-BG':
              return import('../translations/bg-BG.js');
            case 'bg':
              return import('../translations/bg.js');
            case 'cs-CZ':
              return import('../translations/cs-CZ.js');
            case 'cs':
              return import('../translations/cs.js');
            case 'de-DE':
              return import('../translations/de-DE.js');
            case 'de':
              return import('../translations/de.js');
            case 'en-AU':
              return import('../translations/en-AU.js');
            case 'en-GB':
              return import('../translations/en-GB.js');
            case 'en-US':
              return import('../translations/en-US.js');
            case 'en-PH':
            case 'en':
              return import('../translations/en.js');
            case 'es-ES':
              return import('../translations/es-ES.js');
            case 'es':
              return import('../translations/es.js');
            case 'fr-FR':
              return import('../translations/fr-FR.js');
            case 'fr-BE':
              return import('../translations/fr-BE.js');
            case 'fr':
              return import('../translations/fr.js');
            case 'hu-HU':
              return import('../translations/hu-HU.js');
            case 'hu':
              return import('../translations/hu.js');
            case 'it-IT':
              return import('../translations/it-IT.js');
            case 'it':
              return import('../translations/it.js');
            case 'nl-BE':
              return import('../translations/nl-BE.js');
            case 'nl-NL':
              return import('../translations/nl-NL.js');
            case 'nl':
              return import('../translations/nl.js');
            case 'pl-PL':
              return import('../translations/pl-PL.js');
            case 'pl':
              return import('../translations/pl.js');
            case 'ro-RO':
              return import('../translations/ro-RO.js');
            case 'ro':
              return import('../translations/ro.js');
            case 'ru-RU':
              return import('../translations/ru-RU.js');
            case 'ru':
              return import('../translations/ru.js');
            case 'sk-SK':
              return import('../translations/sk-SK.js');
            case 'sk':
              return import('../translations/sk.js');
            case 'uk-UA':
              return import('../translations/uk-UA.js');
            case 'uk':
              return import('../translations/uk.js');
            case 'zh-CN':
            case 'zh':
              return import('../translations/zh.js');
            default:
              return import('../translations/en.js');
          }
        },
      },
      ...super.localizeNamespaces,
    ];
  }

  get _invokerNode() {
    return /** @type {HTMLElement} */ (this.querySelector(`#${this.__invokerId}`));
  }

  get _calendarNode() {
    return /** @type {LionCalendar} */ (this._overlayCtrl.contentNode.querySelector(
      '[slot="content"]',
    ));
  }

  constructor() {
    super();
    this.__invokerId = this.__createUniqueIdForA11y();
    this._calendarInvokerSlot = 'suffix';

    // Configuration flags for subclassers
    this._focusCentralDateOnCalendarOpen = true;
    this._hideOnUserSelect = true;
    this._syncOnUserSelect = true;

    this.__openCalendarOverlay = this.__openCalendarOverlay.bind(this);
    this._onCalendarUserSelectedChanged = this._onCalendarUserSelectedChanged.bind(this);
  }

  __createUniqueIdForA11y() {
    return `${this.localName}-${Math.random().toString(36).substr(2, 10)}`;
  }

  /**
   * @param {PropertyKey} name
   * @param {?} oldValue
   */
  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);

    if (name === 'disabled' || name === 'readOnly') {
      this.__toggleInvokerDisabled();
    }
  }

  __toggleInvokerDisabled() {
    if (this._invokerNode) {
      // @ts-expect-error even though disabled may not exist on the invoker node
      // set it anyway, it doesn't harm, and is needed in case of invoker elements that do have disabled prop
      this._invokerNode.disabled = this.disabled || this.readOnly;
    }
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__toggleInvokerDisabled();
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('validators')) {
      const validators = [...(this.validators || [])];
      this.__syncDisabledDates(validators);
    }
    if (changedProperties.has('label')) {
      this.calendarHeading = this.calendarHeading || this.label;
    }
  }

  /**
   * Defining this overlay as a templates from OverlayMixin
   * this is our source to give as .contentNode to OverlayController.
   * Important: do not change the name of this method.
   */
  _overlayTemplate() {
    // TODO: add performance optimization to only render the calendar if needed
    // When not opened (usually on init), it does not need to be rendered.
    // This would make first paint quicker
    return html`
      <div id="overlay-content-node-wrapper">
        <lion-calendar-overlay-frame class="calendar__overlay-frame">
          <span slot="heading">${this.calendarHeading}</span>
          ${this._calendarTemplate()}
        </lion-calendar-overlay-frame>
        ${this._arrowNodeTemplate()}
      </div>
    `;
  }

  render() {
    return html`
      <div class="form-field__group-one">${this._groupOneTemplate()}</div>
      <div class="form-field__group-two">
        ${this._groupTwoTemplate()} ${this._overlayTemplate()}
      </div>
    `;
  }

  /**
   * Subclassers can replace this with their custom extension of
   * LionCalendar, like `<my-calendar id="calendar"></my-calendar>`
   */
  // eslint-disable-next-line class-methods-use-this
  _calendarTemplate() {
    return html`
      <lion-calendar
        slot="content"
        .selectedDate="${/** @type {typeof LionInputDatepicker} */ (this
          .constructor).__getSyncDownValue(this.modelValue)}"
        .minDate="${this.__calendarMinDate}"
        .maxDate="${this.__calendarMaxDate}"
        .disableDates="${ifDefined(this.__calendarDisableDates)}"
        @user-selected-date-changed="${this._onCalendarUserSelectedChanged}"
      ></lion-calendar>
    `;
  }

  /**
   * Subclassers can replace this with their custom extension invoker,
   * like `<my-button><calendar-icon></calendar-icon></my-button>`
   */
  // eslint-disable-next-line class-methods-use-this
  _invokerTemplate() {
    return html`
      <button
        type="button"
        @click="${this.__openCalendarOverlay}"
        id="${this.__invokerId}"
        aria-label="${this.msgLit('lion-input-datepicker:openDatepickerLabel')}"
        title="${this.msgLit('lion-input-datepicker:openDatepickerLabel')}"
      >
        📅
      </button>
    `;
  }

  _setupOverlayCtrl() {
    super._setupOverlayCtrl();

    this.__datepickerBeforeShow = () => {
      this._overlayCtrl.updateConfig(this._defineOverlayConfig());
    };
    this._overlayCtrl.addEventListener('before-show', this.__datepickerBeforeShow);
  }

  /**
   * @override Configures OverlayMixin
   * @desc overrides default configuration options for this component
   * @returns {Object}
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    if (window.innerWidth >= 600) {
      this.hasArrow = true;
      return {
        ...withModalDialogConfig(),
        hidesOnOutsideClick: true,
        ...super._defineOverlayConfig(),
        popperConfig: {
          ...super._defineOverlayConfig().popperConfig,
          placement: 'bottom',
        },
      };
    }
    this.hasArrow = false;
    return withBottomSheetConfig();
  }

  async __openCalendarOverlay() {
    await this._overlayCtrl.show();
    await Promise.all([
      /** @type {import('@lion/core').LitElement} */ (this._overlayCtrl.contentNode).updateComplete,
      this._calendarNode.updateComplete,
    ]);
    this._onCalendarOverlayOpened();
  }

  /**
   * Lifecycle callback for subclassers
   */
  _onCalendarOverlayOpened() {
    if (this._focusCentralDateOnCalendarOpen) {
      if (this._calendarNode.selectedDate) {
        this._calendarNode.focusSelectedDate();
      } else {
        this._calendarNode.focusCentralDate();
      }
    }
  }

  /**
   * @param {{ target: { selectedDate: Date }}} opts
   */
  _onCalendarUserSelectedChanged({ target: { selectedDate } }) {
    if (this._hideOnUserSelect) {
      this._overlayCtrl.hide();
    }
    if (this._syncOnUserSelect) {
      // Synchronize new selectedDate value to input
      this.modelValue = selectedDate;
    }
  }

  /**
   * The LionCalendar shouldn't know anything about the modelValue;
   * it can't handle Unparseable dates, but does handle 'undefined'
   * @param {?} modelValue
   * @returns {Date|undefined} a 'guarded' modelValue
   */
  static __getSyncDownValue(modelValue) {
    return modelValue instanceof Date ? modelValue : undefined;
  }

  /**
   * Validators contain the information to synchronize the input with
   * the min, max and enabled dates of the calendar.
   * @param {import('@lion/form-core').Validator[]} validators - errorValidators or warningValidators array
   */
  __syncDisabledDates(validators) {
    // On every validator change, synchronize disabled dates: this means
    // we need to extract minDate, maxDate, minMaxDate and disabledDates validators
    validators.forEach(v => {
      const vctor = /** @type {typeof import('@lion/form-core').Validator} */ (v.constructor);
      if (vctor.validatorName === 'MinDate') {
        this.__calendarMinDate = v.param;
      } else if (vctor.validatorName === 'MaxDate') {
        this.__calendarMaxDate = v.param;
      } else if (vctor.validatorName === 'MinMaxDate') {
        this.__calendarMinDate = v.param.min;
        this.__calendarMaxDate = v.param.max;
      } else if (vctor.validatorName === 'IsDateDisabled') {
        this.__calendarDisableDates = v.param;
      }
    });
  }

  /**
   * @override Configures OverlayMixin
   */
  get _overlayInvokerNode() {
    return this._invokerNode;
  }

  /**
   * @override Configures OverlayMixin
   */
  get _overlayContentNode() {
    if (this._cachedOverlayContentNode) {
      return this._cachedOverlayContentNode;
    }
    this._cachedOverlayContentNode = /** @type {HTMLElement} */ (
      /** @type {ShadowRoot} */ (this.shadowRoot).querySelector('.calendar__overlay-frame')
    );
    return this._cachedOverlayContentNode;
  }
}
