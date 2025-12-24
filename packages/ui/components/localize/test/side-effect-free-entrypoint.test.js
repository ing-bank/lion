import { describe, it } from 'vitest';
import sinon from 'sinon';
import { singletonManager } from 'singleton-manager';
import { expect } from '../../../test-helpers.js';
// @ts-ignore

/**
 * @typedef {import('../types/LocalizeMixinTypes.js').LocalizeMixin} LocalizeMixinHost
 * @typedef {import('../../validate-messages/src/getLocalizedMessage.js').LocalizeManager & { __instance_for_testing?: import('../../validate-messages/src/getLocalizedMessage.js').LocalizeManager, aCallToRegisterLazilyLoadedInstance?: () => void }} LocalizeManagerForTesting
 */

describe('Entrypoints localize', () => {
  /** @type {import('sinon').SinonSpy} */
  let singletonManagerSetSpy;
  beforeEach(() => {
    singletonManagerSetSpy = sinon.spy(singletonManager, 'set');
  });
  afterEach(() => {
    singletonManagerSetSpy.restore();
  });

  it('"@lion/ui/localize-no-side-effects.js" has no side effects (c.q. does not register itself on singletonManager)', async () => {
    await import('@lion/ui/localize-no-side-effects.js');

    expect(singletonManagerSetSpy).to.not.have.been.called;
  });

  it('"@lion/ui/localize.js" has side effects (c.q. registers itself on singletonManager)', async () => {
    const /** @type {{ localize: LocalizeManagerForTesting }} */ { localize } = await import(
        '@lion/ui/localize.js'
      );
    localize.aCallToRegisterLazilyLoadedInstance?.();

    expect(singletonManagerSetSpy).to.have.been.calledOnce;

    const /** @type {{ getLocalizeManager: () => LocalizeManagerForTesting }} */ {
        getLocalizeManager,
      } = await import('@lion/ui/localize-no-side-effects.js');

    expect(singletonManagerSetSpy).to.have.been.calledWith(
      '@lion/ui::localize::0.x',
      getLocalizeManager().__instance_for_testing,
    );
  });
});
