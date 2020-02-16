import { LocalizeMixin } from '@lion/localize';
import { LionInput } from '@lion/input';
import { IsEmail } from '@lion/validate';

/**
 * LionInputEmail: extension of lion-input
 *
 * @customElement lion-input-email
 * @extends {LionInput}
 */
export class LionInputEmail extends LocalizeMixin(LionInput) {
  constructor() {
    super();
    // local-part@domain where the local part may be up to 64 characters long
    // and the domain may have a maximum of 255 characters
    // @see https://www.wikiwand.com/en/Email_address
    // however, the longest active email is even bigger
    // @see https://laughingsquid.com/the-worlds-longest-active-email-address/
    // we don't want to forbid Mr. Peter Craig email right?
    this.defaultValidators.push(new IsEmail());
  }
}
