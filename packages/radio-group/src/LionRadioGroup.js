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
}
