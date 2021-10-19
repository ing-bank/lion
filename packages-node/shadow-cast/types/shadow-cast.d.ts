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
  selector: Selector | SelectorPlain | SCNode;
  selectorList: SelectorList | SelectorListPlain;
  rule: Rule | RulePlain;
  atRule: Atrule | AtrulePlain;
  stylesheet: StyleSheet | StyleSheetPlain;
};

export type AstContextPlain = {
  selector: SCNode;
  selectorList: SelectorListPlain;
  rule: RulePlain;
  atRule: AtrulePlain;
  stylesheet: StyleSheetPlain;
};

export type ReplaceContext = {
  matchResult: MatchResult;
  compounds: SCNode[];
  succeedingSiblings: SCNode[];
  preceedingSiblings: SCNode[];
  astContext: AstContextPlain;
};

export type ReplaceFn = (context: ReplaceContext) =>
  | {
      /*
       * The nodes that should be replaced. For instance
       * '.comp.comp--a.comp--b' => ':host(.comp--a.comp--b)'
       */
      replacementNodes: SCNode[];
      /*
       * The number of nodes that needs to be deleted (0 by default).
       * For a Selector transform like '.comp.comp--a.comp--b' => ':host(.comp--a.comp--b)',
       * the number of nodes to delete is 2 (from a length of 3 to 1).
       */
      deleteAfterCount?: number;
      /*
       * Whether the complete Selector should be replaced.
       * In case replacementNodes is empty, the complete Selector will be removed
       */
      replaceCompleteSelector?: boolean;
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
    additionalHostMatcher?: Function;
    /**
     * If we have:
     * - Selector ':host .comp__feedback.comp__feedback--invalid {...}'
     * - config: {host: '.comp', states: {'[invalid]': '.comp__feedback--invalid' }
     * Result will be ':host([invalid]) .comp__feedback {...}'.
     *
     * However, ':host .comp__feedback.comp__feedback--invalid' would result in
     * ':host([invalid]) {...}' => We miss '.comp__feedback', which is needed for the CSS
     * rule to work accurately.
     *
     * For BEM, we can safely deduct this SelectorPart:
     * '.comp__feedback--invalid' minus '--{x}' is '.comp__feedback-'
     *
     * When this function is defined, no error will be thrown, but the deducted SelectorPart will
     * be used instead.
     */
    createCompoundFromStatePart?: (serializedStatePart: string) => string;
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
export type MatcherFn = (
  traversedSelectorPart: SCNode,
  parentSelector: SCNode,
) => MatchResult | undefined;
export type Transform = { matcher: MatcherFn; replaceFn: ReplaceFn };
export type Transforms = { host?: Transform; slots?: Transform[]; states?: Transform[] };

export type SCNode = CssNodePlain & { name: string; children: SCNode[] };
// export type WrappedHostMatcher = {
//   matchHost: CssNodePlain;
//   matchHostChild: CssNodePlain;
//   originalMatcher: MatcherFn;
// };

export type MatchResult = {
  /*
   * When we have a SelectorPart that is a PseudoSelector like ':host(:not(.comp--a)) .comp__body',
   * and we are looking for .comp--a, we need to be aware of the fact that the original Selector has
   * only two SelectorParts: [':host(:not(.comp--a))', '.comp__body'].
   * In order to correctly replace, we need to store the traversal path of Selectors within the
   * original SelectorPart.
   * So we would get an ancestorPath of [CssNodePlain(':host), CssNodePlain(':not')]
   *
   * When we do not deal with PseudoSelectors (for instance when we are looking for '.comp--a' in
   * Selector '.comp.comp--a comp__body'), ancestorPath would be empty.
   */
  ancestorPath: SCNode[];
  /**
   * The matched SelectorPart. For instance, if we are looking for '.comp--a' in the following
   * Selectors:
   * - ':host(:not(.comp--a)) .comp__body'
   * - '.comp.comp--a .comp__body'
   * It would return CssNodePlain('.comp--a') in both cases.
   * The difference: in the latter case, ancestorPath would be empty.
   */
  matchedSelectorPart: SCNode;
  /** Replaces matched SelectorPart in its original context  */
  replace: (newSelectorPart: SCNode) => void;
  /** Removes matched SelectorPart  */
  remove: () => void;
  /** Additional meta for positives of match condition functions */
  matchConditionMeta?: MatchConditionMeta;
};

export type MatchConditionMeta = { partialHostMatchNode?: SCNode };
