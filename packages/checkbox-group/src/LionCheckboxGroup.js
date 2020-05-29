import { LitElement } from '@lion/core';
import { ChoiceGroupMixin, FormGroupMixin } from '@lion/form-core';

/**
 * A wrapper around multiple checkboxes
 *
 * @extends {LionFieldset}
 */
export class LionCheckboxGroup extends ChoiceGroupMixin(FormGroupMixin(LitElement)) {
  constructor() {
    super();
    this.multipleChoice = true;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('name') && !String(this.name).match(/\[\]$/)) {
      throw new Error('Names should end in "[]".');
    }
  }
}
