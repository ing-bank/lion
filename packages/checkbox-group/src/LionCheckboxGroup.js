import { ChoiceGroupMixin } from '@lion/choice-input';
import { LionFieldset } from '@lion/fieldset';

export class LionCheckboxGroup extends ChoiceGroupMixin(LionFieldset) {
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
