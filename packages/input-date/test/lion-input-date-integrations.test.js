import { runInteractionStateMixinSuite } from '@lion/form-core/test-suites/InteractionStateMixin.suite.js';
import { runFormatMixinSuite } from '@lion/form-core/test-suites/FormatMixin.suite.js';
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
