import {
  runFormatMixinSuite,
  runInteractionStateMixinSuite,
} from '@lion/ui/form-core-test-suites.js';
import {} from '@open-wc/testing';
import { LionInputStepper } from '../src/LionInputStepper.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

export const runInputStepperIntegrationSuite = (klassOrConfig = LionInputStepper) => {
  const cfg =
    typeof klassOrConfig === 'function'
      ? { klass: klassOrConfig }
      : { klass: LionInputStepper, .../** @type {any} */ (klassOrConfig) };
  const tagString = resolveSuiteTag(cfg.classes?.host, cfg.tagString, cfg.klass);
  runInteractionStateMixinSuite({
    tagString,
    allowedModelValueTypes: [Number],
  });

  runFormatMixinSuite({
    tagString,
    modelValueType: Number,
  });
};
