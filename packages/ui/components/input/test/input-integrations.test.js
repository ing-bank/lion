import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
  runNativeTextFieldMixinSuite,
} from '@lion/ui/form-core-test-suites.js';
import { LionInput } from '@lion/ui/input.js';

class FieldInput extends LionInput {
  get slots() {
    return {
      ...super.slots,
      // LionInput needs to have an _inputNode defined in order to work...
      input: () => document.createElement('input'),
    };
  }
}

describe('<lion-input> integrations', () => {
  runInteractionStateMixinSuite({
    classes: { host: FieldInput },
  });

  runFormatMixinSuite({
    classes: { host: FieldInput },
    modelValueType: String,
  });

  runNativeTextFieldMixinSuite({
    classes: { host: FieldInput },
  });
});
