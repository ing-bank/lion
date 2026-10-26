/**
 * Proves the subclasser contract for this suite: the caller registers its own element and the
 * suite runs against that tag name (`tagString` mode, see docs/guides/principles/test-suites.md).
 */
import { LionPagination } from '@lion/ui/pagination.js';

import { runPaginationSuite } from '../test-suites/LionPagination.suite.js';

class MyPagination extends LionPagination {}

customElements.define('my-pagination', MyPagination);

describe('pagination test suite, run against a subclasser tag (tagString mode)', () => {
  runPaginationSuite({ tagString: 'my-pagination' });
});
