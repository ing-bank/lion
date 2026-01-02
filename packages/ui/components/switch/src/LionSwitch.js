import { css, html } from 'lit';
import { ChoiceInputMixin, LionField } from '@lion/ui/form-core.js';
import { ScopedElementsMixin } from '../../core/src/ScopedElementsMixin.js';
import { LionSwitchButton } from './LionSwitchButton.js';

/**
 * @customElement lion-switch
 */
export class LionSwitch extends ScopedElementsMixin(ChoiceInputMixin(LionField)) {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host([hidden]) {
          display: none;
        }

        :host([disabled]) {
          color: #adadad;
        }
      `,
    ];
  }

  static get scopedElements() {
    return {
      ...super.scopedElements,
      'lion-switch-button': LionSwitchButton,
    };
  }

  /**
   * Input node here is the lion-switch-button, which is not compatible with LionField _inputNode --> HTMLInputElement
   * Therefore we do a full override and typecast to an intersection type that includes LionSwitchButton
   * @type {LionSwitchButton}
   * @protected
   */
  // @ts-ignore [editor]: prevents vscode from complaining
  get _inputNode() {
    return /** @type {LionSwitchButton} */ (
      Array.from(this.children).find(el => el.slot === 'input')
    );
  }

  get slots() {
    return {
      ...super.slots,
      input: () => {
        const btnEl = this.createScopedElement('lion-switch-button');
        btnEl.setAttribute('data-tag-name', 'lion-switch-button');
        return btnEl;
      },
    };
  }

  /**
   * Restore original render function from FormControlMixin.js
   * As it gets overwritten in ChoiceInputMixin
   */
  render() {
    return html`
      <div class="form-field__group-one">${this._groupOneTemplate()}</div>
      <div class="form-field__group-two">${this._groupTwoTemplate()}</div>
    `;
  }

  /** @protected */
  _groupOneTemplate() {
    return html`${this._labelTemplate()} ${this._helpTextTemplate()} ${this._feedbackTemplate()}`;
  }

  /** @protected */
  _groupTwoTemplate() {
    return html`${this._inputGroupTemplate()}`;
  }

  constructor() {
    super();
    this.checked = false;
    this.__isInternalSync = false;
    this.__isSyncingToButton = false;
    this.__listenerAttached = false;
    /** @private */
    this.__handleButtonSwitchCheckedChanged = this.__handleButtonSwitchCheckedChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.__listenerAttached) {
      this.removeEventListener('checked-changed', this.__handleButtonSwitchCheckedChanged, true);
      this.__listenerAttached = false;
    }
  }

  /**
   * @param {string} [name]
   * @param {unknown} [oldValue]
   * @param {import('lit').PropertyDeclaration} [options]
   * @returns {void}
   */
  requestUpdate(name, oldValue, options) {
    super.requestUpdate(name, oldValue, options);

    if (
      name === 'checked' &&
      this.checked !== oldValue &&
      this._inputNode &&
      this._inputNode.checked !== this.checked
    ) {
      this.__isSyncingToButton = true;
      this._inputNode.checked = this.checked;
      this.__isSyncingToButton = false;

      if (!this.__isInternalSync && this.isConnected) {
        this.__dispatchCheckedChangedEvent(false);
      }
      return;
    }

    if (
      name === 'disabled' &&
      this.disabled !== oldValue &&
      this._inputNode &&
      this._inputNode.disabled !== this.disabled
    ) {
      this._inputNode.disabled = this.disabled;
    }

    if (
      name === 'checked' &&
      this.checked !== oldValue &&
      !this.__isInternalSync &&
      this.isConnected
    ) {
      this.__dispatchCheckedChangedEvent(false);
    }
  }

  /** @param {import('lit').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (!this.__listenerAttached && this._inputNode) {
      // Listen in capture phase to intercept event before user listeners
      this.addEventListener('checked-changed', this.__handleButtonSwitchCheckedChanged, true);
      this.__listenerAttached = true;

      // Initial sync to button
      this._inputNode.disabled = this.disabled;
      this.__isSyncingToButton = true;
      this._inputNode.checked = this.checked;
      this.__isSyncingToButton = false;
    }
  }

  /**
   * Override this function from ChoiceInputMixin.
   * @param {Event} ev
   * @protected
   */
  _toggleChecked(ev) {
    // Just toggle - event will be handled by __handleButtonSwitchCheckedChanged
    super._toggleChecked(ev);
  }

  /**
   * Override this function from ChoiceInputMixin.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _isEmpty() {
    return false;
  }

  /**
   * Dispatches a checked-changed event with redispatched flag
   * @param {boolean} bubbles - Whether the event should bubble
   * @private
   */
  __dispatchCheckedChangedEvent(bubbles) {
    this.dispatchEvent(
      new CustomEvent('checked-changed', {
        detail: {
          redispatched: true,
        },
        bubbles,
      }),
    );
  }

  /**
   * @private
   * @param {Event | CustomEvent} ev
   */
  __handleButtonSwitchCheckedChanged(ev) {
    // Ignore events we redispatched ourselves
    // CustomEvent has detail, regular Event from button doesn't
    if (ev instanceof CustomEvent && ev.detail?.redispatched) {
      return;
    }

    if (this.__isSyncingToButton) {
      ev.stopPropagation();
      return;
    }

    ev.stopPropagation();

    // Sync state from button to switch if needed
    if (this.checked !== this._inputNode.checked) {
      this.__isInternalSync = true;
      this.checked = this._inputNode.checked;
      // modelValue is synchronized by ChoiceInputMixin in requestUpdate
      this.__isInternalSync = false;
    }

    // Re-dispatch event with bubbles: true for user interactions
    this.__dispatchCheckedChangedEvent(true);
  }

  /**
   * @configure FormControlMixin
   * @protected
   */
  _onLabelClick(ev) {
    if (this.disabled) {
      return;
    }
    // Prevent default label behavior (automatic click redispatch to 'for' element)
    // since we're manually toggling the custom element
    ev.preventDefault();

    this._inputNode.focus();
    // Toggle the switch when label is clicked
    this._inputNode.click();
  }
}
