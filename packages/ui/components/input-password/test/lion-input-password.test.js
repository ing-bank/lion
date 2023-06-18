import { expect, fixture as _fixture } from '@open-wc/testing';
import { getInputMembers } from '@lion/ui/input-test-helpers.js';
import '@lion/ui/define/lion-input-password.js';

/**
 * @typedef {import('../src/LionInputPassword.js').LionInputPassword} LionInputPassword
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputPassword>} */ (_fixture);

describe('<lion-input-password>', () => {
  it('has a type = password', async () => {
    const el = await fixture(`<lion-input-password></lion-input-password>`);
    const { _inputNode } = getInputMembers(el);
    expect(_inputNode.type).to.equal('password');
  });
  it('has validator "MinLength" applied by default', async () => {
    // More elaborate tests can be found in lion-validate/test/StringValidators.test.js
    const el = await fixture(`<lion-input-password minLength=5></lion-input-password>`);
    el.modelValue = 'foo';
    // expect(el.hasFeedbackFor).to.deep.equal([]);
    expect(el.hasFeedbackFor).to.deep.equal(['error']);
    expect(el.validationStates.error.MinLength).to.be.true;
  });

  it('has a default type of "password"', async () => {
    const el = await fixture(`<lion-input-password></lion-input-password>`);
    expect(el.type).to.equal('password');
  });

  it('shows character counter if showCharCounter is true', async () => {
    const el = await fixture(`<lion-input-password></lion-input-password>`);
    const charCounter = el.shadowRoot?.querySelector('#char-counter');
    expect(charCounter).to.exist;
  });

  // ????
  it('does not show character counter if showCharCounter is false', async () => {
    const el = await fixture(`<lion-input-password showCharCounter=false></lion-input-password>`);
    const charCounter = el.shadowRoot?.querySelector('#char-counter');
    expect(charCounter).to.be.null;
  });

  it('shows visibility toggle button if showVisibilityControl is true', async () => {
    const el = await fixture(`<lion-input-password showVisibilityControl=true></lion-input-password>`);
    const visibilityToggle = el.shadowRoot?.querySelector('#visibility-toggler');
    expect(visibilityToggle).to.exist;
  });

  // ????
  it('does not show visibility toggle button if showVisibilityControl is false', async () => {
    const el = await fixture(`<lion-input-password showVisibilityControl=false></lion-input-password>`);
    const visibilityToggle = el.shadowRoot?.querySelector('#visibility-toggler');
    expect(visibilityToggle).to.be.null;
  });

  it('can toggle password visibility', async () => {
    const el = await fixture(`<lion-input-password showVisibilityControl=true></lion-input-password>`);
    const visibilityToggle = el.shadowRoot?.querySelector('button');
    visibilityToggle?.click();
    expect(el.type).to.equal('text');
    visibilityToggle?.click();
    expect(el.type).to.equal('password');
  });

  it('updates minLength validator when minLength property changes', async () => {
    const el = await fixture(`<lion-input-password minLength=5></lion-input-password>`);
    el.minLength = 10;
    await el.updateComplete;
    expect(el._inputNode.min).to.equal('10');
  });

  it('updates maxLength validator when maxLength property changes', async () => {
    const el = await fixture(`<lion-input-password maxLength=10></lion-input-password>`);
    el.maxLength = 20;
    await el.updateComplete;
    expect(el._inputNode.max).to.equal('20');
  });
});
