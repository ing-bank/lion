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

    expect(el.hasFeedbackFor).to.deep.equal(['error']);
    expect(el.validationStates.error.Required).to.be.true;
    el.formElements['sports[]'][0].checked = true;
    expect(el.hasFeedbackFor).to.deep.equal([]);
  });

  it('is accessible', async () => {
    const el = await fixture(html`
      <lion-checkbox-group name="scientistsGroup" label="Who are your favorite scientists?">
        <lion-checkbox
          name="scientists[]"
          label="Archimedes"
          .choiceValue=${'Archimedes'}
        ></lion-checkbox>
        <lion-checkbox
          name="scientists[]"
          label="Francis Bacon"
          .choiceValue=${'Francis Bacon'}
        ></lion-checkbox>
        <lion-checkbox
          name="scientists[]"
          label="Marie Curie"
          .modelValue=${{ value: 'Marie Curie', checked: false }}
        ></lion-checkbox>
      </lion-checkbox-group>
    `);
    await expect(el).to.be.accessible();
  });

  it('is accessible when pre-selected', async () => {
    const el = await fixture(html`
      <lion-checkbox-group name="scientistsGroup" label="Who are your favorite scientists?">
        <lion-checkbox
          name="scientists[]"
          label="Archimedes"
          .choiceValue=${'Archimedes'}
        ></lion-checkbox>
        <lion-checkbox
          name="scientists[]"
          label="Francis Bacon"
          .choiceValue=${'Francis Bacon'}
          .choiceChecked=${true}
        ></lion-checkbox>
        <lion-checkbox
          name="scientists[]"
          label="Marie Curie"
          .modelValue=${{ value: 'Marie Curie', checked: true }}
        ></lion-checkbox>
      </lion-checkbox-group>
    `);
    await expect(el).to.be.accessible();
  });

  it('is accessible when disabled', async () => {
    const el = await fixture(html`
      <lion-checkbox-group
        name="scientistsGroup"
        label="Who are your favorite scientists?"
        disabled
      >
        <lion-checkbox
          name="scientists[]"
          label="Archimedes"
          .choiceValue=${'Archimedes'}
        ></lion-checkbox>
        <lion-checkbox
          name="scientists[]"
          label="Francis Bacon"
          .choiceValue=${'Francis Bacon'}
        ></lion-checkbox>
        <lion-checkbox
          name="scientists[]"
          label="Marie Curie"
          .modelValue=${{ value: 'Marie Curie', checked: true }}
        ></lion-checkbox>
      </lion-checkbox-group>
    `);
    await expect(el).to.be.accessible();
  });
});
