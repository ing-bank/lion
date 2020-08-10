/* eslint-disable no-shadow */
const { default: traverse } = require('@babel/traverse');
const babelParser = require('@babel/parser');
const parse5 = require('parse5');
const traverseHtml = require('../utils/traverse-html.js');
const { dashToCamelCase } = require('./caseMap.js');

const fs = require('fs');
const pathLib = require('path');

const htmlCode = fs.readFileSync(pathLib.join(__dirname, 'paper-input.html'), 'utf8');
polymerToLitComponent(htmlCode);

function dashToCamelPascal(str) {
  const d2c = dashToCamelCase(str);
  return d2c[0].toUpperCase() + d2c.slice(1);
}

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

function p2lTemplate(pTemplateEntry) {
  function p2lExpression(attr) {
    const { expression } = attr.binding;
    const isNegation = expression.startsWith('!');

    const fnMatch = expression.match(/!?(.*)\((.*)\)/);
    if (fnMatch) {
      const [, fnName, paramsStr] = fnMatch;
      const params = paramsStr.split(',');
      return `${isNegation ? '!' : ''}this.${fnName}(${params.map(p => `this.${p}`).join(', ')})`;
    }
    const variable = expression.replace(/^|/, '');
    return `${isNegation ? '!' : ''}this.${variable}`;
  }

  const { node } = pTemplateEntry;
  const results = node.content.childNodes.map(c => {
    if (c.nodeName === '#text') {
      return c.value;
    }
    if (c.nodeName === '#comment') {
      return `<!-- ${c.data} -->`;
    }

    const attrsEnriched = c.attrs.map(a => {
      const attr = a;

      // Detect bindings (one or two way?)
      // All variables here will need to be added to static get properties
      if (/\[\[.*\]\]/.test(attr.value)) {
        attr.binding = {
          expression: attr.value.match(/\[\[(.*)\]\]/)[1],
          twoWay: false,
        };
      } else if (/\{\{.*\}\}/.test(attr.value)) {
        attr.binding = {
          expression: attr.value.match(/\{\{(.*)\}\}/)[1],
          twoWay: true,
        };
      }

      // Are we dealing with prop or attr?
      if (attr.binding) {
        // if no prop, we are dealing with regular attr
        attr.type = attr.name.endsWith('$') ? 'attr' : 'prop';
      }

      if (attr.name.startsWith('on-')) {
        attr.event = attr.name.replace(/^on-/, '');
      }

      return attr;
    });

    let result = `<${c.tagName}`;
    attrsEnriched.forEach(a => {
      result += ' \n';
      if (a.event) {
        result += `@${a.event}="\${this.${a.value}}"`;
      } else if (a.type === 'prop') {
        const variable = p2lExpression(a);
        result += `.${dashToCamelCase(a.name)}="\${${variable}}"`;
        if (a.binding && a.binding.twoWay) {
          result += ` @${a.name}-changed="\${({target}) => ${variable} = target.${variable.replace(
            'this.',
            '',
          )}}"`;
        }
      } else if (a.type === 'attr' || !a.type) {
        if (a.binding) {
          result += `${a.name.replace(/\$$/, '')}="\${${p2lExpression(a)}}"`;
        } else {
          result += `${a.name}="${a.value}"`;
        }
      }
    });
    result += '>\n';
    if (c.tagName !== 'input') {
      result += `</${c.tagName}>`;
    }

    return result;
  });

  return results.join('\n');
}

function p2lJs(babelAst) {}

function polymerToLitComponent(htmlCode) {
  const p5Ast = parse5.parseFragment(htmlCode);

  // Start with a simple transition
  const templates = [];
  const styles = [];
  let jsCode;
  let tplCount = 0;

  traverseHtml(p5Ast, {
    // eslint-disable-next-line object-shorthand
    'dom-module'(p5Path) {
      p5Path.traverseHtml({
        template(p5Path) {
          if (p5Path.node.attrs.find(a => a.name === 'is')) {
            // skip <template is="dom-repeat|dom-if">
            return;
          }
          p5Path.traverseHtml({
            style(p5Path) {
              const style = {
                value: p5Path.node.childNodes[0].value,
              };
              const includeAttr = p5Path.node.attrs.find(a => a.name === 'include');
              if (includeAttr) {
                // TODO: connect these to other dom modules
                style.include = includeAttr.value.split(' ');
              }
              styles.push(style);
            },
          });
          // const location = p5Path.node.sourceCodeLocation;
          // const tplRaw = htmlCode.slice(location.startOffset, location.endOffset);
          // const tplWithoutTag = tplRaw.replace(/<template.*>(.*|\n)<\/template>/g, '$1');
          // const tplWithoutStyle = tplWithoutTag.replace(/<style.*>(.*|\n)<\/style>/g, '');
          tplCount += 1;
          const template = {
            // value: tplWithoutStyle,
            node: p5Path.node,
            isMainTemplate: tplCount === 1, // first template found will always be main
          };
          templates.push(template);
        },
      });
    },
    script(p5Path) {
      jsCode = p5Path.node.childNodes[0].value;
    },
  });

  // templates.forEach(t => {
  //   console.log(p2lTemplate(t));
  // });

  const babelAst = babelParser.parse(jsCode, {
    // sourceType: 'module',
    // plugins: ['importMeta', 'dynamicImport', 'classProperties'],
  });

  let customElementName;
  let behaviors;
  let propertiesResult; // result js for LitElement
  const props = {
    //
    value: [],
    notify: [],
    computed: [],
    observer: [],
    readOnly: [],
  };

  function objExprToObj(objExpr) {
    const res = {};
    objExpr.properties.forEach(p => {
      if (p.value.properties) {
        res[p.key.name] = {};
        const resl2 = res[p.key.name];
        p.value.properties.forEach(p => {
          if (p.value.type !== 'ObjectExpression') {
            if (p.value.type === 'Literal' || p.value.type === 'StringLiteral') {
              resl2[p.key.name] = `'${p.value.value}'`;
            } else {
              // Identifier, Boolean
              resl2[p.key.name] = `${p.value.name}`;
            }
          } else {
            resl2[p.key.name] = p.value;
          }
        });
      }
    });
    return res;
  }

  function p2lProperties(objExpr) {
    const propObj = objExprToObj(objExpr);
    console.log('propObj', propObj);
    let keysResult = '';
    Object.entries(propObj).forEach(([propName, keys]) => {
      // console.log(keys);

      Object.entries(keys).forEach(([k, v]) => {
        if (k === 'type') {
          keysResult += `type: ${v},\n`;
        } else if (k === 'reflectToAttribute') {
          keysResult += `reflect: ${v},\n`;
        } else if (k === 'value') {
          // Later add to constructor
          props.value.push({ propName, value: v });
        } else if (k === 'readOnly') {
          // override setter and create _set${dashToCamelCase(propName)}() method
          props.readOnly.push(propName);
        } else if (k === 'notify') {
          // add _requestUpdate(name, oldValue) { super._ru(...); dispatchEvent(new E(`${propName}-changed`)); }
          props.notify.push(propName);
        } else if (k === 'computed') {
          const [, paramsStr] = v.match(/\((.*)\)/);
          const relatedProps = paramsStr.split(',');
          // add _requestUpdate(name, oldValue) { super._ru(...); if (name === relatedProps[0]) { this.${propName} = this.${computedName}} }
          props.computed.push({ propName, methodName: v, relatedProps });
        } else if (k === 'observer') {
          // add _requestUpdate(name, oldValue) { super._ru(...); if (name === propName) { this.${observerName}} }
          props.observer.push({ propName, observerName: v });
        }
      });
    });

    propertiesResult = `
    static get properties() {
      return {
        ${keysResult}
      }
    }
    `;
  }

  traverse(babelAst, {
    CallExpression(path) {
      if (path.node.callee.name !== 'Polymer') {
        return;
      }
      const polymerComponentObj = path.node.arguments[0];

      polymerComponentObj.properties.forEach(prop => {
        // eslint-disable-next-line default-case
        switch (prop.key.name) {
          case 'is':
            customElementName = prop.value.value;
            break;
          case 'behaviors':
            // behaviors = JSON.parse(babelGenerate(prop.value));
            break;
          case 'properties':
            p2lProperties(prop.value);
            break;
          case 'listeners':
            // properties = JSON.parse(babelGenerate(prop.value));
            break;
          case 'keyBindings':
            break;
          case 'hostAttributes':
            break;
        }
      });
    },
  });

  function createRequestUpdateResult(props) {
    const allProps = flatten([
      ...props.observer.map(o => o.propName),
      ...props.computed.map(c => c.relatedProps),
    ]);
    if (!allProps.length) {
      return '';
    }
    const tpls = allProps.map(propName => {
      let observerResult;
      let computedResult;
      const observer = props.observer.find(o => o.propName === propName);
      const computed = props.computed.find(c => c.relatedProps.includes(propName));

      if (observer) {
        observerResult = `this.${observer}(this[name], oldValue);\n`;
      }
      if (computed) {
        computedResult = `this.${computed.propName} = this.${
          computed.methodName
        }(${computed.relatedProps.map(r => `this.${r}`).join(', ')});\n`;
      }
      const result = `
    if (name === '${propName}') {
      ${observerResult}
      ${computedResult}
    }`;
      return { propName, result };
    });
    const result = `
  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);

    ${tpls.join('\n')}
  }
    `;
    return result;
  }

  console.log(createRequestUpdateResult(props));

  //   let litResult = `
  // import { LitElement, html, css } from 'lit-element';

  // export class ${dashToCamelPascal(customElementName)} extends LitElement {
  //   ${propertiesResult}

  //   ${stylesResult}

  //   render() {
  //     return html\`
  //       ${templateResult}
  //     \`;
  //   }

  //   ${_requestUpdateResult}

  // }
  // `;
}

module.exports = { polymerToLitComponent };
