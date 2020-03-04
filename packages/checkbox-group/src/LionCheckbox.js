import { LionInput } from '@lion/input';
import { ChoiceInputMixin } from '@lion/choice-input';

export class LionCheckbox extends ChoiceInputMixin(LionInput) {
  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
    this.type = 'checkbox';
  }
}
