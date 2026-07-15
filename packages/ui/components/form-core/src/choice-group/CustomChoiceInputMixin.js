import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { html } from 'lit';
import { ChoiceInputMixin } from './ChoiceInputMixin.js';
import { LionInput } from '../../../input/src/LionInput.js';

/**
 * @typedef {import('../FormControlMixin.js').HTMLElementWithValue} HTMLElementWithValue
 */

/**
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
const CustomChoiceInputMixinImplementation = superclass =>
  class CustomChoiceInputMixin extends ChoiceInputMixin(superclass) {
    /** @type {(mutationHandler: (mutation: MutationRecord) => void) => MutationObserver} */
    static createMutationObserver = mutationHandler =>
      new MutationObserver(mutations => {
        const mutation = mutations.find(
          ({ type, attributeName }) => type === 'attributes' && attributeName === 'data-checked',
        );

        if (mutation) {
          mutationHandler(mutation);
        }
      });

    get slots() {
      return {
        ...super.slots,
        'user-input': () => {
          const native = document.createElement('input');
          native.setAttribute('value', this.choiceValue);

          return native;
        },
      };
    }

    connectedCallback() {
      super.connectedCallback();

      this.shadowRoot?.addEventListener('slotchange', e => {
        if (/** @type {{ target: HTMLSlotElement | null }} */ (e).target?.name === 'user-input') {
          this.__syncChoiceValueToUserValue();
          this._listenToUserInput();
          if (this._userInputSlotNode) {
            /** @type {HTMLElement} */ (this._userInputSlotNode).dataset.checked =
              this.checked.toString();
          }
        }
      });
    }

    /**
     * @override
     */
    // eslint-disable-next-line class-methods-use-this
    _afterLabel() {
      return html`<slot name="user-input"></slot>`;
    }

    /**
     * @param {string} [name]
     * @param {unknown} [oldValue]
     * @param {import('lit').PropertyDeclaration} [options]
     * @returns {void}
     */
    requestUpdate(name, oldValue, options) {
      super.requestUpdate(name, oldValue, options);

      if (name === 'checked') {
        if (this.checked) {
          this._focusToUserInput();
        }
        if (this._userInputSlotNode) {
          /** @type {HTMLElement} */ (this._userInputSlotNode).dataset.checked =
            this.checked.toString();
        }
      }
    }

    get _userInputNode() {
      if (this.__userInputNode === null) {
        this._updateUserInput();
      }

      return this.__userInputNode;
    }

    _updateUserInput() {
      const slot = this._userInputSlotNode;
      if (!slot) {
        this.__userInputType = null;
        this.__userInputNode = null;
        return;
      }

      const nodeIterator = document.createNodeIterator(slot, NodeFilter.SHOW_ELEMENT);

      let currentNode = null;
      while (currentNode === null) {
        currentNode = nodeIterator.nextNode();
        if (currentNode instanceof LionInput) {
          this.__userInputType = 'lioninput';
          this.__userInputNode = currentNode;
          return;
        }
      }

      if (slot?.tagName === 'INPUT') {
        this.__userInputType = 'native';
        this.__userInputNode = /** @type {HTMLInputElement} */ (slot);
        return;
      }

      const inputInsideSlot = slot?.querySelector('input');
      if (inputInsideSlot) {
        this.__userInputType = 'native';
      }

      this.__userInputNode = inputInsideSlot;
    }

    _getUserValue() {
      if (this.__userInputType === 'lioninput') {
        return /** @type { LionInput } */ (this._userInputNode).modelValue;
      }

      if (this.__userInputType === 'native') {
        return /** @type { HTMLElementWithValue } */ (this._userInputNode).value;
      }

      return undefined;
    }

    _listenToUserInput() {
      this._listenToUserValue();
      this._listenToUserInputFocus();
    }

    _listenToUserValue() {
      this._userInputNode?.addEventListener('input', this.__syncUserValueToChoiceValue.bind(this));
    }

    _listenToUserInputFocus() {
      this._userInputNode?.addEventListener('focus', () => {
        this.checked = true;
      });
    }

    _focusToUserInput() {
      this._userInputNode?.focus();
    }

    get _userInputSlotNode() {
      return /** @type {HTMLSlotElement | null} */ (
        this.shadowRoot?.querySelector('slot[name="user-input"]')
      )?.assignedElements()?.[0];
    }

    __syncUserValueToChoiceValue() {
      const userValue = this._getUserValue();

      if (userValue !== undefined) {
        this._isHandlingUserInput = true;
        this.choiceValue = userValue;
        this._isHandlingUserInput = false;
      }
    }

    __syncChoiceValueToUserValue() {
      if (this.__userInputType === null) {
        this._updateUserInput();
      }
      if (this.__userInputType === 'lioninput') {
        // @ts-ignore -- because the _userInputNode is guaranteed to be LionInput when __userInputType is lioninput
        this._userInputNode.modelValue = this.choiceValue;
      } else if (this.__userInputType === 'native') {
        // @ts-ignore -- because the _userInputNode is guaranteed to be input when __userInputType is native
        this._userInputNode.setAttribute('value', this.choiceValue);
      }
    }

    /** @type {'native' | 'lioninput' | null} */
    __userInputType = null;

    /** @type { HTMLElementWithValue | HTMLInputElement | HTMLTextAreaElement | LionInput | null } */
    __userInputNode = null;
  };

export const CustomChoiceInputMixin = dedupeMixin(CustomChoiceInputMixinImplementation);
