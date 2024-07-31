/**
 * A number, or a string containing a number.
 * @typedef {{element: HTMLElement; deepContains: boolean} | null} CacheItem
 */

/**
 * Whether first element contains the second element, also goes through shadow roots
 * @param {HTMLElement|ShadowRoot} el
 * @param {HTMLElement|ShadowRoot} targetEl
 * @param {{[key: string]: CacheItem[]}} cache
 * @returns {boolean}
 */
export function deepContains(el, targetEl, cache = {}) {
  /**
   * @description A `Typescript` `type guard` for `HTMLElement`
   * @param {Element|ShadowRoot} htmlElement
   * @returns {htmlElement is HTMLElement}
   */
  function isHTMLElement(htmlElement) {
    return 'getAttribute' in htmlElement;
  }

  /**
   * @description Returns a cached item for the given element or null otherwise
   * @param {HTMLElement|ShadowRoot} element
   * @returns {CacheItem|null}
   */
  function getCachedItem(element) {
    if (!isHTMLElement(element)) {
      return null;
    }
    const slotName = element.getAttribute('slot');
    /** @type {CacheItem|null} */
    let result = null;
    if (slotName) {
      const cachedItemsWithSameName = cache[slotName];
      if (cachedItemsWithSameName) {
        result = cachedItemsWithSameName.filter(item => item?.element === element)[0] || null;
      }
    }
    return result;
  }

  const cachedItem = getCachedItem(el);
  if (cachedItem) {
    return cachedItem.deepContains;
  }

  /**
   * @description Cache an html element and its `deepContains` status
   * @param {boolean} contains The `deepContains` status for the element
   * @returns {void}
   */
  function cacheItem(contains) {
    if (!isHTMLElement(el)) {
      return;
    }
    const slotName = el.getAttribute('slot');
    if (slotName) {
      // eslint-disable-next-line no-param-reassign
      cache[slotName] = cache[slotName] || [];
      cache[slotName].push({ element: el, deepContains: contains });
    }
  }

  let containsTarget = el.contains(targetEl);
  if (containsTarget) {
    cacheItem(true);
    return true;
  }

  /**
   * A `Typescript` `type guard` for `HTMLSlotElement`
   * @param {HTMLElement|HTMLSlotElement} htmlElement
   * @returns {htmlElement is HTMLSlotElement}
   */
  function isSlot(htmlElement) {
    return htmlElement.tagName === 'SLOT';
  }

  /**
   * Returns a slot projection or it returns `null` if `htmlElement` is not an `HTMLSlotElement`
   * @example
   * Let's say this is a custom element declared as follows:
   * ```
   * <custom-element>
   *   shadowRoot
   *     <div id="dialog-wrapper">
   *       <div id="dialog-header">Header</div>
   *       <div id="dialog-content">
   *         <slot id="dialog-content-slot" name="content"></slot>
   *       </div>
   *     </div>
   *   <!-- Light DOM -->
   *   <div id="my-slot-content" slot="content">my content</div>
   * </custom-element>
   * ```
   * Then for `slot#dialog-content-slot` which is defined in the ShadowDom the function returns `div#my-slot-content` which is defined in the LightDom
   * @param {HTMLElement|HTMLSlotElement} htmlElement
   * @returns {Element[]}
   * */
  function getSlotProjections(htmlElement) {
    return isSlot(htmlElement) ? /** @type {Element[]}  */ (htmlElement.assignedElements()) : [];
  }

  /**
   * @description A `Typescript` `type guard` for `ShadowRoot`
   * @param {Element|ShadowRoot} htmlElement
   * @returns {htmlElement is ShadowRoot}
   */
  function isShadowRoot(htmlElement) {
    return htmlElement.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }

  /**
   * Check whether any element contains target
   * @param {(Element|ShadowRoot|null)[]} elements
   * */
  function checkElements(elements) {
    let contains = false;
    for (let i = 0; i < elements.length; i += 1) {
      const element = elements[i];
      if (
        element &&
        (isHTMLElement(element) || isShadowRoot(element)) &&
        deepContains(element, targetEl, cache)
      ) {
        contains = true;
        break;
      }
    }
    return contains;
  }

  /** @param {HTMLElement|ShadowRoot} elem */
  function checkChildren(elem) {
    for (let i = 0; i < elem.children.length; i += 1) {
      const child = /** @type {HTMLElement}  */ (elem.children[i]);
      const cachedChild = getCachedItem(child);
      if (cachedChild) {
        containsTarget = cachedChild.deepContains || containsTarget;
        break;
      }
      const slotProjections = getSlotProjections(child);
      const childSubElements = [child.shadowRoot, ...slotProjections];
      if (checkElements(childSubElements)) {
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
    containsTarget = deepContains(el.shadowRoot, targetEl, cache);
    if (containsTarget) {
      cacheItem(true);
      return true;
    }
  }
  checkChildren(el);
  cacheItem(containsTarget);
  return containsTarget;
}
