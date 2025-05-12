import { uuid } from '@lion/ui/core.js';
import { LionValidationFeedback } from '@lion/ui/form-core.js';
import { LocalizeMixin } from '@lion/ui/localize.js';
import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { ScopedElementsMixin } from '../../core/src/ScopedElementsMixin.js';
import { localizeNamespaceLoader } from './localizeNamespaceLoader.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {import('../types/input-file.js').InputFile} InputFile
 * @typedef {import('../types/input-file.js').SystemFile} SystemFile
 */

export class LionSelectedFileList extends LocalizeMixin(ScopedElementsMixin(LitElement)) {
  static get scopedElements() {
    return {
      // @ts-expect-error [external] fix types scopedElements
      ...super.scopedElements,
      'lion-validation-feedback': LionValidationFeedback,
    };
  }

  static get properties() {
    return {
      fileList: { type: Array },
      multiple: { type: Boolean },
    };
  }

  static localizeNamespaces = [
    { 'lion-input-file': localizeNamespaceLoader },
    ...super.localizeNamespaces,
  ];

  constructor() {
    super();
    /**
     * @type {InputFile[]}
     */
    this.fileList = [];
    this.multiple = false;
  }

  /**
   * @param {import('lit').PropertyValues} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('fileList')) {
      this._enhanceLightDomA11y();
    }
  }

  _enhanceLightDomA11y() {
    const fileFeedbackElementList = this.shadowRoot?.querySelectorAll('[id^="file-feedback"]');
    // TODO: this will break as soon as a Subclasser changes the template ...
    const inputFileNode = this.parentNode?.parentNode;
    fileFeedbackElementList?.forEach(feedbackEl => {
      // Generic focus/blur handling that works for both Fields/FormGroups
      inputFileNode?.addEventListener('focusin', () => {
        feedbackEl.setAttribute('aria-live', 'polite');
      });
      inputFileNode?.addEventListener('focusout', () => {
        feedbackEl.setAttribute('aria-live', 'assertive');
      });
    });
  }

  /**
   * @protected
   * @param {InputFile} removedFile
   */
  _removeFile(removedFile) {
    this.dispatchEvent(
      new CustomEvent('file-remove-requested', {
        detail: {
          removedFile,
          status: removedFile.status,
          uploadResponse: removedFile.response,
        },
      }),
    );
  }

  /**
   * @protected
   * @param {Array<import('../../form-core/types/validate/ValidateMixinTypes.js').FeedbackMessage>} validationFeedback
   * @param {string} fileUuid
   * @return {TemplateResult}
   */
  // eslint-disable-next-line class-methods-use-this
  _validationFeedbackTemplate(validationFeedback, fileUuid) {
    return html`
      <lion-validation-feedback
        id="file-feedback-${fileUuid}"
        .feedbackData="${validationFeedback}"
        aria-live="assertive"
      ></lion-validation-feedback>
    `;
  }

  /**
   * @protected
   * @param {InputFile} file
   * @return {TemplateResult|nothing}
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  _listItemBeforeTemplate(file) {
    return nothing;
  }

  /**
   * @protected
   * @param {InputFile} file
   * @param {string} fileUuid
   * @return {TemplateResult}
   */
  // eslint-disable-next-line no-unused-vars
  _listItemAfterTemplate(file, fileUuid) {
    return html`
      <button
        class="selected__list__item__remove-button"
        aria-label="${this.msgLit('lion-input-file:removeButtonLabel', {
          fileName: file.systemFile.name,
        })}"
        @click=${() => this._removeFile(file)}
      >
        ${this._removeButtonContentTemplate()}
      </button>
    `;
  }

  /**
   * @protected
   * @return {TemplateResult}
   */
  // eslint-disable-next-line class-methods-use-this
  _removeButtonContentTemplate() {
    return html`✖️`;
  }

  /**
   * @protected
   * @param {InputFile} file
   * @return {TemplateResult}
   */
  _selectedListItemTemplate(file) {
    const fileUuid = uuid();
    return html`
      <div class="selected__list__item" status="${file.status ? file.status.toLowerCase() : ''}">
        <div class="selected__list__item__label">
          ${this._listItemBeforeTemplate(file)}
          <span id="selected-list-item-label-${fileUuid}" class="selected__list__item__label__text">
            <span class="sr-only">${this.msgLit('lion-input-file:fileNameDescriptionLabel')}</span>
            ${file.downloadUrl && file.status !== 'LOADING'
              ? html`
                  <a
                    class="selected__list__item__label__link"
                    href="${file.downloadUrl}"
                    target="${file.downloadUrl.startsWith('blob') ? '_blank' : ''}"
                    rel="${ifDefined(
                      file.downloadUrl.startsWith('blob') ? 'noopener noreferrer' : undefined,
                    )}"
                    >${file.systemFile?.name}</a
                  >
                `
              : file.systemFile?.name}
          </span>
          ${this._listItemAfterTemplate(file, fileUuid)}
        </div>
        ${file.status === 'FAIL' && file.validationFeedback
          ? html`
              ${repeat(
                file.validationFeedback,
                validationFeedback => html`
                  ${this._validationFeedbackTemplate([validationFeedback], fileUuid)}
                `,
              )}
            `
          : nothing}
      </div>
    `;
  }

  render() {
    return this.fileList?.length
      ? html`
          ${this.multiple
            ? html`
                <ul class="selected__list">
                  ${this.fileList.map(
                    file => html` <li>${this._selectedListItemTemplate(file)}</li> `,
                  )}
                </ul>
              `
            : html` ${this._selectedListItemTemplate(this.fileList[0])} `}
        `
      : nothing;
  }

  static get styles() {
    return [
      css`
        .selected__list {
          list-style-type: none;
          margin-block-start: 0;
          margin-block-end: 0;
          padding-inline-start: 0;
        }

        .sr-only {
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
}
