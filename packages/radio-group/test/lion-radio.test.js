import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import '@lion/radio-group/define-radio';

/**
 * @typedef {import('../src/LionRadio').LionRadio} LionRadio
 */

describe('<lion-radio>', () => {
  it('should have type = radio', async () => {
    const el = await fixture(html`
      <lion-radio name="radio" .choiceValue="${'male'}"></lion-radio>
    `);
    expect(el.getAttribute('type')).to.equal('radio');
  });

  it('can be reset when unchecked by default', async () => {
    const el = /**  @type {LionRadio} */ (
      await fixture(html` <lion-radio name="radio" .choiceValue=${'male'}></lion-radio> `)
    );
    expect(el._initialModelValue).to.deep.equal({ value: 'male', checked: false });
    el.checked = true;
    expect(el.modelValue).to.deep.equal({ value: 'male', checked: true });

    el.reset();
    expect(el.modelValue).to.deep.equal({ value: 'male', checked: false });
  });

  it('can be reset when checked by default', async () => {
    const el = /**  @type {LionRadio} */ (
      await fixture(html` <lion-radio name="radio" .choiceValue=${'male'} checked></lion-radio> `)
    );
    expect(el._initialModelValue).to.deep.equal({ value: 'male', checked: true });
    el.checked = false;
    expect(el.modelValue).to.deep.equal({ value: 'male', checked: false });

    el.reset();
    expect(el.modelValue).to.deep.equal({ value: 'male', checked: true });
  });
});
