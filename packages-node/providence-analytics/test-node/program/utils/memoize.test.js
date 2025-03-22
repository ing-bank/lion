import { expect } from 'chai';
import { it } from 'mocha';
import sinon from 'sinon';

import { memoize } from '../../../src/program/utils/memoize.js';

describe('Memoize', () => {
  /** @type {sinon.SinonStub<* & NodeJS.MemoryUsage>} */
  let memUsageStub;
  before(() => {
    // This is important, since memoization only works when cache is disabled.
    // We want to prevent that another test unintentionally disabled caching.
    memoize.restoreCaching();
    memUsageStub = sinon
      .stub(process, 'memoryUsage')
      // This will be enough to put data on cacheStack (as 90% is allowed)
      .returns({ heapUsed: 10, heapTotal: 100, rss: 20, external: 2 });
  });
  after(() => {
    memUsageStub.restore();
  });

  describe('With primitives', () => {
    describe('Numbers', () => {
      it(`returns cached result when called with same parameters`, async () => {
        let sumCalled = 0;
        function sum(/** @type {number} a */ a, /** @type {number} a */ b) {
          sumCalled += 1;
          return a + b;
        }
        const sumMemoized = memoize(sum);

        // Put in cache for args combination
        expect(sumMemoized(1, 2)).to.equal(3);
        expect(sumCalled).to.equal(1);

        // Return from cache
        expect(sumMemoized(1, 2)).to.equal(3);
        expect(sumCalled).to.equal(1);

        // Put in cache for args combination
        expect(sumMemoized(1, 3)).to.equal(4);
        expect(sumCalled).to.equal(2);

        // Return from cache
        expect(sumMemoized(1, 3)).to.equal(4);
        expect(sumCalled).to.equal(2);
      });

      it(`returns cached result per function for same args`, async () => {
        let sumCalled = 0;
        function sum(/** @type {number} a */ a, /** @type {number} a */ b) {
          sumCalled += 1;
          return a + b;
        }
        const sumMemoized = memoize(sum);
        let sum2Called = 0;
        function sum2(/** @type {number} a */ a, /** @type {number} a */ b) {
          sum2Called += 1;
          return a + b;
        }
        const sum2Memoized = memoize(sum2);

        expect(sumMemoized(1, 2)).to.equal(3);
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(0);

        expect(sum2Memoized(1, 2)).to.equal(3);
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);

        // Both cached
        expect(sumMemoized(1, 2)).to.equal(3);
        expect(sum2Memoized(1, 2)).to.equal(3);
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);
      });
    });
    describe('Strings', () => {
      it(`returns cached result when called with same parameters`, async () => {
        let sumCalled = 0;
        function sum(/** @type {string} a */ a, /** @type {string} a */ b) {
          sumCalled += 1;
          return a + b;
        }
        const sumMemoized = memoize(sum);

        // Put in cache for args combination
        expect(sumMemoized('1', '2')).to.equal('12');
        expect(sumCalled).to.equal(1);

        // Return from cache
        expect(sumMemoized('1', '2')).to.equal('12');
        expect(sumCalled).to.equal(1);

        // Put in cache for args combination
        expect(sumMemoized('1', '3')).to.equal('13');
        expect(sumCalled).to.equal(2);

        // Return from cache
        expect(sumMemoized('1', '3')).to.equal('13');
        expect(sumCalled).to.equal(2);
      });

      it(`returns cached result per function for same args`, async () => {
        let sumCalled = 0;
        function sum(/** @type {string} a */ a, /** @type {string} a */ b) {
          sumCalled += 1;
          return a + b;
        }
        const sumMemoized = memoize(sum);
        let sum2Called = 0;
        function sum2(/** @type {string} a */ a, /** @type {string} a */ b) {
          sum2Called += 1;
          return a + b;
        }
        const sum2Memoized = memoize(sum2);

        expect(sumMemoized('1', '2')).to.equal('12');
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(0);

        expect(sum2Memoized('1', '2')).to.equal('12');
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);

        // Both cached
        expect(sumMemoized('1', '2')).to.equal('12');
        expect(sum2Memoized('1', '2')).to.equal('12');
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);
      });
    });
  });

  describe('With non primitives', () => {
    describe('Arrays', () => {
      it(`returns cached result when called with same parameters`, async () => {
        let sumCalled = 0;
        function sum(/** @type {number[]} a */ a, /** @type {number[]} a */ b) {
          sumCalled += 1;
          return [...a, ...b];
        }
        const sumMemoized = memoize(sum);

        // Put in cache for args combination
        expect(sumMemoized([1], [2])).to.deep.equal([1, 2]);
        expect(sumCalled).to.equal(1);

        // Return from cache
        expect(sumMemoized([1], [2])).to.deep.equal([1, 2]);
        expect(sumCalled).to.equal(1);

        // Put in cache for args combination
        expect(sumMemoized([1], [3])).to.deep.equal([1, 3]);
        expect(sumCalled).to.equal(2);
      });

      it(`returns cached result per function for same args`, async () => {
        let sumCalled = 0;
        function sum(/** @type {number[]} a */ a, /** @type {number[]} a */ b) {
          sumCalled += 1;
          return [...a, ...b];
        }
        const sumMemoized = memoize(sum);
        let sum2Called = 0;
        function sum2(/** @type {number[]} a */ a, /** @type {number[]} a */ b) {
          sum2Called += 1;
          return [...a, ...b];
        }
        const sum2Memoized = memoize(sum2);

        expect(sumMemoized([1], [2])).to.deep.equal([1, 2]);
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(0);

        expect(sum2Memoized([1], [2])).to.deep.equal([1, 2]);
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);

        // Both cached
        expect(sumMemoized([1], [2])).to.deep.equal([1, 2]);
        expect(sum2Memoized([1], [2])).to.deep.equal([1, 2]);
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);
      });
    });

    describe('Objects', () => {
      it(`returns cached result when called with same parameters`, async () => {
        let sumCalled = 0;
        function sum(/** @type {object} a */ a, /** @type {object} a */ b) {
          sumCalled += 1;
          return { ...a, ...b };
        }
        const sumMemoized = memoize(sum, { serializeObjects: true });

        // Put in cache for args combination
        expect(sumMemoized({ x: 1 }, { y: 2 })).to.deep.equal({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);

        // Return from cache
        expect(sumMemoized({ x: 1 }, { y: 2 })).to.deep.equal({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);

        // Put in cache for args combination
        expect(sumMemoized({ x: 1 }, { y: 3 })).to.deep.equal({ x: 1, y: 3 });
        expect(sumCalled).to.equal(2);
      });

      it(`returns cached result per function for same args`, async () => {
        let sumCalled = 0;
        function sum(/** @type {object} a */ a, /** @type {object} a */ b) {
          sumCalled += 1;
          return { ...a, ...b };
        }
        const sumMemoized = memoize(sum);
        let sum2Called = 0;
        function sum2(/** @type {object} a */ a, /** @type {object} a */ b) {
          sum2Called += 1;
          return { ...a, ...b };
        }
        const sum2Memoized = memoize(sum2);

        expect(sumMemoized({ x: 1 }, { y: 2 })).to.deep.equal({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(0);

        expect(sum2Memoized({ x: 1 }, { y: 2 })).to.deep.equal({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);

        // Both cached
        expect(sumMemoized({ x: 1 }, { y: 2 })).to.deep.equal({ x: 1, y: 2 });
        expect(sum2Memoized({ x: 1 }, { y: 2 })).to.deep.equal({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);
      });
    });

    describe('When non primitives (references) are returned', () => {
      // Solve this by making sure your memoized function uses Object.freeze
      it(`will be affected by edited non primitive returns`, async () => {
        let sumCalled = 0;
        function sum(/** @type {object} a */ a, /** @type {object} a */ b) {
          sumCalled += 1;
          return { ...a, ...b };
        }
        const sumMemoized = memoize(sum);

        // Put in cache for args combination
        const result = sumMemoized({ x: 1 }, { y: 2 });
        expect(result).to.deep.equal({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);

        // Return from cache
        const resultCached = sumMemoized({ x: 1 }, { y: 2 });
        expect(resultCached).to.equal(result);
        expect(resultCached).to.deep.equal({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);

        // Outside world can edit returned reference
        // @ts-expect-error
        resultCached.x = 3;
        // Return from cache
        const lastResult = sumMemoized({ x: 1 }, { y: 2 });
        expect(lastResult).to.equal(result);
        expect(lastResult).to.not.eql({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);
      });
    });
  });

  describe('Asynchronous', () => {
    it(`returns cached result when called with same parameters`, async () => {
      let sumCalled = 0;
      async function sum(/** @type {number} a */ a, /** @type {number} a */ b) {
        sumCalled += 1;
        return a + b;
      }
      const sumMemoized = memoize(sum);

      // Put in cache for args combination
      expect(await sumMemoized(1, 2)).to.equal(3);
      expect(sumCalled).to.equal(1);

      // Return from cache
      expect(await sumMemoized(1, 2)).to.equal(3);
      expect(sumCalled).to.equal(1);

      // Put in cache for args combination
      expect(await sumMemoized(1, 3)).to.equal(4);
      expect(sumCalled).to.equal(2);

      // Return from cache
      expect(await sumMemoized(1, 3)).to.equal(4);
      expect(sumCalled).to.equal(2);
    });

    it(`returns cached result per function for same args`, async () => {
      let sumCalled = 0;
      async function sum(/** @type {number} a */ a, /** @type {number} a */ b) {
        sumCalled += 1;
        return a + b;
      }
      const sumMemoized = memoize(sum);
      let sum2Called = 0;
      async function sum2(/** @type {number} a */ a, /** @type {number} a */ b) {
        sum2Called += 1;
        return a + b;
      }
      const sum2Memoized = memoize(sum2);

      expect(await sumMemoized(1, 2)).to.equal(3);
      expect(sumCalled).to.equal(1);
      expect(sum2Called).to.equal(0);

      expect(await sum2Memoized(1, 2)).to.equal(3);
      expect(sumCalled).to.equal(1);
      expect(sum2Called).to.equal(1);

      // Both cached
      expect(await sumMemoized(1, 2)).to.equal(3);
      expect(await sum2Memoized(1, 2)).to.equal(3);
      expect(sumCalled).to.equal(1);
      expect(sum2Called).to.equal(1);
    });
  });

  describe('Cache', () => {
    it(`"memoizedFn.clearCache()" clears the cache for a memoized fn"`, async () => {
      let sumCalled = 0;
      function sum(/** @type {string} a */ a, /** @type {string} a */ b) {
        sumCalled += 1;
        return a + b;
      }
      const sumMemoized = memoize(sum);

      // Put in cache for args combination
      expect(sumMemoized('1', '2')).to.equal('12');
      expect(sumCalled).to.equal(1);

      // Return from cache
      expect(sumMemoized('1', '2')).to.equal('12');
      expect(sumCalled).to.equal(1);

      sumMemoized.clearCache();

      // Now the original function is called again
      expect(sumMemoized('1', '2')).to.equal('12');
      expect(sumCalled).to.equal(2);

      // Return from new cache again
      expect(sumMemoized('1', '2')).to.equal('12');
      expect(sumCalled).to.equal(2);
    });

    describe('Strategies', () => {
      beforeEach(() => {
        memoize.restoreCaching();
      });

      describe('lfu (least frequently used) strategy', () => {
        it('has lfu strategy by default', async () => {
          expect(memoize.cacheStrategy).to.equal('lfu');
        });

        it('removes least used from cache', async () => {
          memoize.maxCacheStack = { length: 2 };

          const spy1 = sinon.spy(() => {});
          const spy2 = sinon.spy(() => {});
          const spy3 = sinon.spy(() => {});

          const spy1Memoized = memoize(spy1);
          const spy2Memoized = memoize(spy2);
          const spy3Memoized = memoize(spy3);

          // Call spy1 3 times
          spy1Memoized();
          expect(spy1.callCount).to.equal(1);
          expect(memoize.cacheStack).to.deep.equal([{ fn: spy1Memoized, count: 1 }]);

          spy1Memoized();
          expect(spy1.callCount).to.equal(1);
          expect(memoize.cacheStack).to.deep.equal([{ fn: spy1Memoized, count: 2 }]);

          spy1Memoized();
          expect(spy1.callCount).to.equal(1);
          expect(memoize.cacheStack).to.deep.equal([{ fn: spy1Memoized, count: 3 }]);

          // Call spy2 2 times (so it's the least frequently used)
          spy2Memoized();
          expect(spy2.callCount).to.equal(1);
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy1Memoized, count: 3 },
            { fn: spy2Memoized, count: 1 },
          ]);

          spy2Memoized();
          expect(spy2.callCount).to.equal(1);
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy1Memoized, count: 3 },
            { fn: spy2Memoized, count: 2 },
          ]);

          // When we add number 3, we exceed maxCacheStack
          // This means that we 'free' the least frequently used (spy2)
          spy3Memoized();
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy1Memoized, count: 3 },
            { fn: spy3Memoized, count: 1 },
          ]);

          spy2Memoized();
          expect(spy2.callCount).to.equal(2);
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy1Memoized, count: 3 },
            { fn: spy2Memoized, count: 1 }, // we start over
          ]);

          spy2Memoized(); // 2
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy1Memoized, count: 3 }, // we start over
            { fn: spy2Memoized, count: 2 },
          ]);
          spy2Memoized(); // 3
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy1Memoized, count: 3 }, // we start over
            { fn: spy2Memoized, count: 3 },
          ]);
          spy2Memoized(); // 4
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy1Memoized, count: 3 }, // we start over
            { fn: spy2Memoized, count: 4 },
          ]);

          spy3Memoized();
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy2Memoized, count: 4 },
            { fn: spy3Memoized, count: 1 }, // we start over
          ]);
        });
      });

      describe('lru (least recently used) strategy', () => {
        it(`can set lru strategy"`, async () => {
          memoize.cacheStrategy = 'lru';
          expect(memoize.cacheStrategy).to.equal('lru');
        });

        it('removes least recently used from cache', async () => {
          memoize.maxCacheStack = { length: 2 };
          memoize.cacheStrategy = 'lru';

          const spy1 = sinon.spy(() => {});
          const spy2 = sinon.spy(() => {});
          const spy3 = sinon.spy(() => {});

          const spy1Memoized = memoize(spy1);
          const spy2Memoized = memoize(spy2);
          const spy3Memoized = memoize(spy3);

          // Call spy1 3 times
          spy1Memoized();
          expect(spy1.callCount).to.equal(1);
          expect(memoize.cacheStack).to.deep.equal([{ fn: spy1Memoized, count: 1 }]);

          spy1Memoized();
          expect(spy1.callCount).to.equal(1);
          expect(memoize.cacheStack).to.deep.equal([{ fn: spy1Memoized, count: 2 }]);

          spy1Memoized();
          expect(spy1.callCount).to.equal(1);
          expect(memoize.cacheStack).to.deep.equal([{ fn: spy1Memoized, count: 3 }]);

          spy2Memoized();
          expect(spy2.callCount).to.equal(1);
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy2Memoized, count: 1 },
            { fn: spy1Memoized, count: 3 },
          ]);

          spy2Memoized();
          expect(spy2.callCount).to.equal(1);
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy2Memoized, count: 2 },
            { fn: spy1Memoized, count: 3 },
          ]);

          spy3Memoized();
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy3Memoized, count: 1 },
            { fn: spy2Memoized, count: 2 },
          ]);

          spy1Memoized();
          expect(spy1.callCount).to.equal(2);
          expect(memoize.cacheStack).to.deep.equal([
            { fn: spy1Memoized, count: 1 }, // we start over
            { fn: spy3Memoized, count: 1 },
          ]);
        });
      });

      // TODO: test maxCacheStack strategy for > memUsage (90%) explicitly
    });
  });
});
