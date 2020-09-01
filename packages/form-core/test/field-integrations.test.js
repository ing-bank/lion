import { defineCE } from '@open-wc/testing';
import { runInteractionStateMixinSuite } from '../test-suites/InteractionStateMixin.suite.js';
import { LionField } from '../src/LionField.js';
import { runFormatMixinSuite } from '../test-suites/FormatMixin.suite.js';

const fieldTagString = defineCE(
  class extends LionField {
    get slots() {
      return {
        ...super.slots,
        // LionField needs to have an _inputNode defined in order to work...
        input: () => document.createElement('input'),
      };
    }
  },
);

describe('<lion-field> integrations', () => {
  runInteractionStateMixinSuite({
    tagString: fieldTagString,
  });

  runFormatMixinSuite({
    tagString: fieldTagString,
  });
});
