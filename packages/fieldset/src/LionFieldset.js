import { LitElement } from '@lion/core';
import { FormGroupMixin } from './FormGroupMixin.js';

/**
 * @desc LionFieldset is basically a 'sub form' and can have its own nested sub forms.
 * It mimics the native <fieldset> element in this sense, but has all the functionality of
 * a FormControl (advanced styling, validation, interaction states etc.). Also see
 * FormGroup.
 *
 * LionFieldset enables the '_isFormOrFieldset' flag in FormRegistrarMixin. This makes .formElements
 * act not only as an array, but also as an object (see FormRegistarMixin for more information).
 * As a bonus, It can also group children having names ending with '[]'.
 * This will be both helpful for forms and sub forms, which can contain sub forms as children
 * as well and allow for a nested form structure, where other form groups
 * (choice groups like radio-group, checkbox-group and (multi)select) don't:
 * they should be considered 'end nodes' or 'leaves' of the form.
 *
 * @customElement lion-fieldset
 * @extends {LitElement}
 */
export class LionFieldset extends FormGroupMixin(LitElement) {
  constructor() {
    super();
    /** @override from FormRegistrarMixin */
    this._isFormOrFieldset = true;
  }

  /**
   * @desc Returns all serialized values for formElements.
   * By default, disabled and Unparseable values are filtered out.
   * @example
   * // When we submit a form
   * formOrFieldset.serializeGroup();
   * // When we want to 'capture' a full serialized form, so that an interrupted
   * // session can be stored at a later time. This could either be sent to a server
   * // or saved in localStorage.
   * formOrFieldset.serializeGroup({ omitDisabled: false, omitUnparseable: false });
   *
   * @param {object} [filterOptions] allows to disable default filters
   * @param {boolean} [filterOptions.omitDisabled=true] when submitting a final result to a
   * server, disabled values are usually left out.
   * @returns {object} serialized values, following .formElements structure
   */
  serializeGroup({ omitDisabled = true } = {}) {
    const filterCondition = el => !(omitDisabled && el.disabled);
    return this._getFromAllFormElements('serializedValue', filterCondition);
  }
}
