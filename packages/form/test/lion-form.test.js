import { expect, fixture, html } from '@open-wc/testing';

import '@lion/input/lion-input.js';
import '@lion/fieldset/lion-fieldset.js';

import '../lion-form.js';

describe('<lion-form>', () => {
  it.skip('has a custom reset that gets triggered by native reset', async () => {
    const withDefaults = await fixture(html`
      <lion-form
        ><form>
          <lion-input name="firstName" .modelValue="${'Foo'}"></lion-input>
          <input type="reset" value="reset-button" /></form
      ></lion-form>
    `);
    const resetButton = withDefaults.querySelector('input[type=reset]');

    withDefaults.formElements.firstName.modelValue = 'updatedFoo';
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'updatedFoo',
    });

    withDefaults.reset();
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'Foo',
    });

    // use button
    withDefaults.formElements.firstName.modelValue = 'updatedFoo';
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'updatedFoo',
    });

    resetButton.click();
    expect(withDefaults.modelValue).to.deep.equal({
      firstName: 'Foo',
    });
  });
});
