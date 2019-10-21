import { html, LitElement } from '@lion/core';

/**
 * @desc Takes care of accessible rendering of error messages
 * Should be used in conjunction with FormControl having ValidateMixin applied
 */
export class LionValidationFeedback extends LitElement {
  static get properties() {
    return {
      /**
       * @desc The message that should be displayed to the end user
       * @property {string} message
       */
      message: String,
      /**
       * @desc The type of feedback(e.g, 'error'/'warning') that will be displayed
       * @property {string} type
       */
      type: String,
      /**
       * @desc
       * @property {Validator} validator
       */
      validator: Object,
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-live', 'polite');
  }

  render() {
    return html`${this.message}`;
  }
}

// class LionMultiValidationFeedback extends LionValidationFeedback {
//   static get properties() {
//     return {
//       feedbackData: Array,
//     }
//   }

//   _messageTemplate({ message }) {
//     return html`${message}`;
//   }

//   render() {
//     return html`
//       ${this.feedbackData.map(({ message, type, validator }) => html`
//         ${this._messageTemplate({ message, type, validator })}
//       `)}
//     `;
//   }
// }
