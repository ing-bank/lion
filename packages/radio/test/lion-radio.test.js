import { expect, fixture, nextFrame } from '@open-wc/testing';

import '../lion-radio.js';

describe('<lion-radio>', () => {
  it('should have type = radio', async () => {
    const el = await fixture(`
      <lion-radio-group>
        <label slot="label">My group</label>
        <lion-radio name="gender[]" value="male">
          <label slot="label">male</label>
        </lion-radio>
        <lion-radio name="gender[]" value="female">
          <label slot="label">female</label>
        </lion-radio>
      </lion-radio-group>
    `);
    await nextFrame();
    expect(el.children[1]._inputNode.getAttribute('type')).to.equal('radio');
  });
});
