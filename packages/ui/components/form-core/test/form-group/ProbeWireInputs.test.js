import { expect, fixture, html } from '@open-wc/testing';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-input-amount.js';
import '@lion/ui/define/lion-input-date.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import { Unparseable } from '@lion/ui/form-core.js';

/**
 * PROBE — the RAW INPUTS a wire projection must consume.
 * Prints, per field type: typeof modelValue, typeof serializedValue, and the
 * JSON form of each. No assertions on policy; this is measurement.
 */
const row = name => el => {
  // eslint-disable-next-line no-console
  console.log(
    `[WIRE] ${name.padEnd(16)} model=${typeof el.modelValue} (${JSON.stringify(
      el.modelValue,
    )})  serialized=${typeof el.serializedValue} (${JSON.stringify(el.serializedValue)})`,
  );
};

describe('PROBE — wire-projection inputs', () => {
  it('scalar / typed / choice fields', async () => {
    const group = await fixture(html`
      <lion-fieldset name="root">
        <lion-input name="text" .modelValue=${'Ada'}></lion-input>
        <lion-input-amount name="amount" .modelValue=${1234.56}></lion-input-amount>
        <lion-input-date name="date" .modelValue=${new Date('2000-12-12')}></lion-input-date>
        <lion-checkbox-group name="terms[]">
          <lion-checkbox .choiceValue=${'a'} .modelValue=${{ checked: true, value: 'a' }}></lion-checkbox>
          <lion-checkbox .choiceValue=${'b'} .modelValue=${{ checked: true, value: 'b' }}></lion-checkbox>
        </lion-checkbox-group>
      </lion-fieldset>
    `);
    for (const el of group.querySelectorAll('lion-input, lion-input-amount, lion-input-date, lion-checkbox-group')) {
      row(el.localName)(el);
    }
    // eslint-disable-next-line no-console
    console.log('[WIRE] group.modelValue     =', JSON.stringify(group.modelValue));
    // eslint-disable-next-line no-console
    console.log('[WIRE] group.serializedValue=', JSON.stringify(group.serializedValue));
    expect(true).to.equal(true);
  });

  it('empty + Unparseable edge cases', async () => {
    const group = await fixture(html`
      <lion-fieldset name="root">
        <lion-input-amount name="emptyAmount"></lion-input-amount>
        <lion-input
          name="unparseable"
          .parser=${v => (Number.isNaN(Number(v)) ? undefined : Number(v))}
        ></lion-input>
      </lion-fieldset>
    `);
    const up = group.querySelector('[name="unparseable"]');
    up.value = 'not-a-number';
    await up.updateComplete;
    row('amount(empty)')(group.querySelector('[name="emptyAmount"]'));
    row('unparseable')(up);
    // eslint-disable-next-line no-console
    console.log('[WIRE] isEmpty(amount) =', group.querySelector('[name="emptyAmount"]')._isEmpty());
    // eslint-disable-next-line no-console
    console.log(
      '[WIRE] unparseable instanceof Unparseable =',
      up.modelValue instanceof Unparseable,
      'viewValue =',
      up.modelValue && up.modelValue.viewValue,
    );
    expect(true).to.equal(true);
  });
});
