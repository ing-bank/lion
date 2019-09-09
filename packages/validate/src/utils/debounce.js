/* eslint-disable */

/**
 * Adjusted from lodash _.debounce
 * @param {Function} func
 * @param {number} wait
 * @param {object} config
 */
export function debounce(func, wait, { immediate, async } = {}) {
  let timeout;
  if (!async) {
    return function() {
      let context = this;
      let args = arguments;
      let later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  } else {
    return async function() {
      let context = this;
      let args = arguments;
      let later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
        return true;
      }
    };
  }
};
