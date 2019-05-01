import { expect } from '@open-wc/testing';

import { LionSingleton } from '@lion/core';
import { LocalizeManager } from '../src/LocalizeManager.js';

import { localize, setLocalize } from '../src/localize.js';

describe('localize', () => {
  // this is an importan mindset:
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
    const newLocalize = {};
    setLocalize(newLocalize);
    expect(localize).to.equal(newLocalize);
    setLocalize(oldLocalize);
  });

  it('is configured to automatically load namespaces if locale is changed', () => {
    expect(localize._autoLoadOnLocaleChange).to.equal(true);
  });
});
