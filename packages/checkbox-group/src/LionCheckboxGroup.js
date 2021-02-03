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

  /** @param {import('@lion/core').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('name') && !String(this.name).match(/\[\]$/)) {
      throw new Error('Names should end in "[]".');
    }
  }
}
