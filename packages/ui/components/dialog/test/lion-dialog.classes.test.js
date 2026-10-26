/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionDialog } from '@lion/ui/dialog.js';
import { runDialogSuite } from '../test-suites/lion-dialog.suite.js';

class MyDialog extends LionDialog {}

describe('lion-dialog, run against a subclasser class (classes mode)', () => {
  runDialogSuite({ classes: { dialog: MyDialog } });
});
