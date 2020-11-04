import { ChoiceInputMixin, FormRegisteringMixin } from '@lion/form-core';
import { css, DisabledMixin, html, LitElement } from '@lion/core';

/**
 * @typedef {import('@lion/form-core/types/choice-group/ChoiceGroupMixinTypes').ChoiceGroupHost } ChoiceGroupHost
 * @typedef {import('../types/LionOption').LionOptionHost } LionOptionHost
 */

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
 * Can be a child of datalist/select, or role="listbox"
 *
 * Element gets state supplied externally, reflects this to attributes,
 * enabling SubClassers to style based on those states
 */
// @ts-expect-error
export class LionOption extends DisabledMixin(ChoiceInputMixin(FormRegisteringMixin(LitElement))) {
  static get properties() {
    return {
      active: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          background-color: white;
          padding: 4px;
          cursor: default;
        }

        :host([hidden]) {
          display: none;
        }

        :host(:hover) {
          background-color: #eee;
        }
        :host([active]) {
          background-color: #ddd;
        }

        :host([checked]) {
          background-color: #bde4ff;
        }

        :host([disabled]) {
          color: #adadad;
        }
      `,
    ];
  }

  /**
   * @override We want to start with a clean slate, so we omit slots inherited from FormControl
   */
  // eslint-disable-next-line class-methods-use-this
  get slots() {
    return {};
  }

  constructor() {
    super();
    this.active = false;
    this.__onClick = this.__onClick.bind(this);
    this.__registerEventListeners();
  }

  /**
   * @param {string} name
   * @param {unknown} oldValue
   */
  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);

    if (name === 'active' && this.active !== oldValue) {
      this.dispatchEvent(new Event('active-changed', { bubbles: true }));
    }
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('checked')) {
      this.setAttribute('aria-selected', `${this.checked}`);
    }

    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', `${this.disabled}`);
    }
  }

  render() {
    return html`
      <div class="choice-field__label">
        <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'option');
  }

  __registerEventListeners() {
    this.addEventListener('click', this.__onClick);
  }

  __unRegisterEventListeners() {
    this.removeEventListener('click', this.__onClick);
  }

  __onClick() {
    if (this.disabled) {
      return;
    }
    const parentForm = /** @type {unknown} */ (this.__parentFormGroup);
    if (parentForm && /** @type {ChoiceGroupHost} */ (parentForm).multipleChoice) {
      this.checked = !this.checked;
    } else {
      this.checked = true;
    }
  }
}
