import { Validator } from '../validate/Validator.js';

export class FormElementsHaveNoError extends Validator {
  static get validatorName() {
    return 'FormElementsHaveNoError';
  }

  /**
   * @param {unknown} [value]
   * @param {string | undefined} [options]
   * @param {{ node: any }} [config]
   */
  // eslint-disable-next-line class-methods-use-this
  execute(value, options, config) {
    const hasError = config?.node._anyFormElementHasFeedbackFor('error');
    return hasError;
  }

  static async getMessage() {
    return '';
  }
}
