import { Validator } from '@lion/validate';

export class FormElementsHaveNoError extends Validator {
  constructor() {
    super();
    this.name = 'FormElementsHaveNoError';
  }

  // eslint-disable-next-line class-methods-use-this
  execute(value, options, config) {
    const hasError = config.node._anyFormElementHas(`hasError`);
    return hasError;
  }
}
