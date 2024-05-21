/* eslint-disable no-unused-vars, no-param-reassign */
import { expect } from '@open-wc/testing';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { MinDate, MinLength, Required } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessagesNoSideEffects } from '@lion/ui/validate-messages-no-side-effects.js';

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

/**
 * @typedef {import('@lion/ui/types/form-core.js').FormControlHost} FormControlHost
 * @typedef {ArrayConstructor | ObjectConstructor | NumberConstructor | BooleanConstructor | StringConstructor | DateConstructor | 'iban' | 'email'} modelValueType
 */

describe('loadDefaultFeedbackMessagesNoSideEffects', () => {
  const localizeManager = getLocalizeManager();

  it('will set default feedback message for Required', async () => {
    const el = new Required();
    const { getMessage } = getProtectedMembers(el);
    expect(await getMessage()).to.equals(
      'Please configure an error message for "Required" by overriding "static async getMessage()"',
    );

    loadDefaultFeedbackMessagesNoSideEffects({ localize: localizeManager });
    expect(await getMessage({ fieldName: 'password' })).to.equal('Please enter a(n) password.');
  });

  it('passes data to the feedback message', async () => {
    const el = new MinLength(10);
    const { getMessage } = getProtectedMembers(el);

    loadDefaultFeedbackMessagesNoSideEffects({ localize: localizeManager });
    expect(await getMessage({ fieldName: 'password' })).to.equal(
      'Please enter a correct password (at least 10 characters).',
    );

    const el2 = new MinDate(new Date('2024-01-29'));
    // @ts-ignore protected members allowed in test
    expect(await el2._getMessage({ fieldName: 'date' })).to.equal(
      'Please enter a(n) date after or equal to 29/01/2024.',
    );
  });

  it('will set select specific feedback message for Required when operationMode is set', async () => {
    const el = new Required();
    loadDefaultFeedbackMessagesNoSideEffects({ localize: localizeManager });
    const { getMessage } = getProtectedMembers(el);
    const formControl = { operationMode: 'select' };
    expect(await getMessage({ fieldName: 'password', formControl })).to.equal(
      'Please select a(n) password.',
    );
  });

  it('will set upload specific feedback message for Required when operationMode is set', async () => {
    const el = new Required();
    const { getMessage } = getProtectedMembers(el);

    loadDefaultFeedbackMessagesNoSideEffects({ localize: localizeManager });
    const formControl = { operationMode: 'upload' };
    expect(await getMessage({ fieldName: 'password', formControl })).to.equal(
      'Please upload a(n) password.',
    );
  });

  it('will set ignore the operationMode for any other validator then Required, e.g. MinLength', async () => {
    const el = new MinLength(10);
    const { getMessage } = getProtectedMembers(el);

    loadDefaultFeedbackMessagesNoSideEffects({ localize: localizeManager });
    const formControl = { operationMode: 'select' };
    expect(await getMessage({ fieldName: 'password', formControl })).to.equal(
      'Please enter a correct password (at least 10 characters).',
    );
  });

  it('will await loading of translations when switching locale', async () => {
    const el = new Required();
    const { getMessage } = getProtectedMembers(el);
    loadDefaultFeedbackMessagesNoSideEffects({ localize: localizeManager });
    expect(await getMessage({ fieldName: 'password' })).to.equal('Please enter a(n) password.');
    expect(await getMessage({ fieldName: 'user name' })).to.equal('Please enter a(n) user name.');

    localizeManager.locale = 'de-DE';
    await localizeManager.loadingComplete;
    expect(await getMessage({ fieldName: 'Password' })).to.equal(
      'Password muss ausgefüllt werden.',
    );
    expect(await getMessage({ fieldName: 'Benutzername' })).to.equal(
      'Benutzername muss ausgefüllt werden.',
    );
  });
});
