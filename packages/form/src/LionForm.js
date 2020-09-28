import { LionFieldset } from '@lion/fieldset';

const throwFormNodeError = () => {
  throw new Error(
    'No form node found. Did you put a <form> element inside your custom-form element?',
  );
};

/**
 * LionForm: form wrapper providing extra features and integration with lion-field elements.
 *
 * @customElement lion-form
 */
// eslint-disable-next-line no-unused-vars
export class LionForm extends LionFieldset {
  constructor() {
    super();
    /** @param {Event} ev */
    this._submit = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      this.submitGroup();
      this.dispatchEvent(new Event('submit', { bubbles: true }));
    };
    /** @param {Event} ev */
    this._reset = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      this.resetGroup();
      this.dispatchEvent(new Event('reset', { bubbles: true }));
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.__registerEventsForLionForm();

    // @override LionFieldset: makes sure a11y is handled by ._formNode
    this.removeAttribute('role');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__teardownEventsForLionForm();
  }

  get _formNode() {
    return /** @type {HTMLFormElement} */ (this.querySelector('form'));
  }

  submit() {
    if (this._formNode) {
      this._formNode.submit();
    } else {
      throwFormNodeError();
    }
  }

  reset() {
    if (this._formNode) {
      this._formNode.reset();
    } else {
      throwFormNodeError();
    }
  }

  __registerEventsForLionForm() {
    this._formNode.addEventListener('submit', this._submit);
    this._formNode.addEventListener('reset', this._reset);
  }

  __teardownEventsForLionForm() {
    this._formNode.removeEventListener('submit', this._submit);
    this._formNode.removeEventListener('reset', this._reset);
  }
}
