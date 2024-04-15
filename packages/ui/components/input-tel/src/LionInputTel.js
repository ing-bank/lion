import { Unparseable } from '@lion/ui/form-core.js';
import { LocalizeMixin } from '@lion/ui/localize-no-side-effects.js';
import { LionInput } from '@lion/ui/input.js';

import { liveFormatPhoneNumber } from './preprocessors.js';
import { formatPhoneNumber } from './formatters.js';
import { parsePhoneNumber } from './parsers.js';
import { PhoneNumber } from './validators.js';
import { localizeNamespaceLoader } from './localizeNamespaceLoader.js';

import countryCodes from './country-codes.js';

/**
 * @typedef {import('../types/index.js').RegionCode} RegionCode
 * @typedef {import('awesome-phonenumber').PhoneNumberFormat} PhoneNumberFormat
 * @typedef {import('awesome-phonenumber').PhoneNumberTypes} PhoneNumberTypes
 * @typedef {import('../../form-core/types/FormatMixinTypes.js').FormatOptions} FormatOptions
 * @typedef {* & import('awesome-phonenumber')} AwesomePhoneNumber
 * @typedef {FormatOptions & {regionCode: RegionCode; formatStrategy: PhoneNumberFormat; formatCountryCodeStyle: string;}} FormatOptionsTel
 */

export class LionInputTel extends LocalizeMixin(LionInput) {
  /**
   * @configure LitElement
   */
  static properties = {
    allowedRegions: { type: Array },
    formatStrategy: { type: String, attribute: 'format-strategy' },
    formatCountryCodeStyle: { type: String, attribute: 'format-country-code-style' },
    activeRegion: { type: String },
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
    return this.allowedRegions;
  }

  /**
   * Set a default name for this field, so that validation feedback will be always
   * accessible and linguistically correct
   * @configure FormControlMixin
   */
  // @ts-expect-error
  // eslint-disable-next-line class-methods-use-this
  get fieldName() {
    return this._localizeManager.msg('lion-input-tel:phoneNumber');
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
     * Extra styling of the format strategy
     * default | parentheses
     * @type {string}
     */
    this.formatCountryCodeStyle = 'default';

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

    this._calculateValues({ source: null });
    this.__calculateActiveRegion();
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

    if (changedProperties.has('formatCountryCodeStyle')) {
      this._calculateValues({ source: null });
      /** @type {FormatOptionsTel} */
      (this.formatOptions).formatCountryCodeStyle = this.formatCountryCodeStyle;
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

    const localeSplitted = this._localizeManager.locale.split('-');
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
      formatCountryCodeStyle: this.formatCountryCodeStyle,
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
      formatCountryCodeStyle: this.formatCountryCodeStyle,
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
   * @private
   */
  __calculateActiveRegion() {
    // 1. Get the region from preconfigured allowed region (if one entry)
    if (this.allowedRegions?.length === 1) {
      this._setActiveRegion(this.allowedRegions[0]);
      return;
    }

    // 2. Try to derive action region from user value
    const regex = /[+0-9]+/gi;
    const value = !(this.modelValue instanceof Unparseable)
      ? this.modelValue
      : this.value.match(regex)?.join('');

    const regionDerivedFromValue = countryCodes
      ?.sort((a, b) => {
        if (a.dial_code > b.dial_code) {
          return -1;
        }
        if (a.dial_code < b.dial_code) {
          return 1;
        }
        return 0;
      })
      .find(countryCode => value.startsWith(countryCode.dial_code))?.code;

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
