import { LionSteps } from '../src/LionSteps.js';
import { LionStep } from '../src/LionStep.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-steps': LionSteps;
    'lion-step': LionStep;
  }
}

export { LionSteps, LionStep };
