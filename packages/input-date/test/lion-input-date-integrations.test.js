import { runInteractionStateMixinSuite } from '@lion/field/test-suites/InteractionStateMixin.suite.js';
import { runFormatMixinSuite } from '@lion/field/test-suites/FormatMixin.suite.js';
import '../lion-input-date.js';

const tagString = 'lion-input-date';

describe('<lion-input-date> integrations', () => {
  runInteractionStateMixinSuite({
    tagString,
    suffix: tagString,
    allowedModelValueTypes: [Date],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Date,
  });
});
