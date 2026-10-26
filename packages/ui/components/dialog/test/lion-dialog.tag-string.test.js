/**
 * Proves the subclasser contract for this suite: the caller registers its own element(s) and the
 * suite runs against those tag names (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionDialog } from '@lion/ui/dialog.js';

import { runDialogSuite } from '../test-suites/lion-dialog.suite.js';

class MyDialog extends LionDialog {}

customElements.define('my-ui-dialog', MyDialog);

describe('lion-dialog suite, run against a subclasser tag (tagString mode)', () => {
  runDialogSuite({ tagString: 'my-ui-dialog' });
});
