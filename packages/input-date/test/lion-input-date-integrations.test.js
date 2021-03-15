import { runInteractionStateMixinSuite, runFormatMixinSuite } from '@lion/form-core/test-suites';

import '@lion/input-date/define';

const tagString = 'lion-input-date';
describe('<lion-input-date> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Date],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Date,
  });
});
