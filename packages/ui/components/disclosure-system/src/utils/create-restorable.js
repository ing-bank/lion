/** @type {WeakMap<HTMLElement, { attrs: { name: string, value: string | null }[], listeners: unknown[][] }>} */
const attrsAndListenersWeakmap = new WeakMap();

/**
 * @param {HTMLElement} targetNode
 * @param {string[]} allowedAttrs
 * @returns {HTMLElement}
 */
export function createRestorable(targetNode, allowedAttrs) {
  const originalAttrs = allowedAttrs.map(name => ({ name, value: targetNode.getAttribute(name) }));
  /**
   * @type {unknown[][]}
   */
  const listeners = [];

  const proxiedEl = new Proxy(targetNode, {
    set(target, prop, value) {
      // maybe we should only allow style here?
      return Reflect.set(target, prop, value);
    },
    get(target, prop) {
      const source = /** @type {any} */ (target);
      // If the accessed property is a method, wrap it to capture arguments
      if (typeof source[prop] === 'function') {
        /**
         * @param {...any} args
         */
        return function restorableMethod(...args) {
          const [firstArg] = args;
          if (prop === 'addEventListener') {
            listeners.push(args);
          } else if (prop === 'setAttribute' && !allowedAttrs.includes(String(firstArg))) {
            throw new Error(
              `Only attributes in the allowedAttrs (${allowedAttrs.join(', ')}) can be set on this element. Found: ${firstArg}`,
            );
          }

          // Ensure 'this' context remains bound correctly to the object
          return /** @type {Function} */ (source[prop].bind(targetNode)).apply(targetNode, args);
        };
      }

      return source[prop];
    },
  });

  attrsAndListenersWeakmap.set(targetNode, { attrs: originalAttrs, listeners });

  return /** @type {* & HTMLElement} */ (proxiedEl);
}

/**
 * @param {HTMLElement|HTMLElement[]} targetNode
 */
export function restore(targetNode) {
  if (Array.isArray(targetNode)) {
    targetNode.forEach(restore);
    return;
  }

  const entry = attrsAndListenersWeakmap.get(targetNode);
  if (!entry) return;

  for (const { name, value } of entry.attrs) {
    if (value === null) {
      targetNode.removeAttribute(name);
    } else {
      targetNode.setAttribute(name, value);
    }
  }
  for (const args of entry.listeners) {
    targetNode.removeEventListener(
      /** @type {string} */ (args[0]),
      /** @type {EventListenerOrEventListenerObject} */ (args[1]),
    );
  }
}
