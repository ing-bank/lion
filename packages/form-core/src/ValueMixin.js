import { dedupeMixin } from '@lion/core';

/**
 * @typedef {import('../types/ValueMixinTypes').ValueMixin} ValueMixin
 * @type {ValueMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('../types/ValueMixinTypes').LionFieldWithValue>} superclass} superclass
 */
const ValueMixinImplementation = superclass =>
  class ValueMixin extends superclass {
    get value() {
      return (this._inputNode && this._inputNode.value) || this.__value || '';
    }

    // We don't delegate, because we want to preserve caret position via _setValueAndPreserveCaret
    /** @type {string} */
    set value(value) {
      // if not yet connected to dom can't change the value
      if (this._inputNode) {
        this._setValueAndPreserveCaret(value);
        /** @type {string | undefined} */
        this.__value = undefined;
      } else {
        this.__value = value;
      }
    }

    /**
     * Restores the cursor to its original position after updating the value.
     * @param {string} newValue The value that should be saved.
     */
    _setValueAndPreserveCaret(newValue) {
      // Only preserve caret if focused (changing selectionStart will move focus in Safari)
      if (this.focused) {
        // Not all elements might have selection, and even if they have the
        // right properties, accessing them might throw an exception (like for
        // <input type=number>)
        try {
          // SelectElement doesn't have selectionStart/selectionEnd
          if (!(this._inputNode instanceof HTMLSelectElement)) {
            const start = this._inputNode.selectionStart;
            this._inputNode.value = newValue;
            // The cursor automatically jumps to the end after re-setting the value,
            // so restore it to its original position.
            this._inputNode.selectionStart = start;
            this._inputNode.selectionEnd = start;
          }
        } catch (error) {
          // Just set the value and give up on the caret.
          this._inputNode.value = newValue;
        }
      } else {
        this._inputNode.value = newValue;
      }
    }
  };

export const ValueMixin = dedupeMixin(ValueMixinImplementation);
