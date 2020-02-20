import { LitElement } from '@lion/core';
import { ChoiceGroupMixin } from '@lion/choice-input';
import { FormGroupMixin } from '@lion/fieldset';

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
