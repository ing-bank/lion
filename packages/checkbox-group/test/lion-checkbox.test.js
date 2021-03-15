import { expect, fixture, html } from '@open-wc/testing';
import '@lion/checkbox-group/define-checkbox';

/**
 * @typedef {import('../src/LionCheckbox').LionCheckbox} LionCheckbox
 */

describe('<lion-checkbox>', () => {
  it('should have type = checkbox', async () => {
    const el = await fixture(html`
      <lion-checkbox name="checkbox" .choiceValue="${'male'}"></lion-checkbox>
    `);
    expect(el.getAttribute('type')).to.equal('checkbox');
  });

  it('can be reset when unchecked by default', async () => {
    const el = /**  @type {LionCheckbox} */ (await fixture(html`
      <lion-checkbox name="checkbox" .choiceValue=${'male'}></lion-checkbox>
    `));
    expect(el._initialModelValue).to.deep.equal({ value: 'male', checked: false });
    el.checked = true;
    expect(el.modelValue).to.deep.equal({ value: 'male', checked: true });

    el.reset();
    expect(el.modelValue).to.deep.equal({ value: 'male', checked: false });
  });

  it('can be reset when checked by default', async () => {
    const el = /**  @type {LionCheckbox} */ (await fixture(html`
      <lion-checkbox name="checkbox" .choiceValue=${'male'} checked></lion-checkbox>
    `));
    expect(el._initialModelValue).to.deep.equal({ value: 'male', checked: true });
    el.checked = false;
    expect(el.modelValue).to.deep.equal({ value: 'male', checked: false });

    el.reset();
    expect(el.modelValue).to.deep.equal({ value: 'male', checked: true });
  });
});
