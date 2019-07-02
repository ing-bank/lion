/* eslint-disable class-methods-use-this */

import { dedupeMixin } from '@lion/core';
import { EventMixin } from '@lion/core/src/EventMixin.js';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';
import { Unparseable } from '@lion/validate';

/**
 * @desc Designed to be applied on top of a LionField
 *
 * FormatMixin supports these two main flows:
 * 1) Application Developer sets `.modelValue`:
 *    Flow: `.modelValue` -> `.formattedValue` -> `.inputElement.value`
 *                        -> `.serializedValue`
 * 2) End user interacts with field:
 *    Flow: `@user-input-changed` -> `.modelValue` -> `.formattedValue` - (debounce till reflect condition (formatOn) is met) -> `.inputElement.value`
 *                                -> `.serializedValue`
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
           * The model value is 'ready for consumption' by the outside world (think of a Date object
           * or a float). The modelValue can(and is recommended to) be used as both input value and
           * output value of the <lion-field>
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
       * === Formatting and parsing ====
       * To understand all concepts below, please consult the flow diagrams in the documentation.
       */

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
       * Converts modelValue to formattedValue (formattedValue will be synced with <input>.value)
       * For instance, a Date object to a localized date
       * @param {Object} value - modelValue: can be an Object, Number, String depending on the input
       * type(date, number, email etc)
       * @returns {String} formattedValue
       */
      formatter(v) {
        return v;
      }

      /**
       * Converts modelValue to serializedValue (<lion-field>.value).
       * For instance, a Date object to an iso formatted date string
       * @param {Object} value - modelValue: can be an Object, Number, String depending on the input
       * type(date, number, email etc)
       * @returns {String} serializedValue
       */
      serializer(v) {
        return v;
      }

      /**
       * Converts <lion-field>.value to modelValue
       * For instance, an iso formatted date string to a Date object
       * @param {Object} value - modelValue: can be an Object, Number, String depending on the input
       * type(date, number, email etc)
       * @returns {Object} modelValue
       */
      deserializer(v) {
        return v;
      }

      /**
       * Responsible for storing all representations(modelValue, serializedValue, formattedValue
       * and value) of the input value.
       * Prevents infinite loops, so all value observers can be treated like they will only be
       * called once, without indirectly calling other observers.
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
        // A) check if we need to parse at all

        // A.1) The end user had no intention to parse
        if (value === '') {
          // Ideally, modelValue should be undefined for empty strings.
          // For backwards compatibility we return an empty string:
          // - it triggers validation for required validators (see ValidateMixin.validate())
          // - it can be expected by 3rd parties (for instance unit tests)
          // TODO: In a breaking refactor of the Validation System, this behaviot can be corrected.
          return '';
        }

        // A.2) Handle edge cases We might have no view value yet, for instance because
        // inputElement.value was not available yet
        if (typeof value !== 'string') {
          // This means there is nothing to find inside the view that can be of
          // interest to the Application Developer or needed to store for future form state
          // retrieval.
          return undefined;
        }

        // B) parse the view value

        // - if result:
        // return the successfully parsed viewValue
        // - if no result:
        // Apparently, the parser was not able to produce a satisfactory output for the desired
        // modelValue type, based on the current viewValue. Unparseable allows to restore all
        // states (for instance from a lost user session), since it saves the current viewValue.
        const result = this.parser(value, this.formatOptions);
        return result !== undefined ? result : new Unparseable(value);
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

      // TODO: investigate if this also can be solved by using 'hasChanged' on property accessor
      // inside choiceInputs
      /**
       * This is wrapped in a distinct method, so that parents can control when the changed event is
       * fired. For instance: when modelValue is an object, a deep comparison is needed first
       */
      _dispatchModelValueChangedEvent() {
        this.dispatchEvent(
          new CustomEvent('model-value-changed', { bubbles: true, composed: true }),
        );
      }

      _onFormattedValueChanged() {
        this.dispatchEvent(
          new CustomEvent('formatted-value-changed', {
            bubbles: true,
            composed: true,
          }),
        );
        this._calculateValues({ source: 'formatted' });
      }

      _onSerializedValueChanged() {
        this.dispatchEvent(
          new CustomEvent('serialized-value-changed', {
            bubbles: true,
            composed: true,
          }),
        );
        this._calculateValues({ source: 'serialized' });
      }

      /**
       * Synchronization from <input>.value to <lion-field>.formattedValue
       */
      _syncValueUpwards() {
        // Downwards syncing should only happen for <lion-field>.value changes from 'above'
        // This triggers _onModelValueChanged and connects user input to the
        // parsing/formatting/serializing loop
        this.modelValue = this.__callParser(this.value);
      }

      /**
       * Synchronization from <lion-field>.value to <input>.value
       */
      _reflectBackFormattedValueToUser() {
        // Downwards syncing 'back and forth' prevents change event from being fired in IE.
        // So only sync when the source of new <lion-field>.value change was not the 'input' event
        // of inputElement
        if (!this.__isHandlingUserInput) {
          // Text 'undefined' should not end up in <input>
          this.value = typeof this.formattedValue !== 'undefined' ? this.formattedValue : '';
        }
      }

      // TODO: rename to __dispatchNormalizedInputEvent?
      // This can be called whenever the view value should be updated. Dependent on component type
      // ("input" for <input> or "change" for <select>(mainly for IE)) a different event should be used
      // as "source" for the "user-input-changed" event (which can be seen as an abstraction layer on
      // top of other events (input, change, whatever))
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
