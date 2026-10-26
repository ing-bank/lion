/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionButton, LionButtonReset, LionButtonSubmit } from '@lion/ui/button.js';
import { LionButtonResetSuite } from '../test-suites/LionButtonReset.suite.js';
import { LionButtonSubmitSuite } from '../test-suites/LionButtonSubmit.suite.js';
import { LionButtonSuite } from '../test-suites/LionButton.suite.js';

class MyButton extends LionButton {}
class MyButtonReset extends LionButtonReset {}
class MyButtonSubmit extends LionButtonSubmit {}

describe('lion-button-suite-tag-string.test.js, run against a subclasser class (classes mode)', () => {
  LionButtonSuite({ classes: { host: MyButton } });
  LionButtonResetSuite({ classes: { host: MyButtonReset } });
  LionButtonSubmitSuite({ classes: { host: MyButtonSubmit } });
});
