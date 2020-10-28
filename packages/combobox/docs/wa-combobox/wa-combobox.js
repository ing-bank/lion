import { html, css } from '@lion/core';
import { renderLitAsNode } from '@lion/helpers';
import { LionOption } from '@lion/listbox';
import { LionCombobox } from '../../src/LionCombobox.js';

class WaOption extends LionOption {
  static get properties() {
    return {
      title: String,
      text: String,
      time: String,
      image: String,
      isUserText: { attribute: 'is-user-text', reflect: true, type: Boolean },
      isUserTextRead: { attribute: 'is-user-text-read', reflect: true, type: Boolean },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --background-default: white;
          --background-default-active: gray;
          --secondary: #777;
          --secondary-lighter: #aaa;
          --chatlist-icon: #aaa;
          background-color: var(--background-default);
          cursor: pointer;
          color: rgb(74, 74, 74);
          padding: 0;
          transition: max-height 0.4s ease, opacity 0.3s ease;
          max-height: 500px;
        }

        :host([checked]) {
          background-color: #eee;
        }

        :host(:hover) {
          background-color: #f6f6f6;
        }

        .wa-option {
          position: relative;
          display: flex;
          flex-direction: row;
          height: 72px;
          pointer-events: all;
        }

        .wa-option__image {
          display: flex;
          flex: none;
          align-items: center;
          margin-top: -1px;
          padding: 0 15px 0 13px;
        }

        .wa-option__image-inner {
          position: relative;
          overflow: hidden;
          background-color: var(--avatar-background);
          border-radius: 50%;
          height: 49px;
          width: 49px;
        }

        .wa-option__image-inner img,
        .wa-option__image-inner svg {
          width: 100%;
          height: 100%;
        }

        .wa-option__image-inner-inner {
          position: absolute;
          top: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .wa-option__content {
          display: flex;
          flex-basis: auto;
          flex-direction: column;
          flex-grow: 1;
          justify-content: center;
          min-width: 0;
          border-bottom: 1px solid #eee;
          padding-right: 15px;
        }

        .wa-option__content-row1 {
          display: flex;
          align-items: center;
          line-height: normal;
          text-align: left;
        }

        .wa-option__content-row1-title {
          display: flex;
          flex-grow: 1;
          overflow: hidden;
          color: var(--primary-strong);
          font-weight: 400;
          font-size: 17px;
          line-height: 21px;
        }

        .wa-option__content-row1-time {
          line-height: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 6px;
          margin-top: 3px;

          flex: none;
          max-width: 100%;
          color: var(--secondary-lighter);
          font-size: 12px;
          line-height: 20px;
        }

        .wa-option__content-row2 {
          display: flex;
          align-items: center;
          min-height: 20px;
          color: var(--secondary);
          font-size: 13px;
          line-height: 20px;
          margin-top: 2px;
          /* color: var(--secondary-stronger); */
        }

        .wa-option__content-row2-text {
          flex-grow: 1;
          overflow: hidden;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .wa-option__content-row2-text-inner {
          display: flex;
          align-items: flex-start;
        }

        .wa-option__content-row2-text-inner-icon {
          display: none;
          flex: none;
          color: var(--chatlist-icon);
          vertical-align: top;
          margin-right: 2px;
        }

        :host([is-user-text]) .wa-option__content-row2-text-inner-icon {
          display: inline-block;
        }

        :host([is-user-text-read]) .wa-option__content-row2-text-inner-icon {
          color: lightblue;
        }
        .wa-selected {
          color: #009688;
        }
      `,
    ];
  }

  render() {
    return html`<div class="wa-option">
      <div class="wa-option__image">
        <div class="wa-option__image-inner">
          <img src="${this.image}" alt="" draggable="false" style="visibility: visible;" />
          ${this.image
            ? ''
            : html`<div class="wa-option__image-inner-inner">
                <span data-testid="default-user" data-icon="default-user" class="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 212 212"
                    width="212"
                    height="212"
                  >
                    <path
                      fill="#DFE5E7"
                      class="background"
                      d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"
                    ></path>
                    <path
                      fill="#FFF"
                      class="primary"
                      d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"
                    ></path>
                  </svg>
                </span>
              </div>`}
        </div>
      </div>
      <div class="wa-option__content">
        <div class="wa-option__content-row1">
          <div class="wa-option__content-row1-title">
            <span>
              <span dir="auto" title="${this.title}"> ${this.title} </span>
              <div></div>
            </span>
          </div>
          <div class="wa-option__content-row1-time">${this.time}</div>
        </div>
        <div class="wa-option__content-row2">
          <div class="wa-option__content-row2-text">
            <span class="wa-option__content-row2-text-inner" title="‪${this.text}‬">
              <div class="wa-option__content-row2-text-inner-icon">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 18 18"
                    width="18"
                    height="18"
                  >
                    <path
                      fill="currentColor"
                      d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"
                    ></path>
                  </svg>
                </span>
              </div>
              <span dir="ltr">${this.text}</span></span
            >
          </div>
          <div class="wa-option__content-row2-menu"><span></span><span></span><span></span></div>
        </div>
      </div>
    </div>`;
  }

  /**
   * @configure LionCombobox
   * @param {string} matchingString
   */
  onFilterMatch(matchingString) {
    this.__originalTitle = this.title;
    this.__originalText = this.text;
    const newTitle = this.__originalTitle.replace(
      new RegExp(`(${matchingString})`, 'i'),
      `<b class="wa-selected">$1</b>`,
    );
    const newText = this.__originalText.replace(
      new RegExp(`(${matchingString})`, 'i'),
      `<b class="wa-selected">$1</b>`,
    );

    const helperNode = document.createElement('div');
    // For Safari, we need to add a label to the element
    helperNode.innerHTML = `<span aria-label="${this.title}">${newTitle}</span>`;
    [this.title] = helperNode.children;
    helperNode.innerHTML = `<span aria-label="${this.text}">${newText}</span>`;
    [this.text] = helperNode.children;
    // Show animation
    this.style.cssText = `
    max-height: 500px;
    opacity: 1;
    `;
  }

  /**
   * @configure LionCombobox
   * @param {string} [curValue]
   * @param {string} [prevValue]
   */
  // eslint-disable-next-line no-unused-vars
  onFilterUnmatch() {
    if (this.__originalTitle) {
      this.title = this.__originalTitle;
    }
    if (this.__originalText) {
      this.text = this.__originalText;
    }
    this.style.cssText = `
    max-height: 0;
    opacity: 0;
    `;
  }
}
customElements.define('wa-option', WaOption);

class WaCombobox extends LionCombobox {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          font-family: SF Pro Text, SF Pro Icons, system, -apple-system, system-ui,
            BlinkMacSystemFont, Helvetica Neue, Helvetica, Lucida Grande, Kohinoor Devanagari,
            sans-serif;
        }

        .input-group__container {
          display: flex;
          border-bottom: none;
        }

        * > ::slotted([role='listbox']) {
          max-height: none;
        }

        * > ::slotted([slot='input']) {
          font-size: 14px;
        }

        .input-group {
          padding: 15px;
          background: #f6f6f6;
        }

        .input-group__prefix {
          margin-right: 20px;
          color: #999;
          display: flex;
        }

        .input-group__container {
          border-radius: 18px;
          background: white;
          padding: 7px;
          padding-left: 16px;
        }

        /** Undo Popper */
        #overlay-content-node-wrapper {
          position: static !important;
          width: auto !important;
          transform: none !important;

          /* height: 300px;
          overflow: scroll; */
        }
      `,
    ];
  }

  get slots() {
    return {
      ...super.slots,
      prefix: () =>
        renderLitAsNode(
          html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"
            ></path>
          </svg>`,
        ),
    };
  }

  constructor() {
    super();

    /** @configure OverlayMixin */
    this.opened = true;
    /** @configure LionCombobox */
    this.showAllOnEmpty = true;
    /** @configure LionCombobox */
    this.rotateKeyboardNavigation = false;
    /** @configure LionCombobox */
    this.autocomplete = 'list';
  }

  /**
   * @override LionCombobox - also match option.text
   * @param {LionOption} option
   * @param {string} textboxValue current ._inputNode value
   */
  matchCondition(option, textboxValue) {
    let idx = -1;
    if (typeof option.choiceValue === 'string' && typeof textboxValue === 'string') {
      idx = option.choiceValue.toLowerCase().indexOf(textboxValue.toLowerCase());
      // enhance LionCombobox: also match option.text
      const text = option.__originalText || option.text;
      if (idx === -1 && typeof text === 'string') {
        idx = text.toLowerCase().indexOf(textboxValue.toLowerCase());
      }
    }

    if (this.matchMode === 'all') {
      return idx > -1; // matches part of word
    }
    return idx === 0; // matches beginning of value
  }

  /**
   * @override LionCombobox - always sync textbox when selected value changes
   */
  // eslint-disable-next-line no-unused-vars
  _syncToTextboxCondition() {
    return true;
  }
}
customElements.define('wa-combobox', WaCombobox);
