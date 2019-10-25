import autosize from 'autosize/src/autosize.js';
import { LionField } from '@lion/field';
import { css } from '@lion/core';

/**
 * LionTextarea: extension of lion-field with native input element in place and user friendly API
 *
 * @customElement
 * @extends LionInput
 */
export class LionTextarea extends LionField {
  static get properties() {
    return {
      maxRows: {
        type: Number,
        attribute: 'max-rows',
      },
      rows: {
        type: Number,
        reflect: true,
      },
      readOnly: {
        type: Boolean,
        attribute: 'readonly',
        reflect: true,
      },
    };
  }

  get slots() {
    return {
      ...super.slots,
      input: () => {
        const input = document.createElement('textarea');

        // disable user resize behavior if browser supports it
        if (input.style.resize !== undefined) {
          input.style.resize = 'none';
        }

        return input;
      },
    };
  }

  constructor() {
    super();
    this.rows = 2;
    this.maxRows = 6;
    this.readOnly = false;
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.__initializeAutoresize();
  }

  disconnectedCallback() {
    autosize.destroy(this.inputElement);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('rows')) {
      const native = this.inputElement;
      if (native) {
        native.rows = this.rows;
      }
    }

    if (changedProperties.has('readOnly')) {
      const native = this.inputElement;
      if (native) {
        native.readOnly = this.readOnly;
      }
    }

    if (changedProperties.has('modelValue')) {
      this.resizeTextarea();
    }

    if (changedProperties.has('maxRows') || changedProperties.has('rows')) {
      this.setTextareaMaxHeight();
    }
  }

  /**
   * To support maxRows we need to set max-height of the textarea
   */
  setTextareaMaxHeight() {
    const { value } = this.inputElement;
    this.inputElement.value = '';
    this.resizeTextarea();

    const cs = window.getComputedStyle(this.inputElement, null);
    const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.height) / this.rows;
    const paddingOffset = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const borderOffset = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const offset = cs.boxSizing === 'border-box' ? paddingOffset + borderOffset : 0;

    this.inputElement.style.maxHeight = `${lineHeight * this.maxRows + offset}px`;

    this.inputElement.value = value;
    this.resizeTextarea();
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        .input-group__container > .input-group__input ::slotted(.form-control) {
          overflow-x: hidden; /* for FF adds height to the TextArea to reserve place for scroll-bars */
        }
      `,
    ];
  }

  get updateComplete() {
    if (this.__textareaUpdateComplete) {
      return Promise.all([this.__textareaUpdateComplete, super.updateComplete]);
    }
    return super.updateComplete;
  }

  resizeTextarea() {
    autosize.update(this.inputElement);
  }

  __initializeAutoresize() {
    if (this.__shady_native_contains) {
      this.__textareaUpdateComplete = this.__waitForTextareaRenderedInRealDOM().then(() => {
        this.__startAutoresize();
        this.__textareaUpdateComplete = null;
      });
    } else {
      this.__startAutoresize();
    }
  }

  async __waitForTextareaRenderedInRealDOM() {
    let count = 3; // max tasks to wait for
    while (count !== 0 && !this.__shady_native_contains(this.inputElement)) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve));
      count -= 1;
    }
  }

  __startAutoresize() {
    autosize(this.inputElement);
    this.setTextareaMaxHeight();
  }
}
