import { localizeTearDown } from '@lion/localize/test-helpers.js';
import { expect, fixture, html } from '@open-wc/testing';
import '../lion-checkbox-group.js';
import '../lion-checkbox.js';

beforeEach(() => {
  localizeTearDown();
});

describe('<lion-checkbox-group>', () => {
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

  it("should throw exception if name doesn't end in []", async () => {
    const el = await fixture(html`<lion-checkbox-group name="woof[]"></lion-checkbox-group>`);
    el.name = 'woof';
    let err;
    try {
      await el.updateComplete;
    } catch (e) {
      err = e;
    }
    expect(err).to.be.an.instanceof(Error);
    expect(err.message).to.equal('Names should end in "[]".');
  });
});
