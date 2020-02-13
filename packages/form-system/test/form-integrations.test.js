import { expect, fixture, html } from '@open-wc/testing';
import './helpers/umbrella-form.js';

// Test umbrella form
// For all els, check whether 'serializedValue' === serializeGroup() (when not disabled)

describe('Form Integrations', () => {
  it('".serializedValue" and ".serializeGroup()" return same value for non-disabled fields', async () => {
    const el = await fixture(
      html`
        <umbrella-form></umbrella-form>
      `,
    );
    const formEl = el._lionFormNode;
    expect(formEl.serializeGroup()).to.eql(formEl.serializedValue);
  });
});
