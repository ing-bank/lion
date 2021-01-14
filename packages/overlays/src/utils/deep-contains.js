/**
 * Whether first element contains the second element, also goes through shadow roots
 * @param {HTMLElement|ShadowRoot} el
 * @param {HTMLElement|ShadowRoot} targetEl
 * @returns {boolean}
 */
export function deepContains(el, targetEl) {
  let containsTarget = el.contains(targetEl);
  if (containsTarget) {
    return true;
  }

  /** @param {HTMLElement|ShadowRoot} elem */
  function checkChildren(elem) {
    for (let i = 0; i < elem.children.length; i += 1) {
      const child = /** @type {HTMLElement}  */ (elem.children[i]);
      if (child.shadowRoot && deepContains(child.shadowRoot, targetEl)) {
        containsTarget = true;
        break;
      }
      if (child.children.length > 0) {
        checkChildren(child);
      }
    }
  }

  // If element is not shadowRoot itself
  if (el instanceof HTMLElement && el.shadowRoot) {
    containsTarget = deepContains(el.shadowRoot, targetEl);
    if (containsTarget) {
      return true;
    }
  }
  checkChildren(el);
  return containsTarget;
}
