import { expect, html, fixture, nextFrame } from '@open-wc/testing';

import { localizeTearDown } from '@lion/localize/test-helpers.js';
import { Required } from '@lion/validate';

import '@lion/checkbox/lion-checkbox.js';
import '../lion-checkbox-group.js';

beforeEach(() => {
  localizeTearDown();
});

describe('<lion-checkbox-group>', () => {
  it('can be required', async () => {
    const el = await fixture(html`
      <lion-checkbox-group .validators=${[new Required()]}>
        <lion-checkbox name="sports[]" .choiceValue=${'running'}></lion-checkbox>
        <lion-checkbox name="sports[]" .choiceValue=${'swimming'}></lion-checkbox>
      </lion-checkbox-group>
    `);
    await nextFrame();

    expect(el.hasError).to.be.true;
    expect(el.errorState.required).to.be.true;
    el.formElements['sports[]'][0].choiceChecked = true;
    expect(el.hasError).to.be.false;
  });
});
