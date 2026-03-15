// @ts-expect-error
// eslint-disable-next-line import/no-extraneous-dependencies
import * as csstree from 'css-tree/dist/csstree.esm';
import { globalStateMap } from '../../test-and-demo-helpers/modifier-interfaces/index.js';

/**
 * When a csstree Prelude contains unknown css syntax, it will be parsed as type 'Raw' instead of 'SelectorList'.
 * In that case, replace via string replace.
 * @param {string} selectorListRaw
 * @param {{ name:string; pseudoClass:string; lionGlobalAttr:string }[]} statesToReplace
 * @returns {string}
 */
function replaceInRawSelectorList(selectorListRaw, statesToReplace) {
  const selectorList = selectorListRaw.split(',').map(s => s.trim());
  const selectorsToBePrepended = [];
  for (const selector of selectorList) {
    let newSelector = selector;
    for (const { name, pseudoClass, lionGlobalAttr } of statesToReplace) {
      if (selector.includes(pseudoClass)) {
        newSelector = newSelector.replace(pseudoClass, `._m-${name}`);
      }
      // TODO: we probably need to enhance this with regex for attrs like [atrr~=val]
      if (selector.includes(`[${lionGlobalAttr}]`)) {
        newSelector = newSelector.replace(`[${lionGlobalAttr}]`, `._m-${name}`);
      }
    }
    if (newSelector !== selector) {
      selectorsToBePrepended.push(newSelector);
    }
  }
  if (selectorsToBePrepended.length) {
    return [...selectorsToBePrepended, ...selectorList].join(', ');
  }
  return selectorListRaw;
}

/**
 * @param {string} cssTxt
 * @param {string[]} states - a set of css pseudo classes that should be replaced in demo
 */
export function replaceTxtWithModifierDemoClasses(cssTxt, states) {
  const statesThatHavePseudoClassOrGlobalAttr = states.filter(s => {
    const found = globalStateMap.find(g => g.name === s);
    return found?.pseudoClass || found?.lionGlobalAttr;
  });
  const statesToReplace = /** @type {{ name:string; pseudoClass:string }[]} */ (
    statesThatHavePseudoClassOrGlobalAttr.map(s => ({
      name: s,
      pseudoClass: globalStateMap.find(g => g.name === s)?.pseudoClass,
      lionGlobalAttr: globalStateMap.find(g => g.name === s)?.lionGlobalAttr,
    }))
  );

  const ast = csstree.parse(cssTxt);
  csstree.walk(
    ast,
    (
      /** @type {{ type: string; prelude: { type: string; value: string; children: any; }; }} */ node,
    ) => {
      if (node.type === 'Rule') {
        if (node.prelude.type === 'Raw') {
          // @ts-expect-error
          node.prelude.value = replaceInRawSelectorList(node.prelude.value, statesToReplace);
        } else {
          // Since css-tree does not understand 'modern' css syntax like ":host(<children>)",
          // we just convert prelude.type === 'SelectorList' to 'Raw' and replace the pseudo classes like above.
          const rawValue = csstree.generate(node.prelude);
          node.prelude.type = 'Raw';
          delete node.prelude.children;
          // @ts-expect-error
          node.prelude.value = replaceInRawSelectorList(rawValue, statesToReplace);
        }
      }
    },
  );

  // generate CSS from AST
  const replacedResult = csstree.generate(ast);
  return replacedResult;
}
