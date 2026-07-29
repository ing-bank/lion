import { visualDiffEnabled } from '@lion/ui/test-helpers/visual-diff-if-enabled/index.js';
import { LionButtonSuite } from '../test-suites/LionButton.suite.js';
import { LionButtonResetSuite } from '../test-suites/LionButtonReset.suite.js';
import { LionButtonSubmitSuite } from '../test-suites/LionButtonSubmit.suite.js';

describe('lion-button', () => {
  LionButtonSuite({ visualDiffEnabled });
  LionButtonResetSuite({ visualDiffEnabled });
  LionButtonSubmitSuite({ visualDiffEnabled });
});
