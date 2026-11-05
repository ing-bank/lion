import { LionCombobox } from '@lion/ui/combobox.js';
import { LionOptions } from '@lion/ui/listbox.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { runComboboxSuite } from '../test-suites/lion-combobox.suite.js';

class SuiteOptions extends LionOptions {}

class SuiteCombobox extends LionCombobox {
  static get scopedElements() {
    return {
      ...LionCombobox.scopedElements,
      'suite-options': SuiteOptions,
    };
  }

  get slots() {
    return {
      ...super.slots,
      listbox: () => html`<suite-options .registrationTarget=${this}></suite-options>`,
    };
  }
}

customElements.define('suite-combobox', SuiteCombobox);

describe('combobox suite with renamed scoped options', () => {
  it('uses the scoped options element instead of lion-options', async () => {
    const el = await fixture(html`<suite-combobox></suite-combobox>`);
    expect(el.querySelector('suite-options')).to.be.instanceOf(SuiteOptions);
    expect(el.querySelector('lion-options')).to.be.null;
  });

  runComboboxSuite({ classes: { host: SuiteCombobox } });
});
