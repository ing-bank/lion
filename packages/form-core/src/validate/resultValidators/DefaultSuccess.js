import { ResultValidator } from '../ResultValidator.js';

/**
 * @typedef {import('../Validator').Validator} Validator
 */

export class DefaultSuccess extends ResultValidator {
  /**
   * @param  {...any} args
   */
  constructor(...args) {
    super(...args);
    this.type = 'success';
  }

  /**
   *
   * @param {Object} context
   * @param {Validator[]} context.regularValidationResult
   * @param {Validator[]} context.prevValidationResult
   * @returns {boolean}
   */
  // eslint-disable-next-line class-methods-use-this
  executeOnResults({ regularValidationResult, prevValidationResult }) {
    const errorOrWarning = /** @param {Validator} v */ v =>
      v.type === 'error' || v.type === 'warning';
    const hasErrorOrWarning = !!regularValidationResult.filter(errorOrWarning).length;
    const prevHadErrorOrWarning = !!prevValidationResult.filter(errorOrWarning).length;
    return !hasErrorOrWarning && prevHadErrorOrWarning;
  }
}
