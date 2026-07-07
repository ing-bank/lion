import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
  runNativeTextFieldMixinSuite,
} from '@lion/ui/form-core-test-suites.js';
import { defineCE } from '@open-wc/testing';

import { LionInput } from '@lion/ui/input.js';

const fieldTagString = defineCE(
  class extends LionInput {
    get slots() {
      return {
        ...super.slots,
        // LionInput needs to have an _inputNode defined in order to work...
        input: () => document.createElement('input'),
      };
    }
  },
);

describe('<lion-input> integrations', () => {
  runInteractionStateMixinSuite({
    tagString: fieldTagString,
  });

  runFormatMixinSuite({
    tagString: fieldTagString,
    modelValueType: String,
    valueToggler: ({ toggleValue }) => (!toggleValue ? 'input-value-1' : 'input-value-2'),
    getExpectedInitialModelValue: () => '',
    getExpectedInitialFormattedValue: () => '',
    getExpectedInitialSerializedValue: () => '',
    valueChangeCounterOffset: 0,
  });

  runNativeTextFieldMixinSuite({
    tagString: fieldTagString,
  });
});
