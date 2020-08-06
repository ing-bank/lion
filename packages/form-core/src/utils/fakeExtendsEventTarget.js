// TODO: this method has to be removed when EventTarget polyfill is available on IE11
// TODO: move to core and apply everywhere?
// TODO: pascalCase this filename?
/**
 * @param {HTMLElement} instance
 */
export function fakeExtendsEventTarget(instance) {
  const delegate = document.createDocumentFragment();

  /**
   * @param {string} type
   * @param {EventListener} listener
   * @param {Object} opts
   */
  const delegatedMethodAdd = (type, listener, opts) =>
    delegate.addEventListener(type, listener, opts);

  /**
   * @param {Event|CustomEvent} event
   */
  const delegatedMethodDispatch = event => delegate.dispatchEvent(event);

  /**
   * @param {string} type
   * @param {EventListener} listener
   * @param {Object} opts
   */
  const delegatedMethodRemove = (type, listener, opts) =>
    delegate.removeEventListener(type, listener, opts);

  /* eslint-disable no-param-reassign */
  instance.addEventListener = delegatedMethodAdd;
  instance.dispatchEvent = delegatedMethodDispatch;
  instance.removeEventListener = delegatedMethodRemove;
  /* eslint-enable no-param-reassign */
}
