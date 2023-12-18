function isChildOf(ctorName, el) {
  let current = el;
  while (current) {
    if (current.constructor.name === ctorName) {
      return true;
    }
    current = current.getPrototypeOf(current);
  }
  return false;
}

/**
 * Whenever a Subclasser creates a custom html, he/she needs to apply a part directive with the right semantics.
 * These assert functions can be used in UIPartDirectives.
 *
 * @example
 * ```js
 * class MyDirective extends UIPartDirective {
 *   setup(part, [name, localContext]) {
 *      if (name === 'anchor') {
 *          assertAnchor(part.element);
 *      }
 *   }
 * }
 * ```
 */

export function assertNav(el) {
  if (!(el.tagName === 'NAV' || el.getAttribute('role') === 'navigation')) {
    throw new Error('Please apply to HTMLNavElement (`<nav>`) | `[role="navigation"]`');
  }
}

export function assertList(el) {
  if (!(el.tagName === 'UL' || el.tagName === 'OL')) {
    throw new Error('Please apply to HTMLUListElement (`<ul>`) | HTMLOListElement (`<ol>`)');
  }
  if (!(el.getAttribute('role') === 'list')) {
    throw new Error(
      'Please apply to [role="list"]. See https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html',
    );
  }
}

export function assertListItem(el) {
  if (!(el.tagName === 'LI')) {
    throw new Error('Please apply to HTMLLIElement (`<li>`)');
  }
}

export function assertAnchor(el) {
  if (!(el.tagName === 'A')) {
    throw new Error('Please apply to HTMLAnchorElement (`<a>`)');
  }
}

export function assertButton(el) {
  const isButton =
    el.tagName === 'BUTTON' || isChildOf('LionButton', el) || el.getAttribute('role') === 'button';
  if (!isButton) {
    throw new Error(
      '[UIPortalMainNavPartDirective.toggle-for-level] Please apply to HTMLButtonElement (`<button>`) | LionButton | `[role=button]`',
    );
  }
}

export function assertLionIcon(el) {
  if (!isChildOf('LionIcon', el)) {
    throw new Error('[UIPortalMainNavPartDirective.icon] Please apply to LionIcon');
  }
}
