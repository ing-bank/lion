/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionDialog } from '@lion/ui/dialog.js';
import { runDialogSuite } from '../test-suites/lion-dialog.suite.js';

describe('lion-dialog.classes, run with an explicit classes map', () => {
  runDialogSuite({ classes: { host: LionDialog } });
});
