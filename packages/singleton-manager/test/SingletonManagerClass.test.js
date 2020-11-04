import { expect } from '@open-wc/testing';

import { SingletonManagerClass } from '../src/SingletonManagerClass.js';

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

  it('throws if an app tries to set an existing key again', () => {
    const mngr = new SingletonManagerClass();
    mngr.set('overlays/overlays.js::0.13.x', 'is-set');
    expect(() => {
      mngr.set('overlays/overlays.js::0.13.x', 'new-set');
    }).to.throw(
      'The key "overlays/overlays.js::0.13.x" is already defined and can not be overridden.',
    );
  });
});
