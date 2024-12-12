import { expect } from '@open-wc/testing';
import { resolveLocaleConfig } from '../src/utils/resolveLocaleConfig.js';

describe('resolveLocaleConfig', () => {
  it('works correctly', async () => {
    const localePath = new URL('./translations', import.meta.url);
    const localeConfig = await resolveLocaleConfig('demo', localePath);

    // When no locale is supplied `en.js` is loaded
    expect((await localeConfig.demo()).default.hello).to.equal('en.js loaded');

    // When `de-DE` locale is supplied `de-DE.js` is loaded
    expect((await localeConfig.demo('de-DE')).default.hello).to.equal('de-DE.js loaded');

    // When `de-AB` locale is supplied and the file does not exists.
    // Then everything from - is removed and `de.js` is loaded. Which is equivalent to the default case.
    expect((await localeConfig.demo('de-AB')).default.hello).to.equal('de.js loaded');
  });
});
