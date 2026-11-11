export class EventTargetShim {
  constructor() {
    const delegate = document.createDocumentFragment();

    /**
     *
     * @param {string} type
     * @param {EventListener} listener
     * @param {Object} [opts]
     */
    const delegatedAddEventListener = (type, listener, opts) =>
      delegate.addEventListener(type, listener, opts);

    /**
     * @param {string} type
     * @param {EventListener} listener
     * @param {Object} [opts]
     */
    const delegatedRemoveEventListener = (type, listener, opts) =>
      delegate.removeEventListener(type, listener, opts);

    /**
     * @param {Event|CustomEvent} event
     */
    const delegatedDispatchEvent = event => delegate.dispatchEvent(event);

    this.addEventListener = delegatedAddEventListener;

    this.removeEventListener = delegatedRemoveEventListener;

    this.dispatchEvent = delegatedDispatchEvent;
  }
}
