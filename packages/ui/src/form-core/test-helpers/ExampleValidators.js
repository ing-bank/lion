/* eslint-disable max-classes-per-file, class-methods-use-this */
import { Validator } from '@lion/ui/form-core.js';

export class AlwaysInvalid extends Validator {
  static get validatorName() {
    return 'AlwaysInvalid';
  }

  execute() {
    const showMessage = true;
    return showMessage;
  }
}

export class AlwaysValid extends Validator {
  static get validatorName() {
    return 'AlwaysValid';
  }

  /**
   * @return {Promise<boolean> | boolean}
   */
  execute() {
    const showMessage = false;
    return showMessage;
  }
}

export class AsyncAlwaysValid extends AlwaysValid {
  static get async() {
    return true;
  }

  /**
   * @return {Promise<boolean>}
   */
  async execute() {
    return true;
  }
}

export class AsyncAlwaysInvalid extends AlwaysValid {
  static get async() {
    return true;
  }

  /**
   * @return {Promise<boolean>}
   */
  async execute() {
    return false;
  }
}
