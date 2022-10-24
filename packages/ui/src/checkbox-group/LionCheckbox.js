import { LionInput } from '@lion/ui/input.js';
import { ChoiceInputMixin } from '@lion/ui/form-core.js';

export class LionCheckbox extends ChoiceInputMixin(LionInput) {
  connectedCallback() {
    super.connectedCallback();
    this.type = 'checkbox';
  }
}
