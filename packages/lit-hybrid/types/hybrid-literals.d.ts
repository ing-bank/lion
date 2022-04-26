import {
  CSSResult as CSSResult1,
  TemplateResult as TemplateResult1,
  SVGTemplateResult as SVGTemplateResult1,
} from '@lion/core';

export type CSSResultHybrid = CSSResult1 & { _$cssResult$: boolean };
export type TemplateResultHybrid = TemplateResult1 & { _$litType$: number };
export type SVGTemplateResultHybrid = SVGTemplateResult1 & { _$litType$: number };
