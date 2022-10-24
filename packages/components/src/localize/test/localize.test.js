import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import { localize, setLocalize, LocalizeManager } from '@lion/components/localize.js';

/**
 * @param {LocalizeManager} localizeManagerEl
 */
function getProtectedMembers(localizeManagerEl) {
  // @ts-ignore
  const { _autoLoadOnLocaleChange: autoLoadOnLocaleChange, _fallbackLocale: fallbackLocale } =
    localizeManagerEl;
  return {
    autoLoadOnLocaleChange,
    fallbackLocale,
  };
}

describe('localize', () => {
  // this is an important mindset:
  // we don't test the singleton
  // we check that it is an instance of the right class
  // we test newly created instances of this class separately
  // this allows to avoid any side effects caused by changing singleton state between tests

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
    const { autoLoadOnLocaleChange } = getProtectedMembers(localize);
    expect(autoLoadOnLocaleChange).to.equal(true);
  });

  it('is configured to fallback to the locale "en-GB"', () => {
    const { fallbackLocale } = getProtectedMembers(localize);
    expect(fallbackLocale).to.equal('en-GB');
  });
});
