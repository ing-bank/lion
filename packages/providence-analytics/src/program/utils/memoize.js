const { InputDataService } = require('../services/InputDataService.js');

function memoize(func, externalStorage) {
  const storage = externalStorage || {};
  // eslint-disable-next-line func-names
  return function () {
    // eslint-disable-next-line prefer-rest-params
    const args = [...arguments];
    // Allow disabling of cache for testing purposes
    if (!InputDataService.cacheDisabled && args in storage) {
      return storage[args];
    }
    const outcome = func.apply(this, args);
    storage[args] = outcome;
    return outcome;
  };
}

function memoizeAsync(func, externalStorage) {
  const storage = externalStorage || {};
  // eslint-disable-next-line func-names
  return async function () {
    // eslint-disable-next-line prefer-rest-params
    const args = [...arguments];
    // Allow disabling of cache for testing purposes
    if (!InputDataService.cacheDisabled && args in storage) {
      return storage[args];
    }
    const outcome = await func.apply(this, args);
    storage[args] = outcome;
    return outcome;
  };
}

module.exports = {
  memoize,
  memoizeAsync,
};
