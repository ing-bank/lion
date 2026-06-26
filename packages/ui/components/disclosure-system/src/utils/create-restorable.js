/** @type {WeakMap<HTMLElement, { attrs: { name: string, value: string | null }[], listeners: IArguments[] }>} */
const attrsAndListenersWeakmap = new WeakMap();

/**
 * @param {HTMLElement} targetNode
 * @param {string[]} allowedAttrs
 * @returns {HTMLElement}
 */
export function createRestorable(targetNode, allowedAttrs) {
  const originalAttrs = allowedAttrs.map(name => ({ name, value: targetNode.getAttribute(name) }));
  /**
   * @type {IArguments[]}
   */
  const listeners = [];

  const proxiedEl = new Proxy(targetNode, {
    set(target, prop, value) {
      // maybe we should only allow style here?
      return Reflect.set(target, prop, value);
    },
    get(target, prop, receiver) {
      // If the accessed property is a method, wrap it to capture arguments
      if (typeof target[prop] === 'function') {
        return function () {
          if (prop === 'addEventListener') {
            listeners.push(arguments);
          } else if (prop === 'setAttribute' && !allowedAttrs.includes(arguments[0])) {
            throw new Error(
              `Only attributes in the allowedAttrs (${allowedAttrs.join(', ')}) can be set on this element. Found: ${arguments[0]}`,
            );
          }

          // Ensure 'this' context remains bound correctly to the object
          return /** @type {Function} */ (target[prop].bind(targetNode)).apply(
            targetNode,
            arguments,
          );
        };
      }

      return target[prop];
    },
  });

  attrsAndListenersWeakmap.set(targetNode, { attrs: originalAttrs, listeners });

  return /** @type {* & HTMLElement} */ (proxiedEl);
}

/**
 * @param {HTMLElement} targetNode
 */
export function restore(targetNode) {
  const entry = attrsAndListenersWeakmap.get(targetNode);
  if (!entry) return;

  for (const { name, value } of entry.attrs) {
    if (value === null) {
      targetNode.removeAttribute(name);
      continue;
    }
    targetNode.setAttribute(name, value);
  }
  for (const args of entry.listeners) {
    targetNode.removeEventListener(args[0], args[1]);
  }
}
