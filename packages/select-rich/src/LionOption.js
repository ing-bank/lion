import { ChoiceInputMixin, FormRegisteringMixin } from '@lion/form-core';
import { css, DisabledMixin, html, LitElement } from '@lion/core';

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
 * Can be a child of datalist/select, or role="listbox"
 *
 * Element gets state supplied externally, reflects this to attributes,
 * enabling SubClassers to style based on those states
 */
export class LionOption extends DisabledMixin(ChoiceInputMixin(FormRegisteringMixin(LitElement))) {
  static get properties() {
    return {
      active: {
        type: Boolean,
        reflect: true,
      },
      name: {
        type: String,
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
        }

        :host([hidden]) {
          display: none;
        }

        :host([active]),
        :host(:hover) {
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

  constructor() {
    super();
    this.active = false;
    this.__registerEventListeners();
  }

  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);

    if (name === 'active') {
      this.dispatchEvent(new Event('active-changed', { bubbles: true }));
    }
  }

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
    this.__onClick = () => {
      if (!this.disabled) {
        this.checked = true;
      }
    };
    this.addEventListener('click', this.__onClick);
  }

  __unRegisterEventListeners() {
    this.removeEventListener('click', this.__onClick);
  }
}
