/**
 * Use the [inert] attribute to be forwards compatible with: https://html.spec.whatwg.org/multipage/interaction.html#inert
 */

/**
 * Makes sibling elements inert, sets the inert attribute and aria-hidden for
 * screen readers.
 * @param {HTMLElement} element
 */
export function setSiblingsInert(element) {
  const parentChildren = /** @type {HTMLCollection} */ (element.parentElement?.children);
  for (let i = 0; i < parentChildren.length; i += 1) {
    const sibling = parentChildren[i];

    if (sibling !== element) {
      sibling.setAttribute('inert', '');
      sibling.setAttribute('aria-hidden', 'true');
    }
  }
}

/**
 * Removes inert and aria-hidden attribute from sibling elements
 * @param {HTMLElement} element
 */
export function unsetSiblingsInert(element) {
  const parentChildren = /** @type {HTMLCollection} */ (element.parentElement?.children);
  for (let i = 0; i < parentChildren.length; i += 1) {
    const sibling = parentChildren[i];

    if (sibling !== element) {
      sibling.removeAttribute('inert');
      sibling.removeAttribute('aria-hidden');
    }
  }
}
