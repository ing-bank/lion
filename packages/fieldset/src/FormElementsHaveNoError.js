import { Validator } from '@lion/validate';

export class FormElementsHaveNoError extends Validator {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  static get validatorName() {
    return 'FormElementsHaveNoError';
  }

  // eslint-disable-next-line class-methods-use-this
  execute(value, options, config) {
    const hasError = config.node._anyFormElementHasFeedbackFor('error');
    return hasError;
  }

  static async getMessage() {
    return '';
  }
}
