import { LionButton } from '../src/LionButton.js';
import { LionButtonReset } from '../src/LionButtonReset.js';
import { LionButtonSubmit } from '../src/LionButtonSubmit.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-button': LionButton;
    'lion-button-reset': LionButtonReset;
    'lion-button-submit': LionButtonSubmit;
  }
}

export { LionButton, LionButtonReset, LionButtonSubmit };
