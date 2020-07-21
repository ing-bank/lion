import { singletonManager } from 'singleton-manager';
import { LocalizeManager } from './LocalizeManager.js';

// eslint-disable-next-line import/no-mutable-exports
export let localize =
  singletonManager.get('@lion/localize::localize::0.10.x') ||
  LocalizeManager.getInstance({
    autoLoadOnLocaleChange: true,
    fallbackLocale: 'en-GB',
  });

/**
 * @param {LocalizeManager} newLocalize
 */
export function setLocalize(newLocalize) {
  localize.teardown();
  localize = newLocalize;
}
