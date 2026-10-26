/**
 * Proves the contract a subclasser relies on: `tagString` mode. The caller registers its OWN
 * elements (here `my-*`, standing in for an extension layer like my-ui) and the suites run against
 * those, without touching Lion's registration.
 */
import { LionButton, LionButtonReset, LionButtonSubmit } from '@lion/ui/button.js';

import { LionButtonResetSuite } from '../test-suites/LionButtonReset.suite.js';
import { LionButtonSubmitSuite } from '../test-suites/LionButtonSubmit.suite.js';
import { LionButtonSuite } from '../test-suites/LionButton.suite.js';

class MyButton extends LionButton {}
class MyButtonReset extends LionButtonReset {}
class MyButtonSubmit extends LionButtonSubmit {}

customElements.define('my-button', MyButton);
customElements.define('my-button-reset', MyButtonReset);
customElements.define('my-button-submit', MyButtonSubmit);

describe('button test suites, run against a subclasser tag (tagString mode)', () => {
  LionButtonSuite({ tagString: 'my-button' });
  LionButtonResetSuite({ tagString: 'my-button-reset' });
  LionButtonSubmitSuite({ tagString: 'my-button-submit' });
});
