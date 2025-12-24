import { describe, it } from 'vitest';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { singletonManager } from 'singleton-manager';
import { expect } from '../../../test-helpers.js';
// @ts-ignore
import { LocalizeManager } from '../src/LocalizeManager.js';

/** @typedef {LocalizeManager & { __instance_for_testing?: LocalizeManager }} LocalizeManagerForTesting */

describe('getLocalizeManager', () => {
  beforeEach(() => {
    // @ts-ignore
    singletonManager._map.clear();
  });

  it('gets a default instance when nothing registered on singletonManager with "@lion/ui::localize::0.x"', () => {
    expect(singletonManager.get('@lion/ui::localize::0.x')).to.be.undefined;
    const /** @type {LocalizeManagerForTesting} */ localizeManager = getLocalizeManager();
    expect(localizeManager.__instance_for_testing).to.equal(
      singletonManager.get('@lion/ui::localize::0.x'),
    );
  });

  it('gets the same instance when called multiple times', () => {
    const /** @type {LocalizeManagerForTesting} */ localizeManager = getLocalizeManager();
    const /** @type {LocalizeManagerForTesting} */ localizeManagerSecondCall = getLocalizeManager();
    expect(localizeManager.__instance_for_testing).not.to.be.undefined;
    expect(localizeManager.__instance_for_testing).to.equal(
      localizeManagerSecondCall.__instance_for_testing,
    );
  });

  it('gets the instance that was registered on singletonManager with "@lion/ui::localize::0.x"', () => {
    // Set your own for custom behavior or for deduping purposes
    class MyLocalizeManager extends LocalizeManager {}
    singletonManager.set('@lion/ui::localize::0.x', MyLocalizeManager);
    const /** @type {LocalizeManagerForTesting} */ localizeManager = getLocalizeManager();
    expect(localizeManager.__instance_for_testing).to.equal(MyLocalizeManager);
  });
});
