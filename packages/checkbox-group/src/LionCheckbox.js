import { LionInput } from '@lion/input';
import { ChoiceInputMixin } from '@lion/form-core';

export class LionCheckbox extends ChoiceInputMixin(LionInput) {
  connectedCallback() {
    super.connectedCallback();
    this.type = 'checkbox';
  }
}
