import { expect, fixture } from '@open-wc/testing';
import '../lion-radio.js';

describe('<lion-radio>', () => {
  it('should have type = radio', async () => {
    const el = await fixture(`
      <lion-radio name="radio" value="male"></lion-radio>
    `);
    expect(el.getAttribute('type')).to.equal('radio');
  });
});
