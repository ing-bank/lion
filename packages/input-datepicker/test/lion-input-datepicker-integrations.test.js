import { runInteractionStateMixinSuite, runFormatMixinSuite } from '@lion/form-core/test-suites';

import '@lion/input-datepicker/define';

const tagString = 'lion-input-datepicker';
describe('<lion-input-datepicker> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Date],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Date,
  });
});
