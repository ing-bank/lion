/* eslint-disable class-methods-use-this */

import { dedupeMixin } from '@lion/core';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';
import { calculateValues } from './calculateValues.js';

// For a future breaking release:
// - do not allow the private `.formattedValue` as property that can be set to
// trigger a computation loop.
// - do not fire events for those private and protected concepts
// - simplify _calculateValues: recursive trigger lock can be omitted, since need for connecting
// the loop via sync observers is not needed anymore.
// - consider `formatOn` as an overridable function, by default something like:
// `(!__isHandlingUserInput || !errorState) && !focused`
// This would allow for more advanced scenarios, like formatting an input whenever it becomes valid.
// This would make formattedValue as a concept obsolete, since for maximum flexibility, the
// formattedValue condition needs to be evaluated right before syncing back to the view

/**
 * @desc Designed to be applied on top of a LionField.
 * To understand all concepts within the Mixin, please consult the flow diagram in the
 * documentation.
 *
 * ## Flows
 * FormatMixin supports these two main flows:
 * [1] Application Developer sets `.modelValue`:
 *     Flow: `.modelValue` (formatter) -> `.formattedValue` -> `.inputElement.value`
 *                         (serializer) -> `.serializedValue`
 * [2] End user interacts with field:
 *     Flow: `@user-input-changed` (parser) -> `.modelValue` (formatter) -> `.formattedValue` - (debounce till reflect condition (formatOn) is met) -> `.inputElement.value`
 *                                 (serializer) -> `.serializedValue`
 *
 * For backwards compatibility with the platform, we also support `.value` as an api. In that case
 * the flow will be like [2], without the debounce.
 *
 * ## Difference between value, viewValue and formattedValue
 * A viewValue is a concept rather than a property. To be compatible with the platform api, the
 * property for the concept of viewValue is thus called `.value`.
 * When reading code and docs, one should be aware that the term viewValue is mostly used, but the
 * terms can be used interchangeably.
 * The `.formattedValue` should be seen as the 'scheduled' viewValue. It is computed realtime and
 * stores the output of formatter. It will replace viewValue. once condition `formatOn` is met.
 * Another difference is that formattedValue lives on `LionField`, whereas viewValue is shared
 * across `LionField` and `.inputElement`.
 *
 * For restoring serialized values fetched from a server, we could consider one extra flow:
 * [3] Application Developer sets `.serializedValue`:
 *     Flow: serializedValue (deserializer) -> `.modelValue` (formatter) -> `.formattedValue` -> `.inputElement.value`
 */
export const FormatMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-unused-vars, no-shadow
    class FormatMixin extends ObserverMixin(superclass) {
      static get properties() {
        return {
          value: {
            type: String,
          },

          /**
           * The model value is the result of the parser function(when available).
           * It should be considered as the internal value used for validation and reasoning/logic.
           * The model value is 'ready for consumption' by the outside world (think of a Date
           * object or a float). The modelValue can(and is recommended to) be used as both input
           * value and output value of the `LionField`.
           *
           * Examples:
           * - For a date input: a String '20/01/1999' will be converted to new Date('1999/01/20')
           * - For a number input: a formatted String '1.234,56' will be converted to a Number:
           *   1234.56
           */
          modelValue: {
            type: Object,
          },

          /**
           * The view value is the result of the formatter function (when available).
           * The result will be stored in the native inputElement (usually an input[type=text]).
           *
           * Examples:
           * - For a date input, this would be '20/01/1999' (dependent on locale).
           * - For a number input, this could be '1,234.56' (a String representation of modelValue
           * 1234.56)
           *
           * @private
           */
          formattedValue: {
            type: String,
          },

          /**
           * The serialized version of the model value.
           * This value exists for maximal compatibility with the platform API.
           * The serialized value can be an interface in context where data binding is not
           * supported and a serialized string needs to be set.
           *
           * Examples:
           * - For a date input, this would be the iso format of a date, e.g. '1999-01-20'.
           * - For a number input this would be the String representation of a float ('1234.56'
           *   instead of 1234.56)
           *
           * When no parser is available, the value is usually the same as the formattedValue
           * (being inputElement.value)
           *
           */
          serializedValue: {
            type: String,
          },

          /**
           * Event that will trigger formatting (more precise, visual update of the view, so the
           * user sees the formatted value)
           * Default: 'change'
           */
          formatOn: {
            type: String,
          },

          /**
           * Configuration object that will be available inside the formatter function
           */
          formatOptions: {
            type: Object,
          },

          formatter: {
            type: Function,
          },

          parser: {
            type: Function,
          },

          serializer: {
            type: Function,
          },

          deserializer: {
            type: Function,
          },
        };
      }

      static get syncObservers() {
        return {
          ...super.syncObservers,
          _onModelValueChanged: ['modelValue'],
          _onSerializedValueChanged: ['serializedValue'],
          _onFormattedValueChanged: ['formattedValue'],
        };
      }

      constructor() {
        super();
        this.formatOn = 'blur';
        this.formatOptions = {};

        this.__preventRecursiveTrigger = true;
        /**
         * Converts formattedValue to modelValue
         * For instance, a localized date to a Date Object
         * @param {String} value - formattedValue: the formatted value inside <input>
         * @returns {Object} modelValue
         */
        this.parser = value => value;

        /**
         * Converts modelValue to formattedValue (formattedValue will be synced with
         * `.inputElement.value`)
         * For instance, a Date object to a localized date.
         * @param {Object} value - modelValue: can be an Object, Number, String depending on the
         * input type(date, number, email etc)
         * @returns {String} formattedValue
         */
        this.formatter = value => value;

        /**
         * Converts `.modelValue` to `.serializedValue`
         * For instance, a Date object to an iso formatted date string
         * @param {Object} value - modelValue: can be an Object, Number, String depending on the
         * input type(date, number, email etc)
         * @returns {String} serializedValue
         */
        this.serializer = value => value;

        /**
         * Converts `LionField.value` to `.modelValue`
         * For instance, an iso formatted date string to a Date object
         * @param {Object} value - modelValue: can be an Object, Number, String depending on the
         * input type(date, number, email etc)
         * @returns {Object} modelValue
         */
        this.deserializer = value => value;

        /**
         * @type {string}
         */
        this.value = '';
        /**
         * @type {string|number|object}
         */
        this.modelValue = '';
        /**
         * @type {string}
         */
        this.formattedValue = '';
        /**
         * @type {string}
         */
        this.serializedValue = '';

        this.__preventRecursiveTrigger = false;
      }

      _requestUpdate(name, oldValue) {
        super._requestUpdate(name, oldValue);

        const calculcateOn = [
          'modelValue',
          'serializedValue',
          'formattedValue',
          'value',
          'formatter',
          'parser',
          'serializer',
          'deserializer',
        ];

        if (calculcateOn.includes(name)) {
          this._calculateValues(
            {
              modelValue: this.modelValue,
              formattedValue: this.formattedValue,
              serializedValue: this.serializedValue,
            },
            name,
          );
        }
      }

      /**
       * @param {Object} allValues - The value to updated
       * @param {string} source - Who requested the update can be ['formattedValue', 'modelValue', 'serializedValue', 'value']
       */
      _calculateValues(allValues, source) {
        if (this.__preventRecursiveTrigger) return; // prevent infinite loops
        this.__preventRecursiveTrigger = true;

        const newValues = calculateValues(allValues, source, {
          formatter: {
            exec: this.formatter,
            options: this.formatOptions,
            disabled: this.errorState,
          },
          parser: { exec: this.parser, options: this.formatOptions },
          deserializer: { exec: this.deserializer },
          serializer: { exec: this.serializer },
        });
        Object.assign(this, newValues);

        // imparatively setting a value will always be reflected to end user
        if (
          source === 'modelValue' ||
          source === 'serializedValue' ||
          source === 'formattedValue'
        ) {
          this.value = this.formattedValue !== undefined ? this.formattedValue : '';
        }

        this.__preventRecursiveTrigger = false;
      }

      /** Observer Handlers */
      _onModelValueChanged(...args) {
        this._dispatchModelValueChangedEvent(...args);
      }

      /**
       * This is wrapped in a distinct method, so that parents can control when the changed event
       * is fired. For objects, a deep comparison might be needed.
       */
      _dispatchModelValueChangedEvent() {
        /** @event model-value-changed */
        this.dispatchEvent(
          new CustomEvent('model-value-changed', { bubbles: true, composed: true }),
        );
      }

      _onFormattedValueChanged() {
        /** @deprecated */
        this.dispatchEvent(
          new CustomEvent('formatted-value-changed', {
            bubbles: true,
            composed: true,
          }),
        );
      }

      _onSerializedValueChanged() {
        /** @deprecated */
        this.dispatchEvent(
          new CustomEvent('serialized-value-changed', {
            bubbles: true,
            composed: true,
          }),
        );
      }

      /**
       * Synchronization from `.inputElement.value` to `LionField` (flow [2])
       */
      _syncValueUpwards() {
        // Downwards syncing should only happen for `LionField`.value changes from 'above'
        // This triggers _onModelValueChanged and connects user input to the
        // parsing/formatting/serializing loop
        if (this.inputElement) {
          this.value = this.inputElement.value;
          // this._calculateValues(this.inputElement.value, 'value');
        }
      }

      /**
       * Synchronization from `LionField.value` to `.inputElement.value`
       * - flow [1] will always be reflected back
       * - flow [2] will not be reflected back when this flow was triggered via
       *   `@user-input-changed` (this will happen later, when `formatOn` condition is met)
       */
      _reflectBackFormattedValueToUser() {
        if (!this.__isHandlingUserInput && this.inputElement) {
          // Text 'undefined' should not end up in <input>
          this.inputElement.value =
            typeof this.formattedValue !== 'undefined' ? this.formattedValue : '';
        }
      }

      // This can be called whenever the view value should be updated. Dependent on component type
      // ("input" for <input> or "change" for <select>(mainly for IE)) a different event should be
      // used  as source for the "user-input-changed" event (which can be seen as an abstraction
      // layer on top of other events (input, change, whatever))
      _proxyInputEvent() {
        this.dispatchEvent(
          new CustomEvent('user-input-changed', {
            bubbles: true,
            composed: true,
          }),
        );
      }

      _onUserInputChanged() {
        // Upwards syncing. Most properties are delegated right away, value is synced to
        // `LionField`, to be able to act on (imperatively set) value changes
        this.__isHandlingUserInput = true;
        this._syncValueUpwards();
        this.__isHandlingUserInput = false;
      }

      connectedCallback() {
        super.connectedCallback();

        this.addEventListener('user-input-changed', this._onUserInputChanged);
        // Connect the value found in <input> to the formatting/parsing/serializing loop as a
        // fallback mechanism. Assume the user uses the value property of the
        // `LionField`(recommended api) as the api (this is a downwards sync).
        // However, when no value is specified on `LionField`, have support for sync of the real
        // input to the `LionField` (upwards sync).

        // if (typeof this.value === 'undefined') {
        //   this._syncValueUpwards();
        // }

        if (this.inputElement) {
          this.inputElement.addEventListener(this.formatOn, () => {
            // Text 'undefined' should not end up in <input>
            this.value = this.formattedValue !== undefined ? this.formattedValue : '';
          });
          this.inputElement.addEventListener('input', this._proxyInputEvent);
        }
      }

      updated(changedProps) {
        super.updated(changedProps);
        if (changedProps.has('value')) {
          this.inputElement.value = this.value;
        }
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('user-input-changed', this._onUserInputChanged);
        if (this.inputElement) {
          this.inputElement.removeEventListener('input', this._proxyInputEvent);
          this.inputElement.removeEventListener(
            this.formatOn,
            this._reflectBackFormattedValueDebounced,
          );
        }
      }
    },
);
