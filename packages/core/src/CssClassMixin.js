import { dedupeMixin } from './dedupeMixin.js';

/**
 * # CssClassMixin
 * `CssClassMixin` is a base mixin for the use of css in lion-components.
 *
 * **Deprecated**: A custom element should not modify it's own classes
 *
 * @deprecated
 * @type {function()}
 * @polymerMixin
 * @mixinFunction
 */
export const CssClassMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line
    class CssClassMixin extends superclass {
      update(changedProps) {
        super.update(changedProps);
        this._updateCssClasses(changedProps);
      }

      /**
       * This function will check for 'empty': it returns true when an array or object has
       * no keys or when a value is falsy.

       *
       * @param {Object} value
       * @returns {boolean}
       * @private
       */
      static _isEmpty(value) {
        if (typeof value === 'object') {
          return Object.keys(value).length === 0;
        }
        return !value;
      }

      /**
       * This function updates css classes
       *
       * @param {Object} newValues
       * @private
       */
      _updateCssClasses(changedProps) {
        Array.from(changedProps.keys()).forEach(property => {
          const klass = this.constructor.properties[property].nonEmptyToClass;
          if (klass) {
            if (this.constructor._isEmpty(this[property])) {
              this.classList.remove(klass);
            } else {
              this.classList.add(klass);
            }
          }
        });
      }
    },
);
