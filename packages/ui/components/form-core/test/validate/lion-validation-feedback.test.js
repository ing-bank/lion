/* eslint-disable no-unused-vars, no-param-reassign */
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';
import '@lion/ui/define/lion-validation-feedback.js';
import { AlwaysInvalid, AlwaysValid } from '@lion/ui/form-core-test-helpers.js';

/**
 * @typedef {import('../../src/validate/LionValidationFeedback.js').LionValidationFeedback} LionValidationFeedback
 */

describe('lion-validation-feedback', () => {
  it('renders a validation message', async () => {
    const el = /** @type {LionValidationFeedback} */ (
      await fixture(html`<lion-validation-feedback></lion-validation-feedback>`)
    );
    expect(el).shadowDom.to.equal('');
    el.feedbackData = [{ message: 'hello', type: 'error', validator: new AlwaysInvalid() }];
    await el.updateComplete;
    expect(el).shadowDom.to.equal('hello');
  });

  it('renders the validation type attribute', async () => {
    const el = /** @type {LionValidationFeedback} */ (
      await fixture(html`<lion-validation-feedback></lion-validation-feedback>`)
    );
    el.feedbackData = [{ message: 'hello', type: 'error', validator: new AlwaysInvalid() }];
    await el.updateComplete;
    expect(el.getAttribute('type')).to.equal('error');

    el.feedbackData = [{ message: 'hello', type: 'warning', validator: new AlwaysInvalid() }];
    await el.updateComplete;
    expect(el.getAttribute('type')).to.equal('warning');
  });

  it('success message clears after 3s', async () => {
    const el = /** @type {LionValidationFeedback} */ (
      await fixture(html`<lion-validation-feedback></lion-validation-feedback>`)
    );

    const clock = sinon.useFakeTimers();

    el.feedbackData = [{ message: 'hello', type: 'success', validator: new AlwaysValid() }];
    await el.updateComplete;
    expect(el.getAttribute('type')).to.equal('success');

    clock.tick(2900);

    expect(el.getAttribute('type')).to.equal('success');

    clock.tick(200);

    expect(el).to.not.have.attribute('type');

    clock.restore();
  });

  it('does not clear error messages', async () => {
    const el = /** @type {LionValidationFeedback} */ (
      await fixture(html`<lion-validation-feedback></lion-validation-feedback>`)
    );

    const clock = sinon.useFakeTimers();

    el.feedbackData = [{ message: 'hello', type: 'success', validator: new AlwaysValid() }];
    await el.updateComplete;
    expect(el.getAttribute('type')).to.equal('success');

    el.feedbackData = [{ message: 'hello', type: 'error', validator: new AlwaysInvalid() }];
    await el.updateComplete;
    clock.tick(3100);
    expect(el.getAttribute('type')).to.equal('error');

    clock.restore();
  });
});
