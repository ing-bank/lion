/**
 * @typedef {{fn:MemoizedFn; count:number}} CacheStrategyItem
 * @typedef {function & {clearCache: () => void}} MemoizedFn
 */

// https://www.nearform.com/insights/tracking-memory-allocation-node-js/

/**
 * @param {number} memoryPercentage
 */
function hasEnoughMemory(memoryPercentage) {
  const memUsage = process.memoryUsage();
  return memUsage.heapUsed / memUsage.heapTotal < memoryPercentage / 100;
}

function getDefaultMaxCacheStack() {
  return { memoryPercentage: 90, length: undefined };
}

/** @type {CacheStrategyItem[]} */
let cacheStack = [];
/** @type {'lfu'|'lru'} */
let cacheStrategy = 'lfu';
/** @type {{memoryPercentage?:number;length?:number}} */
let maxCacheStack = getDefaultMaxCacheStack();
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

function makeRoomOnCacheStackIfNeeded() {
  const hasRoomLeft = maxCacheStack.memoryPercentage
    ? hasEnoughMemory(maxCacheStack.memoryPercentage)
    : cacheStack.length < (maxCacheStack.length || 0);
  // We're done if room is left
  if (hasRoomLeft) return;

  if (cacheStrategy === 'lfu') {
    // eslint-disable-next-line no-case-declarations
    const lowestCount = Math.min(...cacheStack.map(({ count }) => count));
    const leastUsedIndex = cacheStack.findIndex(({ count }) => count === lowestCount);
    const [itemToClear] = cacheStack.splice(leastUsedIndex, 1);
    itemToClear?.fn.clearCache();
    return;
  }

  // acheStrategy === 'lru'
  const itemToClear = /** @type {CacheStrategyItem} */ (cacheStack.pop());
  itemToClear?.fn.clearCache();
}

/**
 * @param {MemoizedFn} newlyMemoizedFn
 * @returns {CacheStrategyItem}
 */
function addCacheStrategyItem(newlyMemoizedFn) {
  if (cacheStrategy === 'lfu') {
    cacheStack.push({ fn: newlyMemoizedFn, count: 1 });
    return cacheStack[cacheStack.length - 1];
  }
  // lru
  cacheStack.unshift({ fn: newlyMemoizedFn, count: 1 });
  return cacheStack[0];
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
  cacheStack.splice(cacheStack.indexOf(currentCacheStrategyItem), 1);
  cacheStack.unshift(currentCacheStrategyItem);
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

    // Do we already track an item in our list?
    if (!currentCacheStrategyItem) {
      makeRoomOnCacheStackIfNeeded();
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
  maxCacheStack = getDefaultMaxCacheStack();
  cacheStack = [];
  cacheStrategy = 'lfu';
};

Object.defineProperty(memoize, 'isCacheEnabled', {
  get() {
    return shouldCache;
  },
});

/**
 * The amount of functions that are memoized.
 * N.B. memoryPercentage takes precedence
 */
Object.defineProperty(memoize, 'maxCacheStack', {
  get() {
    return maxCacheStack;
  },
  set(/** @type {{ length: number; memoryPercentage: number; }} */ newValue) {
    if (
      !(
        ['undefined', 'number'].includes(typeof newValue?.memoryPercentage) ||
        typeof newValue?.length === 'number'
      )
    ) {
      throw new Error('Please provide {memoryPercantage:number} or {length:number}');
    }
    if (cacheStack.length) {
      throw new Error('Please configure maxCacheStack before using memoize');
    }
    maxCacheStack = newValue;
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
    if (cacheStack.length) {
      throw new Error('Please configure a strategy before using memoize');
    }
    cacheStrategy = newStrategy;
  },
});

Object.defineProperty(memoize, 'cacheStack', {
  get() {
    return cacheStack;
  },
});
