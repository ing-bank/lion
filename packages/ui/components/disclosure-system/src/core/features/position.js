/**
 * Position the content against its anchor. CSS anchor positioning first — that costs nothing — and
 * popper only as a lazy polyfill on engines that do not support it yet.
 *
 * @typedef {import('../DisclosureCore.js').Disclosure} Disclosure
 * @typedef {import('../DisclosureCore.js').DisclosureDescriptor} DisclosureDescriptor
 */

/**
 * @returns {boolean}
 */
function supportsAnchorPositioning() {
  return (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    (CSS.supports('position-anchor: --a') || CSS.supports('anchor-name: --a'))
  );
}

/**
 * @param {Disclosure} disclosure
 * @param {DisclosureDescriptor} descriptor
 * @returns {{ release: () => void }}
 */
export function installPosition(disclosure, descriptor) {
  const { content, element } = disclosure;
  if (!content || !descriptor.anchor) return { release: () => {} };

  if (supportsAnchorPositioning()) {
    content.style.positionAnchor = descriptor.anchor;
    if (descriptor.area) content.style.positionArea = descriptor.area;
    if (descriptor.placement) content.style.positionArea = descriptor.placement;
    return {
      release: () => {
        content.style.positionAnchor = '';
        content.style.positionArea = '';
      },
    };
  }

  /** @type {{ destroy: () => void } | undefined} */
  let popper;
  /** @type {boolean} */
  let released = false;
  // Loaded on demand, only on engines without anchor positioning. Never part of the core chunk.
  import('@popperjs/core')
    .then(({ createPopper }) => {
      if (released) return;
      popper = createPopper(/** @type {Element} */ (element ?? content), content, {
        placement: /** @type {import('@popperjs/core').Placement} */ (
          descriptor.placement ?? 'bottom-start'
        ),
      });
    })
    .catch(() => {
      /* a polyfill that cannot load must not break the disclosure */
    });

  return {
    release: () => {
      released = true;
      popper?.destroy();
    },
  };
}
