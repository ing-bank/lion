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

    // @override LionFieldset: makes sure a11y is handled by ._formNode
    this.removeAttribute('role');
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.__teardownEventsForLionForm();
  }

  get _formNode() {
    return this.querySelector('form');
  }

  submit() {
    this._formNode.submit();
  }

  reset() {
    this._formNode.reset();
  }

  __registerEventsForLionForm() {
    this._submit = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      this.submitGroup();
      this.dispatchEvent(new Event('submit', { bubbles: true }));
    };
    this._formNode.addEventListener('submit', this._submit);

    this._reset = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      this.resetGroup();
      this.dispatchEvent(new Event('reset', { bubbles: true }));
    };
    this._formNode.addEventListener('reset', this._reset);
  }

  __teardownEventsForLionForm() {
    this._formNode.removeEventListener('submit', this._submit);
    this._formNode.removeEventListener('rest', this._reset);
  }
}
