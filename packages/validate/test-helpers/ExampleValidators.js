/* eslint-disable max-classes-per-file, class-methods-use-this */
import { Validator } from '../src/Validator.js';

export class AlwaysInvalid extends Validator {
  constructor(...args) {
    super(...args);
    this.name = 'AlwaysInvalid';
  }

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

  execute() {
    return true;
  }
}

export class AsyncAlwaysInvalid extends AlwaysValid {
  constructor(...args) {
    super(...args);
    this.async = true;
  }

  async execute() {
    return false;
  }
}
