/* eslint-disable max-classes-per-file, class-methods-use-this */
import { Validator } from '../src/Validator.js';

export class AlwaysInvalid extends Validator {
  // eslint-disable-next-line no-useless-constructor
  constructor(...args) {
    super(...args);
  }

  static get validatorName() {
    return 'AlwaysInvalid';
  }

  execute() {
    const showMessage = true;
    return showMessage;
  }
}

export class AlwaysValid extends Validator {
  // eslint-disable-next-line no-useless-constructor
  constructor(...args) {
    super(...args);
  }

  static get validatorName() {
    return 'AlwaysValid';
  }

  execute() {
    const showMessage = false;
    return showMessage;
  }
}

export class AsyncAlwaysValid extends AlwaysValid {
  // eslint-disable-next-line no-useless-constructor
  constructor(...args) {
    super(...args);
  }

  static get async() {
    return true;
  }

  execute() {
    return true;
  }
}

export class AsyncAlwaysInvalid extends AlwaysValid {
  // eslint-disable-next-line no-useless-constructor
  constructor(...args) {
    super(...args);
  }

  static get async() {
    return true;
  }

  async execute() {
    return false;
  }
}
