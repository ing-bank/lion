import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/form-core-test-suites.js';
import { defineCE } from '@open-wc/testing';
import { LionInputStepper } from '../src/LionInputStepper.js';

export const runInputStepperIntegrationSuite = (klass = LionInputStepper) => {
  const tagString = defineCE(class extends klass {});
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Number],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Number,
  });
};
