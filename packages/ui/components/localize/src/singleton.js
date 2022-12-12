import { singletonManager } from 'singleton-manager';
import { LocalizeManager } from './LocalizeManager.js';

/** @type {LocalizeManager} */
// eslint-disable-next-line import/no-mutable-exports
export const localize =
  /** @type {LocalizeManager} */ (singletonManager.get('@lion/ui::localize::0.x')) ||
  new LocalizeManager({
    autoLoadOnLocaleChange: true,
    fallbackLocale: 'en-GB',
  });
