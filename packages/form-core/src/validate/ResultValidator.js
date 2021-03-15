import { Validator } from './Validator.js';

/**
 * @desc Instead of evaluating the result of a regular validator, a ResultValidator looks
 * at the total result of regular Validators. Instead of an execute function, it uses a
 * 'executeOnResults' Validator.
 * ResultValidators cannot be async, and should not contain an execute method.
 */
export class ResultValidator extends Validator {
  /**
   * @param {Object} context
   * @param {Validator[]} context.regularValidationResult
   * @param {Validator[]} context.prevValidationResult
   * @param {Validator[]} context.prevShownValidationResult
   * @param {Validator[]} [context.validators]
   * @returns {boolean}
   */
  /* eslint-disable no-unused-vars */
  // eslint-disable-next-line class-methods-use-this
  executeOnResults({
    regularValidationResult,
    prevValidationResult,
    prevShownValidationResult,
    validators,
  }) {
    /* eslint-enable no-unused-vars */
    return true;
  }
}
