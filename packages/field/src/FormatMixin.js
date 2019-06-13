/* eslint-disable class-methods-use-this */

import { dedupeMixin } from '@lion/core';
import { EventMixin } from '@lion/core/src/EventMixin.js';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';
import { Unparseable } from '@lion/validate';

// TODO:
// - clearly document relation between `.value`, `.formattedValue` and `view value` and simplify
// where possible.
// - investigate if `_dispatchModelValueChanged` also can be solved by using 'hasChanged' on
// property accessor inside choiceInputs

// For a future breaking release:
// - do not allow `.formattedValue` and `.serializedValue` as properties that can be set to
// trigger a computation loop. They are protected and private concepts respectively.
// - do not fire events for those private and protected concepts
// - simplify _calculateValues: recursive trigger lock can be omitted, since need for connecting
// the loop via sync observers is not needed anymore.
// - consider `formatOn` as an overridable function, by default something like:
// `(!__isHandlingUserInput || !errorState) && !focused`
// This would allow for more advanced scenarios, like formatting an input whenever it becomes valid.
// Possibly, it's wise here to make a distinction between 2 scenarios:
// 'reflectBackFormattedValueCondition' and 'computeFormattedValueCondition',
// We need to find the best balance between backwards compatibility, DX and seperation of concerns.

/**
 * @desc Designed to be applied on top of a LionField.
 * To understand all concepts within the Mixin, please consult the flow diagram in the
 * documentation.
 *
 * ## Flows
 * FormatMixin supports these two main flows:
 * [1] Application Developer sets `.modelValue`:
 *     Flow: `.modelValue` -> `.formattedValue` -> `.inputElement.value`
 *                        -> `.serializedValue`
 * [2] End user interacts with field:
 *     Flow: `@user-input-changed` -> `.modelValue` -> `.formattedValue` - (debounce till reflect condition (formatOn) is met) -> `.inputElement.value`
 *                                -> `.serializedValue`
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
 * @mixinFunction
 */
export const FormatMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-unused-vars, no-shadow
    class FormatMixin extends EventMixin(ObserverMixin(superclass)) {
      static get properties() {
        return {
          ...super.properties,

          /**
           * The model value is the result of the parser function(when available).
           * It should be considered as the internal value used for validation and reasoning/logic.
           * The model value is 'ready for consumption' by the outside world (think of a Date
           * object or a float). The modelValue can(and is recommended to) be used as both input
           * value and output value of the <lion-field>.
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
           * @protected
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

      /**
       * Converts formattedValue to modelValue
       * For instance, a localized date to a Date Object
       * @param {String} value - formattedValue: the formatted value inside <input>
       * @returns {Object} modelValue
       */
      parser(v) {
        return v;
      }

      /**
       * Converts modelValue to formattedValue (formattedValue will be synced with
       * `.inputElement.value`)
       * For instance, a Date object to a localized date.
       * @param {Object} value - modelValue: can be an Object, Number, String depending on the
       * input type(date, number, email etc)
       * @returns {String} formattedValue
       */
      formatter(v) {
        return v;
      }

      /**
       * Converts `.modelValue` to `.serializedValue`
       * For instance, a Date object to an iso formatted date string
       * @param {Object} value - modelValue: can be an Object, Number, String depending on the
       * input type(date, number, email etc)
       * @returns {String} serializedValue
       */
      serializer(v) {
        return v;
      }

      /**
       * Converts `LionField.value` to `.modelValue`
       * For instance, an iso formatted date string to a Date object
       * @param {Object} value - modelValue: can be an Object, Number, String depending on the
       * input type(date, number, email etc)
       * @returns {Object} modelValue
       */
      deserializer(v) {
        return v;
      }

      /**
       * Responsible for storing all representations(modelValue, serializedValue, formattedValue
       * and value) of the input value. Prevents infinite loops, so all value observers can be
       * treated like they will only be called once, without indirectly calling other observers.
       * (in fact, some are called twice, but the __preventRecursiveTrigger lock prevents the
       * second call from having effect).
       *
       * @param {string} source - the type of value that triggered this method. It should not be
       * set again, so that its observer won't be triggered. Can be:
       * 'model'|'formatted'|'serialized'.
       */
      _calculateValues({ source } = {}) {
        if (this.__preventRecursiveTrigger) return; // prevent infinite loops

        this.__preventRecursiveTrigger = true;
        if (source !== 'model') {
          if (source === 'serialized') {
            this.modelValue = this.deserializer(this.serializedValue);
          } else if (source === 'formatted') {
            this.modelValue = this.__callParser();
          }
        }
        if (source !== 'formatted') {
          this.formattedValue = this.__callFormatter();
        }
        if (source !== 'serialized') {
          this.serializedValue = this.serializer(this.modelValue);
        }
        this._reflectBackFormattedValueToUser();
        this.__preventRecursiveTrigger = false;
      }

      __callParser(value = this.formattedValue) {
        if (value === '') {
          // Ideally, modelValue should be undefined for empty strings.
          // For backwards compatibility we return an empty string
          return '';
        }

        if (typeof value !== 'string') {
          // This means there is nothing to find inside the view that can be of
          // interest to the Application Developer or needed to store for future form state
          // retrieval.
          return undefined;
        }

        const result = this.parser(value, this.formatOptions);
        if (!result) {
          // Apparently, the parser was not able to produce a satisfactory output
          // for the desired modelValue type, based on the current viewValue.
          // Unparseable allows to restore all states (for instance from a lost user session),
          // since it saves the current viewValue.
          return new Unparseable(value);
        }
        // Return the successfully parsed viewValue
        return result;
      }

      __callFormatter() {
        if (this.modelValue instanceof Unparseable) {
          return this.modelValue.viewValue;
        }

        // - Why check for this.errorState?
        // We only want to format values that are considered valid. For best UX,
        // we only 'reward' valid inputs.
        // - Why check for __isHandlingUserInput?
        // Downwards sync is prevented whenever we are in a `@user-input-changed` flow.
        // If we are in a 'imperatively set `.modelValue`' flow, we want to reflect back
        // the value, no matter what.
        // This means, whenever we are in errorState, we and modelValue is set
        // imperatively, we DO want to format a value (it is the only way to get meaningful
        // input into `.inputElement` with modelValue as input)

        if (this.__isHandlingUserInput && this.errorState) {
          return this.inputElement ? this.value : undefined;
        }
        return this.formatter(this.modelValue, this.formatOptions);
      }

      /** Observer Handlers */
      _onModelValueChanged(...args) {
        this._calculateValues({ source: 'model' });
        this._dispatchModelValueChangedEvent(...args);
      }

      /**
       * This is wrapped in a distinct method, so that parents can control when the changed event
       * is fired. For instance: when modelValue is an object, a deep comparison is needed first.
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
        this._calculateValues({ source: 'formatted' });
      }

      _onSerializedValueChanged() {
        /** @deprecated */
        this.dispatchEvent(
          new CustomEvent('serialized-value-changed', {
            bubbles: true,
            composed: true,
          }),
        );
        this._calculateValues({ source: 'serialized' });
      }

      /**
       * Synchronization from `.inputElement.value` to `LionField` (flow [2])
       */
      _syncValueUpwards() {
        // Downwards syncing should only happen for <lion-field>.value changes from 'above'
        // This triggers _onModelValueChanged and connects user input to the
        // parsing/formatting/serializing loop
        this.modelValue = this.__callParser(this.value);
      }

      /**
       * Synchronization from `LionField.value` to `.inputElement.value`
       * - flow [1] will always be reflected back
       * - flow [2] will not be reflected back when this flow was triggered via
       *   `@user-input-changed` (this will happen later, when `formatOn` condition is met)
       */
      _reflectBackFormattedValueToUser() {
        // Downwards syncing 'back and forth' prevents change event from being fired in IE.
        // So only sync when the source of new `LionField.value` change was not the 'input' event
        // of inputElement
        if (!this.__isHandlingUserInput) {
          // Text 'undefined' should not end up in <input>
          this.value = typeof this.formattedValue !== 'undefined' ? this.formattedValue : '';
        }
      }

      // This can be called whenever the view value should be updated. Dependent on component type
      // ("input" for <input> or "change" for <select>(mainly for IE)) a different event should be
      // used  as "source" for the "user-input-changed" event (which can be seen as an abstraction
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
        // <lion-field>, to be able to act on (imperatively set) value changes
        this.__isHandlingUserInput = true;
        this._syncValueUpwards();
        this.__isHandlingUserInput = false;
      }

      constructor() {
        super();
        this.formatOn = 'change';
        this.formatOptions = {};
      }

      connectedCallback() {
        super.connectedCallback();
        this._reflectBackFormattedValueToUser = this._reflectBackFormattedValueToUser.bind(this);

        this._reflectBackFormattedValueDebounced = () => {
          // Make sure this is fired after the change event of inputElement, so that formattedValue
          // is guaranteed to be calculated
          setTimeout(this._reflectBackFormattedValueToUser);
        };
        this.inputElement.addEventListener(this.formatOn, this._reflectBackFormattedValueDebounced);
        this.inputElement.addEventListener('input', this._proxyInputEvent);
        this.addEventListener('user-input-changed', this._onUserInputChanged);
        // Connect the value found in <input> to the formatting/parsing/serializing loop as a
        // fallback mechanism. Assume the user uses the value property of the
        // <lion-field>(recommended api) as the api (this is a downwards sync).
        // However, when no value is specified on <lion-field>, have support for sync of the real
        // input to the <lion-field> (upwards sync).
        if (typeof this.modelValue === 'undefined') {
          this._syncValueUpwards();
        }
        this._reflectBackFormattedValueToUser();
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        this.inputElement.removeEventListener('input', this._proxyInputEvent);
        this.removeEventListener('user-input-changed', this._onUserInputChanged);
        this.inputElement.removeEventListener(
          this.formatOn,
          this._reflectBackFormattedValueDebounced,
        );
      }
    },
);
