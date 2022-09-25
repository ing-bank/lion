const { InputDataService } = require('../services/InputDataService.js');

function isObject(arg) {
  return !Array.isArray(arg) && typeof arg === 'object';
}

function createCachableArg(arg) {
  if (isObject(arg)) {
    try {
      return JSON.stringify(arg);
    } catch {
      return arg;
    }
  }
  return arg;
}

/**
 * @param {function} functionToMemoize
 * @param {{ storage:object; serializeObjects: boolean }} [opts]
 */
function memoize(functionToMemoize, { storage = {}, serializeObjects = false } = {}) {
  // eslint-disable-next-line func-names
  return function () {
    // eslint-disable-next-line prefer-rest-params
    const args = [...arguments];
    const cachableArgs = !serializeObjects ? args : args.map(createCachableArg);
    // Allow disabling of cache for testing purposes
    // @ts-ignore
    if (!InputDataService.cacheDisabled && cachableArgs in storage) {
      // @ts-ignore
      return storage[cachableArgs];
    }
    // @ts-ignore
    const outcome = functionToMemoize.apply(this, args);
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    storage[cachableArgs] = outcome;
    return outcome;
  };
}

module.exports = {
  memoize,
};
