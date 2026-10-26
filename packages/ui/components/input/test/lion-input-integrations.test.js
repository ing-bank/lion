import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

import { LionInput } from '@lion/ui/input.js';
import '@lion/ui/define/lion-input.js';

describe('<lion-input> integrations', () => {
  runInteractionStateMixinSuite({
    classes: { host: LionInput },
  });

  runFormatMixinSuite({
    classes: { host: LionInput },
    modelValueType: String,
  });
});
