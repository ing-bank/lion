import { DelegateMixin } from '@lion/core';
import { LionFieldset } from '@lion/fieldset';

/**
 * LionForm: form wrapper providing extra features and integration with lion-field elements.
 *
 * @customElement
 * @extends LionFieldset
 */
// eslint-disable-next-line no-unused-vars
export class LionForm extends DelegateMixin(LionFieldset) {
  get delegations() {
    return {
      ...super.delegations,
      target: () => this.formElement,
      events: [...super.delegations.events, 'submit', 'reset'],
      methods: [...super.delegations.methods, 'submit', 'reset'],
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('submit', this._submit);
    this.addEventListener('reset', this._reset);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('submit', this._submit);
    this.removeEventListener('reset', this._reset);
  }

  get formElement() {
    return this.querySelector('form');
  }

  /**
   * As we use a native form there is no need for a role
   */
  _setRole() {} // eslint-disable-line class-methods-use-this

  _submit(ev) {
    ev.preventDefault();
    this.submitGroup();
  }

  _reset(ev) {
    ev.preventDefault();
    this.resetGroup();
  }
}
