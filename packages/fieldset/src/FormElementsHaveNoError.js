import { Validator } from '@lion/validate';

export class FormElementsHaveNoError extends Validator {
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
