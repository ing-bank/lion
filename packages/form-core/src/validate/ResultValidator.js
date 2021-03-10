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
   * @param {string} context.prevShownValidationFeedback
   * @param {Validator[]} [context.validators]
   * @returns {boolean}
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  executeOnResults({ regularValidationResult, prevShownValidationFeedback, validators }) {
    return true;
  }
}
