/* eslint-disable max-classes-per-file */
// @ts-expect-error https://github.com/jackmoore/autosize/pull/384 wait for this, then we can switch to just 'autosize'; and then types will work!
import autosize from 'autosize/src/autosize.js';
import { LionField } from '@lion/form-core';
import { css } from '@lion/core';
import { NativeTextFieldMixin } from '@lion/form-core/src/NativeTextFieldMixin';

class LionFieldWithTextArea extends LionField {
  /**
   * @returns {HTMLTextAreaElement}
   */
  get _inputNode() {
    return /** @type {HTMLTextAreaElement} */ (Array.from(this.children).find(
      el => el.slot === 'input',
    ));
  }
}

/**
 * LionTextarea: extension of lion-field with native input element in place and user friendly API
 *
 * @customElement lion-textarea
 */
// @ts-expect-error false positive, parent properties get merged by lit-element already
export class LionTextarea extends NativeTextFieldMixin(LionFieldWithTextArea) {
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
      placeholder: {
        type: String,
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
    this.placeholder = '';
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.__initializeAutoresize();
    this.__intersectionObserver = new IntersectionObserver(() => this.resizeTextarea());
    this.__intersectionObserver.observe(this);
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('name')) {
      this._inputNode.name = this.name;
    }

    if (changedProperties.has('autocomplete')) {
      this._inputNode.autocomplete = /** @type {string} */ (this.autocomplete);
    }

    if (changedProperties.has('disabled')) {
      this._inputNode.disabled = this.disabled;
      this.validate();
    }

    if (changedProperties.has('rows')) {
      const native = this._inputNode;
      if (native) {
        native.rows = this.rows;
      }
    }

    if (changedProperties.has('readOnly')) {
      const native = this._inputNode;
      if (native) {
        native.readOnly = this.readOnly;
      }
    }

    if (changedProperties.has('placeholder')) {
      const native = this._inputNode;
      if (native) {
        native.placeholder = this.placeholder;
      }
    }

    if (changedProperties.has('modelValue')) {
      this.resizeTextarea();
    }

    if (changedProperties.has('maxRows') || changedProperties.has('rows')) {
      this.setTextareaMaxHeight();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    autosize.destroy(this._inputNode);
  }

  /**
   * To support maxRows we need to set max-height of the textarea
   */
  setTextareaMaxHeight() {
    const { value } = this._inputNode;
    this._inputNode.value = '';
    this.resizeTextarea();

    const cs = window.getComputedStyle(this._inputNode, null);
    const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.height) / this.rows;
    const paddingOffset = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const borderOffset = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const offset = cs.boxSizing === 'border-box' ? paddingOffset + borderOffset : 0;

    this._inputNode.style.maxHeight = `${lineHeight * this.maxRows + offset}px`;

    this._inputNode.value = value;
    this.resizeTextarea();
  }

  static get styles() {
    return [
      super.styles,
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
    autosize.update(this._inputNode);
  }

  __initializeAutoresize() {
    // @ts-ignore this property is added by webcomponentsjs polyfill for old browsers
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
    // @ts-ignore this property is added by webcomponentsjs polyfill for old browsers
    while (count !== 0 && !this.__shady_native_contains(this._inputNode)) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve));
      count -= 1;
    }
  }

  __startAutoresize() {
    autosize(this._inputNode);
    this.setTextareaMaxHeight();
  }
}
