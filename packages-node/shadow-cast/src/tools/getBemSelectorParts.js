const csstree = require('css-tree');

/**
 * @typedef {import('../../types/csstree').StyleSheet} StyleSheet
 * @typedef {import('../../types/csstree').CssNode} CssNode
 * @typedef {string} BemClassSelectorPart
 */

/**
 * @param {string|StyleSheet} bemCodeOrStylesheet
 */
function getBemSelectorParts(bemCodeOrStylesheet) {
  const stylesheetNode =
    typeof bemCodeOrStylesheet === 'string'
      ? csstree.parse(bemCodeOrStylesheet)
      : bemCodeOrStylesheet;

  /** @type {Set<BemClassSelectorPart>} */
  const blocks = new Set();
  /** @type {Set<BemClassSelectorPart>} */
  const elements = new Set();
  /** @type {Set<BemClassSelectorPart>} */
  const modifiers = new Set();

  csstree.walk(stylesheetNode, cssNode => {
    if (cssNode.type === 'ClassSelector') {
      const selectorPart = csstree.generate(cssNode);
      if (cssNode.name.includes('__')) {
        elements.add(selectorPart);
      } else if (cssNode.name.includes('--')) {
        modifiers.add(selectorPart);
      } else {
        blocks.add(selectorPart);
      }
    }
  });

  const resultsPerBlock = Array.from(blocks).map(block => {
    const elms = Array.from(elements).filter(e => e.startsWith(`${e}__`));
    const mods = Array.from(modifiers).filter(m => m.startsWith(`${m}--`));
    return { host: block, elements: elms, states: mods };
  });

  return { hosts: blocks, elements, states: modifiers, resultsPerHost: resultsPerBlock };
}

// /**
//  * @param {string|StyleSheet} bemCodeOrStylesheet
//  */
// function getBemModifiers(bemCodeOrStylesheet) {
//   return getBemSelectorParts(bemCodeOrStylesheet).states;
// }

module.exports = {
  getBemSelectorParts,
  // getBemModifiers,
};
