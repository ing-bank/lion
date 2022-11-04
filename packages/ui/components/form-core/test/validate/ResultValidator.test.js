import { expect } from '@open-wc/testing';
import { MinLength, Required, DefaultSuccess, ResultValidator } from '@lion/ui/form-core.js';

/**
 * @typedef {import('../../src/validate/Validator.js').Validator} Validator
 */

describe('ResultValidator', () => {
  it('has an "executeOnResults" function returning active state', async () => {
    // This test shows the best practice of creating executeOnResults method
    class MyResultValidator extends ResultValidator {
      /**
       *
       * @param {Object} context
       * @param {Validator[]} context.regularValidationResult
       * @param {Validator[]} context.prevValidationResult
       * @param {Validator[]} context.prevShownValidationResult
       * @returns {boolean}
       */
      executeOnResults({ regularValidationResult, prevShownValidationResult }) {
        const errorOrWarning = /** @param {Validator} v */ v =>
          v.type === 'error' || v.type === 'warning';
        const hasErrorOrWarning = !!regularValidationResult.filter(errorOrWarning).length;
        const hasShownErrorOrWarning = !!prevShownValidationResult.filter(errorOrWarning).length;

        return !hasErrorOrWarning && hasShownErrorOrWarning;
      }
    }
    expect(
      new MyResultValidator().executeOnResults({
        regularValidationResult: [new Required(), new MinLength(3)],
        prevValidationResult: [],
        prevShownValidationResult: [],
      }),
    ).to.be.false;
    expect(
      new MyResultValidator().executeOnResults({
        regularValidationResult: [new DefaultSuccess()],
        prevValidationResult: [new Required()],
        prevShownValidationResult: [new Required()],
      }),
    ).to.be.true;
  });
});
