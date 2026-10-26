/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionSelectedFileList } from '@lion/ui/input-file.js';

import { runSelectedFileListSuite } from '../test-suites/lion-selected-file-list.suite.js';

class MySelectedFileList extends LionSelectedFileList {}

customElements.define('my-ui-selected-file-list', MySelectedFileList);

describe('lion-selected-file-list suite, run against a subclasser tag (tagString mode)', () => {
  runSelectedFileListSuite({ tagString: 'my-ui-selected-file-list' });
});
