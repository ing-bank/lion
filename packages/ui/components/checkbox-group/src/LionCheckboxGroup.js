import { LitElement } from 'lit';
import { ChoiceGroupMixin, FormGroupMixin } from '@lion/ui/form-core.js';

/**
 * A wrapper around multiple checkboxes
 *
 * @customElement lion-checkbox-group
 */
export class LionCheckboxGroup extends ChoiceGroupMixin(FormGroupMixin(LitElement)) {
  constructor() {
    super();
    this.multipleChoice = true;
  }
}
