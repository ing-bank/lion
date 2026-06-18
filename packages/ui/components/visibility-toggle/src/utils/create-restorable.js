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
      // // @ts-expect-error
      // if (typeof target[prop] === 'function') {
      //   if (prop === 'addEventListener') {
      //     console.debug('addEventListener', arguments);
      //     listeners.push(arguments);
      //     // return Reflect.apply(target[prop], target, arguments).bind(target);
      //   } else if (prop === 'setAttribute' && !allowedAttrs.includes(arguments[1])) {
      //     console.debug('setAttribute', arguments, target, prop, receiver);

      //     throw new Error(
      //       `Only attributes in the allowedAttrs (${allowedAttrs.join(', ')}) can be set on this element. Found: ${arguments[1]}`,
      //     );
      //   }

      //   // @ts-expect-error
      //   return target[prop].bind(targetNode);
      // }
      // // @ts-expect-error
      // return target[prop];

      // const value = Reflect.get(target, prop, receiver).bind(targetNode);

      // If the accessed property is a method, wrap it to capture arguments
      if (typeof target[prop] === 'function') {
        // const x = target[prop].bind(targetNode);
        return function () {
          if (prop === 'addEventListener') {
            // console.debug('addEventListener', arguments);
            listeners.push(arguments);
            // return Reflect.apply(target[prop], target, arguments).bind(target);
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
