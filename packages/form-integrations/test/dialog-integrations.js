import { expect, fixture, html } from '@open-wc/testing';
import './helpers/umbrella-form.js';
import '@lion/dialog/lion-dialog.js';

/**
 * @typedef {import('./helpers/umbrella-form.js').UmbrellaForm} UmbrellaForm
 * @typedef {import('@lion/dialog/').LionDialog} LionDialog
 */

// Test umbrella form inside dialog
describe('Form inside dialog Integrations', () => {
  it('"Successfully spawns all form components inside a dialog', async () => {
    expect(
      await fixture(html` <lion-dialog>
        <button slot="invoker">Open Dialog</button>
        <umbrella-form slot="content"></umbrella-form>
      </lion-dialog>`),
    ).to.not.throw();
  });
});
