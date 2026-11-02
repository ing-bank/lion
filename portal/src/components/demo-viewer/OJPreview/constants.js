/**
 * @typedef {import('lit').CSSResult} CSSResult
 */

// const themes = ['legacy', 'retail', 'youth', 'business', 'private', 'wholesale', 'wireframe'];
// const themesBasic = ['legacy', 'oj2', 'wireframe'];
export const surfaces = [
  'default',
  'primary',
  'secondary',
  'secondary-subtle',
  'secondary-moderate',
  'secondary-bold',
  'tertiary',
  'tertiary-subtle',
  'tertiary-moderate',
  'tertiary-bold',
  'quaternary',
  'quaternary-subtle',
  'quaternary-moderate',
  'quaternary-bold',
  'neutral',
  'neutral-subtle',
  'neutral-moderate',
  'neutral-bold',
  'inverse',
];

export const modes = ['light', 'dark'];

export const supportsAdoptingStyleSheets =
  window.ShadowRoot &&
  // @ts-ignore
  (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
  'adoptedStyleSheets' in Document.prototype &&
  'replace' in CSSStyleSheet.prototype;
