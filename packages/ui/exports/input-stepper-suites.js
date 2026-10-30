import { LionInputStepper } from './input-stepper.js';
import { runInputStepperSuite } from '../components/input-stepper/test-suites/lion-input-stepper.suite.js';
import { runInputStepperIntegrationSuite } from '../components/input-stepper/test-suites/lion-input-stepper.integration.suite.js';

/**
 * Runs both input-stepper suites against the element the caller hands in as the `host` role.
 * @param {{ classes?: { host?: import('@lion/ui/types/test-suites.js').SuiteElement } } | typeof LionInputStepper} [customConfig]
 */
export function runInputStepperSuites(customConfig = {}) {
  const config =
    typeof customConfig === 'function'
      ? { classes: { host: customConfig } }
      : { classes: { host: LionInputStepper, ...customConfig.classes } };
  runInputStepperSuite(config);
  runInputStepperIntegrationSuite(config);
}
