import { css } from '@lion/core';
import { LionInput } from '@lion/input';
import { getCurrencyName, localize, LocalizeMixin } from '@lion/localize';
import { IsNumber } from '@lion/form-core';
import { formatAmount, formatCurrencyLabel } from './formatters.js';
import { parseAmount } from './parsers.js';

/**
 * @typedef {import('@lion/form-core/types/FormatMixinTypes').FormatOptions} FormatOptions
 * @typedef {FormatOptions & {locale?:string;currency:string|undefined}} AmountFormatOptions
 */

/**
 * `LionInputAmount` is a class for an amount custom form element (`<lion-input-amount>`).
 *
 * @customElement lion-input-amount
 */
export class LionInputAmount extends LocalizeMixin(LionInput) {
  /** @type {any} */
  static get properties() {
    return {
      /**
       * @desc an iso code like 'EUR' or 'USD' that will be displayed next to the input
       * and from which an accessible label (like 'euros') is computed for screen
       * reader users
       */
      currency: String,
      /**
       * @desc the modelValue of the input-amount has the 'Number' type. This allows
       * Application Developers to easily read from and write to this input or write custom
       * validators.
       */
      modelValue: Number,
      locale: { attribute: false },
    };
  }

  get slots() {
    return {
      ...super.slots,
      after: () => {
        const el = document.createElement('span');
        // The data-label attribute will make sure that FormControl adds this to
        // input[aria-labelledby]
        el.setAttribute('data-label', '');
        el.textContent = this.__currencyLabel;
        return el;
      },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        .input-group__container > .input-group__input ::slotted(.form-control) {
          text-align: right;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.parser = parseAmount;
    this.formatter = formatAmount;
    /** @type {string | undefined} */
    this.currency = undefined;
    /** @type {string | undefined} */
    this.locale = undefined;
    /** 
     * @private
     * @type {boolean}
     */
    this.__currencyDisplayNodeIsConnected = true;
    this.defaultValidators.push(new IsNumber());
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.type = 'text';
    this._inputNode.setAttribute('inputmode', 'decimal');

    if (this.currency) {
      this.__setCurrencyDisplayLabel();
    }
  }

  /** @param {import('@lion/core').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('currency')) {
      this._onCurrencyChanged({ currency: this.currency || null });
    }

    if (changedProperties.has('locale') && this.locale !== changedProperties.get('locale')) {
      if (this.locale) {
        /** @type {AmountFormatOptions} */
        (this.formatOptions).locale = this.locale;
      } else {
        delete (/** @type {AmountFormatOptions} */ (this.formatOptions).locale);
      }
      this.__reformat();
    }
  }

  /**
   * Upon connecting slot mixin, we should check if
   * the after slot was created by the slot mixin,
   * and if so, we should execute the currency changed flow
   * which evaluates whether the slot node should be
   * removed for invalid currencies
   */
  _connectSlotMixin() {
    super._connectSlotMixin();
    if (this._isPrivateSlot('after')) {
      this._onCurrencyChanged({ currency: this.currency || null });
    }
  }

  /**
   * @param {string} newLocale
   * @param {string} oldLocale
   * @enhance LocalizeMixin
   */
  onLocaleChanged(newLocale, oldLocale) {
    super.onLocaleChanged(newLocale, oldLocale);
    // If locale property is used, no need to respond to global locale changes
    if (!this.locale) {
      this.__reformat();
    }
  }

  /**
   * @enhance FormatMixin: instead of only formatting on blur, also format when a user pasted
   * content
   * @protected
   */
  _reflectBackOn() {
    return super._reflectBackOn() || this._isPasting;
  }

  /**
   * @param {Object} opts
   * @param {string?} opts.currency
   * @protected
   */
  _onCurrencyChanged({ currency }) {
    if (!this.__currencyDisplayNode) {
      return;
    }

    /** @type {AmountFormatOptions} */
    (this.formatOptions).currency = currency || undefined;
    if (currency) {
      if (!this.__currencyDisplayNodeIsConnected) {
        this.appendChild(this.__currencyDisplayNode);
        this.__currencyDisplayNodeIsConnected = true;
      }
      this.__currencyDisplayNode.textContent = this.__currencyLabel;

      try {
        this._calculateValues({ source: null });
      } catch (e) {
        // In case Intl.NumberFormat gives error for invalid currency
        // we should catch, remove the node, and rethrow (since it's still a user error)
        if (e instanceof RangeError) {
          this.__currencyDisplayNode?.remove();
          this.__currencyDisplayNodeIsConnected = false;
        }
        throw e;
      }
      this.__setCurrencyDisplayLabel();
    } else {
      this.__currencyDisplayNode?.remove();
      this.__currencyDisplayNodeIsConnected = false;
    }
  }

  /**
   * @returns the current currency display node
   * @private
   */
  get __currencyDisplayNode() {
    const node = Array.from(this.children).find(child => child.slot === 'after');
    if (node) {
      this.__storedCurrencyDisplayNode = node;
    }

    return node || this.__storedCurrencyDisplayNode;
  }

  /** @private */
  __setCurrencyDisplayLabel() {
    // TODO: (@erikkroes) for optimal a11y, abbreviations should be part of aria-label
    // example, for a language switch with text 'en', an aria-label of 'english' is not
    // sufficient, it should also contain the abbreviation.
    if (this.__currencyDisplayNode) {
      this.__currencyDisplayNode.setAttribute(
        'aria-label',
        this.currency ? getCurrencyName(this.currency, {}) : '',
      );
    }
  }

  /**
   * @private
   */
  get __currencyLabel() {
    return this.currency ? formatCurrencyLabel(this.currency, localize.locale) : '';
  }

  __reformat() {
    this.formattedValue = this._callFormatter();
  }
}
