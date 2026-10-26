/**
 * Proves the subclasser contract for this suite with BOTH tag names supplied by the caller.
 */
import { LionRadio, LionRadioGroup } from '@lion/ui/radio-group.js';

import { runRadioGroupSuite } from '../test-suites/lion-radio-group.suite.js';

class MyRadio extends LionRadio {}
class MyRadioGroup extends LionRadioGroup {}

customElements.define('my-ui-radio', MyRadio);
customElements.define('my-ui-radio-group', MyRadioGroup);

describe('lion-radio-group suite, run against subclasser tags (tagString mode)', () => {
  runRadioGroupSuite({ tagString: 'my-ui-radio-group', childTagString: 'my-ui-radio' });
});
