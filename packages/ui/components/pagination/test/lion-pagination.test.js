import { expect } from '@open-wc/testing';
import { runPaginationSuite } from '../test-suites/LionPagination.suite.js';

runPaginationSuite();

describe('custom disabled assertion', () => {
  let assertions = 0;

  runPaginationSuite({
    assertDisabled(node) {
      assertions += 1;
      expect(/** @type {HTMLButtonElement} */ (node).disabled).to.be.true;
    },
  });

  after(() => {
    expect(assertions).to.equal(2);
  });
});
