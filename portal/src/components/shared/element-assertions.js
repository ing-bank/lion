import { isServer } from 'lit';

/**
 * Element assertions assure the right semantics are applied to the right element.
 * These assertions can be used in UIPartDirectives, making sure that custom templates provide the
 * semantics that are expected.
 */

/**
 * @param {Element} el
 */
function printElFound(el) {
  const role = el.getAttribute('role');
  return el.tagName.toLowerCase() + role ? `[role="${role}"]` : '';
}

/**
 * @param {string} ctorName
 * @param {Element} el
 */
function isChildOf(ctorName, el) {
  let current = el;
  while (current) {
    if (current.constructor.name === ctorName) {
      return true;
    }
    current = Object.getPrototypeOf(current);
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

/**
 * @param {Element} el
 */
export function assertNav(el) {
  if (!(el.tagName === 'NAV' || el.getAttribute('role') === 'navigation')) {
    throw new Error('Please apply to HTMLNavElement (`<nav>`) | `[role="navigation"]`');
  }
}

/**
 * @param {Element} el
 */
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

/**
 * @param {Element} el
 */
export function assertListItem(el) {
  if (!(el.tagName === 'LI')) {
    throw new Error('Please apply to HTMLLIElement (`<li>`)');
  }
}

/**
 * @param {Element} el
 */
export function assertAnchor(el) {
  if (!(el.tagName === 'A')) {
    throw new Error('Please apply to HTMLAnchorElement (`<a>`)');
  }
}

/**
 * @param {Element} el
 */
export function assertButton(el) {
  const isButton =
    el.tagName === 'BUTTON' || isChildOf('LionButton', el) || el.getAttribute('role') === 'button';
  if (!isButton) {
    throw new Error(
      'Please apply to HTMLButtonElement (`<button>`) | LionButton | `[role=button]`',
    );
  }
}

/**
 * @param {Element} el
 */
export function assertLabel(el) {
  const isLabel = el.tagName === 'LABEL' || el.getAttribute('role') === 'label';
  if (!isLabel) {
    throw new Error('Please apply to HTMLLabelElement (`<label>`) | `[role=label]`');
  }
}

/**
 * @param {Element} el
 */
export function assertTextbox(el) {
  const isLabel = el.tagName === 'INPUT' || el.getAttribute('role') === 'textbox';
  if (!isLabel) {
    throw new Error('Please apply to HTMLInputElement (`<input>`) | `[role=textbox]`');
  }
}

/**
 * @param {Element} el
 */
export function assertRegion(el) {
  const isRegion = el.getAttribute('role') === 'region';
  if (!isRegion) {
    throw new Error('Please apply to `[role=region]`');
  }
}

// Landmark asserts

/**
 * @param {Element} el
 */
export function assertBannerLandmark(el) {
  const isBanner = el.getAttribute('role') === 'banner';
  if (!isBanner) {
    throw new Error('Please apply to `[role=banner]`');
  }
}

/**
 * @param {Element} el
 */
export function assertMainLandmark(el) {
  const isMain = el.tagName === 'MAIN' || el.getAttribute('role') === 'main';
  if (!isMain) {
    throw new Error('Please apply to HTMLMainElement (`<main>`) | `[role=main]`');
  }
}

/**
 * @param {Element} el
 */
export function assertContentinfoLandmark(el) {
  const isContentInfo = el.getAttribute('role') === 'contentinfo';
  if (!isContentInfo) {
    throw new Error('Please apply to `[role=contentinfo]`');
  }
}

/**
 * @param {Element} el
 */
export function assertComplementaryLandmark(el) {
  const isContentInfo = el.getAttribute('role') === 'complementary';
  if (!isContentInfo) {
    throw new Error('Please apply to `[role=complementary]`');
  }
}

/**
 * @param {Element} el
 */
export function assertPresentation(el) {
  const roleAttr = el.getAttribute('role');
  const isPresentation =
    ['none', 'presentation'].includes(roleAttr) ||
    (!roleAttr && ['DIV', 'SPAN'].includes(el.tagName));
  if (!isPresentation) {
    throw new Error(`Please apply to an element without semantics. Found: ${printElFound(el)}`);
  }
}

/**
 * @param {Element} el
 */
export function assertLionIcon() {
  if (isServer) {
    // We can only determine after hydration, so leave it for now...
  }
  // if (!isChildOf('LionIcon', el)) {
  //   throw new Error('[UIMainNavPartDirective.icon] Please apply to LionIcon');
  // }
}
