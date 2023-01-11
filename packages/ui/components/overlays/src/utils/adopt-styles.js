// See: https://github.com/ing-bank/lion/issues/1880

/**
 * @typedef {import('lit').CSSResult|CSSStyleSheet} AdoptableStyle
 * @typedef {(renderRoot:DocumentOrShadowRoot, style: AdoptableStyle, opts?: {teardown?: boolean}) => void} AdoptStyleFn
 * @typedef {(renderRoot:DocumentOrShadowRoot, styles: AdoptableStyle[], opts?: {teardown?: boolean}) => void} AdoptStylesFn
 */

// Shared protected object that can be spied/mocked in tests
export const _adoptStyleUtils = {
  // Mocking Document.prototype.adoptedStyleSheets seemed impossible
  supportsAdoptingStyleSheets:
    window.ShadowRoot &&
    // @ts-ignore
    (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype,
  /** @type {AdoptStyleFn} */
  // @ts-ignore
  adoptStyle: undefined,
  /** @type {AdoptStylesFn} */
  // @ts-ignore
  adoptStyles: undefined,
};

const styleCache = new Map();

/**
 * @param {CSSStyleSheet} cssStyleSheet
 */
export function serializeConstructableStylesheet(cssStyleSheet) {
  return Array.from(cssStyleSheet.cssRules)
    .map(r => r.cssText)
    .join('');
}

/**
 * @param {DocumentOrShadowRoot} renderRoot
 * @param {AdoptableStyle} style
 * @param {{teardown?: boolean}} opts
 */
function adoptStyleWhenAdoptedStylesheetsNotSupported(
  renderRoot,
  style,
  { teardown = false } = {},
) {
  const adoptRoot = /** @type {ShadowRoot|Document['body']} */ (
    renderRoot === document ? document.body : renderRoot
  );
  // @ts-ignore
  const styleText = style.cssText || serializeConstructableStylesheet(style);

  if (!teardown) {
    const styleEl = document.createElement('style');
    // keep notation, so it's not renamed in minification/build
    // eslint-disable-next-line dot-notation
    const nonce = window['litNonce'];
    if (nonce !== undefined) {
      styleEl.setAttribute('nonce', nonce);
    }
    styleEl.textContent = styleText;
    adoptRoot.appendChild(styleEl);
  } else {
    const foundStyleEls = Array.from(adoptRoot.querySelectorAll('style'));

    for (const foundStyleEl of foundStyleEls) {
      if (foundStyleEl.textContent === styleText) {
        foundStyleEl.remove();
        break;
      }
    }
  }
}

/**
 * @param {DocumentOrShadowRoot} renderRoot
 * @param {AdoptableStyle} style
 * @param {{teardown?: boolean}} opts
 */
function handleCache(renderRoot, style, { teardown = false } = {}) {
  let haltFurtherExecution = false;
  if (!styleCache.has(renderRoot)) {
    styleCache.set(renderRoot, []);
  }
  const addedStylesForRoot = styleCache.get(renderRoot);
  const foundStyle = addedStylesForRoot.find(
    (/** @type {import("lit").CSSResultOrNative} */ addedStyle) => style === addedStyle,
  );

  if (foundStyle && teardown) {
    addedStylesForRoot.splice(addedStylesForRoot.indexOf(style), 1);
  } else if (!foundStyle && !teardown) {
    addedStylesForRoot.push(style);
  } else if ((foundStyle && !teardown) || (!foundStyle && teardown)) {
    // Already removed or added. We're done
    haltFurtherExecution = true;
  }

  return { haltFurtherExecution };
}

/** @type {AdoptStyleFn} */
export function adoptStyle(renderRoot, style, { teardown = false } = {}) {
  const { haltFurtherExecution } = handleCache(renderRoot, style, { teardown });
  if (haltFurtherExecution) {
    return;
  }

  if (!_adoptStyleUtils.supportsAdoptingStyleSheets) {
    adoptStyleWhenAdoptedStylesheetsNotSupported(renderRoot, style, { teardown });
    return;
  }

  const sheet = style instanceof CSSStyleSheet ? style : style.styleSheet;
  if (!sheet) {
    throw new Error(`Please provide a CSSResultOrNative style`);
  }

  if (!teardown) {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    renderRoot.adoptedStyleSheets.push(sheet);
  } else if (renderRoot.adoptedStyleSheets.includes(sheet)) {
    renderRoot.adoptedStyleSheets.splice(renderRoot.adoptedStyleSheets.indexOf(sheet), 1);
  }
}

/** @type {AdoptStylesFn} */
export function adoptStyles(renderRoot, styles, { teardown = false } = {}) {
  for (const style of styles) {
    _adoptStyleUtils.adoptStyle(renderRoot, style, { teardown });
  }
}

_adoptStyleUtils.adoptStyle = adoptStyle;
_adoptStyleUtils.adoptStyles = adoptStyles;
