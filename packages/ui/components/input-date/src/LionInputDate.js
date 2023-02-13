import { IsDate } from '@lion/ui/form-core.js';
import { LionInput } from '@lion/ui/input.js';
import { formatDate, LocalizeMixin, parseDate } from '@lion/ui/localize-no-side-effects.js';

/**
 *
 * @param {Date | undefined} newV
 * @param {Date | undefined} oldV
 */
function hasDateChanged(newV, oldV) {
  return !(
    (
      Object.prototype.toString.call(newV) === '[object Date]' && // is Date Object
      newV &&
      newV.getDate() === oldV?.getDate?.() && // day
      newV.getMonth() === oldV.getMonth?.() && // month
      newV.getFullYear() === oldV.getFullYear?.()
    ) // year
  );
}

/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
export const notEqual = (value, old) => {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
};

/**
 * @param {Date|number} date
 */
function isValidDate(date) {
  // to make sure it is a valid date we use isNaN and not Number.isNaN
  // @ts-ignore [allow]: dirty hack, you're not supposed to pass Date instances to isNaN
  // eslint-disable-next-line no-restricted-globals
  return date instanceof Date && !isNaN(date);
}

/**
 * `LionInputDate` has a .modelValue of type Date. It parses, formats and validates based
 * on locale.
 *
 * @customElement lion-input-date
 */
export class LionInputDate extends LocalizeMixin(LionInput) {
  /** @type {any} */
  static get properties() {
    return {
      modelValue: {
        type: Date,
        hasChanged: hasDateChanged,
      },
    };
  }

  constructor() {
    super();
    /**
     * @param {string} value
     */
    this.parser = value => (value === '' ? undefined : parseDate(value));
    this.formatter = formatDate;
    this.defaultValidators.push(new IsDate());
    // Just explicitly make clear we shouldn't use type 'date'
    this.type = 'text';
  }

  /** @param {import('lit').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('locale')) {
      this._calculateValues({ source: null });
    }
  }

  /**
   * @param {Date} modelValue
   */
  // eslint-disable-next-line class-methods-use-this
  serializer(modelValue) {
    if (!isValidDate(modelValue)) {
      return '';
    }
    // modelValue is localized, so we take the timezone offset in milliseconds and subtract it
    // before converting it to ISO string.
    const offset = modelValue.getTimezoneOffset() * 60000;
    return new Date(modelValue.getTime() - offset).toISOString().slice(0, 10);
  }

  /**
   * @param {string} serializedValue
   */
  // eslint-disable-next-line class-methods-use-this
  deserializer(serializedValue) {
    return new Date(serializedValue);
  }
}
