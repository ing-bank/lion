import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/form-core-test-suites.js';
import {} from '@open-wc/testing';
import { LionInputStepper } from '../src/LionInputStepper.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * Runs the input-stepper suite. The caller hands the element to run against; leaving `host` out keeps
 * `LionInputStepper`.
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}>} [customConfig]
 */
export const runInputStepperIntegrationSuite = ({
  classes: { host = LionInputStepper } = {},
  tagString: legacyTagString,
} = {}) => {
  const tagString = resolveSuiteTag(host, legacyTagString);
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Number],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Number,
  });
};
