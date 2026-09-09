import { PhoneUtilManager } from '../src/PhoneUtilManager.js';

const originalLoadComplete = PhoneUtilManager.loadComplete;
const originalIsLoaded = Object.getOwnPropertyDescriptor(PhoneUtilManager, 'isLoaded')?.get;

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

export function restorePhoneUtilManager() {
  PhoneUtilManager.loadComplete = originalLoadComplete;
  Object.defineProperty(PhoneUtilManager, 'isLoaded', {
    // @ts-ignore
    get: () => originalIsLoaded.call(PhoneUtilManager),
  });
}
