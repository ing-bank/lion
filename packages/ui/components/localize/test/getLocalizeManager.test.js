import { expect } from '@open-wc/testing';
// @ts-ignore
import { singletonManager } from 'singleton-manager';
import { LocalizeManager } from '../src/LocalizeManager.js';
import { getLocalizeManager } from '../src/getLocalizeManager.js';

describe('getLocalizeManager', () => {
  beforeEach(() => {
    // @ts-ignore
    singletonManager._map.clear();
  });

  it('gets a default instance when nothing registered on singletonManager with "@lion/ui::localize::0.x"', () => {
    expect(singletonManager.get('@lion/ui::localize::0.x')).to.be.undefined;
    const localizeManager = getLocalizeManager();
    expect(localizeManager).to.equal(singletonManager.get('@lion/ui::localize::0.x'));
  });

  it('gets the same instance when called multiple times', () => {
    const localizeManager = getLocalizeManager();
    const localizeManagerSecondCall = getLocalizeManager();
    expect(localizeManager).to.equal(localizeManagerSecondCall);
  });

  it('gets the instance that was registered on singletonManager with "@lion/ui::localize::0.x"', () => {
    // Set your own for custom behavior or for deduping purposes
    class MyLocalizeManager extends LocalizeManager {}
    singletonManager.set('@lion/ui::localize::0.x', MyLocalizeManager);
    expect(getLocalizeManager()).to.equal(MyLocalizeManager);
  });
});
