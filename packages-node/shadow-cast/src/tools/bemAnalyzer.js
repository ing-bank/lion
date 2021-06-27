const csstree = require('css-tree');

/**
 * @typedef {import('../../types/csstree').StyleSheet} StyleSheet
 * @typedef {import('../../types/csstree').CssNode} CssNode
 */

/**
 * @param {string|StyleSheet} bemCodeOrStylesheet
 */
function bemAnalyzer(bemCodeOrStylesheet) {
  const stylesheet =
    typeof bemCodeOrStylesheet === 'string'
      ? csstree.parse(bemCodeOrStylesheet)
      : bemCodeOrStylesheet;

  /** @type {{ node:CssNode, selectorPart:string }[]} */
  const modifiers = [];

  csstree.walk(stylesheet, cssNode => {
    if (cssNode.type === 'ClassSelector') {
      if (cssNode.name.includes('--')) {
        modifiers.push({ node: cssNode, selectorPart: csstree.generate(cssNode) });
      }
    }
  });

  return { modifiers };
}

/**
 * @param {string|StyleSheet} bemCodeOrStylesheet
 */
function getBemModifiers(bemCodeOrStylesheet) {
  return bemAnalyzer(bemCodeOrStylesheet).modifiers;
}

module.exports = {
  bemAnalyzer,
  getBemModifiers,
};
