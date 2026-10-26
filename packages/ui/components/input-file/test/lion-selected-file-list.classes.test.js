/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionSelectedFileList } from '@lion/ui/input-file.js';
import { runSelectedFileListSuite } from '../test-suites/lion-selected-file-list.suite.js';

class MySelectedFileList extends LionSelectedFileList {}

describe('lion-selected-file-list, run against a subclasser class (classes mode)', () => {
  runSelectedFileListSuite({ classes: { host: MySelectedFileList } });
});
