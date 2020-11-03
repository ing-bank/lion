const parse5 = require('parse5');
const t = require('@babel/types');
const { generateJs } = require('./formatting-utils.js');

// This is used for 'stitching together' templates from lit-html
const TEMPLATE_PLACEHOLDER = '{{}}';

/**
 * @param {BabelAstPath} taggedTemplateExpressionPath
 * @param {Map} tagMap ScopedElements info or derived from customElements.define file
 */
function createEnrichedP5AstForTemplate(taggedTemplateExpressionPath, tagMap) {
  const { quasis, expressions } = taggedTemplateExpressionPath.node.quasi;
  const stitchedTpl = quasis.map(templateEl => templateEl.value.raw).join(TEMPLATE_PLACEHOLDER);

  const p5Ast = parse5.parseFragment(stitchedTpl);

  const attributeExpressions = expressions
    .map((expression, index) => {
      const precedingQuasi = quasis[index];
      // Since parse5 lowercases attrs, we need to get back these nuances for props
      // For instance, revert '.mylitprop' to '.myLitProp'
      const attrMatch = precedingQuasi.value.raw.match(/ (.*)=("|')?$/);
      if (attrMatch) {
        return {
          attrName: attrMatch[1],
          expression,
        };
      }
      return undefined;
    })
    .filter(Boolean);

  let exprIndex = 0;

  // Add expressions and tagNames to attributes
  function enrichChild(child) {
    if (child.tagName && tagMap) {
      // eslint-disable-next-line no-param-reassign
      child.tagMeta = tagMap.get(child.tagName); // will be { ctorIdentifier: 'MyComp', ctorRootFile: './src/MyComp.js'}
    }

    if (child.attrs) {
      const typeMap = { '?': 'boolean', '.': 'property', '@': 'event' };
      child.attrs.forEach(attrObj => {
        if (attrObj.value === TEMPLATE_PLACEHOLDER) {
          // eslint-disable-next-line no-param-reassign
          attrObj.expression = attributeExpressions[exprIndex].expression;
          // Override attr name for expressions: '.iconid' => '.iconId'
          // eslint-disable-next-line no-param-reassign
          attrObj.name = attributeExpressions[exprIndex].attrName;
          // eslint-disable-next-line no-param-reassign
          exprIndex += 1;
        }

        // eslint-disable-next-line no-param-reassign
        attrObj.type = 'attribute';
        Object.entries(typeMap).forEach(([symbol, type]) => {
          if (attrObj.name.startsWith(symbol)) {
            // eslint-disable-next-line no-param-reassign
            attrObj.type = type;
          }
        });
      });
    }
    if (child.childNodes) {
      child.childNodes.forEach(nextLvlChild => {
        enrichChild(nextLvlChild);
      });
    }
  }

  p5Ast.childNodes.forEach(enrichChild);

  return p5Ast;
}

function createBabelTemplateLiteralFromP5Ast(enrichedP5Ast) {
  const nonClosableTags = ['input'];
  function handleLevel(childNodes) {
    let result = '';
    childNodes.forEach(c => {
      if (c.nodeName.startsWith('#')) {
        result += c.value;
        return;
      }
      result += `<${c.tagName}`;
      (c.attrs || []).forEach(a => {
        const value =
          a.value === TEMPLATE_PLACEHOLDER ? `\${${generateJs(a.expression)}}` : a.value;
        result += ` ${a.name}="${value}"`;
      });
      result += '>';
      if (c.childNodes) {
        result += handleLevel(c.childNodes);
      }
      if (!nonClosableTags.includes(c.tagName)) {
        result += `</${c.tagName}>`;
      }
    });
    return result;
  }

  let result = 'html`';
  result += handleLevel(enrichedP5Ast.childNodes);

  result += '`';

  return result;
}

/**
 * @param {object} enrichedP5Ast
 * @param {object} opts Babel plugin options
 */
function findAndProcessAttrMatchInP5Ast(enrichedP5Ast, opts) {
  const { attrMatchConfigs, iconTagName } = opts;

  function checkLevel(childNodes) {
    childNodes.forEach(childNode => {
      attrMatchConfigs.forEach(attrMatchConfig => {
        if (childNode.tagName === iconTagName) {
          childNode.attrs.forEach(attrObj => {
            if (attrObj.name === attrMatchConfig.attrName) {
              attrMatchConfig.onAttrMatch(attrObj, opts);
            }
          });
        }
      });
      if (childNode.childNodes) {
        checkLevel(childNode.childNodes);
      }
    });
  }

  checkLevel(enrichedP5Ast.childNodes);
}

/**
 * @example
 * from: icon-id="brand:set:icon"
 * to: icon-id="brandNew:setNew:iconNew"
 *
 * @example
 * from: .iconId="\${'brand:set:icon'}"
 * to: .iconId="\${'brandNew:setNew:iconNew'}"
 *
 * @param {{value:string, expression?:object, name:string}} attrObj
 * @param {object} opts Babel plugin options
 */
function replaceAttrValueInP5Ast(attrObj, opts) {
  let value;
  let isExpression = false;
  if (attrObj.value === TEMPLATE_PLACEHOLDER && t.isLiteral(attrObj.expression)) {
    value = attrObj.expression.value;
    isExpression = true;
  } else {
    value = attrObj.value;
  }

  const mapped = opts.oldToNewMap[value];
  if (mapped) {
    if (isExpression) {
      // eslint-disable-next-line no-param-reassign
      attrObj.value = `\${'${mapped}'}`;
    } else {
      // eslint-disable-next-line no-param-reassign
      attrObj.value = mapped;
    }
  }
}

module.exports = {
  createEnrichedP5AstForTemplate,
  createBabelTemplateLiteralFromP5Ast,
  findAndProcessAttrMatchInP5Ast,
  replaceAttrValueInP5Ast,
  TEMPLATE_PLACEHOLDER,
};
