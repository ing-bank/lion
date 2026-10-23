import { LionRadioGroup } from '../src/LionRadioGroup.js';
import { LionRadio } from '../src/LionRadio.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-radio-group': LionRadioGroup;
    'lion-radio': LionRadio;
  }
}

export { LionRadioGroup, LionRadio };
