import { localizeTearDown } from '@lion/components/localize-test-helpers.js';
import { expect, fixture as _fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import '@lion/components/define/lion-checkbox.js';
import '@lion/components/define/lion-checkbox-group.js';

/**
 * @typedef {import('../src/LionCheckboxGroup').LionCheckboxGroup} LionCheckboxGroup
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionCheckboxGroup>} */ (_fixture);

beforeEach(() => {
  localizeTearDown();
});

describe('<lion-checkbox-group>', () => {
  describe('resetGroup', () => {
    // TODO move to FormGroupMixin test suite and let CheckboxGroup make use of them
    it('restores default values of arrays if changes were made', async () => {
      const el = await fixture(html`
        <lion-checkbox-group name="scientists[]" label="Favorite scientists">
          <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
          <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
          <lion-checkbox
            label="Marie Curie"
            .modelValue=${{ value: 'Marie Curie', checked: false }}
          ></lion-checkbox>
        </lion-checkbox-group>
      `);
      el.formElements[0].checked = true;
      expect(el.modelValue).to.deep.equal(['Archimedes']);

      el.resetGroup();
      expect(el.modelValue).to.deep.equal([]);
    });

    it('restores default values of arrays if changes were made', async () => {
      const el = await fixture(html`
        <lion-checkbox-group name="scientists[]" label="Favorite scientists">
          <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
          <lion-checkbox
            label="Francis Bacon"
            .modelValue=${{ value: 'Francis Bacon', checked: true }}
          ></lion-checkbox>
          <lion-checkbox label="Marie Curie" .choiceValue=${'Marie Curie'}></lion-checkbox>
        </lion-checkbox-group>
      `);
      el.formElements[0].checked = true;
      expect(el.modelValue).to.deep.equal(['Archimedes', 'Francis Bacon']);

      el.resetGroup();
      expect(el.modelValue).to.deep.equal(['Francis Bacon']);

      el.formElements[2].checked = true;
      expect(el.modelValue).to.deep.equal(['Francis Bacon', 'Marie Curie']);

      el.resetGroup();
      expect(el.modelValue).to.deep.equal(['Francis Bacon']);
    });
  });

  it('is accessible', async () => {
    const el = await fixture(html`
      <lion-checkbox-group name="scientists[]" label="Who are your favorite scientists?">
        <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
        <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
        <lion-checkbox
          label="Marie Curie"
          .modelValue=${{ value: 'Marie Curie', checked: false }}
        ></lion-checkbox>
      </lion-checkbox-group>
    `);
    await expect(el).to.be.accessible();
  });

  it('is accessible when pre-selected', async () => {
    const el = await fixture(html`
      <lion-checkbox-group name="scientists[]" label="Who are your favorite scientists?">
        <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
        <lion-checkbox
          label="Francis Bacon"
          .choiceValue=${'Francis Bacon'}
          .choiceChecked=${true}
        ></lion-checkbox>
        <lion-checkbox
          label="Marie Curie"
          .modelValue=${{ value: 'Marie Curie', checked: true }}
        ></lion-checkbox>
      </lion-checkbox-group>
    `);
    await expect(el).to.be.accessible();
  });

  it('is accessible when disabled', async () => {
    const el = await fixture(html`
      <lion-checkbox-group name="scientists[]" label="Who are your favorite scientists?" disabled>
        <lion-checkbox label="Archimedes" .choiceValue=${'Archimedes'}></lion-checkbox>
        <lion-checkbox label="Francis Bacon" .choiceValue=${'Francis Bacon'}></lion-checkbox>
        <lion-checkbox
          label="Marie Curie"
          .modelValue=${{ value: 'Marie Curie', checked: true }}
        ></lion-checkbox>
      </lion-checkbox-group>
    `);
    await expect(el).to.be.accessible();
  });
});
