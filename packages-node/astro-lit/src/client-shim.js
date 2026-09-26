/**
 * @license
 * Copyright 2026 ING Bank N.V.
 * SPDX-License-Identifier: MIT
 *
 * Declarative Shadow DOM ponyfill, injected into `<head>` of every page.
 *
 * Browsers that already support declarative shadow DOM parsing do nothing here
 * (the check below short-circuits). Older browsers hydrate the shadow roots
 * once the document is parsed.
 */
async function polyfill() {
  const { hydrateShadowRoots } = await import(
    '@webcomponents/template-shadowroot/template-shadowroot.js'
  );
  window.addEventListener('DOMContentLoaded', () => hydrateShadowRoots(document.body), {
    once: true,
  });
}

const polyfillCheckEl = Document.parseHTMLUnsafe(
  '<p><template shadowrootmode="open"></template></p>',
).querySelector('p');

if (!polyfillCheckEl?.shadowRoot) {
  polyfill();
}
