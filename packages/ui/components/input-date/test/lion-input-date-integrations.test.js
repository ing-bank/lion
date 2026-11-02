import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

import { LionInputDate } from '@lion/ui/input-date.js';
import '@lion/ui/define/lion-input-date.js';

describe('<lion-input-date> integrations', () => {
  runInteractionStateMixinSuite({
    classes: { host: LionInputDate },
    allowedModelValueTypes: [Date],
  });

  runFormatMixinSuite({
    classes: { host: LionInputDate },
    modelValueType: Date,
  });
});
