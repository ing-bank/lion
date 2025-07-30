import { LionInput } from '@lion/ui/input.js';
import { ChoiceInputMixin } from '@lion/ui/form-core.js';

/**
 * @customElement lion-checkbox
 */
export class LionCheckbox extends ChoiceInputMixin(LionInput) {
  connectedCallback() {
    super.connectedCallback();
    this.type = 'checkbox';
  }
}
