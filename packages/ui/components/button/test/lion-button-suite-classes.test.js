/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionButton, LionButtonReset, LionButtonSubmit } from '@lion/ui/button.js';
import { LionButtonResetSuite } from '../test-suites/LionButtonReset.suite.js';
import { LionButtonSubmitSuite } from '../test-suites/LionButtonSubmit.suite.js';
import { LionButtonSuite } from '../test-suites/LionButton.suite.js';

describe('lion-button-suite-classes, run with an explicit classes map', () => {
  LionButtonSuite({ classes: { host: LionButton } });
  LionButtonResetSuite({ classes: { host: LionButtonReset } });
  LionButtonSubmitSuite({ classes: { host: LionButtonSubmit } });
});
