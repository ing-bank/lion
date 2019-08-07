import { runInteractionStateMixinSuite } from '@lion/field/test-suites/InteractionStateMixin.suite.js';
import '../lion-input-datepicker.js';

describe('<lion-input-datepicker> integrations', () => {
  runInteractionStateMixinSuite({
    tagString: 'lion-input-datepicker',
    suffix: 'lion-input-datepicker',
    allowedModelValueTypes: [Date],
  });
});
