/* eslint-disable no-unused-vars, no-param-reassign */
import { expect } from '@open-wc/testing';
import { localize } from '@lion/localize';
import { loadDefaultFeedbackMessages } from '../src/loadDefaultFeedbackMessages.js';
import { Required } from '../src/validators/Required.js';

describe('loadDefaultFeedbackMessages', () => {
  it('will set default feedback message for Required', async () => {
    const el = new Required();
    expect(await el._getMessage()).to.equals(
      'Please configure an error message for "Required" by overriding "static async getMessage()"',
    );

    loadDefaultFeedbackMessages();
    expect(await el._getMessage({ fieldName: 'password' })).to.equal('Please enter a(n) password.');
  });

  it('will await loading of translations when switching locale', async () => {
    const el = new Required();
    loadDefaultFeedbackMessages();
    expect(await el._getMessage({ fieldName: 'password' })).to.equal('Please enter a(n) password.');
    expect(await el._getMessage({ fieldName: 'user name' })).to.equal(
      'Please enter a(n) user name.',
    );

    localize.locale = 'de-DE';
    expect(await el._getMessage({ fieldName: 'Password' })).to.equal(
      'Password muss ausgefüllt werden.',
    );
    expect(await el._getMessage({ fieldName: 'Benutzername' })).to.equal(
      'Benutzername muss ausgefüllt werden.',
    );
  });
});
