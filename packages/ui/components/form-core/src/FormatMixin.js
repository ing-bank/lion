/* eslint-disable class-methods-use-this */

import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { FormControlMixin } from './FormControlMixin.js';
import { Unparseable } from './validate/Unparseable.js';
import { ValidateMixin } from './validate/ValidateMixin.js';

/**
 * @typedef {import('../types/FormatMixinTypes.js').FormatMixin} FormatMixin
 * @typedef {import('../types/FormatMixinTypes.js').FormatOptions} FormatOptions
 * @typedef {import('../types/FormControlMixinTypes.js').ModelValueEventDetails} ModelValueEventDetails
 */

// For a future breaking release:
// - do not allow the private `.formattedValue` as property that can be set to
// trigger a computation loop.
// - do not fire events for those private and protected concepts
// - simplify _calculateValues: recursive trigger lock can be omitted, since need for connecting
// the loop via sync observers is not needed anymore.
// - consider `formatOn` as an overridable function, by default something like:
// `(!_isHandlingUserInput || !hasError) && !focused`
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
 *     Flow: `.modelValue` (formatter) -> `.formattedValue` -> `._inputNode.value`
 *                         (serializer) -> `.serializedValue`
 * [2] End user interacts with field:
 *     Flow: `@user-input-changed` (parser) -> `.modelValue` (formatter) -> `.formattedValue` - (debounce till reflect condition (formatOn) is met) -> `._inputNode.value`
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
 * across `LionField` and `._inputNode`.
 *
 * For restoring serialized values fetched from a server, we could consider one extra flow:
 * [3] Application Developer sets `.serializedValue`:
 *     Flow: serializedValue (deserializer) -> `.modelValue` (formatter) -> `.formattedValue` -> `._inputNode.value`
 *
 * @type {FormatMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
const FormatMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class FormatMixin extends ValidateMixin(FormControlMixin(superclass)) {
    /** @type {any} */
    static get properties() {
      return {
        formattedValue: { attribute: false },
        serializedValue: { attribute: false },
        formatOptions: { attribute: false },
      };
    }

    /**
     * @param {string} name
     * @param {any} oldVal
     */
    requestUpdate(name, oldVal) {
      super.requestUpdate(name, oldVal);

      if (name === 'modelValue' && this.modelValue !== oldVal) {
        this._onModelValueChanged({ modelValue: this.modelValue }, { modelValue: oldVal });
      }
      if (name === 'serializedValue' && this.serializedValue !== oldVal) {
        this._calculateValues({ source: 'serialized' });
      }
      if (name === 'formattedValue' && this.formattedValue !== oldVal) {
        this._calculateValues({ source: 'formatted' });
      }
    }

    /**
     * The view value. Will be delegated to `._inputNode.value`
     */
    get value() {
      return (this._inputNode && this._inputNode.value) || this.__value || '';
    }

    /** @param {string} value */
    set value(value) {
      // if not yet connected to dom can't change the value
      if (this._inputNode) {
        this._inputNode.value = value;
        /** @type {string | undefined} */
        this.__value = undefined;
      } else {
        this.__value = value;
      }
    }

    /**
     * Preprocessors could be considered 'live formatters'. Their result is shown to the user
     * on keyup instead of after blurring the field. The biggest difference between preprocessors
     * and formatters is their moment of execution: preprocessors are run before modelValue is
     * computed (and work based on view value), whereas formatters are run after the parser (and
     * are based on modelValue)
     * Automatically formats code while typing. It depends on a preprocessro that smartly
     * updates the viewValue and caret position for best UX.
     * @example
     * ```js
     * preprocessor(viewValue) {
     *   // only use digits
     *   return viewValue.replace(/\D/g, '');
     * }
     * @param {string} v - the raw value from the <input> after keyUp/Down event
     * @param {FormatOptions & { prevViewValue: string; currentCaretIndex: number }} opts - the raw value from the <input> after keyUp/Down event
     * @returns {{ viewValue:string; caretIndex:number; }|string|undefined} preprocessedValue: the result of preprocessing for invalid input
     */
    // eslint-disable-next-line no-unused-vars
    preprocessor(v, opts) {
      return undefined;
    }

    /**
     * Converts viewValue to modelValue
     * For instance, a localized date to a Date Object
     * @param {string} v - viewValue: the formatted value inside <input>
     * @param {FormatOptions} opts
     * @returns {*} modelValue
     */
    // eslint-disable-next-line no-unused-vars
    parser(v, opts) {
      return v;
    }

    /**
     * Converts modelValue to formattedValue (formattedValue will be synced with
     * `._inputNode.value`)
     * For instance, a Date object to a localized date.
     * @param {*} v - modelValue: can be an Object, Number, String depending on the
     * input type(date, number, email etc)
     * @param {FormatOptions} opts
     * @returns {string} formattedValue
     */
    // eslint-disable-next-line no-unused-vars
    formatter(v, opts) {
      return v;
    }

    /**
     * Converts `.modelValue` to `.serializedValue`
     * For instance, a Date object to an iso formatted date string
     * @param {?} v - modelValue: can be an Object, Number, String depending on the
     * input type(date, number, email etc)
     * @returns {string} serializedValue
     */
    serializer(v) {
      return v !== undefined ? v : '';
    }

    /**
     * Converts `.serializedValue` to `.modelValue`
     * For instance, an iso formatted date string to a Date object
     * @param {?} v - modelValue: can be an Object, Number, String depending on the
     * input type(date, number, email etc)
     * @returns {?} modelValue
     */
    deserializer(v) {
      return v === undefined ? '' : v;
    }

    /**
     * Responsible for storing all representations(modelValue, serializedValue, formattedValue
     * and value) of the input value. Prevents infinite loops, so all value observers can be
     * treated like they will only be called once, without indirectly calling other observers.
     * (in fact, some are called twice, but the __preventRecursiveTrigger lock prevents the
     * second call from having effect).
     *
     * @param {{source:'model'|'serialized'|'formatted'|null}} config - the type of value that triggered this method. It should not be
     * set again, so that its observer won't be triggered. Can be:
     * 'model'|'formatted'|'serialized'.
     * @protected
     */
    _calculateValues({ source } = { source: null }) {
      if (this.__preventRecursiveTrigger) return; // prevent infinite loops

      /** @type {boolean} */
      this.__preventRecursiveTrigger = true;
      if (source !== 'model') {
        if (source === 'serialized') {
          /** @type {?} */
          this.modelValue = this.deserializer(this.serializedValue);
        } else if (source === 'formatted') {
          this.modelValue = this._callParser();
        }
      }
      if (source !== 'formatted') {
        this.formattedValue = this._callFormatter();
      }
      if (source !== 'serialized') {
        this.serializedValue = this.serializer(this.modelValue);
      }
      this._reflectBackFormattedValueToUser();
      this.__preventRecursiveTrigger = false;
      this.__prevViewValue = this.value;
    }

    /**
     * @param {string|undefined} value
     * @return {?}
     * @private
     */
    _callParser(value = this.formattedValue) {
      // A) check if we need to parse at all

      // A.1) The end user had no intention to parse
      if (value === '') {
        // Ideally, modelValue should be undefined for empty strings.
        // For backwards compatibility we return an empty string:
        // - it can be expected by 3rd parties (for instance unit tests)
        // TODO(@tlouisse): In a breaking refactor of the Validation System, this behavior can be corrected.
        return '';
      }

      // A.2) Handle edge cases. We might have no view value yet, for instance because
      // _inputNode.value was not available yet
      if (typeof value !== 'string') {
        // This means there is nothing to find inside the view that can be of
        // interest to the Application Developer or needed to store for future
        // form state retrieval.
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

    /**
     * @returns {string|undefined}
     * @private
     */
    _callFormatter() {
      // - Why check for this.hasError?
      // We only want to format values that are considered valid. For best UX,
      // we only 'reward' valid inputs.
      // - Why check for _isHandlingUserInput?
      // Downwards sync is prevented whenever we are in an `@user-input-changed` flow, [2].
      // If we are in a 'imperatively set `.modelValue`' flow, [1], we want to reflect back
      // the value, no matter what.
      // This means, whenever we are in hasError and modelValue is set
      // imperatively, we DO want to format a value (it is the only way to get meaningful
      // input into `._inputNode` with modelValue as input)

      if (
        this._isHandlingUserInput &&
        this.hasFeedbackFor?.length &&
        this.hasFeedbackFor.includes('error') &&
        this._inputNode
      ) {
        return this._inputNode ? this.value : undefined;
      }

      if (this.modelValue instanceof Unparseable) {
        // When the modelValue currently is unparseable, we need to sync back the supplied
        // viewValue. In flow [2], this should not be needed.
        // In flow [1] (we restore a previously stored modelValue) we should sync down, however.
        return this.modelValue.viewValue;
      }

      return this.formatter(this.modelValue, this.formatOptions);
    }

    /**
     * Responds to modelValue changes in the synchronous cycle (most subclassers should listen to
     * the asynchronous cycle ('modelValue' in the .updated lifecycle))
     * @param {{ modelValue: unknown; }[]} args
     * @protected
     */
    _onModelValueChanged(...args) {
      this._calculateValues({ source: 'model' });
      this._dispatchModelValueChangedEvent(...args);
    }

    /**
     * This is wrapped in a distinct method, so that parents can control when the changed event
     * is fired. For objects, a deep comparison might be needed.
     * @param {{ modelValue: unknown; }[]} args
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _dispatchModelValueChangedEvent(...args) {
      /** @event model-value-changed */
      this.dispatchEvent(
        /** @privateEvent model-value-changed: FormControl redispatches it as public event */
        new CustomEvent('model-value-changed', {
          bubbles: true,
          detail: /** @type { ModelValueEventDetails } */ (
            /** @type {unknown} */ ({
              formPath: [this],
              isTriggeredByUser: Boolean(this._isHandlingUserInput),
            })
          ),
        }),
      );
    }

    /**
     * Synchronization from `._inputNode.value` to `LionField` (flow [2])
     * Downwards syncing should only happen for `LionField`.value changes from 'above'.
     * This triggers _onModelValueChanged and connects user input
     * to the parsing/formatting/serializing loop.
     * @protected
     */
    _syncValueUpwards() {
      if (!this.__isHandlingComposition) {
        this.__handlePreprocessor();
      }
      const prevFormatted = this.formattedValue;
      this.modelValue = this._callParser(this.value);

      // Sometimes, the formattedValue didn't change, but the viewValue did...
      // We need this check to support pasting values that need to be formatted right on paste
      if (prevFormatted === this.formattedValue && this.__prevViewValue !== this.value) {
        this._calculateValues();
      }
    }

    /**
     * Handle view value and caretIndex, depending on return type of .preprocessor.
     * @private
     */
    __handlePreprocessor() {
      const unprocessedValue = this.value;
      let currentCaretIndex = this.value.length;
      // Be gentle with Safari
      if (
        this._inputNode &&
        'selectionStart' in this._inputNode &&
        /** @type {HTMLInputElement} */ (this._inputNode)?.type !== 'range'
      ) {
        currentCaretIndex = /** @type {number} */ (this._inputNode.selectionStart);
      }
      const preprocessedValue = this.preprocessor(this.value, {
        ...this.formatOptions,
        currentCaretIndex,
        prevViewValue: this.__prevViewValue,
      });

      this.__prevViewValue = unprocessedValue;
      if (preprocessedValue === undefined) {
        // Make sure we do no set back original value, so we preserve
        // caret index (== selectionStart/selectionEnd)
        return;
      }
      if (typeof preprocessedValue === 'string') {
        this.value = preprocessedValue;
      } else if (typeof preprocessedValue === 'object') {
        const { viewValue, caretIndex } = preprocessedValue;
        this.value = viewValue;
        if (caretIndex && this._inputNode && 'selectionStart' in this._inputNode) {
          this._inputNode.selectionStart = caretIndex;
          this._inputNode.selectionEnd = caretIndex;
        }
      }
    }

    /**
     * Synchronization from `LionField.value` to `._inputNode.value`
     * - flow [1] will always be reflected back
     * - flow [2] will not be reflected back when this flow was triggered via
     *   `@user-input-changed` (this will happen later, when `formatOn` condition is met)
     * @protected
     */
    _reflectBackFormattedValueToUser() {
      if (this._reflectBackOn()) {
        // Text 'undefined' should not end up in <input>
        this.value = typeof this.formattedValue !== 'undefined' ? this.formattedValue : '';
      }
    }

    /**
     * Every time .formattedValue is attempted to sync to the view value (on change/blur and on
     * modelValue change), this condition is checked. When enhancing it, it's recommended to
     * call via `return this._myExtraCondition && super._reflectBackOn()`
     * @overridable
     * @return {boolean}
     * @protected
     */
    _reflectBackOn() {
      return !this._isHandlingUserInput;
    }

    /**
     * This can be called whenever the view value should be updated. Dependent on component type
     * ("input" for <input> or "change" for <select>(mainly for IE)) a different event should be
     * used  as source for the "user-input-changed" event (which can be seen as an abstraction
     * layer on top of other events (input, change, whatever))
     * @protected
     */
    _proxyInputEvent() {
      // TODO: [v1] remove composed (and bubbles as well if possible)
      /** @protectedEvent user-input-changed meant for usage by Subclassers only */
      this.dispatchEvent(new Event('user-input-changed', { bubbles: true }));
    }

    /** @protected */
    _onUserInputChanged() {
      // Upwards syncing. Most properties are delegated right away, value is synced to
      // `LionField`, to be able to act on (imperatively set) value changes
      this._isHandlingUserInput = true;
      this._syncValueUpwards();
      this._isHandlingUserInput = false;
    }

    /**
     * @param {Event} event
     */
    __onCompositionEvent({ type }) {
      if (type === 'compositionstart') {
        this.__isHandlingComposition = true;
      } else if (type === 'compositionend') {
        this.__isHandlingComposition = false;
        // in all other cases this would be triggered via user-input-changed
        this._syncValueUpwards();
      }
    }

    constructor() {
      super();

      // TODO: [v1] delete; use 'change' event directly within this file
      /**
       * Event that will trigger formatting (more precise, visual update of the view, so the
       * user sees the formatted value)
       * Default: 'change'
       * @deprecated use _reflectBackOn()
       * @protected
       */
      this.formatOn = 'change';

      /**
       * Configuration object that will be available inside the formatter function
       */
      this.formatOptions = /** @type {FormatOptions} */ ({});

      /**
       * The view value is the result of the formatter function (when available).
       * The result will be stored in the native _inputNode (usually an input[type=text]).
       *
       * Examples:
       * - For a date input, this would be '20/01/1999' (dependent on locale).
       * - For a number input, this could be '1,234.56' (a String representation of modelValue
       * 1234.56)
       * @type {string|undefined}
       * @readOnly
       */
      this.formattedValue = undefined;

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
       * (being _inputNode.value)
       * @type {string|undefined}
       */
      this.serializedValue = undefined;

      /**
       * Whether the user is pasting content. Allows Subclassers to do this in their subclass:
       * @example
       * ```js
       * _reflectBackOn() {
       *   return super._reflectBackOn() || this._isPasting;
       * }
       * ```
       * @protected
       * @type {boolean}
       */
      this._isPasting = false;

      /**
       * Flag that will be set when user interaction takes place (for instance after an 'input'
       * event). Will be added as meta info to the `model-value-changed` event. Depending on
       * whether a user is interacting, formatting logic will be handled differently.
       * @protected
       * @type {boolean}
       */
      this._isHandlingUserInput = false;
      /**
       * @private
       * @type {string}
       */
      this.__prevViewValue = '';
      this.__onCompositionEvent = this.__onCompositionEvent.bind(this);
      // This computes formattedValue
      this.addEventListener('user-input-changed', this._onUserInputChanged);
      // This sets the formatted viewValue after paste
      this.addEventListener('paste', this.__onPaste);

      /**
       * @protected
       */
      this._reflectBackFormattedValueToUser = this._reflectBackFormattedValueToUser.bind(this);

      /**
       * @private
       */
      this._reflectBackFormattedValueDebounced = () => {
        // Make sure this is fired after the change event of _inputNode, so that formattedValue
        // is guaranteed to be calculated
        setTimeout(this._reflectBackFormattedValueToUser);
      };
    }

    /**
     * @private
     */
    __onPaste() {
      this._isPasting = true;
      this.formatOptions.mode = 'pasted';
      setTimeout(() => {
        this._isPasting = false;
        this.formatOptions.mode = 'auto';
      });
    }

    connectedCallback() {
      super.connectedCallback();

      // Connect the value found in <input> to the formatting/parsing/serializing loop as a
      // fallback mechanism. Assume the user uses the value property of the
      // `LionField`(recommended api) as the api (this is a downwards sync).
      // However, when no value is specified on `LionField`, have support for sync of the real
      // input to the `LionField` (upwards sync).
      if (typeof this.modelValue === 'undefined') {
        this._syncValueUpwards();
      }
      /** @type {string} */
      this.__prevViewValue = this.value;

      this._reflectBackFormattedValueToUser();

      if (this._inputNode) {
        this._inputNode.addEventListener(this.formatOn, this._reflectBackFormattedValueDebounced);
        this._inputNode.addEventListener('input', this._proxyInputEvent);
        this._inputNode.addEventListener('compositionstart', this.__onCompositionEvent);
        this._inputNode.addEventListener('compositionend', this.__onCompositionEvent);
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      if (this._inputNode) {
        this._inputNode.removeEventListener('input', this._proxyInputEvent);
        this._inputNode.removeEventListener(
          this.formatOn,
          /** @type {EventListenerOrEventListenerObject} */ (
            this._reflectBackFormattedValueDebounced
          ),
        );
        this._inputNode.removeEventListener('compositionstart', this.__onCompositionEvent);
        this._inputNode.removeEventListener('compositionend', this.__onCompositionEvent);
      }
    }
  };

export const FormatMixin = dedupeMixin(FormatMixinImplementation);
