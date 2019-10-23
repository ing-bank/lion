import { Validator } from '../Validator.js';

export class Required extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'Required';
  }

  /**
   * We don't have an execute function, since the Required validator is 'special'.
   * The outcome depends on the modelValue of the FormControl and
   * FormControl.__isEmpty / FormControl._isEmpty.
   */

  // eslint-disable-next-line class-methods-use-this
  onFormControlConnect(formControl) {
    console.log('formControl._inputNode', formControl._inputNode);
    if (formControl._inputNode) {
      formControl._inputNode.setAttribute('aria-required', 'true');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onFormControlDisconnect(formControl) {
    if (formControl._inputNode) {
      formControl._inputNode.removeAttribute('aria-required');
    }
  }
}
