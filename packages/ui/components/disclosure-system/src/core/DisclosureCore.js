/**
 * @typedef {'closed' | 'opening' | 'open' | 'closing'} DisclosureState
 *
 * @typedef {object} DisclosureDescriptor
 * A serializable description of how a disclosure behaves. Plain data on purpose: it can be logged,
 * diffed and passed around, and features only load when it asks for them.
 * @property {'any' | 'closest' | 'none'} [closedby] which user actions may close the disclosure
 * @property {boolean} [lightDismiss] whether a pointer press outside closes the disclosure
 * @property {boolean} [dismissOnFocusOut] whether focus leaving the disclosure closes it (opt-in on
 * purpose: it can hide content from a screen-reader user who is on their way back)
 * @property {boolean} [backdrop] whether the content is painted with a backdrop
 * @property {string} [role] the role of the content — the platform adds none, so the component decides
 * @property {string} [label] an `aria-label` for the content
 * @property {string} [labelledby] the id of the element that names the content
 * @property {HTMLElement} [invoker] the element that opens the disclosure, kept in sync with
 * `aria-expanded` / `aria-controls` / `aria-details` (no browser does this for a non-button invoker)
 * @property {boolean} [modal] whether the disclosure blocks interaction with the rest of the page
 * @property {string} [anchor] the css anchor name the content is positioned against
 * @property {string} [area] the css `position-area` when the native route is used
 * @property {string} [placement] the fallback placement for engines without anchor positioning
 * @property {HTMLElement} [elementToFocus] what to focus when the disclosure opens
 * @property {boolean} [arrow] whether an arrow is rendered against the anchor
 * @property {boolean} [scrollLock] whether page scrolling is locked while open
 * @property {number} [zIndex] stacking order of the content
 *
 * @typedef {{ when: (descriptor: DisclosureDescriptor) => boolean, load: () => Promise<unknown> }} Feature
 *
 * @typedef {object} DisclosureOptions
 * @property {HTMLElement} [element] the element events are dispatched on and attributes reflect to
 * @property {HTMLElement | HTMLDialogElement} [content] the element that is revealed and closed
 * @property {DisclosureDescriptor} [descriptor]
 */

/**
 * The disclosure state machine. It owns the truth: `open` is read from the machine, never from
 * computed display, and the DOM is written from exactly one place (`#project`). Every transition
 * increments `epoch`, which lets a consumer discard its own stale observations instead of
 * resurrecting a disclosure that was just closed (see docs/adr/0002).
 */
export class Disclosure {
  /** @type {DisclosureState} */
  #state = 'closed';

  #epoch = 0;

  /** @type {HTMLElement | undefined} */
  #element;

  /** @type {HTMLElement | HTMLDialogElement | undefined} */
  #content;

  /** @type {DisclosureDescriptor} */
  #descriptor;

  /** @type {Set<{ release: () => void }>} */
  #resources = new Set();

  /** @type {boolean} */
  #featuresLoaded = false;

  /** @type {boolean | undefined} */
  #projectedModal;

  /**
   * @param {DisclosureOptions} [options]
   */
  constructor(options = {}) {
    this.#element = options.element;
    this.#content = options.content;
    this.#descriptor = { closedby: 'none', ...options.descriptor };
    this.#descriptorChanged();
  }

  /**
   * The state of the disclosure.
   * @returns {DisclosureState}
   */
  get state() {
    return this.#state;
  }

  /**
   * Whether the disclosure is open. Reading this never touches the DOM.
   * @returns {boolean}
   */
  get open() {
    return this.#state === 'open';
  }

  /**
   * The current transition counter. Consumers record it to prove their observation is current.
   * @returns {number}
   */
  get epoch() {
    return this.#epoch;
  }

  /**
   * The element that wraps the invoker and the content. Events are dispatched on it and it carries
   * the `[open]` attribute. Features use it to tell "inside" from "outside".
   * @returns {HTMLElement | undefined}
   */
  get element() {
    return this.#element;
  }

  /**
   * The element that is revealed and closed.
   * @returns {HTMLElement | HTMLDialogElement | undefined}
   */
  get content() {
    return this.#content;
  }

  /**
   * The serializable description of this disclosure.
   * @returns {DisclosureDescriptor}
   */
  get descriptor() {
    return this.#descriptor;
  }

  /**
   * Currently held resources (listeners, focus traps, scroll locks). Must be empty when closed.
   * @returns {{ release: () => void }[]}
   */
  get resources() {
    return [...this.#resources];
  }

  /**
   * Update the descriptor. This is how a disclosure changes shape with its context: the state and the
   * DOM subtree stay untouched, while the features that no longer apply are released and the new ones
   * are loaded lazily.
   * @param {DisclosureDescriptor} descriptor
   * @returns {Promise<void>}
   */
  async setDescriptor(descriptor) {
    const wasOpen = this.open;
    this.#descriptor = { closedby: 'none', ...descriptor };
    this.#featuresLoaded = false;
    if (!wasOpen) {
      this.#descriptorChanged();
      return;
    }
    this.#releaseAll();
    this.#project();
    await this.#loadFeatures();
  }

  /**
   * @returns {Promise<void>}
   */
  async show() {
    if (this.#state === 'open' || this.#state === 'opening') return;
    if (!this.#emit('open')) return;
    // The observable part flips synchronously; features load afterwards, so nothing is loaded
    // before first paint and no caller sees a half-open state.
    this.#to('open');
    await this.#loadFeatures();
  }

  /**
   * @returns {Promise<void>}
   */
  async close() {
    if (this.#state === 'closed' || this.#state === 'closing') return;
    if (!this.#emit('closed')) return;
    this.#to('closed');
  }

  /**
   * @returns {Promise<void>}
   */
  async toggle() {
    return this.open ? this.close() : this.show();
  }

  /**
   * Declarative mirror for consumers that follow the state from their own render cycle.
   * A request whose observation predates the current epoch is discarded: it describes a state this
   * disclosure has already left, and honouring it would reopen what was just closed.
   * @param {boolean} open
   * @param {number} [observedEpoch]
   * @returns {Promise<void> | undefined}
   */
  sync(open, observedEpoch) {
    if (observedEpoch !== undefined && observedEpoch < this.#epoch) return undefined;
    return open ? this.show() : this.close();
  }

  /**
   * Release every resource and return to the closed state. Afterwards the disclosure holds nothing.
   * @returns {Promise<void>}
   */
  async teardown() {
    await this.close();
    this.#releaseAll();
    this.#element?.removeAttribute('open');
  }

  /**
   * @returns {void}
   */
  #descriptorChanged() {
    this.#featuresLoaded = false;
    if (this.#content) {
      this.#content.style.display = this.#state === 'open' ? '' : 'none';
      if (this.#descriptor.zIndex !== undefined) {
        this.#content.style.zIndex = String(this.#descriptor.zIndex);
      }
    }
  }

  /**
   * Load every feature the descriptor asks for. Called on show, so nothing is loaded before first
   * paint; anticipation (interest, pointerenter) is allowed, blocking never.
   * @returns {Promise<void>}
   */
  async #loadFeatures() {
    if (this.#featuresLoaded) return;
    this.#featuresLoaded = true;
    const { features } = await import('./registry.js');
    await Promise.all(
      features
        .filter(feature => feature.when(this.#descriptor))
        .map(async feature => {
          const install =
            /** @type {(d: Disclosure, x: DisclosureDescriptor) => {release: () => void}} */ (
              await feature.load()
            );
          this.#acquire(install(this, this.#descriptor));
        }),
    );
  }

  /**
   * @param {'open' | 'closed'} newState
   * @returns {boolean} whether the transition may proceed
   */
  #emit(newState) {
    const event = new CustomEvent('beforetoggle', {
      cancelable: true,
      detail: { newState, oldState: this.#state },
    });
    this.#element?.dispatchEvent(event);
    return !event.defaultPrevented;
  }

  /**
   * @param {'open' | 'closed'} next
   * @returns {void}
   */
  #to(next) {
    this.#state = next;
    this.#epoch += 1;
    if (next === 'closed') this.#releaseAll();
    this.#project();
    this.#element?.dispatchEvent(
      new CustomEvent('toggle', {
        detail: { newState: next, oldState: next === 'open' ? 'closed' : 'open' },
      }),
    );
  }

  /**
   * The only writer of the open state in the DOM. Keep it that way: two writers are how state and
   * display start disagreeing.
   * @returns {void}
   */
  #project() {
    const { open } = this;
    this.#element?.toggleAttribute('open', open);
    const content = this.#content;
    if (!content) return;
    if (content instanceof HTMLDialogElement) {
      const wantModal = Boolean(this.#descriptor.modal);
      if (open) {
        if (!content.open) {
          // `modal` is the platform's own focus trap: a modal dialog is what the descriptor asked for.
          if (wantModal) content.showModal();
          else content.show();
        } else if (wantModal !== this.#projectedModal) {
          // switching context between non-modal and modal means re-showing the dialog: the platform
          // cannot change modality on an open dialog
          content.close();
          if (wantModal) content.showModal();
          else content.show();
        }
      } else if (content.open) {
        content.close();
      }
      this.#projectedModal = open ? wantModal : undefined;
      return;
    }
    content.toggleAttribute('open', open);
  }

  /**
   * @param {{ release: () => void }} resource
   * @returns {void}
   */
  #acquire(resource) {
    if (this.#state !== 'open') {
      resource.release();
      return;
    }
    this.#resources.add(resource);
  }

  /**
   * @returns {void}
   */
  #releaseAll() {
    for (const resource of this.#resources) resource.release();
    this.#resources.clear();
  }
}

/**
 * Dev and test aid: the invariants that must hold after every transition. It lives outside the class
 * on purpose — production bundles that never call it tree-shake it away, so the core stays minimal.
 * @param {Disclosure} disclosure
 * @returns {{ state: DisclosureState, epoch: number, projected: boolean, resources: number }}
 */
export function invariants(disclosure) {
  return {
    state: disclosure.state,
    epoch: disclosure.epoch,
    projected: (disclosure.element?.hasAttribute('open') ?? false) === disclosure.open,
    resources: disclosure.resources.length,
  };
}
