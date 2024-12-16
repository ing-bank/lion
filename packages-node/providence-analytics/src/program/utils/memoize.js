/**
 * @typedef {{fn:MemoizedFn; count:number}} CacheStrategyItem
 * @typedef {function & {clearCache: () => void}} MemoizedFn
 */

/** @type {CacheStrategyItem[]} */
let cacheStrategyItems = [];
/** @type {'lfu'|'lru'} */
let cacheStrategy = 'lfu';
let limitForCacheStrategy = 100;
/** For testing purposes, it is possible to disable caching. */
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

function updateCacheStrategyItemsList() {
  const hasReachedlimitForCacheStrategy = cacheStrategyItems.length >= limitForCacheStrategy;
  if (!hasReachedlimitForCacheStrategy) return;

  if (cacheStrategy === 'lfu') {
    // eslint-disable-next-line no-case-declarations
    const lowestCount = Math.min(...cacheStrategyItems.map(({ count }) => count));
    const leastUsedIndex = cacheStrategyItems.findIndex(({ count }) => count === lowestCount);
    const [itemToClear] = cacheStrategyItems.splice(leastUsedIndex, 1);
    itemToClear?.fn.clearCache();
    return;
  }

  // acheStrategy === 'lru'
  const itemToClear = /** @type {CacheStrategyItem} */ (cacheStrategyItems.pop());
  itemToClear?.fn.clearCache();
}

/**
 * @param {MemoizedFn} newlyMemoizedFn
 * @returns {CacheStrategyItem}
 */
function addCacheStrategyItem(newlyMemoizedFn) {
  if (cacheStrategy === 'lfu') {
    cacheStrategyItems.push({ fn: newlyMemoizedFn, count: 1 });
    return cacheStrategyItems[cacheStrategyItems.length - 1];
  }
  // lru
  cacheStrategyItems.unshift({ fn: newlyMemoizedFn, count: 1 });
  return cacheStrategyItems[0];
}
/**
 *
 * @param {CacheStrategyItem} currentCacheStrategyItem
 */
function updateCacheStrategyItem(currentCacheStrategyItem) {
  // eslint-disable-next-line no-param-reassign
  currentCacheStrategyItem.count += 1;

  if (cacheStrategy === 'lfu') return;

  // 'lru': move recently used to top
  cacheStrategyItems.splice(cacheStrategyItems.indexOf(currentCacheStrategyItem), 1);
  cacheStrategyItems.unshift(currentCacheStrategyItem);
}

/**
 * @template T
 * @type {<T extends Function>(functionToMemoize:T, opts?:{ cacheStorage?:object; }) => T & {clearCache:() => void}}
 */
export function memoize(functionToMemoize, { cacheStorage = {} } = {}) {
  /** @type {CacheStrategyItem|undefined} */
  let currentCacheStrategyItem;
  function memoizedFn() {
    // eslint-disable-next-line prefer-rest-params
    const args = [...arguments];
    const shouldSerialize = args.some(isObject);

    const cachableArgs = shouldSerialize ? args.map(createCachableArg) : args;
    // Allow disabling of cache for testing purposes
    // @ts-expect-error
    if (shouldCache && cachableArgs in cacheStorage) {
      updateCacheStrategyItem(/** @type {CacheStrategyItem} */ (currentCacheStrategyItem));

      // @ts-expect-error
      return cacheStorage[cachableArgs];
    }

    if (!currentCacheStrategyItem) {
      updateCacheStrategyItemsList();
      currentCacheStrategyItem = addCacheStrategyItem(memoizedFn);
    }

    // @ts-expect-error
    const outcome = functionToMemoize.apply(this, args);
    // @ts-expect-error
    // eslint-disable-next-line no-param-reassign
    cacheStorage[cachableArgs] = outcome;
    return outcome;
  }
  memoizedFn.clearCache = () => {
    // eslint-disable-next-line no-param-reassign
    cacheStorage = {};
    currentCacheStrategyItem = undefined;
  };

  return /** @type {* & T & {clearCache:() => void}} */ (memoizedFn);
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
  limitForCacheStrategy = 100;
  cacheStrategyItems = [];
  cacheStrategy = 'lfu';
};

Object.defineProperty(memoize, 'isCacheEnabled', {
  get() {
    return shouldCache;
  },
});

Object.defineProperty(memoize, 'limitForCacheStrategy', {
  get() {
    return limitForCacheStrategy;
  },
  set(/** @type {number} */ newValue) {
    if (typeof newValue !== 'number') {
      throw new Error('Please provide a number');
    }
    if (cacheStrategyItems.length) {
      throw new Error('Please configure limitForCacheStrategy before using memoize');
    }
    limitForCacheStrategy = newValue;
  },
});

Object.defineProperty(memoize, 'cacheStrategy', {
  get() {
    return cacheStrategy;
  },
  set(/** @type {'lfu'|'lru'} */ newStrategy) {
    if (!['lfu', 'lru'].includes(newStrategy)) {
      throw new Error("Please provide 'lfu' or 'lru'");
    }
    if (cacheStrategyItems.length) {
      throw new Error('Please configure a strategy before using memoize');
    }
    cacheStrategy = newStrategy;
  },
});

Object.defineProperty(memoize, 'cacheStrategyItems', {
  get() {
    return cacheStrategyItems;
  },
});
