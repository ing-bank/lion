import { mimicUserTyping } from '@lion/ui/combobox-test-helpers.js';
import { MatchesOption } from '@lion/ui/combobox.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
import { expect, fixture, html } from '@open-wc/testing';

/**
 * @typedef {import('@lion/ui/combobox.js').LionCombobox} LionCombobox
 */

describe('MatchesOption validation', () => {
  it('is enabled when an invalid value is set', async () => {
    let isEnabled;
    const el = /** @type {LionCombobox} */ (
      await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `)
    );
    const config = {};
    config.node = el;
    const validator = new MatchesOption();

    mimicUserTyping(el, 'Artichoke');
    await el.updateComplete;

    isEnabled = validator.execute('Artichoke', undefined, config);
    expect(isEnabled).to.be.false;

    mimicUserTyping(el, 'Foo');
    await el.updateComplete;

    isEnabled = validator.execute('Foo', undefined, config);
    expect(isEnabled).to.be.true;
  });

  it('is not enabled when empty is set', async () => {
    const el = /** @type {LionCombobox} */ (
      await fixture(html`
        <lion-combobox name="foo">
          <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
          <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
          <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
          <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
        </lion-combobox>
      `)
    );
    const config = {};
    config.node = el;
    const validator = new MatchesOption();

    el.modelValue = '';
    await el.updateComplete;

    const isEnabled = validator.execute('', undefined, config);
    expect(isEnabled).to.be.false;
  });
});
