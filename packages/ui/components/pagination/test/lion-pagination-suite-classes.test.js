/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionPagination } from '@lion/ui/pagination.js';
import { runPaginationSuite } from '../test-suites/LionPagination.suite.js';

describe('lion-pagination-suite-classes, run with an explicit classes map', () => {
  runPaginationSuite({ classes: { host: LionPagination } });
});
