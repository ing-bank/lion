import { runInteractionStateMixinSuite } from '@lion/field/test-suites/InteractionStateMixin.suite.js';
import '../lion-input.js';

describe('<lion-input> integrations', () => {
  runInteractionStateMixinSuite({
    tagString: 'lion-input',
    suffix: 'lion-input',
  });
});
