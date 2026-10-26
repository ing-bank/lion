/**
 * Proves the subclasser contract for this suite: the caller registers its own element and the
 * suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionSelectRich } from '@lion/ui/select-rich.js';

import { runSelectRichInteractionSuite } from '../test-suites/lion-select-rich-interaction.suite.js';

class MySelectRich extends LionSelectRich {}

customElements.define('my-ui-select-rich-interaction', MySelectRich);

describe('lion-select-rich-interaction suite, run against a subclasser tag (tagString mode)', () => {
  runSelectRichInteractionSuite({ tagString: 'my-ui-select-rich-interaction' });
});
