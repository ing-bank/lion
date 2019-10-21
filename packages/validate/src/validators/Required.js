import { Validator } from '../Validator.js';

export class Required extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'required';
  }

  // eslint-disable-next-line class-methods-use-this
  onFormControlConnect(formControl) {
    if (formControl.inputElement) {
      formControl.inputElement.setAttribute('aria-required', 'true');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onFormControlDisconnect(formControl) {
    if (formControl.inputElement) {
      formControl.inputElement.removeAttribute('aria-required');
    }
  }
}
