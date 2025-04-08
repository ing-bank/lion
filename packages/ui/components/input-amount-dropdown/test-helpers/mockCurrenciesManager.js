import { CurrencyUtilManager } from '../src/CurrenciesManager.js';

const originalLoadComplete = CurrencyUtilManager.loadComplete;
const originalIsLoaded = CurrencyUtilManager.isLoaded;

export function mockCurrencyUtilManager() {
  /** @type {(value: any) => void} */
  let resolveLoaded;
  let isLoaded = false;
  CurrencyUtilManager.loadComplete = new Promise(resolve => {
    resolveLoaded = () => {
      isLoaded = true;
      resolve(undefined);
    };
  });
  Object.defineProperty(CurrencyUtilManager, 'isLoaded', { get: () => isLoaded });

  // @ts-ignore
  return { resolveLoaded };
}

export function restoreCurrencyUtilManager() {
  CurrencyUtilManager.loadComplete = originalLoadComplete;
  Object.defineProperty(CurrencyUtilManager, 'isLoaded', { get: () => originalIsLoaded });
}
