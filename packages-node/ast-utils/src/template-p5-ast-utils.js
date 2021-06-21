const parse5 = require('parse5');
const t = require('@babel/types');
const { generateJs } = require('./formatting-utils.js');

/**
 * @typedef {{name:string, value: string, expression?:object, expressions?:object[], staticValueParts?:string[]}} EnrichedP5Attr
 */

// TODO: consider supporting attributes without quotes (like <el attr-a=x attr-b=y>)

// This is used for 'stitching together' templates from lit-html
const TEMPLATE_PLACEHOLDER = '{{}}';

/**
 * Enriches attr objects from parse5 AST that contain expressions
 * From: { name:string(lowercased), value:string }
 * To: {
 *   name:string, // original casing
 *   value:string, // template placeholder
 *   expression:object, // reference to the espression in the tagged template literal
 *   type:'attribute'|'property'|'event'|'boolean'
 * }
 *
 * @param {BabelAstPath} taggedTemplateExpressionPath
 * @param {Map} tagMap ScopedElements info or derived from customElements.define file
 */
function createEnrichedP5AstForTemplate(taggedTemplateExpressionPath, tagMap) {
  const { quasis, expressions } = taggedTemplateExpressionPath.node.quasi;
  const stitchedTpl = quasis.map(templateEl => templateEl.value.raw).join(TEMPLATE_PLACEHOLDER);

  const p5Ast = parse5.parseFragment(stitchedTpl);

  const handledForwardLookExpressions = [];
  const attributeExpressions = expressions
    .map((expression, index) => {
      if (handledForwardLookExpressions.includes(expression)) {
        return undefined;
      }

      const precedingQuasi = quasis[index];
      // Since parse5 lowercases attrs, we need to get back these nuances for props
      // For instance, revert '.mylitprop' to '.myLitProp'
      const attrMatch = precedingQuasi.value.raw.match(/ (.*)=("|')?$/);
      console.log('attrName', attrMatch && attrMatch[1]);
      if (attrMatch) {
        return {
          attrName: attrMatch[1],
          expression,
        };
      }
      // The if above looks for .prop="${'dynamic'}".
      // Now look for .prop="static and ${'dynamic'} content ${'combined'}"

      const partialAttrMatch = precedingQuasi.value.raw.match(/ (.*)=("|')?(.*)/);
      console.log('partialAttrMatch attrName', partialAttrMatch && partialAttrMatch[1]);

      if (partialAttrMatch) {
        let shouldLookForMoreStaticParts = true;
        let succeedingIdx = 1;
        const staticValueParts = [partialAttrMatch[3]];
        const foundExpressions = [expression];

        while (shouldLookForMoreStaticParts) {
          shouldLookForMoreStaticParts = false;

          const succeedingQuasi = quasis[index + succeedingIdx];
          console.log('succeedingQuasi', succeedingQuasi.value.raw);

          if (succeedingQuasi) {
            // Regex groups explained:
            // 1. value after expression -> attr="some{{}}(here)"
            // 2. closing or expression char -> attr="{{}}some("), attr='{{}}some('). attr="some({){}}thing"
            const partialAttrMatchAfter = succeedingQuasi.value.raw.match(/^(.*)?("|'|\{)/);
            if (partialAttrMatchAfter) {
              const valueAfterExpr = partialAttrMatchAfter[1];

              if (valueAfterExpr) {
                staticValueParts.push(valueAfterExpr);
              }

              // eslint-disable-next-line prefer-destructuring
              const hasExprOrClosingChar = Boolean(partialAttrMatchAfter[2]);
              const hasClosingChar = hasExprOrClosingChar && partialAttrMatchAfter[2] !== '{';
              if (!hasClosingChar) {
                shouldLookForMoreStaticParts = true;
                const succeedingExpression = expressions[index + succeedingIdx];
                foundExpressions.push(succeedingExpression);
                handledForwardLookExpressions.push(succeedingExpression);
              }
              succeedingIdx += 1;
            }
          }
        }
        return {
          attrName: partialAttrMatch[1],
          staticValueParts,
          expressions: foundExpressions,
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
        /* eslint-disable no-param-reassign */
        if (attrObj.value === TEMPLATE_PLACEHOLDER) {
          attrObj.expression = attributeExpressions[exprIndex].expression;
          // Override attr name for expressions: '.iconid' => '.iconId'
          attrObj.name = attributeExpressions[exprIndex].attrName;
          exprIndex += 1;
        } else if (attrObj.value.includes(TEMPLATE_PLACEHOLDER)) {
          attrObj.expressions = attributeExpressions[exprIndex].expressions;
          attrObj.staticValueParts = attributeExpressions[exprIndex].staticValueParts;
          // Override attr name for expressions: '.iconid' => '.iconId'
          attrObj.name = attributeExpressions[exprIndex].attrName;
          exprIndex += 1;
        }

        attrObj.type = 'attribute';
        Object.entries(typeMap).forEach(([symbol, type]) => {
          if (attrObj.name.startsWith(symbol)) {
            attrObj.type = type;
          }
        });
        /* eslint-enable no-param-reassign */
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

/**
 * Helper fn for createBabelTemplateLiteralFromP5Ast
 * @param {EnrichedP5Attr} a
 */
function computeValue(a) {
  if (a.value === TEMPLATE_PLACEHOLDER && a.expression) {
    return `\${${generateJs(a.expression)}}`;
  }
  if (a.staticValueParts) {
    let res = '';
    a.staticValueParts.forEach((p, i) => {
      res += `${p}`;
      if (a.expressions[i]) {
        res += `\${${generateJs(a.expressions[i])}}`;
      }
    });
    return res;
  }
  return a.value;
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
        result += ` ${a.name}="${computeValue(a)}"`;
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
  const { attrMatchConfigs, tagName } = opts;

  function checkLevel(childNodes) {
    childNodes.forEach(childNode => {
      attrMatchConfigs.forEach(attrMatchConfig => {
        if (childNode.tagName === tagName) {
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
  const isExpression = attrObj.value === TEMPLATE_PLACEHOLDER;
  let isExpressionThatCanBeReplaced = false;
  if (isExpression && t.isLiteral(attrObj.expression)) {
    value = attrObj.expression.value;
    isExpressionThatCanBeReplaced = true;
  } else {
    value = attrObj.value;
  }

  const hasExpressions = attrObj.value.includes(TEMPLATE_PLACEHOLDER);
  const mapped = opts.oldToNewMap[value];
  if (mapped) {
    if (isExpressionThatCanBeReplaced) {
      // eslint-disable-next-line no-param-reassign
      attrObj.value = `\${'${mapped}'}`;
    } else {
      // eslint-disable-next-line no-param-reassign
      attrObj.value = mapped;
    }
  } else if (hasExpressions) {
    // TODO: make this more precise later
    // eslint-disable-next-line no-console
    console.warn(`Please manually update: ${attrObj.name}="${computeValue(attrObj)}"`);
  }
}

module.exports = {
  createEnrichedP5AstForTemplate,
  createBabelTemplateLiteralFromP5Ast,
  findAndProcessAttrMatchInP5Ast,
  replaceAttrValueInP5Ast,
  TEMPLATE_PLACEHOLDER,
};
