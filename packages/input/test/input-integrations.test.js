import { defineCE } from '@open-wc/testing';
import { runInteractionStateMixinSuite } from '@lion/form-core/test-suites/InteractionStateMixin.suite.js';
import { runFormatMixinSuite } from '@lion/form-core/test-suites/FormatMixin.suite.js';
import { LionInput } from '../src/LionInput.js';

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
});
