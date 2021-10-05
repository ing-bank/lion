import {
  CssNodePlain,
  Selector,
  SelectorPlain,
  SelectorList,
  SelectorListPlain,
  Rule,
  RulePlain,
  Atrule,
  AtrulePlain,
  StyleSheet,
  StyleSheetPlain,
} from './csstree';

export type AstContext = {
  selector: Selector | SelectorPlain;
  selectorList: SelectorList | SelectorListPlain;
  rule: Rule | RulePlain;
  atRule: Atrule | AtrulePlain;
  stylesheet: StyleSheet | StyleSheetPlain;
};

export type AstContextPlain = {
  selector: SelectorPlain;
  selectorList: SelectorListPlain;
  rule: RulePlain;
  atRule: AtrulePlain;
  stylesheet: StyleSheetPlain;
};

export type ReplaceContext = {
  match: CssNodePlain | WrappedHostMatcher;
  compounds: CssNodePlain[];
  siblings: CssNodePlain[];
  preceedingSiblings: CssNodePlain[];
  astContext: AstContextPlain;
};

export type ReplaceFn = (context: ReplaceContext) =>
  | {
      replacementNodes: CssNodePlain[];
      replaceCompleteSelector?: boolean;
      startIndex?: number;
    }
  | undefined;

export type CssTransformConfig = {
  cssSources: string[] | { path: string; source: string }[];
  host?: string;
  slots?: { [key: string]: string[] };
  states?: { [key: string]: string[] };
  settings?: {
    contextSelectorHandler?: ReplaceFn;
    getCategorizedSelectorParts?: Function;
    additionalHostMatcher: Function;
  };
  htmlMeta?: { classesInHtml: string[] };
};

export type CategorizedPreAnalysisResult = {
  hosts: Set<string>;
  elements: Set<string>;
  states: Set<string>;
  resultsPerHost: { host: string; elements: string[]; states: string[] }[];
};

export type ActionList = { type: 'deletion' | string; action: Function; originalCode: string }[];
export type SelectorChildNodePlain = CssNodePlain & { name: string };
export type MatcherFn = (traversedSelector: SelectorChildNodePlain) => boolean;
export type Transform = { matcher: MatcherFn; replaceFn: ReplaceFn };
export type Transforms = { host?: Transform; slots?: Transform[]; states?: Transform[] };

export type SCNode = CssNodePlain & { name: string; children: SCNode[] };
export type WrappedHostMatcher = {
  matchHost: CssNodePlain;
  matchHostChild: CssNodePlain;
  originalMatcher: MatcherFn;
};

export type MatchResult = {
  /*
   * When we have a SelectorPart that is a PseudoSelector like ':host(:not(.comp--a)) .comp__body',
   * and we are looking for comp--a, we need to be aware of the fact that the original Selector has
   * two SelectorParts (:host and .comp--a).
   * But... we need to store the traveersal path of Selectors within the
   * original SelectorPart.
   * So we would get [CssNodePlain('.:host), CssNodePlain(':not')]
   */
  ancestorPath: CssNodePlain[];
  matchHostChild: CssNodePlain;
  /** The function that was used to get  */
  originalMatcher: MatcherFn;
};
