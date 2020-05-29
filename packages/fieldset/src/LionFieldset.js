import { LitElement } from '@lion/core';
import { FormGroupMixin } from '@lion/form-core';

/**
 * @desc LionFieldset is basically a 'sub form' and can have its own nested sub forms.
 * It mimics the native <fieldset> element in this sense, but has all the functionality of
 * a FormControl (advanced styling, validation, interaction states etc.) Also see
 * FormGroupMixin it depends on.
 *
 * LionFieldset enables the '_isFormOrFieldset' flag in FormRegistrarMixin. This makes .formElements
 * act not only as an array, but also as an object (see FormRegistarMixin for more information).
 * As a bonus, It can also group children having names ending with '[]'.
 *
 * Above will be  helpful for both forms and sub forms, which can contain sub forms as children
 * as well and allow for a nested form structure.
 * Contrary, other form groups (choice groups like radio-group, checkbox-group and (multi)select)
 * don't: they should be considered 'end nodes' or 'leaves' of the form and their children/formElements
 * cannot be accessed individually via object keys.
 *
 * @customElement lion-fieldset
 * @extends {LitElement}
 */
export class LionFieldset extends FormGroupMixin(LitElement) {
  constructor() {
    super();
    /** @override from FormRegistrarMixin */
    this._isFormOrFieldset = true;
    this._repropagationRole = 'fieldset'; // configures FormControlMixin
  }
}
