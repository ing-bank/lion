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
 * @typedef {import('../../types/shadow-cast').SCNode} SCNode
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
 * @param {CssNodePlain} selectorPart
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
 * @param {CssNodePlain[]} selectorPartNodes
 * @returns {string}
 */
function getSerializedSelectorPartsFromArray(selectorPartNodes) {
  const dummySelector = csstree.parse('.x .y');
  // @ts-expect-error
  dummySelector.children = selectorPartNodes;
  return csstree.generate(dummySelector);
}

/**
 * For host PseudoSelectors, we need to parse the raw contents )for ':host(.comp--warning)',
 * this would be '.comp--warning') into a Selector[]
 * @param {SCNode} hostNode
 * @returns {SCNode[]}
 */
function getParsedPseudoSelectorCompoundParts(hostNode) {
  const rawNode = hostNode?.children?.find(c => c.type === 'Raw');
  return rawNode
    ? csstree.toPlainObject(csstree.parse(rawNode.value, { context: 'selector' })).children
    : [];
}

module.exports = {
  getParsedPseudoSelectorCompoundParts,
  getSerializedSelectorPartsFromArray,
  getSurroundingCompoundParts,
  dissectCssSelectorPart,
  getSelectorEntry,
  getSelectorPartNode,
  hasLeadingWhitespace,
};
