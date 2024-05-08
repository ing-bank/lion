/**
 * For testing purposes, it is possible to disable caching.
 */
let shouldCache = true;

/**
 * @param {object|any[]|string} arg
 */
function isObject(arg) {
  return !Array.isArray(arg) && typeof arg === 'object';
}

/**
 * @param {object|any[]|string} arg
 */
function createCachableArg(arg) {
  if (!isObject(arg)) return arg;
  try {
    return JSON.stringify(arg);
  } catch {
    return arg;
  }
}

/**
 * @template T
 * @type {<T>(functionToMemoize:T, opts?:{ storage?:object; serializeObjects?: boolean }) => T}
 */
export function memoize(functionToMemoize, { storage = {}, serializeObjects = false } = {}) {
  // @ts-expect-erro
  // eslint-disable-next-line func-names
  return /** @type {* & T} */ (
    function memoizedFn() {
      // eslint-disable-next-line prefer-rest-params
      const args = [...arguments];
      const cachableArgs = !serializeObjects ? args : args.map(createCachableArg);
      // Allow disabling of cache for testing purposes
      // @ts-expect-error
      if (shouldCache && cachableArgs in storage) {
        // @ts-expect-error
        return storage[cachableArgs];
      }
      // @ts-expect-error
      const outcome = functionToMemoize.apply(this, args);
      // @ts-expect-error
      // eslint-disable-next-line no-param-reassign
      storage[cachableArgs] = outcome;
      return outcome;
    }
  );
}

/**
 * For testing purposes, it is possible to disable caching.
 */
memoize.disableCaching = () => {
  shouldCache = false;
};
/**
 * Once testing is done, it is possible to restore caching.
 * @param {boolean} [initialValue]
 */
memoize.restoreCaching = initialValue => {
  shouldCache = initialValue || true;
};

Object.defineProperty(memoize, 'isCacheEnabled', {
  // writable: false,
  // enumerable: true,
  get() {
    return shouldCache;
  },
});
