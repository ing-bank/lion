import { LocalizeMixin } from '@lion/localize';
import { LionInput } from '@lion/input';
import { formatIBAN } from './formatters.js';
import { parseIBAN } from './parsers.js';
import { IsIBAN } from './validators.js';

/**
 * `LionInputIban` is a class for an IBAN custom form element (`<lion-input-iban>`).
 * @customElement lion-input-iban
 */
export class LionInputIban extends LocalizeMixin(LionInput) {
  constructor() {
    super();
    this.formatter = formatIBAN;
    this.parser = parseIBAN;
    this.defaultValidators.push(new IsIBAN());
  }
}
