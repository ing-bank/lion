import { css, html, LitElement } from 'lit';
import { ChoiceInputMixin, FormRegisteringMixin } from '@lion/ui/form-core.js';
import { DisabledMixin, SlotMixin } from '@lion/ui/core.js';

/**
 * @typedef {import('lit').TemplateResult } TemplateResult
 * @typedef {import('../../form-core/types/choice-group/ChoiceGroupMixinTypes.js').ChoiceGroupHost } ChoiceGroupHost
 * @typedef {import('../types/LionOption.js').LionOptionHost } LionOptionHost
 */

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
 * Can be a child of datalist/select, or role="listbox"
 *
 * Element gets state supplied externally, reflects this to attributes,
 * enabling SubClassers to style based on those states
 */
export class LionOption extends DisabledMixin(
  ChoiceInputMixin(FormRegisteringMixin(SlotMixin(LitElement))),
) {
  /** @type {any} */
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
    /** @private */
    this.__onClick = this.__onClick.bind(this);
    /** @private */
    this.__registerEventListeners();
  }

  /**
   * @param {string} [name]
   * @param {unknown} [oldValue]
   * @param {import('lit').PropertyDeclaration} [options]
   * @returns {void}
   */
  requestUpdate(name, oldValue, options) {
    super.requestUpdate(name, oldValue, options);

    if (name === 'active' && this.active !== oldValue) {
      this.dispatchEvent(new Event('active-changed', { bubbles: true }));
    }
  }

  /**
   * @param {import('lit').PropertyValues } changedProperties
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

  /**
   *
   * @returns {TemplateResult}
   */
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

  /** @private */
  __registerEventListeners() {
    this.addEventListener('click', this.__onClick);
  }

  /** @private */
  __unRegisterEventListeners() {
    this.removeEventListener('click', this.__onClick);
  }

  /** @private */
  __onClick() {
    if (this.disabled) {
      return;
    }
    const parentForm = /** @type {unknown} */ (this._parentFormGroup);
    this._isHandlingUserInput = true;
    if (parentForm && /** @type {ChoiceGroupHost} */ (parentForm).multipleChoice) {
      this.checked = !this.checked;
      this.active = !this.active;
    } else {
      this.checked = true;
      this.active = true;
    }
    this._isHandlingUserInput = false;
  }
}
