import { LitElement } from 'lit';
import { ChoiceGroupMixin, FormGroupMixin } from '@lion/ui/form-core.js';

/**
 * LionRadioGroup: A wrapper around multiple radios.
 *
 * @customElement lion-radio-group
 */
export class LionRadioGroup extends ChoiceGroupMixin(FormGroupMixin(LitElement)) {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'radiogroup');
  }

  /**
   * @override FormGroupMixin, during a reset if the current checked value is behind
   * the initial checked value, they both got unchecked
   */
  resetGroup() {
    let initValue;
    this.formElements.forEach(child => {
      if (typeof child.resetGroup === 'function') {
        child.resetGroup();
      } else if (typeof child.reset === 'function') {
        child.reset();
        // If the value was initially checked save this
        if (child.checked) {
          initValue = child.choiceValue;
        }
      }
    });
    this.modelValue = initValue;

    this.resetInteractionState();
  }
}
