import { html, css } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';

import { LionInputTel } from '@lion/ui/input-tel.js';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { getFlagSymbol } from './getFlagSymbol.js';

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
 * @typedef {import('../types/index.js').TemplateDataForDropdownInputTel} TemplateDataForDropdownInputTel
 * @typedef {import('../types/index.js').OnDropdownChangeEvent} OnDropdownChangeEvent
 * @typedef {import('../types/index.js').DropdownRef} DropdownRef
 * @typedef {import('../types/index.js').RegionMeta} RegionMeta
 * @typedef {import('../../select-rich/src/LionSelectRich.js').LionSelectRich} LionSelectRich
 * @typedef {import('../../overlays/src/OverlayController.js').OverlayController} OverlayController
 * @typedef {TemplateDataForDropdownInputTel & {data: {regionMetaList:RegionMeta[]}}} TemplateDataForIntlInputTel
 */

/**
 * LionInputTelDropdown renders a dropdown like element next to the text field, inside the
 * prefix slot. This could be a LionSelect, a LionSelectRich or a native select.
 * By default, the native `<select>` element is used for this, so that it's as lightweight as
 * possible. Also, it doesn't need to be a `FormControl`, because it's purely a helper element
 * to provide better UX: the modelValue (the text field) contains all needed info, since it's in
 * `e164` format that contains all info (both region code and national phone number).
 */
export class LionInputTelDropdown extends LionInputTel {
  /**
   * @configure LitElement
   * @type {any}
   */
  static properties = {
    preferredRegions: { type: Array },
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
   * @type {TemplateDataForDropdownInputTel}
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
          selectCountry: localizeManager.msg('lion-input-tel:selectCountry'),
          allCountries:
            this._allCountriesLabel || localizeManager.msg('lion-input-tel:allCountries'),
          preferredCountries:
            this._preferredCountriesLabel ||
            localizeManager.msg('lion-input-tel:suggestedCountries'),
        },
      },
    };

    return {
      refs,
      data: {
        activeRegion: this.activeRegion,
        regionMetaList: this.__regionMetaList,
        regionMetaListPreferred: this.__regionMetaListPreferred,
      },
    };
  }

  static templates = {
    dropdown: (/** @type {TemplateDataForDropdownInputTel} */ templateDataForDropdown) => {
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
     * @param {TemplateDataForDropdownInputTel} templateDataForDropdown
     * @param {RegionMeta} contextData
     */
    // eslint-disable-next-line class-methods-use-this
    dropdownOption: (templateDataForDropdown, { regionCode, countryCode, flagSymbol }) => html`
      <option value="${regionCode}">${regionCode} (+${countryCode}) &nbsp; ${flagSymbol}</option>
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
           * [data-ref=dropdown], recieves a 100% height as well via inline styles (since we
           * can't target from shadow styles).
           */
      ::slotted([slot='prefix']) {
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
      prefix: () => {
        const ctor = /** @type {typeof LionInputTelDropdown} */ (this.constructor);
        const { templates } = ctor;

        return {
          template: templates.dropdown(this._templateDataDropdown),
          afterRender: this.__syncRegionWithDropdown,
        };
      },
    };
  }

  /**
   * @configure LocalizeMixin
   */
  onLocaleUpdated() {
    super.onLocaleUpdated();

    // @ts-expect-error relatively new platform api
    this.__namesForLocale = new Intl.DisplayNames([this._langIso], {
      type: 'region',
    });
    this.__createRegionMeta();
  }

  /**
   * @enhance LionInputTel
   */
  _onPhoneNumberUtilReady() {
    super._onPhoneNumberUtilReady();
    this.__createRegionMeta();
  }

  /**
   * @lifecycle platform
   */
  constructor() {
    super();

    /**
     * Regions that will be shown on top of the dropdown
     * @type {string[]}
     */
    this.preferredRegions = [];
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
     * A filtered `this.__regionMetaList`, containing all regions provided in `preferredRegions`
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
  }

  /**
   * @lifecycle LitElement
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);

    if (changedProperties.has('allowedRegions')) {
      this.__createRegionMeta();
    }
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('activeRegion')) {
      this.__syncRegionWithDropdown();
    }

    if (changedProperties.has('disabled') || changedProperties.has('readOnly')) {
      if (this.disabled || this.readOnly) {
        this.refs.dropdown?.value?.setAttribute('disabled', '');
      } else {
        this.refs.dropdown?.value?.removeAttribute('disabled');
      }
    }

    if (changedProperties.has('_phoneUtil')) {
      this._initModelValueBasedOnDropdown();
    }
  }

  /**
   * @protected
   */
  _initModelValueBasedOnDropdown() {
    if (!this._initialModelValue && !this.dirty && this._phoneUtil) {
      const countryCode = this._phoneUtil.getCountryCodeForRegionCode(this.activeRegion);
      if (this.formatCountryCodeStyle === 'parentheses') {
        this.__initializedRegionCode = `(+${countryCode})`;
      } else {
        this.__initializedRegionCode = `+${countryCode}`;
      }
      this.modelValue = this.__initializedRegionCode;
      this._initialModelValue = this.__initializedRegionCode;
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
    // the activeRegion is not synced on time, so it can't be used in this check
    return super._isEmpty(modelValue) || this.value === this.__initializedRegionCode;
  }

  /**
   * @protected
   * @param {OnDropdownChangeEvent} event
   */
  _onDropdownValueChange(event) {
    const isInitializing = event.detail?.initialize || !this._phoneUtil;
    const dropdownValue = /** @type {RegionCode} */ (event.target.modelValue || event.target.value);

    if (isInitializing || this.activeRegion === dropdownValue) {
      return;
    }

    const prevActiveRegion = this.activeRegion;
    this._setActiveRegion(dropdownValue);

    // Change region code in text box
    // From: https://bl00mber.github.io/react-phone-input-2.html
    if (prevActiveRegion !== this.activeRegion && !this.focused && this._phoneUtil) {
      const prevCountryCode = this._phoneUtil.getCountryCodeForRegionCode(prevActiveRegion);
      const countryCode = this._phoneUtil.getCountryCodeForRegionCode(this.activeRegion);

      if (this.value.includes(`+${prevCountryCode}`)) {
        this.modelValue = this._callParser(
          this.value.replace(`+${prevCountryCode}`, `+${countryCode}`),
        );
      } else {
        // In case of dropdown has +31, and input has only +3
        const valueObj = this.value.split(' ');
        if (this.formatCountryCodeStyle === 'parentheses' && !this.value.includes('(')) {
          this.modelValue = this._callParser(this.value.replace(valueObj[0], `(+${countryCode})`));
        } else {
          this.modelValue = this._callParser(this.value.replace(valueObj[0], `+${countryCode}`));
        }
      }
    }

    // Put focus on text box
    const overlayController = event.target._overlayCtrl;
    if (overlayController?.isShown) {
      setTimeout(() => {
        this._inputNode.focus();
      });
    }
  }

  /**
   * @private
   */
  __syncRegionWithDropdown(regionCode = this.activeRegion) {
    const dropdownElement = this.refs.dropdown?.value;
    if (!dropdownElement || !regionCode) {
      return;
    }
    const inputCountryCode = this._phoneUtil?.getCountryCodeForRegionCode(regionCode);

    if ('modelValue' in dropdownElement) {
      const dropdownCountryCode = this._phoneUtil?.getCountryCodeForRegionCode(
        dropdownElement.modelValue,
      );
      if (dropdownCountryCode === inputCountryCode) {
        return;
      }
      /** @type {* & FormatHost} */ (dropdownElement).modelValue = regionCode;
    } else {
      const dropdownCountryCode = this._phoneUtil?.getCountryCodeForRegionCode(
        dropdownElement.value,
      );
      if (dropdownCountryCode === inputCountryCode) {
        return;
      }
      /** @type {HTMLSelectElement} */ (dropdownElement).value = regionCode;
    }
  }

  /**
   * Prepares data for options, like "Greece (Ελλάδα)", where "Greece" is `nameForLocale` and
   * "Ελλάδα" `nameForRegion`.
   * This should be run on change of:
   * - allowedRegions
   * - _phoneUtil loaded
   * - locale
   * @private
   */
  __createRegionMeta() {
    if (!this._allowedOrAllRegions?.length || !this.__namesForLocale) {
      return;
    }

    this.__regionMetaList = [];
    this.__regionMetaListPreferred = [];
    this._allowedOrAllRegions.forEach(regionCode => {
      // @ts-ignore relatively new platform api
      const namesForRegion = new Intl.DisplayNames([regionCode.toLowerCase()], {
        type: 'region',
      });
      const countryCode =
        this._phoneUtil && this._phoneUtil.getCountryCodeForRegionCode(regionCode);

      const flagSymbol = getFlagSymbol(regionCode);

      const destinationList = this.preferredRegions.includes(regionCode)
        ? this.__regionMetaListPreferred
        : this.__regionMetaList;

      destinationList.push({
        regionCode,
        countryCode,
        flagSymbol,
        nameForLocale: this.__namesForLocale?.of(regionCode),
        nameForRegion: namesForRegion.of(regionCode),
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
}
