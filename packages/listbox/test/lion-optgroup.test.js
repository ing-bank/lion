import { expect, fixture, html } from '@open-wc/testing';

import '../lion-optgroup.js';
import '../lion-option.js';

// Not part of mvp, so we skip for now. We at least already know that an approach
// with visibly grouping several options will work out fine a11y wise as long as we
// hint our screenreaders with aria-setsize and aria-posinset about the proper option
// list structure.
// For a11y, we need proper testing and approach to decide:
// - whether a label is required
// - whether child options should ahve a labelledby reference to the parent optgroup label
// - whether the native scrreenreader feedback(VoiceOver) makes any sense (it says 'dimmed' on
// headers, which is same output as for disabled options)
describe.skip('lion-optgroup', () => {
  it('can have a label', async () => {
    const el = await fixture(html`
      <lion-optgroup label="foo"></lion-optgroup>
    `);
    expect(el.querySelector(['slot="label"'])).lightDom.to.equal('foo');
  });

  it('sets hierarchyLevel to all child options', async () => {
    const el = await fixture(html`
      <lion-optgroup label="foo">
        <lion-option value="bar">Bar</lion-option>
      </lion-optgroup>
    `);
    expect(el.querySelectorAll('lion-option')[0].hierarchyLevel).to.equal('1');
  });

  it('setting disabled will disable all child options', async () => {
    const el = await fixture(html`
      <lion-optgroup label="foo" disabled>
        <lion-option value="bar">Bar</lion-option>
      </lion-optgroup>
    `);
    expect(el.querySelectorAll('lion-option')[0].disabled).to.be.true;
  });
});
