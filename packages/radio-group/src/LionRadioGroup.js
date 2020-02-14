import { ChoiceGroupMixin } from '@lion/choice-input';
import { LionFieldset } from '@lion/fieldset';

/**
 * A wrapper around multiple radios.
 *
 * @extends {LionFieldset}
 */
export class LionRadioGroup extends ChoiceGroupMixin(LionFieldset) {
  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this._setRole('radiogroup');
  }
}
