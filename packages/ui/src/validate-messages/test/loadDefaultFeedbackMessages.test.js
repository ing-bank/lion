/* eslint-disable no-unused-vars, no-param-reassign */
import { expect } from '@open-wc/testing';
import { localize } from '@lion/ui/localize.js';
import { Required } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';

/**
 * @typedef {import('@lion/form-core').Validator} Validator
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
  it('will set default feedback message for Required', async () => {
    const el = new Required();
    const { getMessage } = getProtectedMembers(el);
    expect(await getMessage()).to.equals(
      'Please configure an error message for "Required" by overriding "static async getMessage()"',
    );

    loadDefaultFeedbackMessages();
    expect(await getMessage({ fieldName: 'password' })).to.equal('Please enter a(n) password.');
  });

  it('will await loading of translations when switching locale', async () => {
    const el = new Required();
    const { getMessage } = getProtectedMembers(el);
    loadDefaultFeedbackMessages();
    expect(await getMessage({ fieldName: 'password' })).to.equal('Please enter a(n) password.');
    expect(await getMessage({ fieldName: 'user name' })).to.equal('Please enter a(n) user name.');

    localize.locale = 'de-DE';
    expect(await getMessage({ fieldName: 'Password' })).to.equal(
      'Password muss ausgefüllt werden.',
    );
    expect(await getMessage({ fieldName: 'Benutzername' })).to.equal(
      'Benutzername muss ausgefüllt werden.',
    );
  });
});
