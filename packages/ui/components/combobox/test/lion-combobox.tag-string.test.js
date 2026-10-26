/**
 * Proves the subclasser contract for this suite: the caller registers its own element and the
 * suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionCombobox } from '@lion/ui/combobox.js';

import { runComboboxSuite } from '../test-suites/lion-combobox.suite.js';

class MyCombobox extends LionCombobox {}

customElements.define('my-ui-combobox', MyCombobox);

describe('lion-combobox suite, run against a subclasser tag (tagString mode)', () => {
  runComboboxSuite({ tagString: 'my-ui-combobox' });
});
