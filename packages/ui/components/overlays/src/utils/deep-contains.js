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
   * @param {HTMLElement|ShadowRoot} htmlElement
   * @returns {htmlElement is HTMLElement}
   */
  function isHTMLElement(htmlElement) {
    return 'getAttribute' in htmlElement;
  }

  /** @type {CacheItem} */
  let itemToCache = null;
  if (isHTMLElement(el)) {
    const slotName = el.getAttribute('slot');
    if (slotName) {
      // eslint-disable-next-line no-param-reassign
      cache[slotName] = cache[slotName] || [];
      const cachedItemsWithSameName = cache[slotName];
      for (let i = 0; i < cachedItemsWithSameName.length; i += 1) {
        const cachedItem = cachedItemsWithSameName[i];
        if (cachedItem?.element === el) {
          return cachedItem.deepContains;
        }
      }
      itemToCache = { element: el, deepContains: false };
      cachedItemsWithSameName.push(itemToCache);
    }
  }

  /**
   * @description Cache an html element and its `deepContains` status
   * @param {boolean} contains The `deepContains` status for the element
   * @returns {void}
   */
  function cacheItem(contains) {
    if (itemToCache) {
      itemToCache.deepContains = contains;
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
   * @returns {HTMLElement|null}
   * */
  function getSlotProjection(htmlElement) {
    return isSlot(htmlElement)
      ? /** @type {HTMLElement}  */ (htmlElement.assignedElements()[0])
      : null;
  }

  /**
   * @description Returns a cached item for the given element or null otherwise
   * @param {HTMLElement|HTMLSlotElement} element
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

  /** @param {HTMLElement|ShadowRoot} elem */
  function checkChildren(elem) {
    for (let i = 0; i < elem.children.length; i += 1) {
      const child = /** @type {HTMLElement}  */ (elem.children[i]);
      const cachedChild = getCachedItem(child);
      if (cachedChild) {
        containsTarget = cachedChild.deepContains;
        break;
      }
      const slotProjectionElement = getSlotProjection(child);
      const childSubElement = child.shadowRoot || slotProjectionElement;
      if (childSubElement && deepContains(childSubElement, targetEl, cache)) {
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
