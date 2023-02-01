// @ts-ignore
import { singletonManager } from 'singleton-manager';
import { LocalizeManager } from './LocalizeManager.js';

/**
 * Side-effect-free alternative for `localize` (the globally shared instance of LocalizeManager).
 * When this function is imported, no side-effect happened yet, i.e. no global instance was registered yet.
 * The side effect-free approach generates:
 * - smaller, optimized bundles
 * - a predictable loading order, that allows for:
 *   - deduping strategies when multiple instances of the localizeManager are on a page
 *   - providing a customized extension of LocalizeManager
 *
 * Use it like this:
 *
 * ```js
 * function myFunction() {
 *   // note that 'localizeManager' is the same as former 'localize'
 *   const localize = getLocalizeManger();
 *   // ...
 * }
 * ```
 *
 * In a class, we advise a shared instance:
 * ```js
 * class MyClass {
 *   constructor() {
 *     this._localizeManager = getLocalizeManger();
 *   }
 *   // ...
 * }
 * ```
 *
 * Make sure to always call this method inside a function or class (otherwise side effects are created)
 *
 * Do you want to register your own LocalizeManager?
 * Make sure it's registered before anyone called `getLocalizeManager()`
 *
 * ```js
 * import { singletonManager } from 'singleton-manager';
 * import { getLocalizeManger } from '@lion/ui/localize-no-side-effects.js';
 *
 * // First register your own LocalizeManager (for deduping or other reasons)
 * singletonManager.set('lion/ui::localize::0.x', class MyLocalizeManager extends LocalizeManager {});
 *
 * // Now, all your code gets the right instance
 * function myFuntion() {
 *   const localizeManager = getLocalizeManager();
 *   // ...
 * }
 *
 * class myClass() {
 *   constructor() {
 *     this._localizeManager = getLocalizeManager();
 *     // ...
 *   }
 * }
 * ```
 *
 * @returns {LocalizeManager}
 */
export function getLocalizeManager() {
  if (singletonManager.has('@lion/ui::localize::0.x')) {
    return singletonManager.get('@lion/ui::localize::0.x');
  }

  const localizeManager = new LocalizeManager({
    autoLoadOnLocaleChange: true,
    fallbackLocale: 'en-GB',
  });
  singletonManager.set('@lion/ui::localize::0.x', localizeManager);

  return localizeManager;
}
