const { expect } = require('chai');
const { memoize } = require('../../../src/program/utils/memoize.js');
const { GlobalConfig } = require('../../../src/program/core/GlobalConfig.js');

const cacheDisabledInitialValue = GlobalConfig.cacheDisabled;

describe('Memoize', () => {
  beforeEach(() => {
    // This is important, since memoization only works
    GlobalConfig.cacheDisabled = false;
  });
  afterEach(() => {
    GlobalConfig.cacheDisabled = cacheDisabledInitialValue;
  });

  describe('With primitives', () => {
    describe('Numbers', () => {
      it(`returns cached result when called with same parameters`, async () => {
        let sumCalled = 0;
        function sum(/** @type {number} */ a, /** @type {number} */ b) {
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
        function sum(/** @type {number} */ a, /** @type {number} */ b) {
          sumCalled += 1;
          return a + b;
        }
        const sumMemoized = memoize(sum);
        let sum2Called = 0;
        function sum2(/** @type {number} */ a, /** @type {number} */ b) {
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
        function sum(/** @type {string} */ a, /** @type {string} */ b) {
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
        function sum(/** @type {string} */ a, /** @type {string} */ b) {
          sumCalled += 1;
          return a + b;
        }
        const sumMemoized = memoize(sum);
        let sum2Called = 0;
        function sum2(/** @type {string} */ a, /** @type {string} */ b) {
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
        function sum(/** @type {number[]} */ a, /** @type {number[]} */ b) {
          sumCalled += 1;
          return [...a, ...b];
        }
        const sumMemoized = memoize(sum);

        // Put in cache for args combination
        expect(sumMemoized([1], [2])).to.eql([1, 2]);
        expect(sumCalled).to.equal(1);

        // Return from cache
        expect(sumMemoized([1], [2])).to.eql([1, 2]);
        expect(sumCalled).to.equal(1);

        // Put in cache for args combination
        expect(sumMemoized([1], [3])).to.eql([1, 3]);
        expect(sumCalled).to.equal(2);
      });

      it(`returns cached result per function for same args`, async () => {
        let sumCalled = 0;
        function sum(/** @type {number[]} */ a, /** @type {number[]} */ b) {
          sumCalled += 1;
          return [...a, ...b];
        }
        const sumMemoized = memoize(sum);
        let sum2Called = 0;
        function sum2(/** @type {number[]} */ a, /** @type {number[]} */ b) {
          sum2Called += 1;
          return [...a, ...b];
        }
        const sum2Memoized = memoize(sum2);

        expect(sumMemoized([1], [2])).to.eql([1, 2]);
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(0);

        expect(sum2Memoized([1], [2])).to.eql([1, 2]);
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);

        // Both cached
        expect(sumMemoized([1], [2])).to.eql([1, 2]);
        expect(sum2Memoized([1], [2])).to.eql([1, 2]);
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);
      });
    });

    describe('Objects', () => {
      it(`returns cached result when called with same parameters`, async () => {
        let sumCalled = 0;
        function sum(/** @type {object} */ a, /** @type {object} */ b) {
          sumCalled += 1;
          return { ...a, ...b };
        }
        const sumMemoized = memoize(sum, { serializeObjects: true });

        // Put in cache for args combination
        expect(sumMemoized({ x: 1 }, { y: 2 })).to.eql({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);

        // Return from cache
        expect(sumMemoized({ x: 1 }, { y: 2 })).to.eql({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);

        // Put in cache for args combination
        expect(sumMemoized({ x: 1 }, { y: 3 })).to.eql({ x: 1, y: 3 });
        expect(sumCalled).to.equal(2);
      });

      it(`returns cached result per function for same args`, async () => {
        let sumCalled = 0;
        function sum(/** @type {object} */ a, /** @type {object} */ b) {
          sumCalled += 1;
          return { ...a, ...b };
        }
        const sumMemoized = memoize(sum, { serializeObjects: true });
        let sum2Called = 0;
        function sum2(/** @type {object} */ a, /** @type {object} */ b) {
          sum2Called += 1;
          return { ...a, ...b };
        }
        const sum2Memoized = memoize(sum2, { serializeObjects: true });

        expect(sumMemoized({ x: 1 }, { y: 2 })).to.eql({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(0);

        expect(sum2Memoized({ x: 1 }, { y: 2 })).to.eql({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);

        // Both cached
        expect(sumMemoized({ x: 1 }, { y: 2 })).to.eql({ x: 1, y: 2 });
        expect(sum2Memoized({ x: 1 }, { y: 2 })).to.eql({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);
        expect(sum2Called).to.equal(1);
      });
    });

    describe('When non primitives (references) are returned', () => {
      // Solve this by making sure your memoized function uses Object.freeze
      it(`will be affected by edited non primitive returns`, async () => {
        let sumCalled = 0;
        function sum(/** @type {object} */ a, /** @type {object} */ b) {
          sumCalled += 1;
          return { ...a, ...b };
        }
        const sumMemoized = memoize(sum, { serializeObjects: true });

        // Put in cache for args combination
        const result = sumMemoized({ x: 1 }, { y: 2 });
        expect(result).to.eql({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);

        // Return from cache
        const resultCached = sumMemoized({ x: 1 }, { y: 2 });
        expect(resultCached).to.equal(result);
        expect(resultCached).to.eql({ x: 1, y: 2 });
        expect(sumCalled).to.equal(1);

        // Outside world can edit returned reference
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
      async function sum(/** @type {number} */ a, /** @type {number} */ b) {
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
      async function sum(/** @type {number} */ a, /** @type {number} */ b) {
        sumCalled += 1;
        return a + b;
      }
      const sumMemoized = memoize(sum);
      let sum2Called = 0;
      async function sum2(/** @type {number} */ a, /** @type {number} */ b) {
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
});
