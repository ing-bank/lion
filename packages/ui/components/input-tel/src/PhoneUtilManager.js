/** @type {(value: any) => void} */
let resolveLoaded;

/**
 * @typedef {* & import('awesome-phonenumber')} AwesomePhoneNumber
 */

/**
 * - Handles lazy loading of the awesome-phonenumber library (relatively large, but way lighter than google-libphonenumber), allowing
 * for quick first paints
 * - Maintains one instance of phoneNumberUtil that can be shared across multiple places
 * - Allows for easy mocking in unit tests
 */
export class PhoneUtilManager {
  static async loadLibPhoneNumber() {
    const PhoneUtil = /** @type {AwesomePhoneNumber} */ (await import('awesome-phonenumber'));
    this.PhoneUtil = { ...PhoneUtil };
    resolveLoaded(undefined);
    return PhoneUtil;
  }

  /**
   * Check if awesome-phonenumber has been loaded
   */
  static get isLoaded() {
    return Boolean(this.PhoneUtil);
  }
}

/**
 * Wait till awesome-phonenumber has been loaded
 * @example
 * ```js
 * await PhoneUtilManager.loadComplete;
 * ```
 */
PhoneUtilManager.loadComplete = new Promise(resolve => {
  resolveLoaded = resolve;
});

// initialize
PhoneUtilManager.loadLibPhoneNumber();
