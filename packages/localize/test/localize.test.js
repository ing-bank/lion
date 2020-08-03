import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import { LionSingleton } from '@lion/core';
import { LocalizeManager } from '../src/LocalizeManager.js';

import { localize, setLocalize } from '../src/localize.js';

describe('localize', () => {
  // this is an important mindset:
  // we don't test the singleton
  // we check that it is an instance of the right class
  // we test newly created instances of this class separately
  // this allows to avoid any side effects caused by changing singleton state between tests

  it('is a singleton', () => {
    expect(localize).to.be.an.instanceOf(LionSingleton);
  });

  it('is an instance of LocalizeManager', () => {
    expect(localize).to.be.an.instanceOf(LocalizeManager);
  });

  it('is overridable globally', () => {
    const oldLocalize = localize;
    const oldLocalizeTeardown = localize.teardown;
    localize.teardown = sinon.spy();

    const newLocalize = /** @type {LocalizeManager} */ ({ teardown: () => {} });
    setLocalize(newLocalize);
    expect(localize).to.equal(newLocalize);

    // @ts-ignore since we're testing another reference to the same global instance
    expect(oldLocalize.teardown.callCount).to.equal(1);

    setLocalize(oldLocalize);
    localize.teardown = oldLocalizeTeardown;
  });

  it('is configured to automatically load namespaces if locale is changed', () => {
    expect(localize._autoLoadOnLocaleChange).to.equal(true);
  });

  it('is configured to fallback to the locale "en-GB"', () => {
    expect(localize._fallbackLocale).to.equal('en-GB');
  });
});
