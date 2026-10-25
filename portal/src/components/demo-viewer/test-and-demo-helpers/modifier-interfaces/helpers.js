/**
 * @typedef {import('./ModifierInterface.js').CssStateModifier} CssStateModifier
 */

/**
 * @param {HTMLElement} el
 * @param {string} modifier
 * @param {boolean | string} state
 */
export function setAsBooleanProp(el, modifier, state) {
  // @ts-expect-error
  // eslint-disable-next-line no-param-reassign
  el[modifier] = state;
}

/**
 * @param {HTMLElement} el
 * @param {string} modifier
 * @returns {boolean}
 */
export function getAsBooleanProp(el, modifier) {
  // @ts-expect-error
  return el[modifier];
}

/**
 * @param {HTMLElement} el
 * @param {string} modifier
 * @param {string} state
 */
export function setAsEnumValue(el, modifier, state) {
  // @ts-expect-error
  // eslint-disable-next-line no-param-reassign
  el[modifier] = state;
}

/**
 * @param {HTMLElement} el
 * @param {string} modifier
 * @returns {string}
 */
export function getAsEnumValue(el, modifier) {
  // eslint-disable-next-line no-param-reassign
  // @ts-expect-error
  return el[modifier];
}

/**
 * @param {HTMLElement} el
 * @param {CssStateModifier} modifier
 * @param {boolean | string} state
 */
export function setAsStateModifierDemoClass(el, modifier, state) {
  el.classList.toggle(`_m-${modifier}`, Boolean(state));
}

/**
 * @param {HTMLElement} el
 * @param {CssStateModifier} modifier
 * @returns {boolean}
 */
export function getAsStateModifierDemoClass(el, modifier) {
  return el.classList.contains(`_m-${modifier}`);
}

/**
 * @param {DocumentOrShadowRoot} documentOrShadowRoot
 * @returns {HTMLElement | null}
 */
export function getDeepActiveElement(documentOrShadowRoot = document) {
  const { activeElement } = documentOrShadowRoot;
  if (activeElement?.shadowRoot) {
    return getDeepActiveElement(activeElement.shadowRoot);
  }
  // @ts-expect-error
  return activeElement;
}

/**
 * @param {function} fn
 */
export function runWhilePreservingFocus(fn) {
  const activeElement = getDeepActiveElement();
  fn();
  if (activeElement) {
    activeElement.focus();
  }
}

/**
 * @param {HTMLElement} el
 * @param {CssStateModifier} modifier
 * @param {string} state
 * @param {{variantValues: string[]}} opts
 */
export function setVariantEnumsAsBooleanAttrs(el, modifier, state, { variantValues }) {
  for (const variantValue of variantValues) {
    if (variantValue !== '<default>') {
      if (variantValue === state) {
        el.setAttribute(variantValue, '');
      } else {
        el.removeAttribute(variantValue);
      }
    }
  }
}

/**
 * @param {HTMLElement} el
 * @param {CssStateModifier} modifier
 * @param {{variantValues: string[]}} opts
 * @returns {string}
 */
export function getVariantEnumsAsBooleanAttrs(el, modifier, { variantValues }) {
  for (const variantValue of variantValues) {
    if (el.hasAttribute(variantValue)) {
      return variantValue;
    }
  }
  return '<default>';
}
