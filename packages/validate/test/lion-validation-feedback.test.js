/* eslint-disable no-unused-vars, no-param-reassign */
import { fixture, html, expect } from '@open-wc/testing';
import '../lion-validation-feedback.js';
import {
  AlwaysInvalid,
} from '../test-helpers/helper-validators.js';

describe('lion-validation-feedback', () => {
  it('renders a validation message', async () => {
    const el = await fixture(html`<lion-validation-feedback></lion-validation-feedback>`);
    expect(el).shadowDom.to.equal('');
    el.feedbackData = [
      { message: 'hello', type: 'error', validator: new AlwaysInvalid() },
    ];
    await el.updateComplete;
    expect(el).shadowDom.to.equal('hello');
  });
});