import { html, css, LitElement, DisabledMixin } from '@lion/core';
import { FormRegisteringMixin } from '@lion/field';
import { ChoiceInputMixin } from '@lion/choice-input';

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

  constructor() {
    super();
    this.active = false;
    this.__registerEventListeners();
  }

  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);

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

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__unRegisterEventListeners();
  }

  __registerEventListeners() {
    this.__onClick = () => {
      if (!this.disabled) {
        this.checked = true;
      }
    };
    this.__onMouseEnter = () => {
      if (!this.disabled) {
        this.active = true;
      }
    };
    this.__onMouseLeave = () => {
      if (!this.disabled) {
        this.active = false;
      }
    };
    this.addEventListener('click', this.__onClick);
    this.addEventListener('mouseenter', this.__onMouseEnter);
    this.addEventListener('mouseleave', this.__onMouseLeave);
  }

  __unRegisterEventListeners() {
    this.removeEventListener('click', this.__onClick);
    this.removeEventListener('mouseenter', this.__onMouseEnter);
    this.removeEventListener('mouseleave', this.__onMouseLeave);
  }
}
