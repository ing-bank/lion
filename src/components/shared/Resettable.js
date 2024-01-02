// TODO: implement Proxy and keep original apis

/**
 * Helper class for elements that temporarily fulfill a certain role, when placed in a context.
 * A concrete example: when a main navigation is used on desktop, it is a horizontal bar with menu items.
 * On mobile, it is a vertical bar with menu items, inside a popover.
 * Thus, on switch of layout, the main navigation temporarily fulfills the role of a popover.
 *
 * Resettable allows you to use a subset of the native Element api (setAttribute, removeAttribute, addEventListener, toggleAttribute)
 * that can automatically be cleaned up when the role is no longer needed.
 *
 * @example
 * ```js
 * const inputEl = document.createElement('input');
 *
 * // Setup an element that temporarily fulfills a certain role
 * this._resettableInputEl = new Resettable(inputEl);
 * this._resettableInputEl.setAttribute('aria-labelledby', 'some-label-id');
 *
 * console.log(this._resettableInputEl.el.getAttribute('aria-labelledby')); // 'some-label-id'
 *
 * // The role that our element temporarily fulfilled is no longer needed. Clean up!
 * this._resettableInputEl.reset();
 *
 * console.log(this._resettableInputEl.el.getAttribute('aria-labelledby')); // null
 * ```
 */
export class Resettable {
  constructor(el) {
    this.el = el;
    this._listeners = [];
    this._attrs = new Set();
  }

  setAttribute(...args) {
    this._attrs.add(args);
    this.el.setAttribute(...args);
  }

  toggleAttribute(...args) {
    const needsAttr = Boolean(args[1]);
    if (needsAttr) {
      this.setAttribute(args[0], '');
    } else {
      this.removeAttribute(args[0]);
    }
  }

  removeAttribute(attr) {
    this._attrs.delete(attr);
    this.el.removeAttribute?.(attr);
  }

  addEventListener(...args) {
    this._listeners.push(args);
    this.el.addEventListener(...args);
  }

  reset() {
    for (const attr of Array.from(this._attrs)) {
      this.el.removeAttribute(attr[0]);
    }
    for (const listener of this._listeners) {
      this.el.removeEventListener(...listener);
    }
  }
}
