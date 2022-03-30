/**
 * A modelValue can demand a certain type (Date, Number, Iban etc.). A correct type will always be
 * translatable into a String representation (the value presented to the end user) via the
 * `formatter`. When the type is not valid (usually as a consequence of a user typing in an invalid
 * or incomplete viewValue), the current truth is captured in the `Unparseable` type.
 * For example: a viewValue can't be parsed (for instance 'foo' when the type should be Number).

 * The model(value) concept as implemented in lion-web is conceptually comparable to those found in
 * popular systems like Angular and Vue.

 * The Unparseable type is an addition on top of this that mainly is added for the following two
 * purposes:
 * - restoring user sessions
 * - realtime updated with all value changes
 */
export class Unparseable {
  /** @param {string} value */
  constructor(value) {
    /**
     * Meta info for restoring serialized Unparseable values
     * @type {'unparseable'}
     */
    this.type = 'unparseable';
    /**
     * Stores current view value. For instance, value '09-' is an unparseable Date.
     * This info can be used to restore previous form states.
     * @type {string}
     */
    this.viewValue = value;
  }

  toString() {
    return JSON.stringify({ type: this.type, viewValue: this.viewValue });
  }
}
