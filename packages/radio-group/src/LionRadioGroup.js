import { ChoiceGroupMixin } from '@lion/choice-input';
import { LionFieldset } from '@lion/fieldset';

/**
 * LionRadioGroup: extends the lion-fieldset
 *
 * <lion-radio-group name="radios">
 *   <label slot="label">My Radio</label>
 *   <lion-radio>
 *     <label slot="label">Male</label>
 *   </lion-radio>
 *   <lion-radio>
 *     <label slot="label">Female</label>
 *   </lion-radio>
 * </lion-radio-group>
 *
 * You can preselect an option by setting marking an lion-radio checked.
 *   Example:
 *   <lion-radio checked></lion-radio>
 *
 * It extends LionFieldset so it inherits it's features.
 *
 *
 * @customElement lion-radio-group
 * @extends {LionFieldset}
 */

export class LionRadioGroup extends ChoiceGroupMixin(LionFieldset) {
  connectedCallback() {
    super.connectedCallback();
    this._setRole('radiogroup');
  }
}
