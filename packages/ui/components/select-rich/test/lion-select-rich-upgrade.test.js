import { expect, fixture } from '@open-wc/testing';
import sinon from 'sinon';

describe('lion-select-rich upgrade', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('does not scroll an option into view when upgrading a closed select', async () => {
    const el = /** @type {import('../src/LionSelectRich.js').LionSelectRich} */ (
      await fixture(`
        <lion-select-rich label="Radius">
          <lion-option choicevalue='""' checked>Radius</lion-option>
          <lion-option choicevalue='"5"'>5 km</lion-option>
          <lion-option choicevalue='"10"'>10 km</lion-option>
        </lion-select-rich>
      `)
    );
    const scrollSpy = sinon.spy(Element.prototype, 'scrollIntoView');

    await import('@lion/ui/define/lion-option.js');
    await import('@lion/ui/define/lion-select-rich.js');
    await el.registrationComplete;
    await el.updateComplete;

    expect(el.opened).to.be.false;
    expect(el.checkedIndex).to.equal(0);
    expect(scrollSpy.callCount).to.equal(0);
  });
});
