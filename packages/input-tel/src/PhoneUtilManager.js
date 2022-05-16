/** @type {(value: any) => void} */
let resolveLoaded;

/**
 * - Handles lazy loading of the (relatively large) google-libphonenumber library, allowing
 * for quick first paints
 * - Maintains one instance of phoneNumberUtil that can be shared across multiple places
 * - Allows for easy mocking in unit tests
 */
export class PhoneUtilManager {
  static async loadLibPhoneNumber() {
    const PhoneUtil = (await import('awesome-phonenumber')).default;
    this.PhoneUtil = PhoneUtil;
    resolveLoaded(undefined);
    return PhoneUtil;
  }

  /**
   * Check if google-libphonenumber has been loaded
   */
  static get isLoaded() {
    return Boolean(this.PhoneUtil);
  }
}

/**
 * Wait till google-libphonenumber has been loaded
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
