/**
 * Proves the subclasser contract for this suite: the caller registers its own element and
 * the suite runs against that tag name (`tagString` mode, see
 * docs/guides/principles/test-suites.md).
 */
import { LionAccordion } from '@lion/ui/accordion.js';

import { runAccordionSuite } from '../test-suites/lion-accordion.suite.js';

class MyAccordion extends LionAccordion {}

customElements.define('my-accordion', MyAccordion);

describe('lion-accordion suite, run against a subclasser tag (tagString mode)', () => {
  runAccordionSuite({ tagString: 'my-accordion' });
});
