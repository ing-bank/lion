/**
 * Useful in tests when no need for wc
 */
export function createShadowHost() {
  const shadowHost = document.createElement('div');
  shadowHost.attachShadow({ mode: 'open' });
  /** @type {ShadowRoot} */ (shadowHost.shadowRoot).innerHTML = `<slot></slot>`;
  document.body.appendChild(shadowHost);

  return {
    shadowHost,
    cleanupShadowHost: () => {
      document.body.removeChild(shadowHost);
    },
  };
}
