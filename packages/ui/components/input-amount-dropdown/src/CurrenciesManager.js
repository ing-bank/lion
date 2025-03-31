/** @type {(value: any) => void} */
let resolveLoaded;

/**
 * - Handles lazy loading of the currencies
 * - Maintains one instance of countryToCurrencyMap that can be shared across multiple places
 * - Allows for easy mocking in unit tests
 */
export class CurrencyUtilManager {
  static async loadCurrencies() {
    const countryToCurrencyMap = await import('./countryToCurrencyMap.js');
    this.countryToCurrencyMap = countryToCurrencyMap;
    resolveLoaded(undefined);
    return countryToCurrencyMap;
  }

  /**
   * Check if all currencies are been loaded
   */
  static get isLoaded() {
    return Boolean(this.countryToCurrencyMap);
  }
}

/**
 * Wait till all currencies has been loaded
 * @example
 * ```js
 * await CurrencyUtilManager.loadComplete;
 * ```
 */
CurrencyUtilManager.loadComplete = new Promise(resolve => {
  resolveLoaded = resolve;
});

// initialize
CurrencyUtilManager.loadCurrencies();
