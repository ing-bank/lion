import { expect, fixture, html } from '@open-wc/testing';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-input.js';

/**
 * PROBE — group aggregate FAITHFULNESS (not a bug hunt).
 * The internal (group) model mirrors the platform registration contract:
 * keys are the RAW names (incl. "[]"), repeated names become arrays, nesting is
 * via nested fieldsets, and the aggregate is fresh synchronously.
 * Confirmed native behaviour: name="b[]" -> FormData key "b[]".
 */
describe('PROBE — group aggregate is faithful to the registration contract', () => {
  it('keys the aggregate by the RAW name, brackets included', async () => {
    const group = await fixture(html`
      <lion-fieldset name="root">
        <lion-fieldset name="addresses[]">
          <lion-input name="street" .modelValue=${'A'}></lion-input>
        </lion-fieldset>
        <lion-fieldset name="addresses[]">
          <lion-input name="street" .modelValue=${'B'}></lion-input>
        </lion-fieldset>
      </lion-fieldset>
    `);
    expect(Object.keys(group.modelValue)).to.deep.equal(['addresses[]']);
    expect(Array.isArray(group.modelValue['addresses[]'])).to.equal(true);
    expect(group.modelValue['addresses[]']).to.deep.equal([{ street: 'A' }, { street: 'B' }]);
  });

  it('nests via nested fieldsets', async () => {
    const group = await fixture(html`
      <lion-fieldset name="root">
        <lion-fieldset name="address">
          <lion-input name="street" .modelValue=${'Main'}></lion-input>
          <lion-input name="city" .modelValue=${'Town'}></lion-input>
        </lion-fieldset>
      </lion-fieldset>
    `);
    expect(group.modelValue).to.deep.equal({ address: { street: 'Main', city: 'Town' } });
  });

  it('is fresh synchronously after a child change', async () => {
    const group = await fixture(html`
      <lion-fieldset name="root">
        <lion-input name="a" .modelValue=${'old'}></lion-input>
      </lion-fieldset>
    `);
    group.querySelector('[name="a"]').modelValue = 'new';
    expect(group.modelValue.a).to.equal('new');
  });
});
