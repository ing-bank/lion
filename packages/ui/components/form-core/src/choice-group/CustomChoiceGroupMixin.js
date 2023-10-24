import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { ChoiceGroupMixin } from './ChoiceGroupMixin.js';

/**
 * @typedef {import('../../types/choice-group/CustomChoiceGroupMixinTypes.js').CustomChoiceGroupMixin} CustomChoiceGroupMixin
 * @typedef {import('../../types/choice-group/CustomChoiceGroupMixinTypes.js').CustomChoiceGroupHost} CustomChoiceGroupHost
 */

/**
 * @param {any|any[]} value
 * @returns {any[]}
 */
function normalizeArray(value) {
  return Array.isArray(value) ? value : [value];
}

/**
 * Extends the ChoiceGroupMixin to add optional support for custom user choices without altering the initial choice list.
 *
 * @type {CustomChoiceGroupMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
const CustomChoiceGroupMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class CustomChoiceGroupMixin extends ChoiceGroupMixin(superclass) {
    static get properties() {
      return {
        allowCustomChoice: {
          type: Boolean,
          attribute: 'allow-custom-choice',
        },
        modelValue: { type: Object },
      };
    }

    // @ts-ignore
    get modelValue() {
      return this.__getChoicesFrom(super.modelValue);
    }

    set modelValue(value) {
      super.modelValue = value;

      if (value === null || value === undefined || value === '') {
        // @ts-ignore
        this._customChoices = new Set();
      } else if (this.allowCustomChoice) {
        const old = this.modelValue;
        // @ts-ignore
        this._customChoices = new Set(normalizeArray(value));
        this.requestUpdate('modelValue', old);
      }
    }

    // @ts-ignore
    get formattedValue() {
      return this.__getChoicesFrom(super.formattedValue);
    }

    set formattedValue(value) {
      super.formattedValue = value;

      if (value === null || value === undefined) {
        this._customChoices = new Set();
      } else if (this.allowCustomChoice) {
        const old = this.modelValue;
        // Convert formattedValue to modelValue to store as custom choices, or fall back to the input value
        this._customChoices = new Set(
          normalizeArray(value).map(
            val => this.formElements.find(el => el.formattedValue === val)?.modelValue || val,
          ),
        );
        this.requestUpdate('modelValue', old);
      }
    }

    // @ts-ignore
    get serializedValue() {
      return this.__getChoicesFrom(super.serializedValue);
    }

    set serializedValue(value) {
      super.serializedValue = value;

      if (value === null || value === undefined) {
        this._customChoices = new Set();
      } else if (this.allowCustomChoice) {
        const old = this.modelValue;
        // Convert serializedValue to modelValue to store as custom choices, or fall back to the input value
        this._customChoices = new Set(
          normalizeArray(value).map(
            val => this.formElements.find(el => el.serializedValue === val)?.modelValue || val,
          ),
        );
        this.requestUpdate('modelValue', old);
      }
    }

    /**
     * Custom elements are all missing elements that have no corresponding element, independent if enabled or not.
     */
    // @ts-ignore
    get customChoices() {
      if (!this.allowCustomChoice) {
        return [];
      }

      const elems = this._getCheckedElements();

      return Array.from(this._customChoices).filter(
        choice => !elems.some(elem => elem.choiceValue === choice),
      );
    }

    constructor() {
      super();

      this.allowCustomChoice = false;

      /**
       * @type {Set<unknown>}
       * @protected
       */
      this._customChoices = new Set();

      /**
       * @private
       */
      this.__initialized = false;
    }

    /**
     * @private
     */
    // @ts-ignore
    __getChoicesFrom(input) {
      const values = input;
      if (!this.allowCustomChoice) {
        return values;
      }

      if (this.multipleChoice) {
        return [...normalizeArray(values), ...this.customChoices];
      }

      if (values === '') {
        return this._customChoices.values().next().value || '';
      }

      return values;
    }

    /** @param {import('lit').PropertyValues} changedProperties */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (
        changedProperties.has('modelValue') &&
        JSON.stringify(this.modelValue) !== JSON.stringify(changedProperties.get('modelValue'))
      ) {
        if (!this.__initialized) {
          this.__initialized = true;
          return;
        }

        /** @event model-value-changed */
        this.dispatchEvent(
          /** @privateEvent model-value-changed: FormControl redispatches it as public event */
          new CustomEvent('model-value-changed', {
            bubbles: true,
            detail: {
              formPath: [this],
            },
          }),
        );
      }
    }

    /**
     * @protected
     */
    _isEmpty() {
      return super._isEmpty() && this._customChoices.size === 0;
    }

    clear() {
      this._customChoices = new Set();
      super.clear();
    }
  };

export const CustomChoiceGroupMixin = dedupeMixin(CustomChoiceGroupMixinImplementation);
