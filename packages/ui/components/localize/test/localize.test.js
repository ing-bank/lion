import { expect } from '@open-wc/testing';

import { getLocalizeManager, LocalizeManager } from '@lion/ui/localize-no-side-effects.js';

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
  const localizeManager = getLocalizeManager();
  // this is an important mindset:
  // we don't test the singleton
  // we check that it is an instance of the right class
  // we test newly created instances of this class separately
  // this allows to avoid any side effects caused by changing singleton state between tests

  it('is an instance of LocalizeManager', () => {
    expect(localizeManager).to.be.an.instanceOf(LocalizeManager);
  });

  it('is configured to automatically load namespaces if locale is changed', () => {
    const { autoLoadOnLocaleChange } = getProtectedMembers(localizeManager);
    expect(autoLoadOnLocaleChange).to.equal(true);
  });

  it('is configured to fallback to the locale "en-GB"', () => {
    const { fallbackLocale } = getProtectedMembers(localizeManager);
    expect(fallbackLocale).to.equal('en-GB');
  });
});
