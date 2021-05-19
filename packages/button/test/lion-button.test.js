import { LionButtonSuite } from '../test-suites/LionButton.suite.js';
import { LionButtonResetSuite } from '../test-suites/LionButtonReset.suite.js';
import { LionButtonSubmitSuite } from '../test-suites/LionButtonSubmit.suite.js';

describe('lion-button', () => {
  LionButtonSuite();
  LionButtonResetSuite();
  LionButtonSubmitSuite();
});
