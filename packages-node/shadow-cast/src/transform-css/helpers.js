const csstree = require('css-tree');

/**
 * @typedef {import('../../types/csstree').StyleSheet} StyleSheet
 * @typedef {import('../../types/csstree').StyleSheetPlain} StyleSheetPlain
 * @typedef {import('../../types/csstree').Selector} Selector
 * @typedef {import('../../types/csstree').SelectorPlain} SelectorPlain
 * @typedef {import('../../types/csstree').SelectorList} SelectorList
 * @typedef {import('../../types/csstree').SelectorListPlain} SelectorListPlain
 * @typedef {import('../../types/csstree').Rule} Rule
 * @typedef {import('../../types/csstree').RulePlain} RulePlain
 * @typedef {import('../../types/csstree').CssNode} CssNode
 * @typedef {import('../../types/csstree').CssNodePlain} CssNodePlain
 * @typedef {import('../../types/shadow-cast').CssTransformConfig} CssTransformConfig
 * @typedef {import('../../types/shadow-cast').ReplaceContext} ReplaceContext
 * @typedef {import('../../types/shadow-cast').ReplaceFn} ReplaceFn
 * @typedef {import('../../types/shadow-cast').AstContext} AstContext
 * @typedef {import('../../types/shadow-cast').AstContextPlain} AstContextPlain
 * @typedef {import('../../types/shadow-cast').CategorizedPreAnalysisResult} CategorizedPreAnalysisResult
 * @typedef {import('../../types/shadow-cast').Transforms} Transforms
 * @typedef {import('../../types/shadow-cast').MatcherFn} MatcherFn
 * @typedef {import('../../types/shadow-cast').SelectorChildNodePlain} SelectorChildNodePlain
 * @typedef {import('../../types/shadow-cast').ActionList} ActionList
 * @typedef {import('../../types/shadow-cast').MatchResult} MatchResult
 * @typedef {import('../../types/shadow-cast').SCNode} SCNode
 * @typedef {import('../../types/shadow-cast').MatchConditionMeta} MatchConditionMeta
 */

/**
 * ================
 * Helper functions
 * ==============================================================================================
 */

/**
 * Helper function to be used inside a ReplaceFn to see whether we deal with a 'context Selector'.
 * A context Selector is a Selector that would not be applicable in shadow context, like
 * '[dir=rtl] .comp'
 * @param {CssNodePlain[]} preceedingSiblings
 */
function hasLeadingWhitespace(preceedingSiblings) {
  return (
    preceedingSiblings.length &&
    preceedingSiblings[preceedingSiblings.length - 1].type === 'WhiteSpace'
  );
}

/**
 * @param {string} originalSelectorPart
 */
function getSelectorPartNode(originalSelectorPart) {
  const selectorAst = /** @type {CssNodePlain & {children:any[]}} */ (
    csstree.toPlainObject(csstree.parse(originalSelectorPart, { context: 'selector' }))
  );

  if (selectorAst.children.length !== 1) {
    throw new Error(
      'Only provide selectors in your html mappings with one selector (like ":x:="y:,z")',
    );
  }
  return selectorAst.children[0];
}

/**
 * Helper function that returns a CssNodePlain for a parsed SelectorPart
 * @param {CssNode} selectorPart
 */
function getSelectorEntry(selectorPart) {
  return /** @type {SelectorPlain} */ (csstree.toPlainObject(selectorPart)).children[0];
}

/**
 * Returns the type and value of a SelectorPart
 * See https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#selectors
 * @param {CssNodePlain} selectorPartNode a selcetor part: so '.x' and not '.x .y'
 */
function dissectCssSelectorPart(selectorPartNode) {
  /**
   * @type { {[key:string]: (x:any) => {type:string, attr?: string, value:string} } }
   */
  const typeMap = {
    IdSelector: ast => ({ type: 'id', attr: 'id', value: ast.name }),
    AttributeSelector: ast => ({ type: 'attribute', attr: ast.name.name, value: ast.value.name }),
    ClassSelector: ast => ({ type: 'class', attr: 'class', value: ast.name }),
    // Apparently, csstree does not recognize UniversalSelector:
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors
    TypeSelector: ast => ({ type: ast.name === '*' ? 'universal' : 'type', value: ast.name }),
  };
  return typeMap[selectorPartNode.type](selectorPartNode);
}

/**
 * Imagine we have '.comp--x.comp.comp--y' =>
 * finds .comp--x and .comp--y (preceeding and succeeding respectively)
 * @param {CssNodePlain} selectorPart .comp in example above
 * @param {CssNodePlain[]} siblings
 * @returns {{preceedingParts:CssNodePlain[], succeedingParts:CssNodePlain[]}}
 */
function getSurroundingCompoundParts(selectorPart, siblings) {
  /** @type {CssNodePlain[]} */
  const preceedingParts = [];
  /** @type {CssNodePlain[]} */
  const succeedingParts = [];
  const indexMatchedHost = siblings.indexOf(selectorPart);

  let i;

  for (i = indexMatchedHost - 1; i >= 0; i -= 1) {
    const p = siblings[i];
    if (siblings[i].type === 'WhiteSpace') {
      break;
    }
    preceedingParts.push(p);
  }

  for (i = indexMatchedHost + 1; i < siblings.length; i += 1) {
    const p = siblings[i];
    if (p.type === 'WhiteSpace') {
      break;
    }
    succeedingParts.push(p);
  }

  return { preceedingParts, succeedingParts };
}

/**
 * When array of plain children given, will create ast compatible node and immediately serializes
 * it to css selector
 * @param {SCNode[]|CssNodePlain[]|undefined} selectorPartNodes
 * @returns {string}
 */
function getSerializedSelectorPartsFromArray(selectorPartNodes) {
  if (!selectorPartNodes?.length) {
    return '';
  }
  const dummySelector = csstree.parse('.x .y');
  // @ts-expect-error
  dummySelector.children = selectorPartNodes;
  return csstree.generate(dummySelector);
}

/**
 * Say we have :host(:not(.comp--warning)).
 * For unparsed PseudoSelectors (like host, which is apparently not knwo by css-tree),
 * we need to parse the raw contents:
 * - From:
 * `{ type: 'Raw', name: 'host', value: ':not(.comp--warning)' }`
 * - To:
 * `{ type: 'SelectorList', name: 'host', children: [{ type: 'Selector', children: [<parsedSelector>]}] }`
 *
 * @param {SCNode} pseudoNode, SCNode for pseudo selectors like ':host([x])
 * @returns {SCNode} original pseudoNode with parsed children
 */
function normalizePseudoSelector(pseudoNode) {
  const rawNode = /** @type {SCNode & {value:string}} */ (
    pseudoNode.children?.find(c => c.type === 'Raw')
  );
  if (rawNode) {
    const parsedSelector = /** @type {SCNode} */ (
      csstree.toPlainObject(csstree.parse(rawNode.value, { context: 'selector' }))
    );
    // This is the normalization step that compensates for the fact that csstree does not parse
    // PseudoSelectors like "host(.comp--a)"
    // @ts-expect-error
    // eslint-disable-next-line no-param-reassign
    pseudoNode.children = [{ type: 'SelectorList', children: [parsedSelector] }];
  }
  return pseudoNode;
}

/**
 * For PseudoSelectors, we need to parse the raw contents into a SCNode[].
 * For ':host(.comp--warning)', this would be ['.comp--warning'].
 *
 * Since the contents of :host() are not parsed, we need to do it ourselves. When the contents
 * are already parsed (like for :not()), we can just return the parsed contents.
 * @param {SCNode} pseudoNode, SCNode for pseudo selectors like ':host([x])
 * @returns {SCNode[]}
 */
function normalizePseudoSelectorAndGetChildren(pseudoNode) {
  normalizePseudoSelector(pseudoNode);
  // If we already parsed the contents of the pseudo selector: return it
  if (pseudoNode.children && pseudoNode.children[0]) {
    return pseudoNode.children[0].children[0].children;
  }
  // No children, return empty array
  return [];
}

/**
 * @param {SCNode} plainSelector
 * @param {number} matchIndex
 */
function getReplaceContext(plainSelector, matchIndex) {
  /** @type {SCNode[]} */
  const compounds = [];
  /** @type {SCNode[]} */
  const succeedingSiblings = [];
  /** @type {SCNode[]} */
  const preceedingSiblings = [];

  const separatorTypes = ['WhiteSpace', 'Combinator'];

  /**
   * Assume selector '.comp.x.y .comp__a .comp__b'
   * The selector will be ['.comp','.x','.y', ' ', '.comp__a', ' ', '.comp__b']
   * '.comp' will be the matchIndex (0).
   * We will loop over all indexes after. First, we gather all compounds: ['.x', ',y'].
   * From there on, we gather all siblings: [' ', '.comp__a', ' ', '.comp__b']
   */
  let closestWhiteSpaceIndexBeforeMatch = -1;
  plainSelector.children.some((curSibling, i) => {
    if (i >= matchIndex) {
      return true;
    }
    if (separatorTypes.includes(curSibling.type)) {
      closestWhiteSpaceIndexBeforeMatch = i;
    }
    return false;
  });

  plainSelector.children.forEach((curSibling, i) => {
    if (i === matchIndex) {
      return;
    }
    if (i < matchIndex) {
      if (i <= closestWhiteSpaceIndexBeforeMatch) {
        preceedingSiblings.push(curSibling);
      } else {
        compounds.push(curSibling);
      }
    } else if (!succeedingSiblings.length && !separatorTypes.includes(curSibling.type)) {
      compounds.push(curSibling);
    } else {
      succeedingSiblings.push(curSibling);
    }
  });

  return { compounds, succeedingSiblings, preceedingSiblings };
}

/**
 * @param {MatchResult} matchResult
 */
function isMatchWrappedInHost(matchResult) {
  return matchResult.ancestorPath[0] && matchResult.ancestorPath[0].name === 'host';
}

/**
 * @param {MatchResult} matchResult
 */
function isMatchWrappedInPseudoSelector(matchResult) {
  return Boolean(matchResult.ancestorPath[0]);
}

let callCount = 0;

// TODO: we stop at first found match, theoretically we could have .comp:not(.comp--a):has(> .comp--a))
// We would need to return an array of MatchResults, with different ancestorPaths
/**
 * Matches recursively (because of potential PseudoClassSelectors).
 * @param {object} options
 * @param {SCNode[]} options.selectorPartsToSearchIn a Selector like '.host(:not(.comp--a)) .comp__body'
 * @param {SCNode[]} options.selectorPartsToBeFound SelectorParts within PseudoSelector that should be
 * matched, like [CssNodePlain('.comp--a')]
 * @param {SCNode} options.parentSelector the parent node of the selectorPartsToSearchIn
 * @param {( pseudoSP: SCNode, selectorPartToBeFound: SCNode) => boolean} [options.matchCondition]
 * @param {object} [options.internalOptions]
 * @param {Partial<MatchResult>} [options.internalOptions.result] MatchResult, shared across multiple stages of recursive
 * traversal
 * @param {number} [options.internalOptions.depth] depth of recursive traversal, used internally
 * @returns {MatchResult|undefined}
 */
function findMatchResult({
  selectorPartsToSearchIn,
  selectorPartsToBeFound,
  parentSelector,
  matchCondition = (a, b) => a.type === b.type && a.name === b.name,
  internalOptions: { result = { ancestorPath: [] }, depth = 0 } = {},
}) {
  callCount += 1;
  if (callCount > 100000) {
    throw new Error('10');
  }
  selectorPartsToSearchIn.some((selectorPart, i) => {
    // Are we dealing with a nested PseudoSelector like ':host(:not(.comp--a))'
    // whose raw contents should be parsed and searched?
    if (selectorPart.type === 'PseudoClassSelector' && selectorPart.children) {
      /**
       * innerSelector:
       * For :host(.comp--a.comp--b), we would get back SCNodes for ['.comp--a', '.comp--b']
       */
      const innerSelector = normalizePseudoSelector(selectorPart).children[0].children[0];
      result.ancestorPath?.push(selectorPart);

      findMatchResult({
        selectorPartsToSearchIn: innerSelector.children,
        selectorPartsToBeFound,
        parentSelector: innerSelector,
        matchCondition,
        internalOptions: { result, depth: depth + 1 },
      });
      // Stop here if we found a match 1 lvl deeper
      return Boolean(result.matchedSelectorPart);
    }

    /** @type {MatchConditionMeta|boolean} */
    let foundMatch = false;
    selectorPartsToBeFound.some(toBeFound => {
      foundMatch = matchCondition(selectorPart, toBeFound);
      return Boolean(foundMatch);
    });
    if (foundMatch) {
      // eslint-disable-next-line no-param-reassign
      result.matchedSelectorPart = selectorPart;
      // eslint-disable-next-line no-param-reassign
      result.replace = (/** @type {SCNode} */ newSelectorPart) => {
        parentSelector.children.splice(i, 1, newSelectorPart);
      };
      // eslint-disable-next-line no-param-reassign
      result.remove = () => {
        parentSelector.children.splice(i, 1);
      };
      if (typeof foundMatch !== 'boolean') {
        // eslint-disable-next-line no-param-reassign
        result.matchConditionMeta = foundMatch;
      }
      // we found a match, stop searching
      return true;
    }
    // No match found, try next in array
    return false;
  });
  // Make sure to only return MatchResult in outer context when found in recursive traversal
  if (depth === 0 && result.matchedSelectorPart) {
    return /** @type {MatchResult} */ (result);
  }
  return undefined;
}

module.exports = {
  normalizePseudoSelectorAndGetChildren,
  normalizePseudoSelector,
  getSerializedSelectorPartsFromArray,
  getSurroundingCompoundParts,
  dissectCssSelectorPart,
  getSelectorEntry,
  getSelectorPartNode,
  hasLeadingWhitespace,
  getReplaceContext,
  findMatchResult,
  isMatchWrappedInPseudoSelector,
  isMatchWrappedInHost,
};
