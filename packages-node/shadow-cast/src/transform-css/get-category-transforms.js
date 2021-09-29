const csstree = require('css-tree');

const {
  getParsedPseudoSelectorCompoundParts,
  getSerializedSelectorPartsFromArray,
  getSurroundingCompoundParts,
  getSelectorEntry,
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
 * @typedef {import('../../types/shadow-cast').WrappedHostMatcher} WrappedHostMatcher
 * @typedef {import('../../types/shadow-cast').SCNode} SCNode
 */

/**
 * @param {import("../../types/csstree").CssNodePlain} match
 */
function isWrappedHostMatcher(match) {
  return 'matchHost' in match && 'matchHostChild' in match;
}

/**
 * @param {object} options
 * @param {CssNodePlain|WrappedHostMatcher} options.match
 * @param {boolean} options.stateMatchIsWrappedHost
 * @param {{ (traversedSelector: import("../../types/shadow-cast").SelectorChildNodePlain): boolean; (arg0: any): any; (value: any, index: number, obj: any[]): unknown; }} options.hostMatcher
 * @param {string} [options.targetStateSelector]
 * @param {SCNode} options.matchedHost
 * @param {any[]} [options.precStatePartSiblings]
 * @param {import("../../types/csstree").CssNodePlain[]} options.compounds
 */
function getReplacementStartNodesHost({
  match,
  stateMatchIsWrappedHost,
  hostMatcher,
  targetStateSelector = '',
  matchedHost,
  precStatePartSiblings = [],
  compounds,
}) {
  let compoundHostParts;
  if (matchedHost) {
    // TODO: Before removing the host, search for compound selectors in the 'raw' host part.
    // Then, add them to precStatePartSiblings, after host.
    const hostCompoundSelectorParts = getParsedPseudoSelectorCompoundParts(matchedHost);
    // In the place where we generically call replaceFn, do the same, so states will be found in raw part

    const firstCompoundInSiblings = [...precStatePartSiblings];
    const firstWhitespaceIndex = precStatePartSiblings.findIndex(s => s.type === 'WhiteSpace');
    if (firstWhitespaceIndex < -1) {
      firstCompoundInSiblings.splice(0, firstWhitespaceIndex);
    }
    const hostIndex = firstCompoundInSiblings.findIndex(hostMatcher);
    if (hostIndex > -1) {
      precStatePartSiblings.splice(hostIndex, 1);
    }

    // If stateMatchIsWrappedHost is true (match is a WrappedHostMatcher), we need to filter out
    // match.matchHostChild...
    // so :host([invalid].comp--warning) should become :host([invalid][warning])
    // and not :host([invalid][warning].comp--warning)

    const allSelectorParts = [
      ...precStatePartSiblings,
      ...hostCompoundSelectorParts.filter(s => !match.originalMatcher(s)),
      ...compounds, // when the state is not on the same level as host, we won't find host compounds here
    ];

    compoundHostParts = getSurroundingCompoundParts(matchedHost, allSelectorParts);

    if (!stateMatchIsWrappedHost) {
      const potentialDoubleEntries = [
        ...compoundHostParts.preceedingParts,
        ...compoundHostParts.succeedingParts,
      ];
      // Delete double entries => :host(.comp--invalid[warning]).comp--invalid.comp =>
      // :host(.comp--invalid[warning])
      precStatePartSiblings.splice(0, potentialDoubleEntries.length);

      // if host is still here, delete
      if (precStatePartSiblings.length && hostMatcher(precStatePartSiblings[0])) {
        precStatePartSiblings.splice(0, 1);
      }
    }
  }

  let preceedingSerializedCompound = '';
  let succeedingSerializedCompound = '';
  if (compoundHostParts?.preceedingParts?.length) {
    preceedingSerializedCompound = getSerializedSelectorPartsFromArray(
      compoundHostParts.preceedingParts,
    );
  }
  if (compoundHostParts?.succeedingParts?.length) {
    succeedingSerializedCompound = getSerializedSelectorPartsFromArray(
      compoundHostParts.succeedingParts,
    );
  }

  const hostCompound = `${preceedingSerializedCompound}${targetStateSelector}${succeedingSerializedCompound}`;

  return /** @type {SelectorPlain} */ (
    csstree.toPlainObject(
      csstree.parse(`:host${hostCompound ? `(${hostCompound})` : ''}`, {
        context: 'selector',
      }),
    )
  ).children;
}

/**
 * =============================================================
 * Transforms for different Selector parts (host, slots, states)
 * ==============================================================================================
 */

/**
 * @param {string|undefined} host
 * @param {CssTransformConfig["settings"]} settings
 */
function getHostTransform(host, settings) {
  if (!host) {
    return undefined;
  }
  const hostSelectors = [
    /** @type {SelectorChildNodePlain} */
    (getSelectorEntry(csstree.parse(host, { context: 'selector' }))),
    // Also check for Selectors that already replaced host
    // (to allow multiple, order independent iterations over Selectors)
    /** @type {SelectorChildNodePlain} */
    (getSelectorEntry(csstree.parse(':host', { context: 'selector' }))),
  ];

  const hostMatcher = (/** @type {SelectorChildNodePlain} */ traversedSelector) =>
    hostSelectors.some(
      hostSelector =>
        (traversedSelector.type === hostSelector.type &&
          traversedSelector.name === hostSelector.name) ||
        (settings?.additionalHostMatcher &&
          settings.additionalHostMatcher(traversedSelector, hostSelector)),
    );

  return {
    meta: {
      config: { hostName: host },
    },
    matcher: hostMatcher,
    replaceFn: /** @type {ReplaceFn} */ ({ match, compounds }) => {
      const stateMatchIsWrappedHost = isWrappedHostMatcher(match);
      const matchedHost = stateMatchIsWrappedHost ? match.matchHost : match;

      const replacementNodes = getReplacementStartNodesHost({
        match,
        stateMatchIsWrappedHost,
        hostMatcher,
        matchedHost,
        compounds,
      });

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
    const selectors = sourceSelectors.map(
      sourceSelector =>
        /** @type {SelectorChildNodePlain} */
        (getSelectorEntry(csstree.parse(sourceSelector, { context: 'selector' }))),
    );

    return {
      meta: {
        config: { slotName, sourceSelectors },
      },
      matcher: (/** @type {SelectorChildNodePlain} */ traversedSelector) =>
        selectors.some(
          selector =>
            traversedSelector.type === selector.type && traversedSelector.name === selector.name,
        ),
      replaceFn: /** @type {ReplaceFn} */ ({ compounds }) => {
        const compSelectors =
          compounds.length && compounds.map(s => csstree.generate(/** @type {CssNode} */ (s)));
        const slot = slotName === '<default>' ? ':not([slot])' : `[slot="${slotName}"]`;
        const replacementNodes = /** @type {SelectorPlain} */ (
          csstree.toPlainObject(
            csstree.parse(`::slotted(${slot}${compSelectors || [].join('')})`, {
              context: 'selector',
            }),
          )
        ).children;
        return { replacementNodes, replaceAfterAmount: compounds.length };
      },
    };
  });
}

function searchPseudoPartsRecursively(t, selector, results = []) {
  getParsedPseudoSelectorCompoundParts(t).some(hostSelectorPart => {
    if (hostSelectorPart.type === 'PseudoClassSelector') {
      return searchPseudoPartsRecursively(hostSelectorPart);
    }
    if (hostSelectorPart.type === selector.type && hostSelectorPart.name === selector.name) {
      results.push(hostSelectorPart);
      return true;
    }
    return false;
  });
  return results;
}

/**
 * @param {{[key: string]: string[]}|undefined} states
 * @param {MatcherFn} hostMatcher
 */
function getStatesTransform(states, hostMatcher) {
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
  return Object.entries(states).map(([targetStateSelector, sourceSelectors]) => {
    const selectors = sourceSelectors.map(
      sourceSelector =>
        /** @type {SelectorChildNodePlain} */
        (getSelectorEntry(csstree.parse(sourceSelector, { context: 'selector' }))),
    );

    return {
      meta: {
        config: { targetStateSelector, sourceSelectors },
      },
      matcher: (/** @type {SelectorChildNodePlain} */ traversedSelector) => {
        const t = traversedSelector;
        return selectors.some(selector => {
          if (t.type === selector.type && t.name === selector.name) {
            return true;
          }
          if (t.type === 'PseudoClassSelector' && t.name === 'host') {
            return Boolean(searchPseudoPartsRecursively(t, selector).length);
            // return getParsedPseudoSelectorCompoundParts(t).some(
            //   hostSelectorPart =>
            //     hostSelectorPart.type === selector.type && hostSelectorPart.name === selector.name,
            // );
          }
          return false;
        });
      },
      replaceFn: (
        /** @type {ReplaceContext} */ {
          siblings,
          preceedingSiblings: precStatePartSiblings,
          match,
          compounds,
          astContext,
        },
      ) => {
        const stateMatchIsWrappedHost = isWrappedHostMatcher(match);
        const c = getSurroundingCompoundParts(match, astContext.selector.children);
        const hasNoCompounds =
          !stateMatchIsWrappedHost && !c.preceedingParts?.length && !c.succeedingParts?.length;

        const isHostMatch = stateMatchIsWrappedHost || hostMatcher(match);

        // Check if matching SelectorPart is part of compound SelectorParts
        // @ts-expect-error
        if (!isHostMatch && hasNoCompounds && match._action?.type !== 'deletion') {
          // TODO: should not be fired when this Selector was already scheduled to be deleted in
          // actionList
          throw new Error(`Please make sure to provide an element SelectorPart that source state Selector ${csstree.generate(
            /** @type {CssNode} */ (match),
          )}
part can "lean" on (a 'state target' that can work in conjunction with host Selector):
- correct: '.comp .comp__feedback.comp__feedback--invalid' -> ':host([invalid]) .comp__feedback'
- wrong: '.comp .comp__feedback--invalid' -> ':host([invalid]) <?>'`);
        }

        // @ts-ignore
        const matchedHost = stateMatchIsWrappedHost
          ? match.matchHost
          : precStatePartSiblings.find(hostMatcher);

        const replacementStartNodes = getReplacementStartNodesHost({
          match,
          stateMatchIsWrappedHost,
          hostMatcher,
          targetStateSelector,
          matchedHost,
          precStatePartSiblings,
          compounds,
        });

        /**
         * Say we match '.comp .comp__feedback.comp__feedback--invalid' via
         * { '[invalid]' : '.comp__feedback--invalid'}...
         * We need to convert to ':host([invalid]) .comp__feedback', so we need to know about
         * preceeding siblings of match '.comp__feedback--invalid' when it's a compound selector
         * part (i.e. we should filter be left with the part before: '.comp__feedback').
         * So we deliberately leave out matched CssNode below
         */
        const replacementNodes = [...replacementStartNodes, ...precStatePartSiblings, ...siblings];
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
