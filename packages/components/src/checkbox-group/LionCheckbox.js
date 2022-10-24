import { LionInput } from '@lion/components/input.js';
import { ChoiceInputMixin } from '@lion/components/form-core.js';

export class LionCheckbox extends ChoiceInputMixin(LionInput) {
  connectedCallback() {
    super.connectedCallback();
    this.type = 'checkbox';
  }
}
