// @ts-ignore
const csstree = require('css-tree');

/**
 * @typedef {import('../types/index').SelectorPlain} SelectorPlain
 * @typedef {import('../types/index').Selector} Selector
 * @typedef {import('../types/index').CssNodePlain} CssNodePlain
 * @typedef {import('../types/index').CssNode} CssNode
 */

/**
 * @typedef {CssNodePlain & {name:string}} SelectorChildNodePlain
 * @typedef {(traversedSelector: SelectorChildNodePlain) => boolean} MatcherFn
 * @typedef {{matcher: MatcherFn, replaceFn:function}} Transform
 * @typedef {{match: CssNodePlain, compounds: CssNodePlain[], siblings: CssNodePlain[], preceedingSiblings: CssNodePlain[]}} ReplaceContext
 */

/**
 * @param {Selector} sourceSelector like the result of '.my-comp my-comp__part'
 * @param {MatcherFn} matcherFn like the result of configured host: '.my-comp'
 */
function matchSelector(sourceSelector, matcherFn) {
  /** @type {SelectorChildNodePlain[]} */
  const matches = [];
  const plainSource = /** @type {SelectorPlain} */ (csstree.toPlainObject(sourceSelector));
  plainSource.children.forEach(sourceNode => {
    if (matcherFn(/** @type {SelectorChildNodePlain} */ (sourceNode))) {
      matches.push(/** @type {SelectorChildNodePlain} */ (sourceNode));
    }
  });
  return matches;
}

/**
 * @param {Selector} sourceSelectorNode
 * @param {CssNodePlain[]} matches
 * @param {function} replaceFn returns new nodes
 */
function replaceSelector(sourceSelectorNode, matches, replaceFn) {
  const plainSource = /** @type {SelectorPlain} */ (csstree.toPlainObject(sourceSelectorNode));
  matches.forEach(match => {
    const matchIndex = plainSource.children.indexOf(match);
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
    plainSource.children.forEach((curSibling, i) => {
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

    const { replacementNodes, replaceAfterAmount, replaceCompleteSelector } = replaceFn({
      match,
      compounds,
      siblings,
      preceedingSiblings,
    });
    if (replaceCompleteSelector) {
      plainSource.children = replacementNodes;
    } else {
      plainSource.children.splice(matchIndex, 1 + replaceAfterAmount || 0, ...replacementNodes);
    }
  });
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
    matcher: (/** @type {SelectorChildNodePlain} */ traversedSelector) =>
      traversedSelector.type === selector.type && traversedSelector.name === selector.name,
    replaceFn: (/** @type {{compounds:CssNodePlain[]}} */ { compounds }) => {
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
      replaceFn: (/** @type {{compounds:CssNodePlain[]}} */ { compounds }) => {
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
      replaceFn: (/** @type {ReplaceContext} */ { siblings, preceedingSiblings }) => {
        // Check if matching Selector part is part of compound Selector parts
        if (
          preceedingSiblings.length &&
          preceedingSiblings[preceedingSiblings.length - 1].type === 'WhiteSpace'
        ) {
          throw new Error(`Please make sure to provide an element Selector part that the removed source state selector
part can "lean" on (a 'state target' that can work in conjunction with host selector):
- correct: '.comp .comp__feedback.comp__feedback--invalid' -> ':host([invalid]) .comp__feedback'
- wrong: '.comp .comp__feedback--invalid' -> ':host([invalid]) <?>'`);
        }

        // Find hostMatch
        const matchedHost = hostSelectors.find(h =>
          /** @type {SelectorChildNodePlain[]} */ (preceedingSiblings).find(
            p => p.type === h.type && p.name === h.name,
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
            throw new Error(
              `Make sure your selector starts with your host(.comp) (for selector with state selector (${sourceSelectors.join(
                '|',
              )}).
So (assumed '.comp' is the host in our source):
- good: '.comp.comp--state' -> ':host([state])'
- wrong: '.some-broader-context .comp.comp--state'`,
            );
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
 * @param {{cssSources: string[], host?: string, slots?: {[key: string]: string[]}, states?:{[key: string]: string[]}}} config
 * @returns
 */
function transformCss({ cssSources, host, states, slots }) {
  const ast = csstree.parse(cssSources.join('\n'));

  /**
   * Stores are parsed source selectors that will be used to find matches in the source ast.
   * Once a match is found, a replace function can
   * @type {{host?: Transform, slots?: Transform[], states?: Transform[]}}
   */
  const transforms = {
    host: getHostTransform(host),
    slots: getSlotsTransform(slots),
    states: getStatesTransform(states, host),
  };

  csstree.walk(ast, (/** @type {CssNode} */ node) => {
    if (node.type === 'SelectorList') {
      csstree.walk(node, (/** @type {CssNode} */ subNnode) => {
        if (subNnode.type === 'Selector') {
          if (transforms.host) {
            // When states are defined, it is important to first execute them. Otherwise, host
            // matchers might be affected when host replacements took place already
            if (transforms.states) {
              transforms.states.forEach(stateTransform => {
                const stateMatches = matchSelector(subNnode, stateTransform.matcher);
                replaceSelector(subNnode, stateMatches, stateTransform.replaceFn);
              });
            }
            const matches = matchSelector(subNnode, transforms.host.matcher);
            replaceSelector(subNnode, matches, transforms.host.replaceFn);
          } else if (transforms.slots) {
            transforms.slots.forEach(slotTransform => {
              const matches = matchSelector(subNnode, slotTransform.matcher);
              replaceSelector(subNnode, matches, slotTransform.replaceFn);
            });
          }
        }
      });
    }
  });
  return csstree.generate(ast);
}

module.exports = {
  transformCss,
};
