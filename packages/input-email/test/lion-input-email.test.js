import { expect, fixture } from '@open-wc/testing';

import '../lion-input-email.js';

describe('<lion-input-email>', () => {
  it('has a type = text', async () => {
    const lionInputEmail = await fixture(`<lion-input-email></lion-input-email>`);
    expect(lionInputEmail.inputElement.type).to.equal('text');
  });

  it('has validator "IsEmail" applied by default', async () => {
    // More elaborate tests can be found in lion-validate/test/StringValidators.test.js
    const lionInputEmail = await fixture(`<lion-input-email></lion-input-email>`);
    lionInputEmail.modelValue = 'foo@bar@example.com';
    expect(lionInputEmail.hasError).to.equal(true);
  });
});
