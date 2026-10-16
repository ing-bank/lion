import { PhoneUtilManager } from '../src/PhoneUtilManager.js';

const originalLoadComplete = PhoneUtilManager.loadComplete;
const originalIsLoaded = PhoneUtilManager.isLoaded;
const originalIsLoadedGetter = (() => {
  const getter = Object.getOwnPropertyDescriptor(PhoneUtilManager, 'isLoaded')?.get;
  if (typeof getter !== 'function') {
    throw new Error('PhoneUtilManager.isLoaded must be a getter');
  }
  return getter;
})();

export function mockPhoneUtilManager() {
  /** @type {(value: any) => void} */
  let resolveLoaded;
  let isLoaded = false;
  PhoneUtilManager.loadComplete = new Promise(resolve => {
    resolveLoaded = () => {
      isLoaded = true;
      resolve(undefined);
    };
  });
  Object.defineProperty(PhoneUtilManager, 'isLoaded', { get: () => isLoaded });

  // @ts-ignore
  return { resolveLoaded };
}

/**
 * Restore the mocked phone utility state.
 *
 * The default `legacy` mode preserves the historical exported helper behavior, which restores
 * the load state captured when this module was evaluated. Tests that need the actual current
 * utility state can opt into `current`. Changing the default requires a breaking release.
 *
 * @param {{loadedState?: 'legacy' | 'current'}} [options]
 * @returns {void}
 */
export function restorePhoneUtilManager({ loadedState = 'legacy' } = {}) {
  if (loadedState !== 'legacy' && loadedState !== 'current') {
    throw new TypeError(`Unknown phone utility loaded state: ${loadedState}`);
  }

  PhoneUtilManager.loadComplete = originalLoadComplete;
  Object.defineProperty(PhoneUtilManager, 'isLoaded', {
    get:
      loadedState === 'current'
        ? () => originalIsLoadedGetter.call(PhoneUtilManager)
        : () => originalIsLoaded,
  });
}
