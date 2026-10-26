/**
 * Proves the subclasser contract for this suite: the caller registers its own element and the
 * suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionForm } from '@lion/ui/form.js';

import { runFormSuite } from '../test-suites/lion-form.suite.js';

class MyForm extends LionForm {}

customElements.define('my-ui-form', MyForm);

describe('lion-form suite, run against a subclasser tag (tagString mode)', () => {
  runFormSuite({ tagString: 'my-ui-form' });
});
