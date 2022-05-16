import { Unparseable } from '@lion/form-core';
import { LocalizeMixin, localize } from '@lion/localize';
import { LionInput } from '@lion/input';
import { PhoneUtilManager } from './PhoneUtilManager.js';
import { liveFormatPhoneNumber } from './preprocessors.js';
import { formatPhoneNumber } from './formatters.js';
import { parsePhoneNumber } from './parsers.js';
import { PhoneNumber } from './validators.js';
import { localizeNamespaceLoader } from './localizeNamespaceLoader.js';

/**
 * @typedef {import('../types').RegionCode} RegionCode
 * @typedef {import('awesome-phonenumber').PhoneNumberFormat} PhoneNumberFormat
 * @typedef {import('awesome-phonenumber').PhoneNumberTypes} PhoneNumberTypes
 * @typedef {import('@lion/form-core/types/FormatMixinTypes').FormatOptions} FormatOptions
 * @typedef {* & import('awesome-phonenumber').default} AwesomePhoneNumber
 * @typedef {FormatOptions & {regionCode: RegionCode; formatStrategy: PhoneNumberFormat}} FormatOptionsTel
 */

export class LionInputTel extends LocalizeMixin(LionInput) {
  /**
   * @configure LitElement
   */
  static properties = {
    allowedRegions: { type: Array },
    formatStrategy: { type: String, attribute: 'format-strategy' },
    activeRegion: { type: String },
    _phoneUtil: { type: Object, state: true },
    _needsLightDomRender: { type: Number, state: true },
  };

  static localizeNamespaces = [
    { 'lion-input-tel': localizeNamespaceLoader },
    ...super.localizeNamespaces,
  ];

  /**
   * Currently active region based on:
   * 1. allowed regions: get the region from configured allowed regions (if one entry)
   * 2. user input: try to derive active region from user input
   * 3. locale: try to get the region from locale (`html[lang]` attribute)
   * @readonly
   * @property {RegionCode|undefined}activeRegion
   */
  get activeRegion() {
    return this.__activeRegion;
  }

  // @ts-ignore read only
  // eslint-disable-next-line class-methods-use-this, no-empty-function
  set activeRegion(v) {}

  /**
   * Type of phone number, derived from textbox value. Enum with values:
   * -'fixed-line'
   * -'fixed-line-or-mobile'
   * -'mobile'
   * -'pager'
   * -'personal-number'
   * -'premium-rate'
   * -'shared-cost'
   * -'toll-free'
   * -'uan'
   * -'voip'
   * -'unknown'
   * See https://www.npmjs.com/package/awesome-phonenumber
   * @readonly
   * @property {PhoneNumberTypes|undefined} activePhoneNumberTypes
   */
  get activePhoneNumberType() {
    let pn;
    try {
      pn = this._phoneUtil && this._phoneUtil(this.modelValue, this.activeRegion);
      // eslint-disable-next-line no-empty
    } catch (_) {}
    return pn?.g?.type || 'unknown';
  }

  // @ts-ignore read only
  // eslint-disable-next-line class-methods-use-this, no-empty-function
  set activePhoneNumberType(v) {}

  /**
   * Protected setter for activeRegion, only meant for subclassers
   * @protected
   * @param {RegionCode|undefined} newValue
   */
  _setActiveRegion(newValue) {
    const oldValue = this.activeRegion;
    this.__activeRegion = newValue;
    this.requestUpdate('activeRegion', oldValue);
  }

  /**
   * Used for rendering the region/country list
   * @property _allowedOrAllRegions
   * @type {RegionCode[]}
   */
  get _allowedOrAllRegions() {
    return (
      (this.allowedRegions?.length
        ? this.allowedRegions
        : this._phoneUtil?.getSupportedRegionCodes()) || []
    );
  }

  /**
   * @property _phoneUtilLoadComplete
   * @protected
   * @type {Promise<PhoneNumber>}
   */
  // eslint-disable-next-line class-methods-use-this
  get _phoneUtilLoadComplete() {
    return PhoneUtilManager.loadComplete;
  }

  /**
   * Set a default name for this field, so that validation feedback will be always
   * accessible and linguistically correct
   * @configure FormControlMixin
   */
  // @ts-expect-error
  // eslint-disable-next-line class-methods-use-this
  get fieldName() {
    return localize.msg('lion-input-tel:phoneNumber');
  }

  /**
   * @lifecycle platform
   */
  constructor() {
    super();

    /**
     * Determines what the formatter output should look like.
     * Formatting strategies as provided by google-libphonenumber
     * See: https://www.npmjs.com/package/google-libphonenumber
     * @type {PhoneNumberFormat}
     */
    this.formatStrategy = 'international';

    /**
     * The regions that should be considered when international phone numbers are detected.
     * (when not configured, all regions worldwide will be considered)
     * @type {RegionCode[]}
     */
    this.allowedRegions = [];

    /** @private */
    this.__isPhoneNumberValidatorInstance = new PhoneNumber();
    /**  @configures ValidateMixin */
    this.defaultValidators.push(this.__isPhoneNumberValidatorInstance);

    // Expose awesome-phonenumber lib for Subclassers
    /**
     * @protected
     * @type {AwesomePhoneNumber|null}
     */
    this._phoneUtil = PhoneUtilManager.isLoaded
      ? /** @type {AwesomePhoneNumber} */ (PhoneUtilManager.PhoneUtil)
      : null;

    /**
     * Helper that triggers a light dom render aligned with update loop.
     * TODO: combine with render fn of SlotMixin
     * @protected
     * @type {number}
     */
    this._needsLightDomRender = 0;

    if (!PhoneUtilManager.isLoaded) {
      PhoneUtilManager.loadComplete.then(() => {
        this._onPhoneNumberUtilReady();
      });
    }
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    // This will trigger the right keyboard on mobile
    this._inputNode.inputMode = 'tel';
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('activeRegion')) {
      // Make sure new modelValue is computed, but prevent formattedValue from being set when focused
      this.__isUpdatingRegionWhileFocused = this.focused;
      this._calculateValues({ source: null });
      this.__isUpdatingRegionWhileFocused = false;

      this.__isPhoneNumberValidatorInstance.param = this.activeRegion;
      /** @type {FormatOptionsTel} */
      (this.formatOptions).regionCode = /** @type {RegionCode} */ (this.activeRegion);
    }

    if (changedProperties.has('formatStrategy')) {
      this._calculateValues({ source: null });
      /** @type {FormatOptionsTel} */
      (this.formatOptions).formatStrategy = this.formatStrategy;
    }

    if (changedProperties.has('modelValue') || changedProperties.has('allowedRegions')) {
      this.__calculateActiveRegion();
    }
  }

  /**
   * @configure LocalizeMixin
   */
  onLocaleUpdated() {
    super.onLocaleUpdated();

    const localeSplitted = localize.locale.split('-');
    /**
     * @protected
     * @type {RegionCode}
     */
    this._langIso = /** @type {RegionCode} */ (
      localeSplitted[localeSplitted.length - 1].toUpperCase()
    );
    this.__calculateActiveRegion();
  }

  /**
   * @configure FormatMixin
   * @param {string} modelValue
   * @returns {string}
   */
  formatter(modelValue) {
    return formatPhoneNumber(modelValue, {
      regionCode: /** @type {RegionCode} */ (this.activeRegion),
      formatStrategy: this.formatStrategy,
    });
  }

  /**
   * @configure FormatMixin
   * @param {string} viewValue a phone number without (or with) country code, like '06 12345678'
   * @returns {string} a trimmed phone number with country code, like '+31612345678'
   */
  parser(viewValue) {
    return parsePhoneNumber(viewValue, {
      regionCode: /** @type {RegionCode} */ (this.activeRegion),
    });
  }

  /**
   * @configure FormatMixin
   * @param {string} viewValue
   * @param {object} options
   * @param {string} options.prevViewValue
   * @param {number} options.currentCaretIndex
   * @returns {{ viewValue: string; caretIndex: number; } | undefined }
   */
  preprocessor(viewValue, { currentCaretIndex, prevViewValue }) {
    return liveFormatPhoneNumber(viewValue, {
      regionCode: /** @type {RegionCode} */ (this.activeRegion),
      formatStrategy: this.formatStrategy,
      currentCaretIndex,
      prevViewValue,
    });
  }

  /**
   * Do not reflect back .formattedValue during typing (this normally wouldn't happen when
   * FormatMixin calls _calculateValues based on user input, but for LionInputTel we need to
   * call it on .activeRegion change)
   * @enhance FormatMixin
   * @returns {boolean}
   */
  _reflectBackOn() {
    return !this.__isUpdatingRegionWhileFocused && super._reflectBackOn();
  }

  /**
   * @protected
   */
  _onPhoneNumberUtilReady() {
    // This should trigger a rerender in shadow dom
    this._phoneUtil = /** @type {AwesomePhoneNumber} */ (PhoneUtilManager.PhoneUtil);
    // This should trigger a rerender in light dom
    this._scheduleLightDomRender();
    // Format when libPhoneNumber is loaded
    this._calculateValues({ source: null });
    this.__calculateActiveRegion();
  }

  /**
   * This allows to hook into the update hook
   * @protected
   */
  _scheduleLightDomRender() {
    this._needsLightDomRender += 1;
  }

  /**
   * @private
   */
  __calculateActiveRegion() {
    // 1. Get the region from preconfigured allowed region (if one entry)
    if (this.allowedRegions?.length === 1) {
      this._setActiveRegion(this.allowedRegions[0]);
      return;
    }

    // 2. Try to derive action region from user value
    const value = !(this.modelValue instanceof Unparseable) ? this.modelValue : this.value;
    const regionDerivedFromValue = value && this._phoneUtil && this._phoneUtil(value).g?.regionCode;

    if (regionDerivedFromValue && this._allowedOrAllRegions.includes(regionDerivedFromValue)) {
      this._setActiveRegion(regionDerivedFromValue);
      return;
    }

    // 3. Try to get the region from locale
    if (this._langIso && this._allowedOrAllRegions.includes(this._langIso)) {
      this._setActiveRegion(this._langIso);
      return;
    }

    // 4. Not derivable
    this._setActiveRegion(undefined);
  }
}
