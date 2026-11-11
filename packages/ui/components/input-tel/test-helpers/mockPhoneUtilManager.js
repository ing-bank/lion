import { PhoneUtilManager } from '../src/PhoneUtilManager.js';

const originalLoadComplete = PhoneUtilManager.loadComplete;
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
 * Restores the real loaded-state getter, not a snapshot taken when this module was imported.
 * @returns {void}
 */
export function restorePhoneUtilManager() {
  PhoneUtilManager.loadComplete = originalLoadComplete;
  Object.defineProperty(PhoneUtilManager, 'isLoaded', { get: originalIsLoadedGetter });
}
