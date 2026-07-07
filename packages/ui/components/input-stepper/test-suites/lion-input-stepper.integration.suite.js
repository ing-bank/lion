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
    valueToggler: ({ toggleValue, viewValue }) => {
      if (viewValue) {
        return !toggleValue ? '10' : '20';
      }
      return !toggleValue ? 10 : 20;
    },
    getExpectedInitialModelValue: () => '',
    getExpectedInitialFormattedValue: () => '',
    getExpectedInitialSerializedValue: () => '',
    valueChangeCounterOffset: 0,
  });
};
