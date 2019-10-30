import { expect } from '@open-wc/testing';
import { ResultValidator } from '../src/ResultValidator.js';
import { Required } from '../src/validators/Required.js';
import { MinLength } from '../src/validators/StringValidators.js';

describe('ResultValidator', () => {
  it('has an "executeOnResults" function returning active state', async () => {
    // This test shows the best practice of creating executeOnResults method
    class MyResultValidator extends ResultValidator {
      executeOnResults({ regularValidateResult, prevValidationResult }) {
        const hasSuccess = regularValidateResult.length && !prevValidationResult.length;
        return hasSuccess;
      }
    }
    expect(
      new MyResultValidator().executeOnResults({
        regularValidateResult: [new Required(), new MinLength(3)],
        prevValidationResult: [],
      }),
    ).to.be.true;
  });
});
