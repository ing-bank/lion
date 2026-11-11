import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/test-suites/form-core.js';
import { LionInput } from '@lion/ui/input.js';
import '@lion/ui/define/lion-input.js';
describe('<lion-input> integrations', () => {
  runInteractionStateMixinSuite({
    classes: {
      host: LionInput,
    },
  });
  runFormatMixinSuite({
    classes: {
      host: LionInput,
    },
    modelValueType: String,
  });
});
