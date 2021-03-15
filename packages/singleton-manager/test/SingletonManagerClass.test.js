import { expect } from '@open-wc/testing';

import { SingletonManagerClass } from 'singleton-manager';

describe('SingletonManagerClass', () => {
  it('returns undefined and has false if not set', async () => {
    const mngr = new SingletonManagerClass();
    expect(mngr.get('overlays/overlays.js::0.13.x')).to.be.undefined;
    expect(mngr.has('overlays/overlays.js::0.13.x')).to.be.false;
  });

  it('return value and has true if set', () => {
    const mngr = new SingletonManagerClass();
    mngr.set('overlays/overlays.js::0.13.x', 'is-set');
    expect(mngr.get('overlays/overlays.js::0.13.x')).to.equal('is-set');
    expect(mngr.has('overlays/overlays.js::0.13.x')).to.be.true;
    // make sure non set values are still correct
    expect(mngr.get('overlays/overlays.js::0.14.x')).to.be.undefined;
    expect(mngr.has('overlays/overlays.js::0.14.x')).to.be.false;
  });

  it('does not override existing keys (e.g. subsequentual calls for the same keys are ignored)', () => {
    const mngr = new SingletonManagerClass();
    mngr.set('overlays/overlays.js::0.14.x', 'is-set');
    mngr.set('overlays/overlays.js::0.14.x', 'new-set');
    expect(mngr.get('overlays/overlays.js::0.14.x')).to.equal('is-set');
  });

  it('should return the same value with two SingletonManager instances', () => {
    const mngr1 = new SingletonManagerClass();
    const mngr2 = new SingletonManagerClass();

    mngr1.set('overlays/overlays.js::0.15.x', 'is-set');
    expect(mngr2.get('overlays/overlays.js::0.15.x')).to.equal('is-set');
  });
});
