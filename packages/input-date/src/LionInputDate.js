import { IsDate } from '@lion/form-core';
import { LionInput } from '@lion/input';
import { formatDate, LocalizeMixin, parseDate } from '@lion/localize';

function isValidDate(date) {
  // to make sure it is a valid date we use isNaN and not Number.isNaN
  // eslint-disable-next-line no-restricted-globals
  return date instanceof Date && !isNaN(date);
}

/**
 * `LionInputDate` has a .modelValue of type Date. It parses, formats and validates based
 * on locale.
 *
 * @customElement lion-input-date
 * @extends {LionInput}
 */
export class LionInputDate extends LocalizeMixin(LionInput) {
  static get properties() {
    return {
      modelValue: Date,
    };
  }

  constructor() {
    super();
    this.parser = (value, options) => (value === '' ? undefined : parseDate(value, options));
    this.formatter = formatDate;
    this.defaultValidators.push(new IsDate());
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('locale')) {
      this._calculateValues();
    }
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.type = 'text';
  }

  // eslint-disable-next-line class-methods-use-this
  serializer(modelValue) {
    if (!isValidDate(modelValue)) {
      return '';
    }
    // modelValue is localized, so we take the timezone offset in milliseconds and subtract it
    // before converting it to ISO string.
    const offset = modelValue.getTimezoneOffset() * 60000;
    return new Date(modelValue - offset).toISOString().slice(0, 10);
  }

  // eslint-disable-next-line class-methods-use-this
  deserializer(serializedValue) {
    return new Date(serializedValue);
  }
}
