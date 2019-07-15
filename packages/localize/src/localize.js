import { LocalizeManager } from './LocalizeManager.js';

// eslint-disable-next-line import/no-mutable-exports
export let localize = LocalizeManager.getInstance({
  autoLoadOnLocaleChange: true,
  fallbackLocale: 'en-GB',
});

export function setLocalize(newLocalize) {
  localize.teardown();
  localize = newLocalize;
}
