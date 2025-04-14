import { html, css } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { LionInputAmount } from '@lion/ui/input-amount.js';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { currencyUtil } from './currencyUtil.js';
import { parseAmount } from './parsers.js';
import { formatAmount } from './formatters.js';
import { deserializer, serializer } from './serializers.js';
import { CurrencyAndAmount } from './validators.js';

/**
 * Note: one could consider to implement LionInputTelDropdown as a
 * [combobox](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox).
 * However, the country dropdown does not directly set the textbox value, it only determines
 * its region code. Therefore it does not comply to this criterium:
 * "A combobox is an input widget with an associated popup that enables users to select a value for
 * the combobox from a collection of possible values. In some implementations,
 * the popup presents allowed values, while in other implementations, the popup presents suggested
 * values, and users may either select one of the suggestions or type a value".
 * We therefore decided to consider the dropdown a helper mechanism that does not set, but
 * contributes to and helps format and validate the actual value.
 */

/**
 * @typedef {import('lit/directives/ref.js').Ref} Ref
 * @typedef {import('lit').RenderOptions} RenderOptions
 * @typedef {import('../../form-core/types/FormatMixinTypes.js').FormatHost} FormatHost
 * @typedef {import('../../input-tel/types/index.js').RegionCode} RegionCode
 * @typedef {import('../types/index.js').TemplateDataForDropdownInputAmount} TemplateDataForDropdownInputAmount
 * @typedef {import('../types/index.js').OnDropdownChangeEvent} OnDropdownChangeEvent
 * @typedef {import('../types/index.js').DropdownRef} DropdownRef
 * @typedef {import('../types/index.js').RegionMeta} RegionMeta
 * @typedef {import('../types/index.js').CurrencyCode} CurrencyCode
 * @typedef {import('../../select-rich/src/LionSelectRich.js').LionSelectRich} LionSelectRich
 * @typedef {import('../../overlays/src/OverlayController.js').OverlayController} OverlayController
 * @typedef {import('../../form-core/types/FormatMixinTypes.js').FormatOptions} FormatOptions
 * @typedef {FormatOptions & {locale?:string;currency:string|undefined}} AmountFormatOptions
 * @typedef {TemplateDataForDropdownInputAmount & {data: {regionMetaList:RegionMeta[]}}} TemplateDataForIntlInputAmount
 */

/**
 * LionInputTelDropdown renders a dropdown like element next to the text field, inside the
 * prefix slot. This could be a LionSelect, a LionSelectRich or a native select.
 * By default, the native `<select>` element is used for this, so that it's as lightweight as
 * possible. Also, it doesn't need to be a `FormControl`, because it's purely a helper element
 * to provide better UX: the modelValue (the text field) contains all needed info, since it's in
 * `e164` format that contains all info (both region code and national phone number).
 *
 * @customElement lion-input-amount-dropdown
 */
export class LionInputAmountDropdown extends LionInputAmount {
  /**
   * @configure LitElement
   * @type {any}
   */
  static properties = {
    preferredCurrencies: { type: Array },
    allowedCurrencies: { type: Array },
    _dropdownSlot: { type: String, state: true },
    _currencyUtil: { type: Object, state: true },
  };

  refs = {
    /** @type {DropdownRef} */
    dropdown: /** @type {DropdownRef} */ (createRef()),
  };

  /**
   * This method provides a TemplateData object to be fed to pure template functions, a.k.a.
   * Pure Templates™. The goal is to totally decouple presentation from logic here, so that
   * Subclassers can override all content without having to loose private info contained
   * within the template function that was overridden.
   *
   * Subclassers would need to make sure all the contents of the TemplateData object are implemented
   * by making sure they are coupled to the right 'ref' ([data-ref=dropdown] in this example),
   * with the help of lit's spread operator directive.
   * To enhance this process, the TemplateData object is completely typed. Ideally, this would be
   * enhanced by providing linters that make sure all of their required members are implemented by
   * a Subclasser.
   * When a Subclasser wants to add more data, this can be done via:
   * @example
   * ```js
   * get _templateDataDropdown() {
   *   return {
   *     ...super._templateDataDropdown,
   *     myExtraData: { x: 1, y: 2 },
   *   }
   * }
   * ```
   * @overridable
   * @type {TemplateDataForDropdownInputAmount}
   */
  get _templateDataDropdown() {
    const localizeManager = getLocalizeManager();
    const refs = {
      dropdown: {
        ref: this.refs.dropdown,
        props: {
          style: `height: 100%;`,
        },
        listeners: {
          change: this._onDropdownValueChange,
          'model-value-changed': this._onDropdownValueChange,
        },
        labels: {
          selectCountry: localizeManager.msg('lion-input-amount-dropdown:selectCountry'),
          allCountries:
            this._allCountriesLabel ||
            localizeManager.msg('lion-input-amount-dropdown:allCountries'),
          preferredCountries:
            this._preferredCountriesLabel ||
            localizeManager.msg('lion-input-amount-dropdown:suggestedCountries'),
        },
      },
      input: this._inputNode,
    };

    return {
      refs,
      data: {
        currency: this.currency,
        regionMetaList: this.__regionMetaList,
        regionMetaListPreferred: this.__regionMetaListPreferred,
      },
    };
  }

  get dropdownSlot() {
    return /** @type {string} */ this._dropdownSlot;
  }

  set dropdownSlot(position) {
    if (position !== 'suffix' && position !== 'prefix') {
      throw new Error('Only the suffix and prefix slots are valid positions for the dropdown.');
    }

    this._dropdownSlot = position;
  }

  static templates = {
    dropdown: (/** @type {TemplateDataForDropdownInputAmount} */ templateDataForDropdown) => {
      const { refs, data } = templateDataForDropdown;
      const renderOption = (/** @type {RegionMeta} */ regionMeta) =>
        html`${this.templates.dropdownOption(templateDataForDropdown, regionMeta)} `;

      // TODO: once spread directive available, use it per ref
      return html`
        <select
          ${ref(refs?.dropdown?.ref)}
          aria-label="${refs?.dropdown?.labels?.selectCountry}"
          @change="${refs?.dropdown?.listeners?.change}"
          style="${refs?.dropdown?.props?.style}"
        >
          ${data?.regionMetaListPreferred?.length
            ? html`
                <optgroup label="${refs?.dropdown?.labels?.preferredCountries}">
                  ${data.regionMetaListPreferred.map(renderOption)}
                </optgroup>
                <optgroup label="${refs?.dropdown?.labels?.allCountries}">
                  ${data?.regionMetaList?.map(renderOption)}
                </optgroup>
              `
            : html` ${data?.regionMetaList?.map(renderOption)}`}
        </select>
      `;
    },
    /**
     * @param {TemplateDataForDropdownInputAmount} templateDataForDropdown
     * @param {RegionMeta} contextData
     */
    // eslint-disable-next-line class-methods-use-this
    dropdownOption: (
      templateDataForDropdown,
      { currencyCode, nameForLocale, currencySymbol },
    ) => html`
      <option value="${currencyCode}" aria-label="${ifDefined(nameForLocale)}">
        ${currencyCode} (${currencySymbol})&nbsp;
      </option>
    `,
  };

  /**
   * @configure LitElement
   * @enhance LionInputTel
   */
  static styles = [
    super.styles,
    css`
      /**
       * We need to align the height of the dropdown with the height of the text field.
       * We target the HTMLDivElement (render wrapper from SlotMixin) here. Its child,
       * [data-ref=dropdown], receives a 100% height as well via inline styles (since we
       * can't target from shadow styles).
       */
      ::slotted([slot='prefix']),
      ::slotted([slot='suffix']) {
        height: 100%;
      }
    `,
  ];

  /**
   * @configure SlotMixin
   */
  get slots() {
    return {
      ...super.slots,
      [this.dropdownSlot]: () => {
        const ctor = /** @type {typeof LionInputAmountDropdown} */ (this.constructor);
        const { templates } = ctor;

        return {
          template: templates.dropdown(this._templateDataDropdown),
          renderAsDirectHostChild: true,
        };
      },
    };
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

    // @ts-expect-error relatively new platform api
    this.__namesForLocale = new Intl.DisplayNames([this._langIso], {
      type: 'currency',
    });

    this.__calculateActiveCurrency();
    this.__createCurrencyMeta();
  }

  /**
   * @lifecycle platform
   */
  constructor() {
    super();

    // disable the input-amount currency display
    this._currencyDisplayNodeSlot = '';

    this.parser = parseAmount;
    this.formatter = formatAmount;
    this.serializer = serializer;
    this.deserializer = deserializer;

    this.defaultValidators = [new CurrencyAndAmount()];

    /**
     * Slot position to render the dropdown in
     * @type {string}
     */
    this.dropdownSlot = 'prefix';

    /**
     * Regions that will be shown on top of the dropdown
     * @type {string[]}
     */
    this.preferredCurrencies = [];
    /**
     * Group label for all countries, when preferredCountries are shown
     * @protected
     */
    this._allCountriesLabel = '';
    /**
     * Group label for preferred countries, when preferredCountries are shown
     * @protected
     */
    this._preferredCountriesLabel = '';

    /**
     * Contains everything needed for rendering region options:
     * region code, country code, display name according to locale, display name
     * @private
     * @type {RegionMeta[]}
     */
    this.__regionMetaList = [];

    /**
     * A filtered `this.__regionMetaList`, containing all regions provided in `preferredCurrencies`
     * @private
     * @type {RegionMeta[]}
     */
    this.__regionMetaListPreferred = [];

    /**
     * @protected
     * @type {EventListener}
     */
    this._onDropdownValueChange = this._onDropdownValueChange.bind(this);
    /**
     * @private
     * @type {EventListener}
     */
    this.__syncRegionWithDropdown = this.__syncRegionWithDropdown.bind(this);

    this._currencyUtil = currencyUtil;
  }

  /**
   * @lifecycle LitElement
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);

    if (changedProperties.has('allowedCurrencies')) {
      this.__createCurrencyMeta();
    }
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    this.__syncRegionWithDropdown();

    if (changedProperties.has('disabled') || changedProperties.has('readOnly')) {
      if (this.disabled || this.readOnly) {
        this.refs.dropdown?.value?.setAttribute('disabled', '');
      } else {
        this.refs.dropdown?.value?.removeAttribute('disabled');
      }
    }

    if (changedProperties.has('allowedCurrencies')) {
      this.__calculateActiveCurrency();
    }

    if (changedProperties.has('_currencyUtil')) {
      this._initModelValueBasedOnDropdown();
    }
  }

  /**
   * @protected
   */
  _initModelValueBasedOnDropdown() {
    if (!this._initialModelValue && !this.dirty && this._currencyUtil?.countryToCurrencyMap) {
      const countryCode =
        this._langIso && this._currencyUtil?.countryToCurrencyMap.get(this._langIso);
      this.__initializedCurrencyCode = countryCode || '';

      this._initialModelValue = { currency: this.__initializedCurrencyCode };
      this.modelValue = this._initialModelValue;
      this.initInteractionState();
    }
  }

  /**
   * Used for Required validation and computation of interaction states.
   * We need to override this, because we prefill the input with the region code (like +31), but for proper UX,
   * we don't consider this as having interaction state `prefilled`
   * @param {string} modelValue
   * @return {boolean}
   * @protected
   */
  _isEmpty(modelValue = this.modelValue) {
    // the activeCurrency is not synced on time, so it can't be used in this check
    return super._isEmpty(modelValue) || this.currency === this.__initializedCurrencyCode;
  }

  /**
   * @protected
   * @param {OnDropdownChangeEvent} event
   */
  _onDropdownValueChange(event) {
    const isInitializing = event.detail?.initialize;
    const dropdownElement = event.target;
    const dropdownValue = /** @type {RegionCode} */ (
      dropdownElement.modelValue || dropdownElement.value
    );
    if (isInitializing || this.currency === dropdownValue) {
      return;
    }

    const prevCurrency = this.currency;

    this.currency = dropdownValue;

    if (prevCurrency !== this.currency && !this.focused) {
      if (!this.value) {
        this.modelValue = { currency: this.currency, amount: this.value };
      } else {
        /** @type {AmountFormatOptions} */
        (this.formatOptions).currency = this.currency;
        this.modelValue = this._callParser(this.value);
      }
    }
  }

  /**
   * @private
   */
  __syncRegionWithDropdown(currencyCode = this.currency) {
    const dropdownElement = this.refs.dropdown?.value;
    if (!dropdownElement || !currencyCode) {
      return;
    }

    if ('modelValue' in dropdownElement) {
      const dropdownCountryCode = dropdownElement.modelValue;
      if (dropdownCountryCode === currencyCode) {
        return;
      }
      /** @type {* & FormatHost} */ (dropdownElement).modelValue = currencyCode;
    } else {
      const dropdownCountryCode = dropdownElement.value;
      if (dropdownCountryCode === currencyCode) {
        return;
      }
      /** @type {HTMLSelectElement} */ (dropdownElement).value = currencyCode;
    }
  }

  /**
   * Prepares data for options, like "Greece (Ελλάδα)", where "Greece" is `nameForLocale` and
   * "Ελλάδα" `nameForRegion`.
   * This should be run on change of:
   * - allowedCurrencies
   * - _phoneUtil loaded
   * - locale
   * @private
   */
  __createCurrencyMeta() {
    if (!this._allowedOrAllCurrencies?.length || !this.__namesForLocale) {
      return;
    }

    this.__regionMetaList = [];
    this.__regionMetaListPreferred = [];

    this._allowedOrAllCurrencies.forEach(currencyCode => {
      const destinationList = this.preferredCurrencies.includes(currencyCode)
        ? this.__regionMetaListPreferred
        : this.__regionMetaList;

      destinationList.push({
        currencyCode,
        nameForLocale: this.__namesForLocale?.of(currencyCode),
        currencySymbol: this._currencyUtil.getCurrencySymbol(currencyCode, this._langIso),
      });
    });
  }

  /**
   * Usually, we don't use composition in regular LionFields (non choice-groups). Here we use a LionSelect(Rich) inside.
   * We don't want to repropagate any children, since an Application Developer is not concerned with these internals (see repropate logic in FormControlMixin)
   * Also, we don't want to give (wrong) info to InteractionStateMixin, that will set the wrong interaction states based on child info.
   * TODO: Make "this._repropagationRole !== 'child'" the default for FormControlMixin
   * (so that FormControls used within are never repropagated for LionFields)
   * @protected
   * @configure FormControlMixin: don't repropagate any children
   */
  // eslint-disable-next-line class-methods-use-this
  _repropagationCondition() {
    return false;
  }

  __calculateActiveCurrency() {
    // 1. Get the currency from pre-configured allowed currencies (if one entry)
    if (this.allowedCurrencies?.length === 1) {
      [this.currency] = this.allowedCurrencies;
      return;
    }

    // 2. Try to get the region from locale
    if (
      this._langIso &&
      this._allowedOrAllCurrencies.includes(
        this._currencyUtil?.countryToCurrencyMap.get(this._langIso),
      )
    ) {
      this.currency = this._currencyUtil?.countryToCurrencyMap.get(this._langIso);
      return;
    }

    // 3. Not derivable
    this.currency = undefined;
  }

  /**
   * Used for rendering the region/country list
   * @property _allowedOrAllRegions
   * @type {CurrencyCode[]}
   */
  get _allowedOrAllCurrencies() {
    return this.allowedCurrencies?.length
      ? this.allowedCurrencies
      : Array.from(this._currencyUtil?.allCurrencies) || [];
  }
}
