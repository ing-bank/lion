import { expect } from '@open-wc/testing';

import { localize, LocalizeManager } from '@lion/ui/localize.js';

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

  it('is configured to automatically load namespaces if locale is changed', () => {
    const { autoLoadOnLocaleChange } = getProtectedMembers(localize);
    expect(autoLoadOnLocaleChange).to.equal(true);
  });

  it('is configured to fallback to the locale "en-GB"', () => {
    const { fallbackLocale } = getProtectedMembers(localize);
    expect(fallbackLocale).to.equal('en-GB');
  });
});
