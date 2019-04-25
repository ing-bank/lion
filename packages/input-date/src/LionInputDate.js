/* eslint-disable no-underscore-dangle */

import { LocalizeMixin, formatDate, parseDate } from '@lion/localize';
import { FieldCustomMixin } from '@lion/field';
import { LionInput } from '@lion/input';
import { isDateValidator } from '@lion/validate';

/**
 * `LionInputDate` is a class for a date custom form element (`<lion-input-date>`).
 *
 * @customElement
 * @extends {LionInput}
 */
export class LionInputDate extends FieldCustomMixin(LocalizeMixin(LionInput)) {
  static get asyncObservers() {
    return {
      ...super.asyncObservers,
      _calculateValues: ['locale'],
    };
  }

  constructor() {
    super();
    this.parser = (value, options) => {
      return value === '' ? undefined : parseDate(value, options);
    };
    this.formatter = formatDate;
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.type = 'text';
  }

  getValidatorsForType(type) {
    if (type === 'error') {
      return [isDateValidator()].concat(super.getValidatorsForType(type) || []);
    }
    return super.getValidatorsForType(type);
  }
}
