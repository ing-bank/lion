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
  match: CssNodePlain;
  compounds: CssNodePlain[];
  siblings: CssNodePlain[];
  preceedingSiblings: CssNodePlain[];
  astContext: AstContextPlain;
};

export type ReplaceFn = (
  context: ReplaceContext,
) =>
  | {
      replacementNodes: CssNodePlain[];
      replaceCompleteSelector?: boolean;
      replaceAfterAmount?: number;
    }
  | undefined;

export type CssTransformConfig = {
  cssSources: string[] | { path: string; source: string }[];
  host?: string;
  slots?: { [key: string]: string[] };
  states?: { [key: string]: string[] };
  settings?: { contextSelectorHandler?: ReplaceFn; getStateSelectorParts?: Function };
};
