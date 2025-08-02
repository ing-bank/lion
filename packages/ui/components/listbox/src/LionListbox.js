import { LitElement } from 'lit';
import { ValidateMixin, InteractionStateMixin, FocusMixin } from '@lion/ui/form-core.js';
import { ListboxMixin } from './ListboxMixin.js';

// TODO: could we extend from LionField?

/**
 * LionListbox: implements the wai-aria listbox design pattern and integrates it as a Lion
 * FormControl
 *
 * @customElement lion-listbox
 */
export class LionListbox extends ListboxMixin(
  FocusMixin(InteractionStateMixin(ValidateMixin(LitElement))),
) {
  /**
   * @configure InteractionStateMixin, ValidateMixin
   */
  get _feedbackConditionMeta() {
    return { ...super._feedbackConditionMeta, focused: this.focused };
  }

  /**
   * @configure FocusMixin
   */
  get _focusableNode() {
    return this._inputNode;
  }
}
