import { ChoiceGroupMixin } from '@lion/choice-input';
import { LionFieldset } from '@lion/fieldset';

export class LionCheckboxGroup extends ChoiceGroupMixin(LionFieldset) {
  constructor() {
    super();
    this.multipleChoice = true;
  }
}
