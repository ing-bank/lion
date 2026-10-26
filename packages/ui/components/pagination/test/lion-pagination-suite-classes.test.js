/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionPagination } from '@lion/ui/pagination.js';
import { runPaginationSuite } from '../test-suites/LionPagination.suite.js';

class MyPagination extends LionPagination {}

describe('lion-pagination-suite-tag-string.test.js, run against a subclasser class (classes mode)', () => {
  runPaginationSuite({ classes: { pagination: MyPagination } });
});
