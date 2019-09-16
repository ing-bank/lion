/* eslint-disable max-classes-per-file */
import { Validator } from '../src/Validator.js';

export class AlwaysInvalid extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'alwaysInvalid';
  }

  execute() { // eslint-disable-line class-methods-use-this
    const showMessage = true;
    return showMessage;
  }
}


export class AlwaysValid extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'alwaysValid';
  }

  execute() {  // eslint-disable-line class-methods-use-this
    const showMessage = false;
    return showMessage;
  }
}
