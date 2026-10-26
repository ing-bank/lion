import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

import { LionInputAmount } from '@lion/ui/input-amount.js';
import '@lion/ui/define/lion-input-amount.js';

describe('<lion-input-amount> integrations', () => {
  runInteractionStateMixinSuite({
    classes: { host: LionInputAmount },
    allowedModelValueTypes: [Number],
  });

  runFormatMixinSuite({
    classes: { host: LionInputAmount },
    modelValueType: Number,
  });
});
