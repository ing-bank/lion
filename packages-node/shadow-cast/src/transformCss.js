const csstree = require('css-tree');

/**
 * @typedef {import('../types/csstree').StyleSheet} StyleSheet
 * @typedef {import('../types/csstree').StyleSheetPlain} StyleSheetPlain
 * @typedef {import('../types/csstree').Selector} Selector
 * @typedef {import('../types/csstree').SelectorPlain} SelectorPlain
 * @typedef {import('../types/csstree').SelectorList} SelectorList
 * @typedef {import('../types/csstree').SelectorListPlain} SelectorListPlain
 * @typedef {import('../types/csstree').Rule} Rule
 * @typedef {import('../types/csstree').RulePlain} RulePlain
 * @typedef {import('../types/csstree').CssNode} CssNode
 * @typedef {import('../types/csstree').CssNodePlain} CssNodePlain
 * @typedef {import('../types/shadow-cast').CssTransformConfig} CssTransformConfig
 * @typedef {import('../types/shadow-cast').ReplaceContext} ReplaceContext
 * @typedef {import('../types/shadow-cast').ReplaceFn} ReplaceFn
 * @typedef {import('../types/shadow-cast').AstContext} AstContext
 * @typedef {import('../types/shadow-cast').AstContextPlain} AstContextPlain
 * @typedef {CssNodePlain & {name: string;}} SelectorChildNodePlain
 * @typedef {(traversedSelector: SelectorChildNodePlain) => boolean} MatcherFn
 * @typedef {{matcher: MatcherFn; replaceFn: ReplaceFn;}} Transform
 * @typedef {{host?: Transform, slots?: Transform[], states?: Transform[]}} Transforms
 * @typedef {{type:'deletion'|string, action:function, originalCode:string}[]} ActionList
 */

/**
 * Use inside a ReplaceFn to see whether we deal with a 'context selector'.
 * Assuming a host has already matched.
 * A context selector is a selector
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
  const selectorAst = /** @type {CssNodePlain & {children:any[]}} */ (csstree.toPlainObject(
    csstree.parse(originalSelectorPart, { context: 'selector' }),
  ));

  if (selectorAst.children.length !== 1) {
    throw new Error(
      'Only provide selectors in your html mappings with one selector (like ":x:="y:,z")',
    );
  }
  return selectorAst.children[0];
}

/**
 * Returns the type and value of a selector part
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
 * @param {Selector} sourceSelector like the result of '.my-comp my-comp__part'
 * @param {MatcherFn} matcherFn like the result of configured host: '.my-comp'
 */
function matchSelector(sourceSelector, matcherFn) {
  /** @type {SelectorChildNodePlain[]} */
  const plainSource = /** @type {SelectorPlain} */ (csstree.toPlainObject(sourceSelector));
  return plainSource.children.find(sourceNode => {
    if (matcherFn(/** @type {SelectorChildNodePlain} */ (sourceNode))) {
      return /** @type {SelectorChildNodePlain} */ (sourceNode);
    }
    return false;
  });
}

/**
 * @param {AstContext} astContext
 * @param {CssNodePlain} match
 * @param {ReplaceFn} replaceFn
 * @param {ActionList} actionList
 */
function replaceSelector(astContext, match, replaceFn, actionList) {
  // @ts-ignore
  const plainSelector = /** @type {SelectorPlain} */ (csstree.toPlainObject(astContext.selector));
  const plainSelectorList = /** @type {SelectorListPlain} */ (csstree.toPlainObject(
    // @ts-ignore
    astContext.selectorList,
  ));
  // @ts-ignore
  const plainRule = /** @type {RulePlain} */ (csstree.toPlainObject(astContext.rule));
  const plainAtrule =
    // @ts-ignore
    astContext.atRule && /** @type {AtrulePlain} */ (csstree.toPlainObject(astContext.atRule));
  // @ts-ignore
  const plainStylesheet = /** @type {RulePlain} */ (csstree.toPlainObject(astContext.stylesheet));

  const matchIndex = plainSelector.children.indexOf(match);
  /** @type {CssNodePlain[]} */
  const compounds = [];
  /** @type {CssNodePlain[]} */
  const siblings = [];
  /** @type {CssNodePlain[]} */
  const preceedingSiblings = [];

  /**
   * Assume selector '.comp.x.y .comp__a .comp__b'
   * The selector will be ['.comp','.x','y', ' ', '.comp__a', ' ', '.comp__b']
   * '.comp' will be the matchIndex (0).
   * We will loop over all indexes after. First, we gather all compounds: ['.x', ',y'].
   * From there on, we gather all siblings: [' ', '.comp__a', ' ', '.comp__b']
   */
  plainSelector.children.forEach((curSibling, i) => {
    if (i === matchIndex) {
      return;
    }
    if (i < matchIndex) {
      preceedingSiblings.push(curSibling);
    } else if (!siblings.length && curSibling.type !== 'WhiteSpace') {
      compounds.push(curSibling);
    } else {
      siblings.push(curSibling);
    }
  });

  const result = replaceFn(
    // @ts-expect-error
    /** @type {ReplaceContext} */ ({
      match,
      compounds,
      siblings,
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
  if (result) {
    const { replacementNodes, replaceAfterAmount, replaceCompleteSelector } = result;
    if (replaceCompleteSelector) {
      if (replacementNodes.length) {
        plainSelector.children = replacementNodes;
      } else {
        // delete complete selector
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
          plainRule._action.type = 'deletion';
        }
      }
    } else {
      plainSelector.children.splice(matchIndex, 1 + (replaceAfterAmount || 0), ...replacementNodes);
    }
  }
}

/**
 * @param {CssNode} selector
 */
function getSelectorEntry(selector) {
  return /** @type {SelectorPlain} */ (csstree.toPlainObject(selector)).children[0];
}

/**
 * @param {string|undefined} host
 */
function getHostTransform(host) {
  if (!host) {
    return undefined;
  }
  const selector =
    /** @type {SelectorChildNodePlain} */
    (getSelectorEntry(csstree.parse(host, { context: 'selector' })));
  return {
    // TODO: support host detection function, so not only '.comp' matches,
    // but '.comp--modifier' as well
    matcher: (/** @type {SelectorChildNodePlain} */ traversedSelector) =>
      traversedSelector.type === selector.type && traversedSelector.name === selector.name,
    replaceFn: /** @type {ReplaceFn} */ ({ compounds }) => {
      const hostSelectors =
        compounds.length && compounds.map(s => csstree.generate(/** @type {CssNode} */ (s)));
      const replacementNodes = /** @type {SelectorPlain} */ (csstree.toPlainObject(
        csstree.parse(`:host${hostSelectors ? `(${hostSelectors.join('')})` : ''}`, {
          context: 'selector',
        }),
      )).children;
      return { replacementNodes, replaceAfterAmount: compounds.length };
    },
  };
}

/**
 * @param {{[key: string]: string[]}|undefined} slots
 */
function getSlotsTransform(slots) {
  if (!slots) {
    return undefined;
  }

  return Object.entries(slots).map(([slotName, sourceSelectors]) => {
    const selectors = sourceSelectors.map(sourceSelector =>
      /** @type {SelectorChildNodePlain} */
      (getSelectorEntry(csstree.parse(sourceSelector, { context: 'selector' }))),
    );

    return {
      matcher: (/** @type {SelectorChildNodePlain} */ traversedSelector) =>
        selectors.some(
          selector =>
            traversedSelector.type === selector.type && traversedSelector.name === selector.name,
        ),
      replaceFn: /** @type {ReplaceFn} */ ({ compounds }) => {
        const compSelectors =
          compounds.length && compounds.map(s => csstree.generate(/** @type {CssNode} */ (s)));
        const slot = slotName === '<default>' ? ':not([slot])' : `[slot="${slotName}"]`;
        const replacementNodes = /** @type {SelectorPlain} */ (csstree.toPlainObject(
          csstree.parse(`::slotted(${slot}${compSelectors || [].join('')})`, {
            context: 'selector',
          }),
        )).children;
        return { replacementNodes, replaceAfterAmount: compounds.length };
      },
    };
  });
}

/**
 * @param {{[key: string]: string[]}|undefined} states
 * @param {string|undefined} host
] */
function getStatesTransform(states, host) {
  if (!states) {
    return undefined;
  }
  if (!host) {
    throw new Error('A "states" configuration requires a "host" configuration as well');
  }

  /**
   * - example of stateSelector: '[invalid]'
   * - example of sourceSelector: '.comp__feedback--invalid'
   */
  return Object.entries(states).map(([targetStateSelector, sourceSelectors]) => {
    const selectors = sourceSelectors.map(sourceSelector =>
      /** @type {SelectorChildNodePlain} */
      (getSelectorEntry(csstree.parse(sourceSelector, { context: 'selector' }))),
    );

    const hostSelectors = [
      /** @type {SelectorChildNodePlain} */
      (getSelectorEntry(csstree.parse(':host', { context: 'selector' }))),
      /** @type {SelectorChildNodePlain} */
      (getSelectorEntry(csstree.parse(host, { context: 'selector' }))),
    ];

    return {
      matcher: (/** @type {SelectorChildNodePlain} */ traversedSelector) =>
        selectors.some(
          selector =>
            traversedSelector.type === selector.type && traversedSelector.name === selector.name,
        ),
      replaceFn: (
        /** @type {ReplaceContext} */ { siblings, preceedingSiblings, match, astContext },
      ) => {
        // Check if matching Selector part is part of compound Selector parts
        // @ts-expect-error
        if (hasLeadingWhitespace(preceedingSiblings) && !match._action?.type === 'deletion') {
          // TODO: should not be fired when this Selector was already scheduled to be deleted in
          // actionList
          throw new Error(`Please make sure to provide an element Selector part that source state selector ${csstree.generate(
            /** @type {CssNode} */ (match),
          )}
part can "lean" on (a 'state target' that can work in conjunction with host selector):
- correct: '.comp .comp__feedback.comp__feedback--invalid' -> ':host([invalid]) .comp__feedback'
- wrong: '.comp .comp__feedback--invalid' -> ':host([invalid]) <?>'`);
        }

        // Find hostMatch
        const matchedHost = hostSelectors.find(h =>
          /** @type {SelectorChildNodePlain[]} */ (preceedingSiblings).find(
            p => p.type === h.type && (p.name === h.name || p.name.startsWith(h.name)),
          ),
        );
        if (matchedHost) {
          const first = /** @type {SelectorChildNodePlain} */ (preceedingSiblings[0]);
          if (matchedHost.type === first.type && matchedHost.name === first.name) {
            preceedingSiblings.splice(0, 1);
          } else {
            // TODO: See how to handle broader context selectors, that can evidently not be handled
            // within the shadow root of a component.
            // A solution could be ':host([some-broader-context][state])', in which the broader
            // context shuld be enabled externally enabled by that context
            // TODO: make this check generic for host selectors
            //             throw new Error(
            //               `Make sure your Selector starts with a host SelectorPart in Selector "${csstree.generate(
            //                 /** @type {* & CssNode} */ (astContext.selector),
            //               )}".
            // So:
            // - correct: '.comp.comp--state' -> ':host([state])'
            // - incorrect: '.some-broader-context .comp.comp--state'.
            // Alternatively, consider configuring a helper like "bemCompoundHostHelper"
            // `,
            //             );
          }
        }

        const replacementStartNodes = /** @type {SelectorPlain} */ (csstree.toPlainObject(
          csstree.parse(`:host(${targetStateSelector})`, {
            context: 'selector',
          }),
        )).children;

        /**
         * Say we match '.comp .comp__feedback.comp__feedback--invalid' via
         * { '[invalid]' : '.comp__feedback--invalid'}...
         * We need to convert to ':host([invalid]) .comp__feedback', so we need to know about
         * preceeding siblings of match '.comp__feedback--invalid' when it's a compound selector
         * part (i.e. we should filter be left with the part before: '.comp__feedback').
         * So we deliberately leave out matched CssNode below
         */
        const replacementNodes = [...replacementStartNodes, ...preceedingSiblings, ...siblings];
        return { replacementNodes, replaceCompleteSelector: true };
      },
    };
  });
}

/**
 * @param {AstContext} astContext
 * @param {{(traversedSelector: SelectorChildNodePlain): boolean;(traversedSelector: SelectorChildNodePlain): boolean;}} hostMatcherFn
 * @param {CssTransformConfig["settings"]} settings
 * @param {ActionList} actionList
 */
function interceptExternalContextSelectors(astContext, hostMatcherFn, settings, actionList) {
  // @ts-ignore
  const hostMatchBefore = matchSelector(astContext.selector, hostMatcherFn);
  if (hostMatchBefore) {
    /** @type {ReplaceFn} */
    const replaceFn = replaceContext => {
      if (!hasLeadingWhitespace(replaceContext.preceedingSiblings)) {
        return undefined;
      }
      if (typeof settings?.contextSelectorHandler === 'function') {
        return settings.contextSelectorHandler(replaceContext);
      }
      return { replacementNodes: [], replaceCompleteSelector: true };
    };

    replaceSelector(astContext, hostMatchBefore, replaceFn, actionList);
  }
}

/**
 * @param {Rule} ruleNode
 * @param {Transforms} transforms
 * @param {Partial<AstContext>} astContext
 * @param {CssTransformConfig["settings"]} settings
 * @param {ActionList} actionList
 */
function walkRule(ruleNode, transforms, astContext, settings, actionList) {
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
            // These selectors would not be able to pierce a ShadowRoot and need manual intervention
            // By default, we filter them out, unless a 'settings.contextSelectorHandler' is
            // provided.
            interceptExternalContextSelectors(
              /** @type {AstContext} */ (astContext),
              transforms.host.matcher,
              settings,
              actionList,
            );

            // When states are defined, it is important to first execute them. Otherwise, host
            // matchers might be affected when host replacements took place already
            if (transforms.states) {
              transforms.states.forEach(stateTransform => {
                const stateMatch = matchSelector(selectorNode, stateTransform.matcher);
                if (stateMatch) {
                  replaceSelector(
                    /** @type {AstContext} */ (astContext),
                    stateMatch,
                    stateTransform.replaceFn,
                    actionList,
                  );
                }
              });
            }
            // We replace hosts after states, as explained above
            const hostMatch = matchSelector(selectorNode, transforms.host.matcher);
            if (hostMatch) {
              replaceSelector(
                /** @type {AstContext} */ (astContext),
                hostMatch,
                transforms.host.replaceFn,
                actionList,
              );
            }
          } else if (transforms.slots) {
            transforms.slots.forEach(slotTransform => {
              const slotMatch = matchSelector(selectorNode, slotTransform.matcher);
              if (slotMatch) {
                replaceSelector(
                  /** @type {AstContext} */ (astContext),
                  slotMatch,
                  slotTransform.replaceFn,
                  actionList,
                );
              }
            });
          }
        }
      });
    }
  });
}

/**
 * @param {CssTransformConfig} config
 * @returns
 */
function transformCss({ cssSources, host, states, slots, settings, htmlMeta }) {
  // const cssContents = cssSources.map(s => (typeof s === 'string' ? s : s.content));
  const stylesheetNode = /** @type {StyleSheet & {children:CssNode[]}} */ (csstree.parse(
    cssSources.join('\n'),
  ));

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
  const stats = {};

  // We use this for reporting afterwards
  let selectorPartsFoundInSource;
  if (typeof settings?.getCategorizedSelectorParts === 'function') {
    selectorPartsFoundInSource = settings.getCategorizedSelectorParts(stylesheetNode);
  }
  const stateSelectorPartsLookedFor = Object.values(
    /** @type {{[key:string]:string[]}} */ (states),
    // @ts-expect-error
  ).flat();

  /**
   * Stores are parsed source selectors that will be used to find matches in the source ast.
   * Once a match is found, a replace function can
   * @type {Transforms}
   */
  const transforms = {
    host: getHostTransform(host),
    slots: getSlotsTransform(slots),
    states: getStatesTransform(states, host),
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

  // @ts-expect-error
  csstree.toPlainObject(stylesheetNode).children.forEach((
    /** @type {Rule|import('css-tree').Atrule} */ ruleOrAtRuleNode,
  ) => {
    if (ruleOrAtRuleNode.type === 'Rule') {
      walkRule(ruleOrAtRuleNode, transforms, astContext, settings, actionList);
    } else if (ruleOrAtRuleNode.type === 'Atrule') {
      astContext.atRule = ruleOrAtRuleNode;
      csstree.walk(ruleOrAtRuleNode, (/** @type {CssNode} */ ruleNode) => {
        if (ruleNode.type === 'Rule') {
          walkRule(ruleNode, transforms, astContext, settings, actionList);
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

  // eslint-disable-next-line no-console
  console.info(
    `The following state SelectorParts were found in css source, but not covered in configuration:\n\n${neglectedStates.join(
      '\n',
    )}\n`,
  );

  // TODO: also find out which states were configured, but never found
  return csstree.generate(stylesheetNode);
}

module.exports = {
  transformCss,
  dissectCssSelectorPart,
  getSelectorPartNode,
};
