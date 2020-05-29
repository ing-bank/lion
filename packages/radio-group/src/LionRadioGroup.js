import { LitElement } from '@lion/core';
import { ChoiceGroupMixin, FormGroupMixin } from '@lion/form-core';

/**
 * A wrapper around multiple radios.
 *
 * @extends {LionFieldset}
 */
export class LionRadioGroup extends ChoiceGroupMixin(FormGroupMixin(LitElement)) {
  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.setAttribute('role', 'radiogroup');
  }
}
