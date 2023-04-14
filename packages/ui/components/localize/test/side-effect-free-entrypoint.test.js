import { expect } from '@open-wc/testing';
import sinon from 'sinon';
// @ts-ignore
import { singletonManager } from 'singleton-manager';

/**
 * @typedef {import('../types/LocalizeMixinTypes.js').LocalizeMixin} LocalizeMixinHost
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
    await import('@lion/ui/localize.js');

    expect(singletonManagerSetSpy).to.have.been.calledOnce;

    const { getLocalizeManager } = await import('@lion/ui/localize-no-side-effects.js');

    expect(singletonManagerSetSpy).to.have.been.calledWith(
      '@lion/ui::localize::0.x',
      getLocalizeManager(),
    );
  });
});
