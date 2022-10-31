import { ChoiceInputMixin } from '@lion/ui/form-core.js';
import { LionInput } from '@lion/ui/input.js';

/**
 * Lion-radio can be used inside a lion-radio-group.
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
 *   <lion-radio checked>
 *
 * @customElement lion-radio
 */
export class LionRadio extends ChoiceInputMixin(LionInput) {
  connectedCallback() {
    super.connectedCallback();
    this.type = 'radio';
  }
}
