import { css } from '@lion/core';
import { LionInput } from '@lion/input';
import { getCurrencyName, localize, LocalizeMixin } from '@lion/localize';
import { IsNumber } from '@lion/validate';
import { formatAmount, formatCurrencyLabel } from './formatters.js';
import { parseAmount } from './parsers.js';

/**
 * `LionInputAmount` is a class for an amount custom form element (`<lion-input-amount>`).
 *
 * @customElement lion-input-amount
 * @extends {LionInput}
 */
export class LionInputAmount extends LocalizeMixin(LionInput) {
  static get properties() {
    return {
      /**
       * @desc an iso code like 'EUR' or 'USD' that will be displayed next to the input
       * and from which an accessible label (like 'euros') is computed for screen
       * reader users
       * @type {string}
       */
      currency: String,
      /**
       * @desc the modelValue of the input-amount has the 'Number' type. This allows
       * Application Developers to easily read from and write to this input or write custom
       * validators.
       * @type {number}
       */
      modelValue: Number,
    };
  }

  get slots() {
    return {
      ...super.slots,
      after: () => {
        if (this.currency) {
          const el = document.createElement('span');
          // The data-label attribute will make sure that FormControl adds this to
          // input[aria-labelledby]
          el.setAttribute('data-label', '');

          el.textContent = this.__currencyLabel;
          return el;
        }
        return null;
      },
    };
  }

  get _currencyDisplayNode() {
    return Array.from(this.children).find(child => child.slot === 'after');
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
    this.__isPasting = false;

    this.addEventListener('paste', () => {
      this.__isPasting = true;
      this.__parserCallcountSincePaste = 0;
    });

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

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('currency')) {
      this._onCurrencyChanged({ currency: this.currency });
    }
  }

  /**
   * @override of FormatMixin
   */
  __callParser(value = this.formattedValue) {
    // TODO: (@daKmor) input and change events both trigger parsing therefore we need to handle the second parse
    this.__parserCallcountSincePaste += 1;
    this.__isPasting = this.__parserCallcountSincePaste === 2;
    this.formatOptions.mode = this.__isPasting === true ? 'pasted' : 'auto';
    return super.__callParser(value);
  }

  /**
   * @override of FormatMixin
   */
  _reflectBackOn() {
    return super._reflectBackOn() || this.__isPasting;
  }

  _onCurrencyChanged({ currency }) {
    if (this._isPrivateSlot('after')) {
      this._currencyDisplayNode.textContent = this.__currencyLabel;
    }
    this.formatOptions.currency = currency;
    this._calculateValues();
    this.__setCurrencyDisplayLabel();
  }

  __setCurrencyDisplayLabel() {
    // TODO: (@erikkroes) for optimal a11y, abbreviations should be part of aria-label
    // example, for a language switch with text 'en', an aria-label of 'english' is not
    // sufficient, it should also contain the abbreviation.
    this._currencyDisplayNode.setAttribute('aria-label', getCurrencyName(this.currency));
  }

  get __currencyLabel() {
    return formatCurrencyLabel(this.currency, localize.locale);
  }
}
