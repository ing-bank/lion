import { defineCE } from '@open-wc/testing';
import {
  runInteractionStateMixinSuite,
  runFormatMixinSuite,
} from '@lion/ui/form-core-test-suites.js';
import { LionInputStepper } from '../src/LionInputStepper.js';

export const runInputStepperIntegrationSuite = (klass = LionInputStepper) => {
  // Create a subclass that disables the numeric preprocessor for integration tests
  // since the FormatMixin suite uses non-numeric string values like 'test', 'foo', etc.
  const tagString = defineCE(
    class extends klass {
      constructor() {
        super();
        // Disable the numeric preprocessor for generic integration tests
        this.preprocessor = () => undefined;
      }
    },
  );
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Number],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Number,
  });
};
