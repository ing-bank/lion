import { runInteractionStateMixinSuite } from '@lion/field/test-suites/InteractionStateMixin.suite.js';
import '../lion-input-date.js';

describe('<lion-input-date> integrations', () => {
  runInteractionStateMixinSuite({
    tagString: 'lion-input-date',
    suffix: 'lion-input-date',
    allowedModelValueTypes: [Date],
  });
});
