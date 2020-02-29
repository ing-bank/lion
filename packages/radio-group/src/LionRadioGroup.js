import { LitElement } from '@lion/core';
import { ChoiceGroupMixin } from '@lion/choice-input';
import { FormGroupMixin } from '@lion/fieldset';

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
