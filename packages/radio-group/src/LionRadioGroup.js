import { LitElement } from '@lion/core';
import { ChoiceGroupMixin, FormGroupMixin } from '@lion/form-core';

/**
 * A wrapper around multiple radios.
 */
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/40110
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
          initValue = child.value;
        }
      }
    });
    this.modelValue = initValue;

    this.resetInteractionState();
  }
}
