// @lion/core
// export { dedupeMixin, SlotMixin, DelegateMixin, UpdateStylesMixin } from '@lion/core';
// export { ScopedElementsMixin } from '@open-wc/scoped-elements';

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
  supportsAdoptingStyleSheets,
  CSSResult,
  unsafeCSS,
  css,
  defaultConverter,
  notEqual,
  UpdatingElement,
  customElement,
  property,
  query,
  queryAll,
  eventOptions,
} from 'lit-element';

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
  NodePart,
  isPrimitive,
} from 'lit-html';
