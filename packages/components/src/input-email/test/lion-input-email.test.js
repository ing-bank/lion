import { expect, fixture as _fixture } from '@open-wc/testing';
import { getInputMembers } from '@lion/components/input-test-helpers.js';
import '@lion/components/define/lion-input-email.js';

/**
 * @typedef {import('../src/LionInputEmail').LionInputEmail} LionInputEmail
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputEmail>} */ (_fixture);

describe('<lion-input-email>', () => {
  it('has a type = text', async () => {
    const el = await fixture(`<lion-input-email></lion-input-email>`);
    const { _inputNode } = getInputMembers(el);
    expect(_inputNode.type).to.equal('text');
  });

  it('has validator "IsEmail" applied by default', async () => {
    // More elaborate tests can be found in lion-validate/test/StringValidators.test.js
    const el = await fixture(`<lion-input-email></lion-input-email>`);
    el.modelValue = 'foo@bar@example.com';
    expect(el.hasFeedbackFor).to.deep.equal(['error']);
    expect(el.validationStates.error.IsEmail).to.be.true;
  });

  it('is accessible', async () => {
    const lionInputEmail = await fixture(
      `<lion-input-email><label slot="label">Label</label></lion-input-email>`,
    );
    await expect(lionInputEmail).to.be.accessible();
  });

  it('is accessible when readonly', async () => {
    const lionInputEmail = await fixture(
      `<lion-input-email readonly><label slot="label">Label</label></lion-input-email>`,
    );
    await expect(lionInputEmail).to.be.accessible();
  });

  it('is accessible when disabled', async () => {
    const lionInputEmail = await fixture(
      `<lion-input-email disabled><label slot="label">Label</label></lion-input-email>`,
    );
    await expect(lionInputEmail).to.be.accessible();
  });
});
