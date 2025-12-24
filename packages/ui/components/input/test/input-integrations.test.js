import { describe } from 'vitest';
import { defineCE } from '@open-wc/testing-helpers';
import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
  runNativeTextFieldMixinSuite,
} from '@lion/ui/form-core-test-suites.js';

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
  });

  runNativeTextFieldMixinSuite({
    tagString: fieldTagString,
  });
});
