const parse5 = require('parse5');
const { formatHtml } = require('./formatting-utils.js');

/**
 * @typedef {import('parse5').Document} Document
 * @typedef {import('parse5').Element} Element
 * @typedef {import('parse5').DefaultTreeElement} DefaultTreeElement
 *
 * @typedef {Element & {attrs: {name:string, value:string}[], childNodes:P5Node[], nodeName:string, tagName:string, value:string}} P5Node
 * @typedef {{childNodes: P5Node[]}} AstFragment
 * @typedef {{host: string, slots: {[key: string]: string[]}, states:{[key: string]: string[]}, slotHtml:string[], shadowHtml:string}} AnnotatedHtmlSelectorResult
 */

// helpers

/**
 * @param {P5Node} node
 */
function getNodeclassses(node) {
  return (node.attrs.find(a => a.name === 'class')?.value || '').split(' ');
}

/**
 * @param {P5Node} P5Node
 */
function handleAnnotatedHost(P5Node) {
  const hostNode = P5Node.attrs.find(a => a.name === '::host::');
  if (!hostNode) {
    throw new Error('No ::host:: annotation found');
  }
  // Delete it...
  P5Node.attrs.splice(P5Node.attrs.indexOf(hostNode), 1);
  return hostNode.value;
}

/**
 * @param {P5Node} curNode
 * @param {P5Node} parentNode
 * @param {AnnotatedHtmlSelectorResult} result
 */
function handleStatesAndSlots(curNode, parentNode, result) {
  if (curNode.nodeName === '#text') {
    if (curNode.value.includes('::slot::')) {
      // eslint-disable-next-line no-param-reassign
      curNode.value = curNode.value.replace('::slot::', '<slot></slot>');
      const parentClasses = getNodeclassses(parentNode);
      // TODO: allow for this 'sibling pattern' inside transformCss:
      // eslint-disable-next-line no-param-reassign
      result.slots['<default>'] = parentClasses.map(p => `.${p} > *`);
    }
  } else {
    const slotAttrNode = curNode.attrs.find(a => a.name === '::slot::');
    if (slotAttrNode) {
      // Cleanup
      curNode.attrs.splice(curNode.attrs.indexOf(slotAttrNode), 1);
      // '<input class="comp__input" ::slot::="input:.comp__input">' => ['input', '.comp__input']
      const [slotName, originalSelector] = slotAttrNode.value.split(':');
      const { tagName } = curNode;
      // eslint-disable-next-line no-param-reassign
      result.slotHtml.push(
        `<${tagName} slot="${slotName}">${tagName !== 'input' ? `</${tagName}>` : ''}`,
      );
      // eslint-disable-next-line no-multi-assign, no-param-reassign
      curNode.nodeName = curNode.tagName = 'slot';
      curNode.attrs.push({ name: 'name', value: slotName });

      if (slotName) {
        // eslint-disable-next-line no-param-reassign
        result.slots[slotName] = [originalSelector];
      }
    }

    const stateAttrNode = curNode.attrs.find(a => a.name === '::states::');
    if (stateAttrNode) {
      // Cleanup
      curNode.attrs.splice(curNode.attrs.indexOf(stateAttrNode), 1);

      // ::states::="[invalid]:.comp--invalid, [warning]:.comp--warning"
      const mappings = stateAttrNode.value.split(',');
      mappings.forEach(m => {
        const [state, originalSelector] = m.split(':');
        if (state) {
          // eslint-disable-next-line no-param-reassign
          result.slots[state] = [originalSelector];
        }
      });
    }

    curNode.childNodes.forEach(P5Node => {
      handleStatesAndSlots(P5Node, curNode, result);
    });
  }
}

/**
 * @param {string} htmlSource
 */
function getCssSelectorsFromAnnotatedHtml(htmlSource) {
  const ast = /** @type {AstFragment} */ (parse5.parseFragment(htmlSource.trim()));
  if (!ast.childNodes.length) {
    throw new Error('Please provide an html template');
  }

  // 1. Handle host element
  if (ast.childNodes.length > 1) {
    throw new Error('Please provide an html template with 1 root node');
  }

  /** @type {AnnotatedHtmlSelectorResult} */
  const result = { host: '', slots: {}, states: {}, slotHtml: [], shadowHtml: '' };
  ast.childNodes.forEach((/** @type {any} */ P5Node) => {
    result.host = handleAnnotatedHost(P5Node);
    handleStatesAndSlots(P5Node, /** @type {P5Node} */ (ast), result);
  });

  result.shadowHtml = formatHtml(parse5.serialize({ childNodes: ast.childNodes[0].childNodes }));

  return result;
}

function transformHtml({ htmlSource, annotatedSource }) {
  // const ast = parse5.parseFragment(htmlSource);
}

module.exports = {
  getCssSelectorsFromAnnotatedHtml,
  transformHtml,
};
