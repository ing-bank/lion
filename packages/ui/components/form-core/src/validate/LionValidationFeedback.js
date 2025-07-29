import { css, html, LitElement, nothing } from 'lit';
import { LocalizeMixin } from '@lion/ui/localize-no-side-effects.js';
import { localizeNamespaceLoader } from '../localizeNamespaceLoader.js';

/**
 * @typedef {import('./Validator.js').Validator} Validator
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {import('../../types/validate/ValidateMixinTypes.js').FeedbackMessage} FeedbackMessage
 */

/**
 * @param {string} string
 */
const capitalize = string => `${string[0].toUpperCase()}${string.slice(1)}`;

/**
 * @desc Takes care of accessible rendering of error messages
 * Should be used in conjunction with FormControl having ValidateMixin applied
 */
export class LionValidationFeedback extends LocalizeMixin(LitElement) {
  static get properties() {
    return {
      feedbackData: { attribute: false },
    };
  }

  static localizeNamespaces = [
    { 'lion-form-core': localizeNamespaceLoader },
    ...super.localizeNamespaces,
  ];

  static get styles() {
    return [
      css`
        .validation-feedback__type {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(100%);
          clip: rect(1px, 1px, 1px, 1px);
          white-space: nowrap;
          border: 0;
          margin: 0;
          padding: 0;
        }
      `,
    ];
  }

  constructor() {
    super();
    /**
     * @type {FeedbackMessage[] | undefined}
     */
    this.feedbackData = undefined;
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
   * @param {import('lit').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (this.feedbackData && this.feedbackData[0]) {
      this.setAttribute('type', this.feedbackData[0].type);
      this.currentType = this.feedbackData[0].type;
    } else if (this.currentType !== 'success') {
      this.removeAttribute('type');
    }
  }

  render() {
    return html`
      ${this.feedbackData &&
      this.feedbackData.map(
        ({ message, type, validator }) => html`
          <div class="validation-feedback__type">
            ${message && type
              ? this._localizeManager.msg(`lion-form-core:validation${capitalize(type)}`)
              : nothing}
          </div>
          ${this._messageTemplate({ message, type, validator })}
        `,
      )}
    `;
  }
}
