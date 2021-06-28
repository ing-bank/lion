const parse5 = require('parse5');

const { formatHtml } = require('./tools/formatting-utils.js');
const { dissectCssSelectorPart, getSelectorPartNode } = require('./transformCss.js');

/**
 * @typedef {import('../types/csstree').CssNodePlain} CssNodePlain
 * @typedef {import('../types/csstree').CssNode} CssNode
 * @typedef {import('../types/shadow-cast').CssTransformConfig} CssTransformConfig
 * @typedef {import('parse5').Document} Document
 * @typedef {import('parse5').Element} Element
 * @typedef {import('parse5').DefaultTreeElement} DefaultTreeElement
 * @typedef {Element & {attrs: {name:string, value:string}[], childNodes:P5Node[], nodeName:string, tagName:string, value?:string}} P5Node
 * @typedef {{childNodes: P5Node[]}} AstFragment
 * @typedef {{host: string, slots: {[key: string]: string[]}, states:{[key: string]: string[]}, slotsHtml:string[], shadowHtml:string}} AnnotatedHtmlSelectorResult
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
  const hostNode = P5Node.attrs.find(a => a.name === ':host:');
  if (!hostNode) {
    throw new Error('No :host: annotation found');
  }
  // Delete it...
  P5Node.attrs.splice(P5Node.attrs.indexOf(hostNode), 1);
  return hostNode.value;
}

/**
 * @param {string} tagName
 * @param {string} [slotName]
 */
function getslotsHtml(tagName, slotName) {
  return `<${tagName} ${slotName ? `slot="${slotName}"` : ''}>${
    tagName !== 'input' ? `</${tagName}>` : ''
  }`;
}

/**
 * @param {P5Node & {value:string}} curNode
 * @param {P5Node} parentNode
 * @param {AnnotatedHtmlSelectorResult} result
 */
function handleStatesAndSlots(curNode, parentNode, result) {
  if (curNode.nodeName === '#text') {
    if (curNode.value.includes(':slot:')) {
      // eslint-disable-next-line no-param-reassign
      curNode.value = curNode.value.replace(':slot:', '');
      // add slot node to parent
      parentNode.childNodes.push({ nodeName: 'slot', tagName: 'slot', attrs: [], childNodes: [] });

      const parentClasses = getNodeclassses(parentNode);
      // TODO: allow for this 'sibling pattern' inside transformCss:
      // eslint-disable-next-line no-param-reassign
      result.slots['<default>'] = parentClasses.map(p => `.${p} > *`);
    }
  } else {
    const slotAttrNode = curNode.attrs.find(a => a.name === ':slot:');
    if (slotAttrNode) {
      // Cleanup
      curNode.attrs.splice(curNode.attrs.indexOf(slotAttrNode), 1);
      // '<input class="comp__input" :slot:="input:.comp__input">' => ['input', '.comp__input']
      const [slotName, originalSelector] = slotAttrNode.value.split(':');
      if (!originalSelector) {
        // TODO: for more flexibility and future compatibility, support
        throw new Error(
          `Please provide both slot name and selector, like ':slot:="slotname:,selector" for <${curNode.tagName} :slot:"${slotName}">'`,
        );
      }
      const { tagName } = curNode;
      const nonEmptyTypes = ['id', 'class'];
      const { type, value } = dissectCssSelectorPart(getSelectorPartNode(originalSelector));
      const attrNode = curNode.attrs.find(a => a.name === type);
      if (attrNode) {
        attrNode.value = attrNode.value.replace(value, '');
        // Delete attr if empty for id and class
        if (nonEmptyTypes.includes(type) && !attrNode.value) {
          curNode.attrs.splice(curNode.attrs.indexOf(attrNode), 1);
        }
      } else {
        throw new Error('Provided slot selector does not match html');
      }

      if (slotName === '<default>') {
        // eslint-disable-next-line no-param-reassign
        result.slotsHtml.push(getslotsHtml(tagName));
      } else {
        // eslint-disable-next-line no-param-reassign
        result.slotsHtml.push(getslotsHtml(tagName, slotName));
        curNode.attrs.push({ name: 'name', value: slotName });
      }

      // eslint-disable-next-line no-multi-assign, no-param-reassign
      curNode.nodeName = curNode.tagName = 'slot';
      // eslint-disable-next-line no-param-reassign
      result.slots[slotName] = [originalSelector];
    }

    const stateAttrNode = curNode.attrs.find(a => a.name === ':states:');
    if (stateAttrNode) {
      // Cleanup
      curNode.attrs.splice(curNode.attrs.indexOf(stateAttrNode), 1);

      // :states:="[invalid]:.comp--invalid, [warning]:.comp--warning"
      const mappings = stateAttrNode.value.split(',').map(s => s.trim());
      mappings.forEach(m => {
        const [state, originalSelector] = m.split(':');
        if (state) {
          // eslint-disable-next-line no-param-reassign
          result.states[state] = [...(result.states[state] || []), originalSelector];
        }
      });
    }

    curNode.childNodes.forEach(P5Node => {
      handleStatesAndSlots(/** @type {P5Node & {value:string}} */ (P5Node), curNode, result);
    });
  }
}

/**
 * @param {P5Node} curNode
 */
function getAllClassesInHtml(curNode) {
  /** @type {string[]} */
  const result = [];
  curNode.childNodes.forEach(childNode => {
    const classAttr = childNode.attrs?.find(a => a.name === 'class');
    if (classAttr) {
      result.push(...classAttr.value.split(' ').map(c => `.${c}`));
    }
    if (childNode.childNodes?.length) {
      result.push(...getAllClassesInHtml(childNode));
    }
  });
  return result;
}

/**
 * @param {string} htmlSource
 */
function transformHtml(htmlSource) {
  const ast = /** @type {AstFragment} */ (parse5.parseFragment(htmlSource.trim()));

  if (!ast.childNodes.length) {
    throw new Error('Please provide an html template');
  }

  // 1. Handle host element
  if (ast.childNodes.length > 1) {
    throw new Error('Please provide an html template with 1 root node');
  }

  const classesInHtml = getAllClassesInHtml(/** @type {P5Node } */ (ast));

  /** @type {AnnotatedHtmlSelectorResult} */
  const result = { host: '', slots: {}, states: {}, slotsHtml: [], shadowHtml: '' };
  ast.childNodes.forEach((/** @type {any} */ P5Node) => {
    result.host = handleAnnotatedHost(P5Node);
    handleStatesAndSlots(P5Node, /** @type {P5Node} */ (ast), result);
  });

  result.shadowHtml = formatHtml(parse5.serialize({ childNodes: ast.childNodes[0].childNodes }));

  return {
    cssTransformConfig: /** @type {CssTransformConfig} */ ({
      host: result.host,
      slots: result.slots,
      states: result.states,
    }),
    shadowHtml: result.shadowHtml,
    slotsHtml: result.slotsHtml,
    meta: {
      classesInHtml,
    },
  };
}

module.exports = {
  transformHtml,
};
