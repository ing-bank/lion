import { runInteractionStateMixinSuite } from '@lion/form-core/test-suites/InteractionStateMixin.suite.js';
import { runFormatMixinSuite } from '@lion/form-core/test-suites/FormatMixin.suite.js';
import '../lion-input-datepicker.js';

const tagString = 'lion-input-datepicker';
describe('<lion-input-datepicker> integrations', () => {
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
