/* eslint-disable lit-a11y/click-events-have-key-events */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { html, nothing } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { SlotMixin, DisabledMixin } from '@lion/ui/core.js';
import { FocusMixin } from './FocusMixin.js';
import { InteractionStateMixin } from './InteractionStateMixin.js';
import { localizeNamespaceLoader } from './localizeNamespaceLoader.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {import('./LionField.js').LionField} LionField
 * @typedef {import('./types/ClearButtonMixinTypes.js').SuffixRef} SuffixRef
 * @typedef {import('./types/ClearButtonMixinTypes.js').TemplateDataForField} TemplateDataForField
 */

/**
 * @typedef {import('./types/ClearButtonMixinTypes.js').ClearButtonMixin} ClearButtonMixin
 * @type {ClearButtonMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
const ClearButtonMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class ClearButtonMixin extends InteractionStateMixin(
    DisabledMixin(FocusMixin(SlotMixin(superclass))),
  ) {
    static localizeNamespaces = [{ 'lion-form-core': localizeNamespaceLoader }];

    refs = {
      suffix: /** @type {SuffixRef} */ (createRef()),
    };

    /**
     * @overridable
     * @type {TemplateDataForField}
     */
    get _templateDataField() {
      const refs = {
        suffix: {
          ref: this.refs.suffix,
          listeners: {
            focus: this._onClearButtonFocus,
            blur: this._onClearButtonBlur,
            click: this._onClearButtonClick,
          },
          labels: {
            clearButtonLabel: this._localizeManager.msg('lion-form-core:clear'),
          },
        },
      };
      return {
        refs,
        data: {
          disabled: this.disabled,
          filled: this.filled,
          focused: this.focused,
        },
      };
    }

    static templates = {
      suffix: (/** @type {TemplateDataForField} */ templateDataForField) => {
        const { refs, data } = templateDataForField;
        // TODO: once spread directive available, use it per ref
        if (!data?.filled) {
          return nothing;
        }
        return html`
          <button
            type="button"
            ${ref(refs?.suffix?.ref)}
            ?disabled="${data?.disabled}"
            aria-label="${refs?.suffix?.labels?.clearButtonLabel}"
            @click="${refs?.suffix?.listeners?.click}"
            @focus="${refs?.suffix?.listeners?.focus}"
            @blur="${refs?.suffix?.listeners?.blur}"
          >
            X
          </button>
        `;
      },
    };

    // @ts-ignore
    get slots() {
      return {
        ...super.slots,
        suffix: () => {
          const ctor = /** @type {typeof LionField} */ (this.constructor);
          const { templates } = ctor;
          return {
            template: templates.suffix(this._templateDataField),
          };
        },
      };
    }

    /**
     * @return {HTMLButtonElement|null|undefined}
     */
    get _clearButtonNode() {
      const clearButtonSlot = this.querySelector('[slot="suffix"]');
      if (clearButtonSlot) {
        // @ts-ignore
        return clearButtonSlot.querySelector('[type="button"]');
      }
      return undefined;
    }

    constructor() {
      super();
      this._localizeManager = getLocalizeManager();
      this._onFocusIn = this._onFocusIn.bind(this);
      this._onFocusOut = this._onFocusOut.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      this.__registerEventsForHoverMixin();
      this.__clearButtonHasFocus = false;
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.__teardownEventsForHoverMixin();
    }

    /**
     * @private
     */
    __registerEventsForHoverMixin() {
      this.addEventListener('mouseenter', this._onMouseEnter);
      this.addEventListener('mouseleave', this._onMouseLeave);
      this._focusableNode.addEventListener('focusin', this._onFocusIn);
      this._focusableNode.addEventListener('focusout', this._onFocusOut);
    }

    /**
     * @private
     */
    __teardownEventsForHoverMixin() {
      this.removeEventListener(
        'mouseenter',
        /** @type {EventListenerOrEventListenerObject} */ (this._onMouseEnter),
      );
      this.removeEventListener(
        'mouseleave',
        /** @type {EventListenerOrEventListenerObject} */ (this._onMouseLeave),
      );
      this._focusableNode.removeEventListener('focusin', this._onFocusIn);
      this._focusableNode.removeEventListener('focusout', this._onFocusOut);
    }

    /**
     * @protected
     */
    _onMouseEnter() {
      this._displayClearButton();
    }

    /**
     * @protected
     */
    _onMouseLeave() {
      if (!(this._focusableNode === document.activeElement || this.__clearButtonHasFocus)) {
        this._hideClearButton();
      }
    }

    /**
     * @protected
     */
    _onFocusIn() {
      this._displayClearButton();
    }

    /**
     * @protected
     */
    _onFocusOut() {
      setTimeout(() => {
        if (!this.__clearButtonHasFocus) {
          this._hideClearButton();
        }
      });
    }

    /**
     * @protected
     */
    _displayClearButton() {
      if (this._clearButtonNode) {
        this._clearButtonNode.style.display = 'block';
      }
    }

    /**
     * @protected
     */
    _hideClearButton() {
      if (this._clearButtonNode) {
        this._clearButtonNode.style.display = 'none';
      }
    }

    /**
     * @param {KeyboardEvent} ev
     * @protected
     */
    _textboxOnKeydown(ev) {
      setTimeout(() => {
        if (ev.key === 'Tab' && !this.__clearButtonHasFocus) {
          this._hideClearButton();
        }
      });
    }

    /**
     * @protected
     */
    _onClearButtonFocus() {
      this.__clearButtonHasFocus = true;
    }

    /**
     * @protected
     */
    _onClearButtonBlur() {
      this.__clearButtonHasFocus = false;
      setTimeout(() => {
        if (this._focusableNode !== document.activeElement) {
          this._hideClearButton();
        }
      });
    }

    /**
     * @protected
     */
    _onClearButtonClick() {
      this._isHandlingUserInput = true;
      this.clear();
      this.__clearButtonHasFocus = false;
      this._focusableNode.focus();
      this._isHandlingUserInput = false;
    }

    /**
     * Clears modelValue.
     * Interaction states are not cleared (use resetInteractionState for this)
     */
    clear() {
      // TODO: [v1] set to undefined
      this.modelValue = '';
      this._inputNode.value = '';
    }
  };

export const ClearButtonMixin = dedupeMixin(ClearButtonMixinImplementation);
