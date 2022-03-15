import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { FormatNumberOptions } from '@lion/localize/types/LocalizeMixinTypes';
import { ValidateHost } from './validate/ValidateMixinTypes';
import { FormControlHost } from './FormControlMixinTypes';

export type FormatOptions = { mode: 'pasted' | 'auto' } & object;
export declare class FormatHost {
  /**
   * Converts viewValue to modelValue
   * For instance, a localized date to a Date Object
   * @param {string} v - viewValue: the formatted value inside <input>
   * @param {FormatOptions} opts
   * @returns {*} modelValue
   */
  parser(v: string, opts: FormatOptions): unknown;

  /**
   * Converts modelValue to formattedValue (formattedValue will be synced with
   * `._inputNode.value`)
   * For instance, a Date object to a localized date.
   * @param {*} v - modelValue: can be an Object, Number, String depending on the
   * input type(date, number, email etc)
   * @param {FormatOptions} opts
   * @returns {string} formattedValue
   */
  formatter(v: unknown, opts?: FormatOptions): string;

  /**
   * Converts `.modelValue` to `.serializedValue`
   * For instance, a Date object to an iso formatted date string
   * @param {?} v - modelValue: can be an Object, Number, String depending on the
   * input type(date, number, email etc)
   * @returns {string} serializedValue
   */
  serializer(v: unknown): string;

  /**
   * Converts `.serializedValue` to `.modelValue`
   * For instance, an iso formatted date string to a Date object
   * @param {?} v - modelValue: can be an Object, Number, String depending on the
   * input type(date, number, email etc)
   * @returns {?} modelValue
   */
  deserializer(v: string): unknown;

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
  preprocessor(
    v: string,
    options: FormatOptions & { prevViewValue: string; currentCaretIndex: number },
  ): { viewValue: string; caretIndex: number } | string | undefined;

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
  formattedValue: string | undefined;

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
   */
  serializedValue: string | undefined;

  /**
   * Event that will trigger formatting (more precise, visual update of the view, so the
   * user sees the formatted value)
   * Default: 'change'
   * @deprecated use _reflectBackOn()
   * @protected
   */
  formatOn: string;

  /**
   * Configuration object that will be available inside the formatter function
   */
  formatOptions: FormatOptions;

  /**
   * The view value. Will be delegated to `._inputNode.value`
   */
  get value(): string;
  set value(value: string);

  /**
   * Flag that will be set when user interaction takes place (for instance after an 'input'
   * event). Will be added as meta info to the `model-value-changed` event. Depending on
   * whether a user is interacting, formatting logic will be handled differently.
   */
  protected _isHandlingUserInput: boolean;

  /**
   * Whether the user is pasting content. Allows Subclassers to do this in their subclass:
   * @example
   * ```js
   * _reflectBackOn() {
   *   return super._reflectBackOn() || this._isPasting;
   * }
   * ```
   */
  protected _isPasting: boolean;

  /**
   * Responsible for storing all representations(modelValue, serializedValue, formattedValue
   * and value) of the input value. Prevents infinite loops, so all value observers can be
   * treated like they will only be called once, without indirectly calling other observers.
   * (in fact, some are called twice, but the __preventRecursiveTrigger lock prevents the
   * second call from having effect).
   * @param {{source:'model'|'serialized'|'formatted'|null}} config
   * the type of value that triggered this method. It should not be set again, so that its
   * observer won't be triggered. Can be: 'model'|'formatted'|'serialized'.
   */
  protected _calculateValues(opts: { source: 'model' | 'serialized' | 'formatted' | null }): void;
  protected _onModelValueChanged(arg: { modelValue: unknown }): void;
  protected _dispatchModelValueChangedEvent(): void;

  /**
   * Synchronization from `._inputNode.value` to `LionField` (flow [2])
   * Downwards syncing should only happen for `LionField`.value changes from 'above'.
   * This triggers _onModelValueChanged and connects user input
   * to the parsing/formatting/serializing loop.
   */
  protected _syncValueUpwards(): void;
  protected _reflectBackFormattedValueToUser(): void;
  private _reflectBackFormattedValueDebounced(): void;

  /**
   * Every time .formattedValue is attempted to sync to the view value (on change/blur and on
   * modelValue change), this condition is checked. When enhancing it, it's recommended to
   * call `super._reflectBackOn()`
   * @overridable
   * @return {boolean}
   * @protected
   */
  protected _reflectBackOn(): boolean;

  /**
   * This can be called whenever the view value should be updated. Dependent on component type
   * ("input" for <input> or "change" for <select>(mainly for IE)) a different event should be
   * used  as source for the "user-input-changed" event (which can be seen as an abstraction
   * layer on top of other events (input, change, whatever))
   * @protected
   */
  protected _proxyInputEvent(): void;
  protected _onUserInputChanged(): void;
  protected _callParser(value: string | undefined): object;
  protected _callFormatter(): string;

  private __preventRecursiveTrigger: boolean;
  private __prevViewValue: string;
}

export declare function FormatImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormatHost> &
  Pick<typeof FormatHost, keyof typeof FormatHost> &
  Constructor<ValidateHost> &
  Pick<typeof ValidateHost, keyof typeof ValidateHost> &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type FormatMixin = typeof FormatImplementation;
