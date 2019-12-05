import { LionFieldset } from '@lion/fieldset';

/**
 * LionForm: form wrapper providing extra features and integration with lion-field elements.
 *
 * @customElement lion-form
 * @extends {LionFieldset}
 */
// eslint-disable-next-line no-unused-vars
export class LionForm extends LionFieldset {
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.__registerEventsForLionForm();
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.__teardownEventsForLionForm();
  }

  get formElement() {
    return this.querySelector('form');
  }

  submit() {
    this.formElement.submit();
  }

  reset() {
    this.formElement.reset();
  }

  /**
   * As we use a native form there is no need for a role
   */
  _setRole() {} // eslint-disable-line class-methods-use-this

  __registerEventsForLionForm() {
    this._submit = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      this.submitGroup();
      this.dispatchEvent(new Event('submit', { bubbles: true }));
    };
    this.formElement.addEventListener('submit', this._submit);

    this._reset = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      this.resetGroup();
      this.dispatchEvent(new Event('reset', { bubbles: true }));
    };
    this.formElement.addEventListener('reset', this._reset);
  }

  __teardownEventsForLionForm() {
    this.formElement.removeEventListener('submit', this._submit);
    this.formElement.removeEventListener('rest', this._reset);
  }
}
