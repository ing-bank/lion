import { LionCheckbox } from '../src/LionCheckbox.js';
import { LionCheckboxGroup } from '../src/LionCheckboxGroup.js';
import { LionCheckboxIndeterminate } from '../src/LionCheckboxIndeterminate.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-checkbox': LionCheckbox;
    'lion-checkbox-group': LionCheckboxGroup;
    'lion-checkbox-indeterminate': LionCheckboxIndeterminate;
  }
}

export { LionCheckbox, LionCheckboxGroup, LionCheckboxIndeterminate };
