import { Disclosure } from '../../disclosure-system/src/core/DisclosureCore.js';

/**
 * @typedef {import('../../disclosure-system/src/core/DisclosureCore.js').DisclosureDescriptor} DisclosureDescriptor
 *
 * @typedef {object} LegacyDisclosureOptions
 * @property {HTMLElement} element the element that wraps invoker and content
 * @property {HTMLElement | HTMLDialogElement} [content]
 * @property {DisclosureDescriptor} [descriptor]
 */

/**
 * The compatibility layer for extensions written before the platform vocabulary. It presents the old
 * names (`opened`, `isShown`, `show()`, `hide()`, `_showComplete`, `_hideComplete`) and the old
 * events (`before-show`, `show`, `before-hide`, `hide`, `before-opened`, `opened-changed`,
 * `before-closed`, `closed-changed`, `close-overlay`) on top of the state machine.
 *
 * It is a pure mapping: the state machine decides *when* things happen and flips the observable state
 * synchronously, so this layer never re-times anything. The completion promises legacy code awaits
 * are kept here, derived from the `toggle` event, which is why the core does not have to carry them —
 * see docs/adr/0003-compat-layer-ships-as-subpath-exports.md.
 */
export class LegacyDisclosure {
  /** @type {Disclosure} */
  #disclosure;

  /** @type {HTMLElement} */
  #element;

  /** @type {Promise<void>} */
  #whenOpen = Promise.resolve();

  /** @type {((value: void) => void) | undefined} */
  #resolveOpen;

  /** @type {Promise<void>} */
  #whenClosed = Promise.resolve();

  /** @type {((value: void) => void) | undefined} */
  #resolveClosed;

  /**
   * @param {LegacyDisclosureOptions} options
   */
  constructor(options) {
    this.#element = options.element;
    this.#disclosure = new Disclosure({
      element: options.element,
      content: options.content,
      descriptor: options.descriptor,
    });
    this.#mapEvents();
  }

  /**
   * The state machine underneath, for code that already speaks the new vocabulary.
   * @returns {Disclosure}
   */
  get controller() {
    return this.#disclosure;
  }

  /** @returns {boolean} legacy name for `open` */
  get opened() {
    return this.#disclosure.open;
  }

  /** @param {boolean} value */
  set opened(value) {
    this.#arm(value);
    this.#disclosure.sync(value);
  }

  /** @returns {boolean} legacy name for `open` */
  get isShown() {
    return this.#disclosure.open;
  }

  /** @returns {HTMLElement} legacy name for the controller of this host */
  get _overlayCtrl() {
    return this.#element;
  }

  /** @returns {Promise<void>} resolves on the terminal state, never on an animation */
  get _showComplete() {
    return this.#whenOpen;
  }

  /** @returns {Promise<void>} resolves on the terminal state, never on an animation */
  get _hideComplete() {
    return this.#whenClosed;
  }

  /** @returns {Promise<void>} */
  async show() {
    this.#arm(true);
    await this.#disclosure.show();
    this.#settlePending();
    return this.#whenOpen;
  }

  /** @returns {Promise<void>} */
  async hide() {
    this.#arm(false);
    await this.#disclosure.hide();
    this.#settlePending();
    return this.#whenClosed;
  }

  /** @returns {Promise<void>} */
  async toggle() {
    this.#arm(!this.#disclosure.open);
    await this.#disclosure.toggle();
    this.#settlePending();
    return this.#disclosure.open ? this.#whenOpen : this.#whenClosed;
  }

  /** @returns {Promise<void>} */
  async teardown() {
    this.#element.removeEventListener('beforetoggle', this.#onBeforeToggle);
    this.#element.removeEventListener('toggle', this.#onToggle);
    this.#element.removeEventListener('close-overlay', this.#onCloseOverlay);
    await this.#disclosure.teardown();
  }

  /**
   * Prepare the promise legacy code awaits. It resolves from the `toggle` event, so it is always tied
   * to a real state change and never to an animation.
   * @param {boolean} open
   * @returns {void}
   */
  #arm(open) {
    if (open && !this.#disclosure.open) {
      this.#whenOpen = new Promise(resolve => {
        this.#resolveOpen = resolve;
      });
    }
    if (!open && this.#disclosure.open) {
      this.#whenClosed = new Promise(resolve => {
        this.#resolveClosed = resolve;
      });
    }
  }

  /**
   * Legacy code awaits `_showComplete`/`_hideComplete`. A transition that never happened (it was
   * cancelled from `before-show`, say) also has to settle, exactly like the old implementation did.
   * @returns {void}
   */
  #settlePending() {
    this.#resolveOpen?.();
    this.#resolveClosed?.();
    this.#resolveOpen = undefined;
    this.#resolveClosed = undefined;
  }

  /**
   * Legacy events are dispatched from inside the platform events: a legacy listener that calls
   * `preventDefault()` therefore cancels the `beforetoggle` it is mapped onto.
   * @returns {void}
   */
  #mapEvents() {
    this.#element.addEventListener('beforetoggle', this.#onBeforeToggle);
    this.#element.addEventListener('toggle', this.#onToggle);
    this.#element.addEventListener('close-overlay', this.#onCloseOverlay);
  }

  /** @param {Event} event */
  #onBeforeToggle = event => {
    const { newState } = /** @type {CustomEvent<{ newState: 'open' | 'closed' }>} */ (event).detail;
    const names =
      newState === 'open' ? ['before-show', 'before-opened'] : ['before-hide', 'before-closed'];
    for (const name of names) {
      const legacy = new CustomEvent(name, { cancelable: true });
      if (!this.#element.dispatchEvent(legacy)) event.preventDefault();
    }
  };

  /** @param {Event} event */
  #onToggle = event => {
    const { newState } = /** @type {CustomEvent<{ newState: 'open' | 'closed' }>} */ (event).detail;
    const names = newState === 'open' ? ['show', 'opened-changed'] : ['hide', 'closed-changed'];
    if (newState === 'open') this.#resolveOpen?.();
    else this.#resolveClosed?.();
    this.#resolveOpen = undefined;
    this.#resolveClosed = undefined;
    for (const name of names) this.#element.dispatchEvent(new CustomEvent(name));
  };

  /** @returns {Promise<void>} */
  #onCloseOverlay = () => this.hide();
}
