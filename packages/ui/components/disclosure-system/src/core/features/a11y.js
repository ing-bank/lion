/**
 * The accessibility contract the platform refuses to guess. Always loaded: this is the feature that
 * closes the gaps, it is a few hundred bytes and every disclosure needs it.
 *
 * Why it exists (`popover` adds behaviour, not semantics):
 * - no role is added by the browser — the component must say what the content is;
 * - `aria-expanded` is only implied for real `<button>` invokers, so any other invoker needs it set;
 * - the `aria-details` / controls relationship may only be announced once a user has left and returned
 *   to the invoker, so the relation is written before the disclosure opens.
 *
 * Sources: https://hidde.blog/popover-accessibility/ , https://hidde.blog/popover-semantics/
 *
 * @typedef {import('../DisclosureCore.js').Disclosure} Disclosure
 * @typedef {import('../DisclosureCore.js').DisclosureDescriptor} DisclosureDescriptor
 */

/**
 * @param {Disclosure} disclosure
 * @param {DisclosureDescriptor} descriptor
 * @returns {{ release: () => void }}
 */
export function installA11y(disclosure, descriptor) {
  const { content, element } = disclosure;
  if (content) {
    if (descriptor.role && !content.getAttribute('role')) {
      content.setAttribute('role', descriptor.role);
    }
    if (descriptor.label) content.setAttribute('aria-label', descriptor.label);
    if (descriptor.labelledby) content.setAttribute('aria-labelledby', descriptor.labelledby);
    if (descriptor.modal && content.getAttribute('role') === 'dialog') {
      content.setAttribute('aria-modal', 'true');
    }
  }

  const { invoker } = descriptor;
  if (invoker && content) {
    if (content.id) invoker.setAttribute('aria-controls', content.id);
    // the relation exists before the user opens anything, so assistive tech can announce it right away
    if (!invoker.hasAttribute('aria-details') && content.id) {
      invoker.setAttribute('aria-details', content.id);
    }
  }

  /**
   * Keep the invoker's expanded state in step with the machine — not with the DOM.
   * @param {CustomEvent<{ newState: DisclosureState }>} event
   * @returns {void}
   */
  function syncExpanded(event) {
    invoker?.setAttribute('aria-expanded', String(event.detail?.newState === 'open'));
  }

  // install runs after the transition, so apply the current state immediately
  invoker?.setAttribute('aria-expanded', String(disclosure.open));
  element?.addEventListener('toggle', /** @type {EventListener} */ (syncExpanded));

  return {
    release: () => {
      element?.removeEventListener('toggle', /** @type {EventListener} */ (syncExpanded));
      invoker?.setAttribute('aria-expanded', 'false');
    },
  };
}

/** @typedef {import('../DisclosureCore.js').DisclosureState} DisclosureState */
