import { Validator } from '../Validator.js';

/**
 * @typedef {import('../../../types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 */

export class Required extends Validator {
  static get validatorName() {
    return 'Required';
  }

  static get _compatibleRoles() {
    return [
      'combobox',
      'gridcell',
      'input',
      'listbox',
      'radiogroup',
      'select',
      'spinbutton',
      'textarea',
      'textbox',
      'tree',
    ];
  }

  static get _compatibleTags() {
    return ['input', 'select', 'textarea'];
  }

  /**
   * We don't have an execute function, since the Required validator is 'special'.
   * The outcome depends on the modelValue of the FormControl and
   * FormControl.__isEmpty / FormControl._isEmpty.
   */

  /**
   * @param {FormControlHost & HTMLElement} formControl
   */
  // eslint-disable-next-line class-methods-use-this
  onFormControlConnect(formControl) {
    if (formControl._inputNode) {
      const role = formControl._inputNode.getAttribute('role') || '';
      const elementTagName = formControl._inputNode.tagName.toLowerCase();
      const ctor = /** @type {typeof Required} */ (this.constructor);
      if (ctor._compatibleRoles.includes(role) || ctor._compatibleTags.includes(elementTagName)) {
        formControl._inputNode.setAttribute('aria-required', 'true');
      }
    }
  }

  /**
   * @param {FormControlHost & HTMLElement} formControl
   */
  // eslint-disable-next-line class-methods-use-this
  onFormControlDisconnect(formControl) {
    if (formControl._inputNode) {
      formControl._inputNode.removeAttribute('aria-required');
    }
  }
}
