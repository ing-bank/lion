import { LionInput } from '@lion/ui/input.js';
import { CustomChoiceInputMixin } from '../../form-core/src/choice-group/CustomChoiceInputMixin.js';

/**
 * Lion-radio-with-user-value can be used inside a lion-radio-group.
 *
 * <lion-radio-group name="radios">
 *   <label slot="label">Favorite Fruit</label>
 *   <lion-radio>
 *     <label slot="label">Apple</label>
 *   </lion-radio>
 *   <lion-radio>
 *     <label slot="label">Orange</label>
 *   </lion-radio>
 *   <lion-radio-with-user-value>
 *     <label slot="label">Other</label>
 *     <div slot="userInput">
 *       <input type="text" placeholder="Your value">
 *     </div>
 * </lion-radio-group>
 *
 * You can preselect an option by setting marking an lion-radio checked
 *   Example:
 *   <lion-radio-with-user-value checked .choiceValue=${''}>
 *
 * @customElement lion-radio-with-user-value
 */
export class LionRadioWithUserValue extends CustomChoiceInputMixin(LionInput) {
  connectedCallback() {
    super.connectedCallback();
    this.type = 'radio';
  }
}
