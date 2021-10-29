const csstree = require('css-tree');
const {
  getSerializedSelectorPartsFromArray,
  getSelectorEntry,
  getSelectorPartNode,
  getReplaceContext,
  findMatchResult,
  isMatchWrappedInPseudoSelector,
  isMatchWrappedInHost,
} = require('./helpers.js');

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
 * =============================================================
 * Transforms for different Selector parts (host, slots, states)
 * ==============================================================================================
 */

/**
 * @param {string} host serialized SelectorPart for host (for instance '.comp')
 * @param {CssTransformConfig["settings"]} settings
 */
function getHostTransform(host, settings) {
  if (!host) {
    return undefined;
  }
  const hostSelectors = [
    /** @type {SCNode} */
    (getSelectorEntry(csstree.parse(host, { context: 'selector' }))),
    // Also check for Selectors that already replaced host
    // (to allow multiple, order independent iterations over Selectors)
    /** @type {SCNode} */
    (getSelectorEntry(csstree.parse(':host', { context: 'selector' }))),
  ];

  // eslint-disable-next-line arrow-body-style
  const hostMatcher = /** @type {MatcherFn} */ (traversedSelectorPart, parentSelector) => {
    return findMatchResult({
      selectorPartsToSearchIn: [traversedSelectorPart],
      selectorPartsToBeFound: hostSelectors,
      parentSelector,
      matchCondition: (a, b) =>
        (a.type === b.type && a.name === b.name) ||
        (settings?.additionalHostMatcher && settings.additionalHostMatcher(a, b)),
    });
  };

  return {
    meta: {
      config: { hostName: host },
    },
    matcher: hostMatcher,
    replaceFn: /** @type {ReplaceFn} */ ({
      matchResult,
      compounds,
      preceedingSiblings,
      succeedingSiblings,
    }) => {
      let hostCompound = '';
      if (compounds.length) {
        // 1. Serialize the compounds found in host
        hostCompound = getSerializedSelectorPartsFromArray(compounds);
      }

      // '.comp--modifier' (for cases where modifiers are matched as host)
      // We need to maintain them for a proper state match in later traversal
      if (matchResult.matchConditionMeta) {
        hostCompound += getSerializedSelectorPartsFromArray([
          matchResult.matchConditionMeta.partialHostMatchNode,
        ]);
      }

      const hostNodes = /** @type {SCNode} */ (
        csstree.toPlainObject(
          csstree.parse(`:host${hostCompound ? `(${hostCompound})` : ''}`, { context: 'selector' }),
        )
      ).children;
      const replacementNodes = [...preceedingSiblings, ...hostNodes, ...succeedingSiblings];
      console.log('repl hoszt');

      return { replacementNodes, replaceCompleteSelector: true };
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
    const selectorPartsToBeFound = sourceSelectors.map(
      sourceSelector =>
        /** @type {SCNode} */
        (getSelectorEntry(csstree.parse(sourceSelector, { context: 'selector' }))),
    );
    return {
      meta: {
        config: { slotName, sourceSelectors },
      },
      matcher: /** @type {MatcherFn } */ (
        (traversedSelectorPart, parentSelector) =>
          findMatchResult({
            selectorPartsToSearchIn: [traversedSelectorPart],
            selectorPartsToBeFound,
            parentSelector,
          })
      ),
      replaceFn: /** @type {ReplaceFn} */ ({ compounds }) => {
        const compSelectors =
          compounds.length && compounds.map(s => csstree.generate(/** @type {CssNode} */ (s)));
        const slot = slotName === '<default>' ? ':not([slot])' : `[slot="${slotName}"]`;
        const replacementNodes = /** @type {SCNode[]} */ (
          /** @type {SelectorPlain} */ (
            csstree.toPlainObject(
              csstree.parse(`::slotted(${slot}${compSelectors || [].join('')})`, {
                context: 'selector',
              }),
            )
          ).children
        );
        return { replacementNodes, deleteAfterCount: compounds.length };
      },
    };
  });
}

/**
 * @param {{[key: string]: string[]}|undefined} states
 * @param {CssTransformConfig["settings"]} settings
 * @param {MatcherFn} hostMatcher
 */
function getStatesTransform(states, settings, hostMatcher) {
  if (!states) {
    return undefined;
  }
  if (!hostMatcher) {
    throw new Error('A "states" configuration requires a "hostMatcher" function as well');
  }

  /**
   * - example of stateSelector: '[invalid]'
   * - example of sourceSelector: '.comp__feedback--invalid'
   */
  return Object.entries(states).map(([targetStateSelectorPart, sourceSelectors]) => {
    const selectorPartsToBeFound = sourceSelectors.map(
      sourceSelector =>
        /** @type {SCNode} */
        (getSelectorEntry(csstree.parse(sourceSelector, { context: 'selector' }))),
    );

    return {
      meta: {
        config: { targetStateSelectorPart, sourceSelectors },
      },
      // eslint-disable-next-line arrow-body-style
      matcher: /** @type {MatcherFn} */ (traversedSelectorPart, parentSelector) => {
        return findMatchResult({
          selectorPartsToSearchIn: [traversedSelectorPart],
          selectorPartsToBeFound,
          parentSelector,
        });
      },
      replaceFn: /** @type {ReplaceFn} */ ({
        succeedingSiblings,
        preceedingSiblings: precStatePartSiblings,
        matchResult,
        compounds,
        astContext,
      }) => {
        /**
         * Four scenarios possible:
         * 1. on host: '.comp.comp--invalid'
         * 2. inside host: ':host(.comp--invalid)'
         * 3. inside pseudo selector: '.comp:not(.comp--invalid)'
         * 4. on descendant of host: ':host .comp__feedback.comp__feedback--invalid'
         *
         * In all cases, we need to wrap the state SelectorPart in a host PseudoSelectorPart
         */
        function getSerializedHostCompoundSelectorParts() {
          const hostSelectorPart = /** @type {SCNode} */ (
            astContext.selector.children.find(sp => hostMatcher(sp, astContext.selector))
          );

          console.log('astContext.selector.children', astContext.selector.children);

          let compounds = [];
          if (hostSelectorPart.type === 'PseudoClassSelector') {
            if (hostSelectorPart.children) {
              compounds = hostSelectorPart.children[0].children[0].children;
            } // else ':host'
          } else {
            compounds = getReplaceContext(
              astContext.selector,
              astContext.selector.children.indexOf(hostSelectorPart),
            ).compounds;
          }
          return getSerializedSelectorPartsFromArray(compounds);
        }

        /** @type {SCNode[]} */
        let hostNodes = [];
        /** @type {SCNode[]} */
        let finalCompounds = [];

        // Scenario 1 (find '.comp' when matchResult is for '.comp--invalid')
        const hostFoundOnStateCompounds = compounds.find(compound =>
          hostMatcher(compound, astContext.selector),
        );
        if (hostFoundOnStateCompounds && !isMatchWrappedInPseudoSelector(matchResult)) {
          matchResult.replace(getSelectorPartNode(targetStateSelectorPart));
        }
        // Scenario 2: inside host (':host(.comp--invalid)')
        else if (isMatchWrappedInHost(matchResult)) {
          // Translate '.comp--invalid' into '[invalid]'
          matchResult.replace(getSelectorPartNode(targetStateSelectorPart));
          // get ':host([invalid].smth)'  (step above already converted ':host(.comp--invalid.smth)' into ':host([invalid].smth)')
          const hostSelectorPart = matchResult.ancestorPath[0];
          // get ['[invalid]','.smth'] and serialize into '[invalid].smth'
          const hostCompound = getSerializedSelectorPartsFromArray(
            hostSelectorPart.children[0].children[0].children,
          );
          // get [':host([invalid])']
          hostNodes = /** @type {SCNode} */ (
            csstree.toPlainObject(csstree.parse(`:host(${hostCompound})`, { context: 'selector' }))
          ).children;
        }
        // Scenario 3: inside pseudo selector ('.comp:not(.comp--invalid)')
        else if (isMatchWrappedInPseudoSelector(matchResult)) {
          // Apparently we are not inside a host, we just need to replace the matched Selector in
          // the AST.
          // Translate ':not(.comp--invalid)' into ':not([invalid])'
          matchResult.replace(getSelectorPartNode(targetStateSelectorPart));
          const hostCompound = getSerializedHostCompoundSelectorParts();

          // TODO: we should leave this '.comp' actualy
          hostNodes = /** @type {SCNode} */ (
            csstree.toPlainObject(csstree.parse(`:host(${hostCompound})`, { context: 'selector' }))
          ).children;
        }
        // Scenario 4: on descendant of host (':host .comp__feedback.comp__feedback--invalid')
        else {
          // We need to bring the replaced state to the host => [':host([invalid])', ' ', '.comp__feedback']
          const hostCompound = getSerializedHostCompoundSelectorParts() + targetStateSelectorPart;
          // Here we remove '.comp__feedback--invalid'
          matchResult.remove();
          // Here we put back ',comp__feedback'
          finalCompounds = compounds;

          // But what if '.comp__feedback--invalid' had nothing to 'lean on'?
          // (Selector would have been ':host .comp__feedback--invalid'?)
          if (!finalCompounds.length) {
            const part = getSerializedSelectorPartsFromArray([matchResult.matchedSelectorPart]);

            if (typeof settings?.createCompoundFromStatePart === 'function') {
              finalCompounds = [getSelectorPartNode(settings.createCompoundFromStatePart(part))];
            } else {
              throw new Error(`Please make sure to provide an element SelectorPart that source state Selector ${part}
part can "lean" on (a 'state target' that can work in conjunction with host Selector):
- correct: '.comp .comp__feedback.comp__feedback--invalid' -> ':host([invalid]) .comp__feedback'
- wrong: '.comp .comp__feedback--invalid' -> ':host([invalid]) <?>'`);
            }
          }

          // Now filter out host from precStatePartSiblings
          // eslint-disable-next-line no-param-reassign
          precStatePartSiblings = precStatePartSiblings.filter(
            sp => !hostMatcher(sp, astContext.selector),
          );

          hostNodes = /** @type {SCNode} */ (
            csstree.toPlainObject(csstree.parse(`:host(${hostCompound})`, { context: 'selector' }))
          ).children;
        }
        /**
         * Situation 2 (on descendant of host)
         * Say we match '.comp .comp__feedback.comp__feedback--invalid' via
         * { '[invalid]' : '.comp__feedback--invalid'}...
         * We need to convert to ':host([invalid]) .comp__feedback', so we need to know about
         * preceeding siblings of match '.comp__feedback--invalid' when it's a compound selector
         * part (i.e. we should be left with the part before: '.comp__feedback').
         * So we deliberately leave out matchResult.matchedSelectorPart below.
         */
        const replacementNodes = [
          ...hostNodes,
          ...precStatePartSiblings,
          ...finalCompounds,
          ...succeedingSiblings,
        ];
        console.log('repl states');

        return { replacementNodes, replaceCompleteSelector: true };
      },
    };
  });
}

module.exports = {
  getHostTransform,
  getSlotsTransform,
  getStatesTransform,
};
