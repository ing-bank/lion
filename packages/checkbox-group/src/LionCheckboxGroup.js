import { LitElement } from '@lion/core';
import { ChoiceGroupMixin, FormGroupMixin } from '@lion/form-core';

/**
 * A wrapper around multiple checkboxes
 */
export class LionCheckboxGroup extends ChoiceGroupMixin(FormGroupMixin(LitElement)) {
  constructor() {
    super();
    this.multipleChoice = true;
  }
}
