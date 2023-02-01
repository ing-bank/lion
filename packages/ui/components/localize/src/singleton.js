import { getLocalizeManager } from './getLocalizeManager.js';

/**
 * Use the side-effect-free `const localizeManager = getLocalizeManager()` instead.
 * @deprecated
 */
// eslint-disable-next-line import/no-mutable-exports
export const localize = getLocalizeManager();
