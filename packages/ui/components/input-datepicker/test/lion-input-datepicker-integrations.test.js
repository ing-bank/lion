import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

import { LionInputDatepicker } from '@lion/ui/input-datepicker.js';
import '@lion/ui/define/lion-input-datepicker.js';

describe('<lion-input-datepicker> integrations', () => {
  runInteractionStateMixinSuite({
    classes: { host: LionInputDatepicker },
    allowedModelValueTypes: [Date],
  });

  runFormatMixinSuite({
    classes: { host: LionInputDatepicker },
    modelValueType: Date,
  });
});
