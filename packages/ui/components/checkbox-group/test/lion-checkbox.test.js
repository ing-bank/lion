import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import '@lion/ui/define/lion-checkbox.js';

/**
 * @typedef {import('../src/LionCheckbox.js').LionCheckbox} LionCheckbox
 */

describe('<lion-checkbox>', () => {
  it('should have type = checkbox', async () => {
    const el = await fixture(html`
      <lion-checkbox name="checkbox" .choiceValue="${'male'}"></lion-checkbox>
    `);
    expect(el.getAttribute('type')).to.equal('checkbox');
  });
});
