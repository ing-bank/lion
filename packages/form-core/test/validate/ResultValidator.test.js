import { expect } from '@open-wc/testing';
import { ResultValidator } from '../../src/validate/ResultValidator.js';
import { Required } from '../../src/validate/validators/Required.js';
import { MinLength } from '../../src/validate/validators/StringValidators.js';

/**
 * @typedef {import('../../src/validate/Validator').Validator} Validator
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
       * @returns {boolean}
       */
      executeOnResults({ regularValidationResult, prevValidationResult }) {
        const hasSuccess = regularValidationResult.length && !prevValidationResult.length;
        return !!hasSuccess;
      }
    }
    expect(
      new MyResultValidator().executeOnResults({
        regularValidationResult: [new Required(), new MinLength(3)],
        prevValidationResult: [],
      }),
    ).to.be.true;
  });
});
