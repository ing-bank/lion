import { LionSwitch } from '../src/LionSwitch.js';
import { LionSwitchButton } from '../src/LionSwitchButton.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-switch': LionSwitch;
    'lion-switch-button': LionSwitchButton;
  }
}

export { LionSwitch, LionSwitchButton };
