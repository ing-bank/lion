/* eslint-disable no-shadow */
const { default: traverse } = require('@babel/traverse');
const babelParser = require('@babel/parser');
const parse5 = require('parse5');
const { traverseHtml } = require('../utils/traverse-html.js');
const {
  dashToCamelCase,
  camelToDashCase,
  dashToPascalCase,
  pascalCase,
  formatJs,
  formatHtml,
  generateJs,
  objExprToObj,
  flatten,
  levenshtein,
  trimLines,
} = require('./utils.js');

/** Output parts */
const notEqualFn = `
const notEqual = (value, old) => {
  // This ensures (old==NaN, value==NaN) always returns false
  // eslint-disable next-line
  return old !== value && (old === old || value === value);
};
`;

/** Retrieve html and js data via ASTs  */

function retrieveHtmlData(htmlCode) {
  const p5Ast = parse5.parseFragment(htmlCode);

  const foundTemplates = [];
  const foundStyles = [];
  const foundImports = [];

  let jsCode;
  let tplCount = 0;

  traverseHtml(p5Ast, {
    link(p5Path) {
      const isHtmlImport = Boolean(
        p5Path.node.attrs.find(a => a.name === 'rel' && a.value === 'import'),
      );

      if (isHtmlImport) {
        const hrefAttr = p5Path.node.attrs.find(a => a.name === 'href');

        if (!hrefAttr) {
          return;
        }
        const source = hrefAttr.value;
        foundImports.push({ source });
      }
    },
    // eslint-disable-next-line object-shorthand
    'dom-module'(p5Path) {
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
          foundStyles.push(style);
        },
        template(p5Path) {
          if (p5Path.node.attrs.find(a => a.name === 'is')) {
            // skip <template is="dom-repeat|dom-if">
            return;
          }
          tplCount += 1;
          const template = {
            node: p5Path.node,
            istemplate: tplCount === 1, // first template found will always be main
          };
          foundTemplates.push(template);
        },
      });
    },
    script(p5Path) {
      jsCode = p5Path.node.childNodes[0].value;
    },
  });

  return {
    jsCode,
    templates: foundTemplates,
    styles: foundStyles,
    imports: foundImports,
  };
}

function retrieveJsData(jsCode) {
  if (!jsCode) {
    return null;
  }

  let foundCustomElementName;
  let foundBehaviors;
  let foundObservers;
  let foundProperties;
  let foundListeners;
  /** @type {ObjectProperty[]} */
  const foundClassMembers = [];

  const babelAst = babelParser.parse(jsCode, {});

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
            foundCustomElementName = prop.value.value;
            break;
          case 'behaviors':
            foundBehaviors = prop.value;
            break;
          case 'properties':
            foundProperties = prop.value;
            break;
          case 'observers':
            foundObservers = prop.value;
            break;
          case 'listeners':
            foundListeners = prop.value;
            break;
          case 'keyBindings':
            break;
          case 'hostAttributes':
            break;
          default:
            foundClassMembers.push(prop);
            break;
        }
      });
    },
    // ExpressionStatement(path) {
    //   const name = path.node?.expression?.callee?.property?.name;
    //   let to;
    //   if (name) {
    //     const { value } = path.node.expression.arguments[0];
    //     const o = path.node.expression.callee.object;
    //     const objName = o.type === 'Identifier' ? o.name : 'this';
    //     if (name === '$$') {
    //       to = `${objName}.shadowRoot.querySelector('${value}')`;
    //     } else if (name === '$') {
    //       to = `${objName}.shadowRoot.getElementById('${value}')`;
    //     }
    //   }

    //   if (to) {
    //     // parse(to)
    //   }
    // },
  });

  return {
    customElementName: foundCustomElementName,
    behaviors: foundBehaviors,
    observers: foundObservers,
    properties: foundProperties,
    listeners: foundListeners,
    classMembers: foundClassMembers,
  };
}

/** Create output code from found data */

/**
 * @param {{ node:parse5TemplateNode, istemplate:boolean }} pTemplateEntry the parse5 template node found in the original template
 * @returns {string}
 */
function getTemplateOutput(pTemplateEntry) {
  /**
   * @param {string} expression like '!_myMehod(arg1, arg2)'
   * @param {{ localContext: boolean }} opts localContext will be true for dom-ifs and -repeats, when scope variables are not bound to this
   * @returns {string} like '!this._myMehod(this.arg1, this.arg2)'
   */
  function p2lExpression(expression, { localContext = false } = {}) {
    const isNegation = expression.startsWith('!');
    const context = localContext ? '' : 'this.';

    const fnMatch = expression.match(/!?(.*)\((.*)\)/);
    if (fnMatch) {
      const [, fnName, paramsStr] = fnMatch;
      const params = paramsStr.split(',').map(p => p.trim());
      return `${isNegation ? '!' : ''}${context}${fnName}(${params
        .map(p => `${context}${p}`)
        .join(', ')})`;
    }
    const variable = expression.replace(/^|/, '');
    return `${isNegation ? '!' : ''}${context}${variable.replace(/^!/, '')}`;
  }

  /**
   * https://polymer-library.polymer-project.org/2.0/api/
   * @param {parse5Node} c
   */
  function transformPolymerBuiltin(c) {
    const templateExt = c.nodeName === 'template' && c.attrs.find(a => a.name === 'is');
    if (!(templateExt || ['dom-if', 'dom-repeat'].includes(c.nodeName))) {
      return null;
    }

    let res = '';
    const childNodes = templateExt
      ? c.content.childNodes
      : c.childNodes.find(n => n.nodeName === 'template').content.childNodes;
    const attrsEnriched = c.attrs.map(enrichAttr);

    // <dom-if> or <template is="dom-if">
    if (c.nodeName === 'dom-if' || (templateExt && templateExt.value === 'dom-if')) {
      const ifAttr = attrsEnriched.find(a => a.name === 'if');
      res += `
        \${${p2lExpression(ifAttr.binding.expression)} ? html\`
          ${childNodes.map(c => p2lTagNode(c)).join('\n')}
        \` : ''}`;
    }
    // <dom-repeat> or <template is="dom-repeat">
    else if (c.nodeName === 'dom-repeat' || (templateExt && templateExt.value === 'dom-repeat')) {
      // https://polymer-library.polymer-project.org/2.0/api/elements/Polymer.DomRepeat
      const itemsAttr = attrsEnriched.find(a => a.name === 'items');
      const asAttr = attrsEnriched.find(a => a.name === 'as');
      const asValue = (asAttr && asAttr.value) || 'item';

      res += `
        \${${p2lExpression(itemsAttr.binding.expression)}.map(${asValue} => html\`
          ${childNodes.map(c => p2lTagNode(c, { localContext: true })).join('\n')}
        \`)}`;
    }

    return res;
  }

  function extractExpression(value) {
    // Detect bindings (one or two way?)
    // All variables here will need to be added to static get properties
    if (/\[\[.*\]\]/.test(value)) {
      return {
        expression: value.match(/\[\[(.*)\]\]/)[1],
        twoWay: false,
      };
    } else if (/\{\{.*\}\}/.test(value)) {
      return {
        expression: value.match(/\{\{(.*)\}\}/)[1],
        twoWay: true,
      };
    }
  }

  /**
   *
   * @param {parse5NodeAttr} attibute
   * @returns {parse5NodeAttr}
   */
  function enrichAttr(attibute) {
    const attr = attibute;

    attr.binding = extractExpression(attr.value);

    // Are we dealing with prop or attr?
    if (attr.binding) {
      // if no prop, we are dealing with regular attr
      attr.type = attr.name.endsWith('$') ? 'attr' : 'prop';
    }

    if (attr.name.startsWith('on-')) {
      attr.event = attr.name.replace(/^on-/, '');
    }

    return attr;
  }

  /**
   *
   * @param {parse5Node} c
   * @param {{ localContext:boolean }}
   */
  function p2lTagNode(c, { localContext = false } = {}) {
    const context = localContext ? '' : 'this.';

    if (c.nodeName === '#text') {
      const expr = extractExpression(c.value);
      if (expr) {
        return `\${${p2lExpression(expr.expression, { localContext })}}`;
      } else {
        return c.value;
      }
    }
    if (c.nodeName === '#comment') {
      return `<!-- ${c.data} -->`;
    }

    if (c.tagName === 'style') {
      // This will not be part of template output and handled elsewhere
      return '';
    }

    const polymerBuiltInResult = transformPolymerBuiltin(c);
    if (polymerBuiltInResult) {
      return polymerBuiltInResult;
    }

    const attrsEnriched = c.attrs.map(enrichAttr);

    let result = `<${c.tagName}`;
    attrsEnriched.forEach(a => {
      result += ' \n';
      if (a.event) {
        result += `@${a.event}="\${${context}${a.value}}"`;
      } else if (a.type === 'prop') {
        const variable = p2lExpression(a.binding.expression, { localContext });
        result += `.${dashToCamelCase(a.name)}="\${${variable}}"`;
        if (a.binding && a.binding.twoWay) {
          result += ` @${
            a.name
          }-changed="\${({ currentTarget }) => ${variable} = currentTarget.${variable.replace(
            context,
            '',
          )}}"`;
        }
      } else if (a.type === 'attr' || !a.type) {
        if (a.binding) {
          result += `${a.name.replace(/\$$/, '')}="\${${p2lExpression(a.binding.expression, {
            localContext,
          })}}"`;
        } else {
          result += `${a.name}="${a.value}"`;
        }
      }
    });
    result += '>\n';

    if (c.childNodes) {
      result += c.childNodes.map(c => p2lTagNode(c, { localContext })).join('\n');
    }

    if (c.tagName !== 'input') {
      result += `\n</${c.tagName}>`;
    }

    return result;
  }

  const { node } = pTemplateEntry;
  const results = node.content.childNodes.map(p2lTagNode);

  return formatHtml(trimLines(results));
}

function getStylesOutput(styles) {
  if (!styles || !styles.length) {
    return null;
  }
  return `static get styles() {\nreturn [${styles.map(s => `css\`${s.value}\``).join(',\n')}];\n}`;
}

/**
 * @param {object[]} imports
 * @returns {string}
 */
function getImportsOutput(imports, behaviorNames) {
  const importResults = [];
  imports.forEach(({ source }) => {
    // Omit polymer
    if (source.endsWith('polymer/polymer.html')) {
      return;
    }

    // Rewrite extension
    let res = source.replace(/\.html$/, '.js');
    // Rewrite to local es import
    const isCurrentFolder = res[0] !== '.';
    if (isCurrentFolder) {
      res = `./${res}`;
    } else {
      const isBowerComponent = res.match(/^\.\.\/[^\.].*\//);
      if (isBowerComponent) {
        res = res.replace(/^\.\.\//, '');
      }
    }
    const isBehavior = behaviorNames && res.toLowerCase().includes('behavior');
    let from = '';
    if (isBehavior) {
      // TODO: get data from file itself. Could potentially be multiple behaviors as well...
      let behaviorName = dashToPascalCase(res.match(/\/(.*)\.js$/)[1]);

      const sortedBehaviorNames = behaviorNames
        .slice()
        .sort((a, b) => levenshtein(a, behaviorName) - levenshtein(b, behaviorName));

      // res = `${res.split('/').slice(0, -1).join('/')}/${behaviorName}.js`;
      from = `{ ${sortedBehaviorNames[0]} } from `;
    }
    importResults.push(`import ${from} '${res}';`);
  });
  return importResults.join('\n');
}

function getPropertiesOutputAndExtractProps(objExpr) {
  if (!objExpr) {
    return { result: null, props: null };
  }
  const propObj = objExprToObj(objExpr);
  const props = {
    value: [],
    notify: [],
    computed: [],
    observer: [],
    readOnly: [],
  };
  let keysResult = '';
  Object.entries(propObj).forEach(([propName, keys]) => {
    if (typeof keys === 'object') {
      keysResult += `${propName}: {`;
      Object.entries(keys).forEach(([k, v]) => {
        if (k === 'type') {
          keysResult += `type: ${v}, `;
        } else if (k === 'reflectToAttribute') {
          keysResult += `reflect: ${v}, `;
        } else if (k === 'value') {
          // Later add to constructor
          props.value.push({ propName, value: v });
        } else if (k === 'readOnly') {
          // override setter and create _set${dashToCamelCase(propName)}() method
          props.readOnly.push({ propName });
        } else if (k === 'notify') {
          // add requestUpdateInternal(name, oldValue) { super._ru(...); dispatchEvent(new E(`${propName}-changed`)); }
          props.notify.push({ propName });
        } else if (k === 'computed') {
          const [, paramsStr] = v.match(/\((.*)\)/);
          const relatedProps = paramsStr.split(',').map(p => p.trim());
          // add requestUpdateInternal(name, oldValue) { super._ru(...); if (name === relatedProps[0]) { this.${propName} = this.${computedName}} }
          props.computed.push({ propName, methodName: v, relatedProps });
        } else if (k === 'observer') {
          // add requestUpdateInternal(name, oldValue) { super._ru(...); if (name === propName) { this.${observerName}} }
          props.observer.push({ propName, observerName: v });
        }
      });
      const attribute = camelToDashCase(propName);
      if (attribute !== propName) {
        keysResult += `attribute: '${attribute}', `;
      }
      keysResult += `},\n`;
    } else {
      keysResult += `${propName}: ${keys},`;
    }
  });

  const result = `
    static get properties() {
      return {
        ${keysResult}
      }
    }
  `;

  return { result, props };
}

function getRequestUpdateOutput(props, observers) {
  if (!props && !observers) {
    return null;
  }
  let allProps;
  if (props) {
    allProps = flatten([
      ...props.observer.map(o => o.propName),
      ...props.computed.map(c => c.relatedProps),
      ...props.notify.map(c => c.propName),
    ]);
  }

  if (!(allProps && allProps.length) && !observers) {
    return null;
  }

  let complexObserversResult = '';
  if (observers) {
    if (observers.type !== 'ArrayExpression') {
      throw new Error('Please make sure to use format "observers: [\'method(propA)\']"');
    }
    const methodStrings = observers.elements.map(e => e.value);

    methodStrings.forEach(m => {
      const [, methodName, paramsStr] = m.match(/(.*)\((.*)\)/);
      const relatedProps = paramsStr.split(',').map(p => p.trim());

      // const methodName = m.replace(/\'(.*)\(.*\'$/, '$1');
      complexObserversResult += `
      if (${relatedProps
        .map(p => `(name === '${p}' && notEqual(this.${p}, oldValue))`)
        .join(' || ')}) {
        this.${methodName}(${relatedProps.map(p => `this.${p}`).join(', ')});
      }
      `;
    });
  }

  let propertyKeysResult = '';
  if (allProps && allProps.length) {
    propertyKeysResult = allProps
      .map(propName => {
        let observerResult = '';
        let computedResult = '';
        let notifyResult = '';

        const observer = props.observer.find(o => o.propName === propName);
        const computed = props.computed.find(c => c.relatedProps.includes(propName));
        const notify = props.notify.find(c => c.propName === propName);

        if (observer) {
          const methodName = observer.observerName.replace(/\'(.*)'$/, '$1');
          observerResult = `this.${methodName}(this.${propName}, oldValue);`;
        }
        if (computed) {
          const methodName = computed.methodName.replace(/\'(.*)\(.*\'$/, '$1');
          computedResult = `this.${
            computed.propName
          } = this.${methodName}(${computed.relatedProps.map(r => `this.${r}`).join(', ')});`;
        }
        if (notify) {
          notifyResult = `this.dispatchEvent(new CustomEvent('${camelToDashCase(
            propName,
          )}-changed', { bubbles: true, composed: true, detail: { propX: this.${propName} } }));`;
        }
        const result = `
      if (name === '${propName}' && notEqual(this.${propName}, oldValue)) {
        ${observerResult}
        ${computedResult}
        ${notifyResult}
      }`;
        return result;
      })
      .join('\n');
  }
  const result = `
    requestUpdateInternal(name, oldValue) {
      super.requestUpdateInternal(name, oldValue);

      ${notEqualFn}

      ${propertyKeysResult}

      ${complexObserversResult}
    }
      `;
  return result;
}

function getReadOnlyOutput(props) {
  if (!props || !props.readOnly.length) {
    return null;
  }
  let res = '';
  props.readOnly.forEach(p => {
    res += `
    set ${p.propName}(v) {} // readOnly

    get ${p.propName}() {
      return this.__${p.propName};
    }

    _set${pascalCase(p.propName)}(v) {
      this.__${p.propName} = v;
    }

    `;
  });
  return res;
}

function getConstructorOutput(props) {
  if (!props || !props.value.length) {
    return;
  }

  return `
    constructor() {
      super();

      ${props.value.map(v => `this.${v.propName} = ${v.value};`).join('')}
    }
    `;
}

function getClassMembersOutput(polymerObjectProps) {
  if (!polymerObjectProps) {
    return null;
  }
  function generateResult(p) {
    const body = generateJs(p.body || p.value.body);
    const params = (p.value && p.value.params) || [];
    function writeComment(l) {
      if (l.value.startsWith('*')) {
        return `/**
        ${l.value.trim()}
        */`;
      } else {
        return `// ${l.value.trim()}`;
      }
    }
    const result = `
      ${(p.leadingComments || []).map(writeComment).join('\n')}
      ${p.kind || ''} ${p.key.name}(${params.map(p => p.name).join(', ')})${body}
    `;
    return result;
  }
  const functions = [];
  const methods = [];
  const getterSetters = [];
  polymerObjectProps.forEach(prop => {
    if (prop.type === 'ObjectMethod') {
      if (prop.kind) {
        getterSetters.push(generateResult(prop));
      } else {
        methods.push(generateResult(prop));
      }
    } else if (prop.value.type === 'FunctionExpression') {
      functions.push(generateResult(prop));
    }
  });

  return `
    ${getterSetters.join('\n\n')}
    ${functions.join('\n\n')}
    ${methods.join('\n\n')}
  `;
}

/**
 * @param {object} data meta data including names
 * @param {object} parts different parts that will be placed in the result class
 */
function getTotalOutput(data, parts) {
  const { className, customElementName, behaviorNames } = data;
  const {
    imports,
    properties,
    styles,
    templates,
    constructor,
    requestUpdateInternal,
    readOnlyGetterSetters,
    classMembers,
  } = parts;

  // TODO: filter out main in a more trusted way
  const template = templates[0];

  /**
   * @param {string[]} bs behavior names like [InputBehavior, MyBehavior]
   * @param {string} superClass like 'LitElement'
   * @returns {string} InputBehavior(MyBehavior(LitElement))
   */
  const addMixins = (bs, superClass = 'LitElement') =>
    bs.map(b => `${b}(`).join('') + superClass + bs.map(() => ')').join('');

  const result = `
    import { LitElement, ${template ? 'html,' : ''} ${styles ? 'css,' : ''} } from 'lit-element';
    ${imports || ''}

    ${
      className
        ? `
    class ${className} extends ${behaviorNames ? addMixins(behaviorNames) : 'LitElement'} {
      ${properties || ''}

      ${styles || ''}

      ${template ? `render() {\nreturn html\`\n${template}\`;\n}` : ''}

      ${constructor || ''}

      ${requestUpdateInternal || ''}

      ${readOnlyGetterSetters || ''}

      ${classMembers || ''}
    }
    customElements.define('${customElementName}', ${className});
  `
        : ''
    }`;

  console.log(formatJs(result));

  return formatJs(result);
}

function getBehaviorNames(behaviorsNode) {
  if (!behaviorsNode) {
    return null;
  }
  return behaviorsNode.elements.map(e => {
    if (e.type === 'MemberExpression') {
      return e.property.name; // My.global.namespace.MyBehavior => MyBehavior
    }
    if (e.type === Identifier) {
      return e.name;
    }
  });
}

function polymerToLitCodemod(htmlCode) {
  const htmlFound = retrieveHtmlData(htmlCode);
  const jsFound = retrieveJsData(htmlFound.jsCode) || {};

  const data = {
    className: jsFound.customElementName ? dashToPascalCase(jsFound.customElementName) : null,
    customElementName: jsFound.customElementName,
    behaviorNames: getBehaviorNames(jsFound.behaviors),
  };

  const { result: propertiesResult, props } = getPropertiesOutputAndExtractProps(
    jsFound.properties,
  );
  const parts = {
    imports: getImportsOutput(htmlFound.imports, data.behaviorNames),
    templates: htmlFound.templates.map(getTemplateOutput),
    styles: getStylesOutput(htmlFound.styles),
    properties: propertiesResult,
    constructor: getConstructorOutput(props),
    requestUpdateInternal: getRequestUpdateOutput(props, jsFound.observers),
    readOnlyGetterSetters: getReadOnlyOutput(props),
    classMembers: getClassMembersOutput(jsFound.classMembers),
  };

  const result = getTotalOutput(data, parts);

  return {
    parts,
    result,
  };
}

module.exports = { polymerToLitCodemod };
