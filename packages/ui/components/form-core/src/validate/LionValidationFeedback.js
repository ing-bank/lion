import { html, LitElement } from 'lit';

/**
 * @typedef {import('./Validator.js').Validator} Validator
 * @typedef {Object} messageMap
 * @property {string | Node} message
 * @property {string} type
 * @property {Validator} [validator]
 */

/**
 * @desc Takes care of accessible rendering of error messages
 * Should be used in conjunction with FormControl having ValidateMixin applied
 */
export class LionValidationFeedback extends LitElement {
  static get properties() {
    return {
      feedbackData: { attribute: false },
    };
  }

  /**
   * @overridable
   * @param {Object} opts
   * @param {string | Node | TemplateResult } opts.message message or feedback node or TemplateResult
   * @param {string} [opts.type]
   * @param {Validator} [opts.validator]
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _messageTemplate({ message }) {
    return message;
  }

  /**
   * @param {PropertyValues} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (this.feedbackData && this.feedbackData[0]) {
      this.setAttribute('type', this.feedbackData[0].type);
      this.currentType = this.feedbackData[0].type;
      window.clearTimeout(this.removeMessage);
      // TODO: this logic should be in ValidateMixin, so that [show-feedback-for] is in sync,
      // plus duration should be configurable
      if (this.currentType === 'success') {
        this.removeMessage = window.setTimeout(() => {
          this.removeAttribute('type');
          /** @type {messageMap[]} */
          this.feedbackData = [];
        }, 3000);
      }
    } else if (this.currentType !== 'success') {
      this.removeAttribute('type');
    }
  }

  render() {
    return html`
      ${this.feedbackData &&
      this.feedbackData.map(
        ({ message, type, validator }) => html`
          ${this._messageTemplate({ message, type, validator })}
        `,
      )}
    `;
  }
}
