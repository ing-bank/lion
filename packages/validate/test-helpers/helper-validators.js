/* eslint-disable max-classes-per-file */
import { Validator } from '../src/Validator.js';

export class AlwaysInvalid extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'AlwaysInvalid';
  }

  // eslint-disable-next-line class-methods-use-this
  execute() {
    const showMessage = true;
    return showMessage;
  }
}

export class AlwaysValid extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'AlwaysValid';
  }

  // eslint-disable-next-line class-methods-use-this
  execute() {
    const showMessage = false;
    return showMessage;
  }
}

export class AsyncAlwaysValid extends AlwaysValid {
  constructor(...args) {
    super(...args);
    this.async = true;
  }

  // eslint-disable-next-line class-methods-use-this
  execute() {
    return true;
  }
}

export class AsyncAlwaysInvalid extends AlwaysValid {
  constructor(...args) {
    super(...args);
    this.async = true;
  }

  // eslint-disable-next-line class-methods-use-this
  async execute() {
    return false;
  }
}
