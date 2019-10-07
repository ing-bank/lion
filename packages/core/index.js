/**
 * Info for TypeScript users:
 *   For now please import types from lit-element and lit-html directly.
 */

// lit-html
export {
  html,
  svg,
  render,
  noChange,
  nothing,
  directive,
  isDirective,
  TemplateResult,
  SVGTemplateResult,
} from 'lit-html';
export { render as renderShady } from 'lit-html/lib/shady-render.js';
export { asyncAppend } from 'lit-html/directives/async-append.js';
export { asyncReplace } from 'lit-html/directives/async-replace.js';
export { cache } from 'lit-html/directives/cache.js';
export { classMap } from 'lit-html/directives/class-map.js';
export { guard } from 'lit-html/directives/guard.js';
export { ifDefined } from 'lit-html/directives/if-defined.js';
export { repeat } from 'lit-html/directives/repeat.js';
export { styleMap } from 'lit-html/directives/style-map.js';
export { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
export { until } from 'lit-html/directives/until.js';
// lit-element
export {
  LitElement,
  // css-tag.js
  supportsAdoptingStyleSheets,
  CSSResult,
  unsafeCSS,
  css,
  // updating-element.js
  defaultConverter,
  notEqual,
  UpdatingElement,
  // decorators.js
  customElement,
  property,
  query,
  queryAll,
  eventOptions,
} from 'lit-element';
// ours
export { dedupeMixin } from './src/dedupeMixin.js';
export { DelegateMixin } from './src/DelegateMixin.js';
export { DomHelpersMixin } from './src/DomHelpersMixin.js';
export { LionSingleton } from './src/LionSingleton.js';
export { SlotMixin } from './src/SlotMixin.js';
export { DisabledMixin } from './src/DisabledMixin.js';
export { DisabledWithTabIndexMixin } from './src/DisabledWithTabIndexMixin.js';
export { renderAsNode } from './src/render-as-node.js';
