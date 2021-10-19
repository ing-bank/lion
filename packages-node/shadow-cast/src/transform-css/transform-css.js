const csstree = require('css-tree');

const {
  dissectCssSelectorPart,
  getSelectorPartNode,
  hasLeadingWhitespace,
  getReplaceContext,
  // getPseudoSelectorChildren,
} = require('./helpers.js');

const {
  getHostTransform,
  getSlotsTransform,
  getStatesTransform,
} = require('./get-category-transforms.js');

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
 * @typedef {import('../../types/shadow-cast').Transform} Transform
 * @typedef {import('../../types/shadow-cast').MatcherFn} MatcherFn
 * @typedef {import('../../types/shadow-cast').SelectorChildNodePlain} SelectorChildNodePlain
 * @typedef {import('../../types/shadow-cast').ActionList} ActionList
 * @typedef {import('../../types/shadow-cast').MatchResult} MatchResult
 * @typedef {import('../../types/shadow-cast').SCNode} SCNode
 */

/**
 * Finds matching SelectorPart, based on matcherFn
 * @param {Selector} sourceSelector like the result of '.my-comp my-comp__part'
 * @param {MatcherFn} matcherFn like a function that searches for configured host '.my-comp'
 * @returns {MatchResult|undefined} matchedSelector
 */
function findMatchResultInSelector(sourceSelector, matcherFn) {
  const plainSource = /** @type {SelectorPlain} */ (csstree.toPlainObject(sourceSelector));
  let result;
  // eslint-disable-next-line array-callback-return, consistent-return
  plainSource.children.some(sourceNode => {
    result = matcherFn(/** @type {SCNode} */ (sourceNode), plainSource);
    return Boolean(result);
  });
  return result;

  // const match = /** @type {SCNode} */ (
  //   plainSource.children.find(sourceNode =>
  //     matcherFn(/** @type {SelectorChildNodePlain} */ (sourceNode)),
  //   )
  // );

  // // Handle :host(.x.y) differently
  // if (match) {
  //   if (match.type === 'PseudoClassSelector' && match.name === 'host') {
  //     return {
  //       matchHost: match,
  //       matchHostChild: /** @type {CssNodePlain} */ (
  //         getPseudoSelectorChildren(match).find(matcherFn)
  //       ),
  //       originalMatcher: matcherFn,
  //     };
  //   }
  //   return match;
  // }
  // return undefined;
}

/**
 * @param {object} options
 * @param {AstContext} options.astContext
 * @param {MatchResult} options.matchResult
 * @param {ReplaceFn} options.replaceFn the replace function from Transform for host/slots/states
 * @param {ActionList} options.actionList
 */
function replaceSelector({ astContext, matchResult, replaceFn, actionList }) {
  /**
   * 1. Assemble Ast context
   */

  // @ts-ignore
  const plainSelector = /** @type {SCNode} */ (csstree.toPlainObject(astContext.selector));
  const plainSelectorList = /** @type {SCNode} */ (
    csstree.toPlainObject(
      // @ts-ignore
      astContext.selectorList,
    )
  );
  // @ts-ignore
  const plainRule = /** @type {RulePlain} */ (csstree.toPlainObject(astContext.rule));
  const plainAtrule =
    // @ts-ignore
    astContext.atRule && /** @type {AtrulePlain} */ (csstree.toPlainObject(astContext.atRule));
  // @ts-ignore
  const plainStylesheet = /** @type {RulePlain} */ (csstree.toPlainObject(astContext.stylesheet));

  /**
   * 2. Assemble replace context
   */
  /**
   * The current position of matched SelectorPart (or ancestor thereof) in the plainSelector
   * @type {number}
   */
  const matchIndex = plainSelector.children.indexOf(
    matchResult.ancestorPath[0] || matchResult.matchedSelectorPart,
  );
  const { compounds, succeedingSiblings, preceedingSiblings } = getReplaceContext(
    plainSelector,
    matchIndex,
  );

  /**
   * 3. Gather replacement data to alter the AST
   */
  const result = replaceFn(
    // @ts-expect-error
    /** @type {ReplaceContext} */ ({
      matchResult,
      compounds,
      succeedingSiblings,
      preceedingSiblings,
      astContext: {
        selector: plainSelector,
        selectorList: plainSelectorList,
        rule: plainRule,
        atRule: plainAtrule,
        stylesheet: plainStylesheet,
      },
    }),
  );

  /**
   * 4. Alter AST, based on replacement data.
   * Also, populate actionList for later alterations
   */
  if (result) {
    const { replacementNodes, deleteAfterCount, replaceCompleteSelector } = result;
    if (replaceCompleteSelector) {
      if (replacementNodes.length) {
        plainSelector.children = replacementNodes;
        // plainSelector.children.splice(0, plainSelector.children.length, ...replacementNodes);
      } else {
        // Delete complete selector
        // @ts-expect-error
        plainSelector._action = plainSelector._action || {};
        // @ts-expect-error
        plainSelector._action.type = 'deletion';
        actionList.push({
          type: 'deletion',
          action: () =>
            plainSelectorList.children.splice(plainSelectorList.children.indexOf(plainSelector), 1),
          // @ts-expect-error
          originalCode: csstree.generate(astContext.selectorList),
        });
        if (plainSelectorList.children.length === 1) {
          // so no Selectors left after one above deleted
          actionList.push({
            type: 'deletion',
            action: () => {
              if (astContext.atRule) {
                plainAtrule.block.children.splice(plainAtrule.block.children.indexOf(plainRule), 1);
              } else {
                // @ts-expect-error
                plainStylesheet.children.splice(plainStylesheet.children.indexOf(plainRule), 1);
              }
            },
            // @ts-expect-error
            originalCode: csstree.generate(astContext.rule),
          });
          // @ts-expect-error
          plainRule._action = plainRule._action || {};
          // @ts-expect-error
          plainRule._action.type = 'deletion';
        }
      }
    } else {
      // In this case, we use number deleteAfterCount (which contains the amount of nodes to delete)
      plainSelector.children.splice(matchIndex, 1 + (deleteAfterCount || 0), ...replacementNodes);
    }
  }
}

/**
 * @param {object} options
 * @param {AstContext} options.astContext
 * @param {MatcherFn} options.hostMatcherFn
 * @param {CssTransformConfig["settings"]} options.settings
 * @param {ActionList} options.actionList
 */
function interceptExternalContextSelectors({ astContext, hostMatcherFn, settings, actionList }) {
  // @ts-ignore
  const hostMatchBefore = findMatchResultInSelector(astContext.selector, hostMatcherFn);
  if (hostMatchBefore) {
    /** @type {ReplaceFn} */
    const replaceFn = replaceContext => {
      if (!hasLeadingWhitespace(replaceContext.preceedingSiblings)) {
        return undefined;
      }
      if (typeof settings?.contextSelectorHandler === 'function') {
        return settings.contextSelectorHandler(replaceContext);
      }
      // Deletes the context Selector
      return { replacementNodes: [], replaceCompleteSelector: true };
    };

    replaceSelector({ astContext, matchResult: hostMatchBefore, replaceFn, actionList });
  }
}

/**
 * Walks and transforms a css Rule.
 * Transforms that need to be scheduled are added to the actionList.
 * @param {object} options
 * @param {Rule} options.ruleNode current css Rule
 * @param {Transforms} options.transforms Transforms for slots, states and host
 * @param {Partial<AstContext>} options.astContext
 * @param {CssTransformConfig["settings"]} options.settings
 * @param {ActionList} options.actionList
 */
function processRule({ ruleNode, transforms, astContext, settings, actionList }) {
  // eslint-disable-next-line no-param-reassign
  astContext.rule = ruleNode;
  csstree.walk(ruleNode, (/** @type {CssNode} */ selectorListNode) => {
    if (selectorListNode.type === 'SelectorList') {
      // eslint-disable-next-line no-param-reassign
      astContext.selectorList = selectorListNode;
      csstree.walk(selectorListNode, (/** @type {CssNode} */ selectorNode) => {
        if (selectorNode.type === 'Selector') {
          // eslint-disable-next-line no-param-reassign
          astContext.selector = selectorNode;

          if (transforms.host) {
            // Intercept 'external context selectors': selectors that contain the host part and are
            // preceeded by a context selector part (like '[dir=rtl] .comp .x').
            // These selectors would not be able to pierce a ShadowRoot and need manual
            // 'intervention' (like defining css/js outside the ShadowRoot).
            // By default, we filter them out, unless a 'settings.contextSelectorHandler' is
            // provided
            interceptExternalContextSelectors({
              // eslint-disable-next-line object-shorthand
              astContext: /** @type {AstContext} */ (astContext),
              hostMatcherFn: transforms.host.matcher,
              settings,
              actionList,
            });

            // We replace hosts after states, as explained above
            const hostMatch = findMatchResultInSelector(selectorNode, transforms.host.matcher);
            if (hostMatch) {
              replaceSelector({
                // eslint-disable-next-line object-shorthand
                astContext: /** @type {AstContext} */ (astContext),
                matchResult: hostMatch,
                replaceFn: transforms.host.replaceFn,
                actionList,
              });
            }

            // States should be transformed after :host replacement took place, so compound matchers
            // on host can be handled in a more predictable way
            if (transforms.states) {
              transforms.states.forEach(stateTransform => {
                const stateMatchResult = findMatchResultInSelector(
                  selectorNode,
                  stateTransform.matcher,
                );
                if (stateMatchResult) {
                  replaceSelector({
                    // eslint-disable-next-line object-shorthand
                    astContext: /** @type {AstContext} */ (astContext),
                    matchResult: stateMatchResult,
                    replaceFn: stateTransform.replaceFn,
                    actionList,
                  });
                }
              });
            }
          }
          if (transforms.slots) {
            transforms.slots.forEach(slotTransform => {
              const slotMatch = findMatchResultInSelector(selectorNode, slotTransform.matcher);
              if (slotMatch) {
                replaceSelector({
                  // eslint-disable-next-line object-shorthand
                  astContext: /** @type {AstContext} */ (astContext),
                  matchResult: slotMatch,
                  replaceFn: slotTransform.replaceFn,
                  actionList,
                });
              }
            });
          }
        }
      });
    }
  });
}

/**
 * ======
 * Report
 * ==============================================================================================
 */

/**
 * These inital data need to be gathered before the AST gets manipulated.
 * At a later stage, they will be used for reporting
 * @param {CssTransformConfig} cssTransformConfig
 * @param {StyleSheet} stylesheetNode
 * @returns {{ stateSelectorPartsLookedFor:string[], selectorPartsFoundInSource: CategorizedPreAnalysisResult }}
 */
function prepareReport({ settings, states }, stylesheetNode) {
  // We use this for reporting afterwards
  let selectorPartsFoundInSource;
  if (typeof settings?.getCategorizedSelectorParts === 'function') {
    selectorPartsFoundInSource = settings.getCategorizedSelectorParts(stylesheetNode);
  }
  const stateSelectorPartsLookedFor = Object.values(
    /** @type {{[key:string]:string[]}} */ (states || {}),
    // @ts-expect-error
  ).flat();

  return { stateSelectorPartsLookedFor, selectorPartsFoundInSource };
}

/**
 * Write a report about coverage etc.
 * @param {CssTransformConfig} cssTransformConfig
 * @param {{ stateSelectorPartsLookedFor:string[], selectorPartsFoundInSource: CategorizedPreAnalysisResult }} reportMeta
 * @returns
 */
function report({ host, htmlMeta }, { stateSelectorPartsLookedFor, selectorPartsFoundInSource }) {
  if (!selectorPartsFoundInSource) {
    return;
  }

  /** @type {string[]} */
  const neglectedStates = [];
  selectorPartsFoundInSource.states.forEach((/** @type {string} */ ssp) => {
    if (!stateSelectorPartsLookedFor.includes(ssp) && ssp.startsWith(`${host}--`)) {
      neglectedStates.push(ssp);
    }
  });

  const allSelectorPartsFound = [
    ...selectorPartsFoundInSource.states,
    ...selectorPartsFoundInSource.elements,
    ...selectorPartsFoundInSource.hosts,
  ];
  htmlMeta?.classesInHtml.forEach(c => {
    if (!allSelectorPartsFound.includes(c)) {
      // eslint-disable-next-line no-console
      console.info(`This selector is found in css, but not in html: ${c}`);
    }
  });

  if (neglectedStates.length) {
    // eslint-disable-next-line no-console
    console.info(
      `The following state SelectorParts were found in css source, but not covered in configuration:\n\n${neglectedStates.join(
        '\n',
      )}\n`,
    );
  }
}

/**
 * ============
 * Main program
 * ==============================================================================================
 */

/**
 * @param {CssTransformConfig} cssTransformConfig
 * @returns
 */
function transformCss(cssTransformConfig) {
  const { cssSources, host, states, slots, settings = {} } = cssTransformConfig;

  // const cssContents = cssSources.map(s => (typeof s === 'string' ? s : s.content));
  const stylesheetNode = /** @type {StyleSheet & {children:CssNode[]}} */ (
    csstree.parse(cssSources.join('\n'))
  );

  /**
   * This stats object will help identify whether all the provided configurations are covered.
   * For instance, we configure states
   * "{'[invalid]': ['.comp--invalid'], '[warning]': ['.comp--warning'] }"
   * in the following css: ".comp--invalid { color: blue }".
   * ".comp--warning" is not covered, which will be reported.
   * @type {Partial<{states: string[], host: string, slots: string[]}>}
   */
  // TODO: implement
  // eslint-disable-next-line no-unused-vars
  const transformStats = {};

  const reportPreparation = prepareReport(cssTransformConfig, stylesheetNode);
  const hostTransform = getHostTransform(host, settings);

  /**
   * Stores are parsed source selectors that will be used to find matches in the source ast.
   * Once a match is found, a replace function can
   * @type {Transforms}
   */
  const transforms = {
    host: hostTransform,
    slots: getSlotsTransform(slots),
    states: getStatesTransform(states, settings, /** @type {Transform} */ (hostTransform)?.matcher),
  };

  /** @type {Partial<AstContext>} */
  const astContext = { stylesheet: stylesheetNode };

  /**
   * @type {ActionList}
   */
  const actionList = [];

  /**
   * ==============================================================================================
   * Traverse and transform
   */

  csstree
    .toPlainObject(stylesheetNode)
    // @ts-expect-error
    .children.forEach((/** @type {Rule|import('css-tree').Atrule} */ ruleOrAtRuleNode) => {
      if (ruleOrAtRuleNode.type === 'Rule') {
        processRule({ ruleNode: ruleOrAtRuleNode, transforms, astContext, settings, actionList });
      } else if (ruleOrAtRuleNode.type === 'Atrule') {
        astContext.atRule = ruleOrAtRuleNode;
        csstree.walk(ruleOrAtRuleNode, (/** @type {CssNode} */ ruleNode) => {
          if (ruleNode.type === 'Rule') {
            processRule({ ruleNode, transforms, astContext, settings, actionList });
          }
        });
      }
    });

  /**
   * ==============================================================================================
   * Perform deferred actions (like deletions that cannot be performed during csstree.walk)
   * and report.
   */
  actionList.forEach(action => {
    action.action();
    // eslint-disable-next-line no-console
    console.info(`applied action of type "${action.type}" for code "${action.originalCode}"`);
  });

  report(cssTransformConfig, reportPreparation);

  // TODO: also find out which states were configured, but never found
  return csstree.generate(stylesheetNode);
}

module.exports = {
  transformCss,
  dissectCssSelectorPart,
  getSelectorPartNode,
};
