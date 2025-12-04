import { LionInputStepper } from './input-stepper.js';
import { runInputStepperSuite } from '../components/input-stepper/test-suites/lion-input-stepper.suite.js';
import { runInputStepperIntegrationSuite } from '../components/input-stepper/test-suites/lion-input-stepper.integration.suite.js';

/**
 * @param {typeof LionInputStepper} klass
 */
export function runInputStepperSuites(klass = LionInputStepper) {
  runInputStepperSuite(klass);
  runInputStepperIntegrationSuite(klass);
}
