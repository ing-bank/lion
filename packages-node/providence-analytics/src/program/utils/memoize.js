/* eslint-disable no-param-reassign */
const { GlobalConfig } = require('../core/GlobalConfig.js');

const fnMeta = new WeakMap();

/**
 * @param {Function} func
 */
function memoize(func, { storage = {}, trackForDebug = false, serializeObjects = false } = {}) {
  const meta = fnMeta.get(func) || fnMeta.set(func, {}).get(func);

  // eslint-disable-next-line func-names
  return function () {
    // eslint-disable-next-line prefer-rest-params
    const args = [...arguments];
    const cachableArgs = !serializeObjects
      ? args
      : args.map(a => {
          if (!Array.isArray(a) && typeof a === 'object') {
            try {
              return JSON.stringify(a);
            } catch (_) {
              return a;
            }
          }
          return a;
        });
    // Allow disabling of cache for testing purposes
    // @ts-ignore
    if (!GlobalConfig.cacheDisabled && cachableArgs in storage) {
      if (trackForDebug) {
        // @ts-ignore
        // eslint-disable-next-line no-console
        console.log('[trackForDebug]', func, cachableArgs, storage[cachableArgs]);
      }
      // @ts-ignore
      return meta.isPromise ? Promise.resolve(storage[cachableArgs]) : storage[cachableArgs];
    }
    // @ts-ignore
    const outcome = func.apply(this, args);
    // @ts-ignore
    if (outcome && outcome.then) {
      meta.isPromise = true;
      return new Promise((resolve, reject) => {
        outcome
          .then((/** @type {any} */ asyncOutcome) => {
            if (trackForDebug) {
              // eslint-disable-next-line no-console
              console.log('[trackForDebug original]', func, cachableArgs, asyncOutcome);
            }
            // @ts-ignore
            storage[cachableArgs] = asyncOutcome;
            resolve(asyncOutcome);
          })
          .catch(reject);
      });
    }
    if (trackForDebug) {
      // eslint-disable-next-line no-console
      console.log('[trackForDebug original]', func, cachableArgs, outcome);
    }
    // @ts-ignore
    storage[cachableArgs] = outcome;
    return outcome;
  };
}

module.exports = { memoize };
