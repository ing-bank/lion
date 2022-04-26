import { css as css2, html as html2 } from '@lion/core';
import { css as css1, html as html1 } from '@lion/core';

import { html2Hybrid } from '../hybrid-lit/html2-hybrid-tag';

import { cssHybrid } from '../hybrid-lit/css-hybrid-tag';

export type HybridCore = {
  cssHybrid: typeof cssHybrid | typeof css1;
  html2Hybrid: typeof html2Hybrid | typeof html1;

  css: css1 | css2;
  html: html1 | html2;
  nothing: nothing;
  asyncAppend: asyncAppend;
  asyncReplace: asyncReplace;
  cache: cache;
  classMap: classMap;
  guard: guard;
  ifDefined: ifDefined;
  repeat: repeat;
  styleMap: styleMap;
  unsafeHTML: unsafeHTML;
  unsafeCSS: unsafeCSS;
  until: until;
  LitElement: LitElement1 | LitElement2;
  ScopedElementsMixin: ScopedElementsMixin;
  unsafeHTML: unsafeHTML;
  render: render;
  svg: svg;
  directive: directive;
  Directive: Directive;
  dedupeMixin: dedupeMixin;
  SlotMixin: SlotMixin;
  DelegateMixin: DelegateMixin;
  isPrimitive: isPrimitive;
  UpdateStylesMixin: UpdateStylesMixin;

  isTemplateResult: isTemplateResult;
};
