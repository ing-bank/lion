import { Validator } from './Validator.js';

/**
 * @desc Instead of evaluating the result of a regular validator, a HolisticValidator looks
 * at the total result of regular Validators. Instead of an execute function, it uses a
 * 'executeOnResults' Validator.
 * ResultValidators cannot be async, and should noy contain an execute method.
 */
export class ResultValidator extends Validator {
  /**
   * @param {object} context
   * @param {Validator[]} context.validationResult
   * @param {Validator[]} context.prevValidationResult
   * @param {Validator[]} context.validators
   * @returns {Feedback[]}
   */
  executeOnResults({ validationResult, prevValidationResult, validators }) {} // eslint-disable-line
}
