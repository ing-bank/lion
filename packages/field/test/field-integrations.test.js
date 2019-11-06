import { defineCE } from '@open-wc/testing';
import { runInteractionStateMixinSuite } from '../test-suites/InteractionStateMixin.suite.js';
import '../lion-field.js';
import { runFormatMixinSuite } from '../test-suites/FormatMixin.suite.js';

const fieldTagString = defineCE(
  class extends customElements.get('lion-field') {
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
    suffix: 'lion-field',
  });

  runFormatMixinSuite({
    tagString: fieldTagString,
  });
});
