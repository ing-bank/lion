import autosize from 'autosize/src/autosize.js';
import { LionInput } from '@lion/input';
import { css } from '@lion/core';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';

/* eslint-disable no-underscore-dangle */

/**
 * LionTextarea: extension of lion-field with native input element in place and user friendly API
 *
 * @customElement
 * @extends LionInput
 */
export class LionTextarea extends ObserverMixin(LionInput) {
  // eslint-disable-line no-unused-vars
  static get properties() {
    return {
      ...super.properties,
      maxRows: {
        type: Number,
        attribute: 'max-rows',
      },
    };
  }

  get delegations() {
    return {
      ...super.delegations,
      target: () => this.inputElement,
      properties: [...super.delegations.properties, 'rows'],
      attributes: [...super.delegations.attributes, 'rows'],
    };
  }

  static get asyncObservers() {
    return {
      ...super.asyncObservers,
      resizeTextarea: ['maxRows', 'modelValue'],
      setTextareaMaxHeight: ['maxRows', 'rows'],
    };
  }

  get slots() {
    return {
      ...super.slots,
      input: () => document.createElement('textarea'),
    };
  }

  constructor() {
    super();
    this.rows = 2;
    this.maxRows = 6;
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.setTextareaMaxHeight();
    autosize(this.inputElement);
  }

  disconnectedCallback() {
    autosize.destroy(this.inputElement);
  }

  /**
   * To support maxRows we need to set max-height of the textarea
   */
  setTextareaMaxHeight() {
    const cs = window.getComputedStyle(this.inputElement, null);
    const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.height) / this.rows;
    const paddingOffset = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const borderOffset = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const offset = cs.boxSizing === 'border-box' ? paddingOffset + borderOffset : 0;

    this.inputElement.style.maxHeight = `${lineHeight * this.maxRows + offset}px`;
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

  resizeTextarea() {
    autosize.update(this.inputElement);
  }
}
