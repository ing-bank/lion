/* eslint-disable no-unused-vars, no-param-reassign */
import { expect } from '@open-wc/testing';
import { Required } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';

/**
 * @typedef {import('../../form-core/src/validate/Validator.js').Validator} Validator
 */

/**
 * @param {Validator} validatorEl
 */
function getProtectedMembers(validatorEl) {
  // @ts-ignore protected members allowed in test
  return {
    // @ts-ignore
    getMessage: (...args) => validatorEl._getMessage(...args),
  };
}

describe('loadDefaultFeedbackMessages', () => {
  it('will work without providing a LocalizeManager instance', async () => {
    const el = new Required();
    const { getMessage } = getProtectedMembers(el);
    expect(await getMessage()).to.equals(
      'Please configure an error message for "Required" by overriding "static async getMessage()"',
    );

    loadDefaultFeedbackMessages();
    expect(await getMessage({ fieldName: 'password' })).to.equal('Please enter a(n) password.');
  });
});
