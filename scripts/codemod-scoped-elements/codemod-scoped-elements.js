// const require trackdownCustomElements

const babel = require('@babel/core');
const babelParser = require('@babel/parser');
const parseToNodes = require('./parse-to-nodes.js');

function pascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const pathLib = require('path');

// ing-web specific config: move to different file and use lion by default.
const externalConfig = {
  shouldReplaceImport(source) {
    return source.startsWith('ing-web');
  },
  replaceImportWith(source) {
    const ce = pathLib.basename(source, '.js');
    const className = pascalCase(ce);
    // Don't worry about multiple imports with the same source
    // This will be taken care of later.
    const importDeclarationString = `import { ${className} } from 'ing-web/index.js'`;
    return { ce, className: pascalCase(ce), importDeclarationString };
  },
};

export default function(babel) {
  const { types: t } = babel;

  const klassDefs = [];
  // klassDefs.push({ ce: 'lion-calendar', klass: 'LionCalendar', path: 'xyz' });
  // klassDefs.push({
  //   ce: 'lion-calendar-overlay-frame',
  //   klass: 'LionCalendarOverlayFrame',
  //   path: 'xyz',
  // });

  const shouldImportGetScopedTagName = false;
  const foundImportPaths = [];

  return {
    name: 'ast-transform', // not required
    visitor: {
      Program: {
        enter(path) {},
        exit(path) {},
      },
      ImportDeclaration: {
        enter(path) {
          if (!path.node.specifiers.length) {
            const src = path.node.source.value;

            if (externalConfig.shouldReplaceImport(src)) {
              const entry = externalConfig.replaceImportWith(src);
              klassDefs.push(entry);
              // replace import
              const ImportDecNode = parseToNodes(
                entry.importDeclarationString,
                'ImportDeclaration',
              )[0];
              path.replaceWith(ImportDecNode);
            }
          }
          foundImportPaths.push(path);
        },
        exit(path) {
          // const parentPath =
          // dedupe all imports
        },
      },
      ClassDeclaration: {
        enter(path) {
          const superClassPath = path.get('superClass');
          const wrapped = t.callExpression(t.identifier('ScopedElementsMixin'), [
            superClassPath.node,
          ]);
          superClassPath.replaceWith(wrapped);
        },
        exit(path) {
          const scopedElsClassMethodString = `
            Class X {
              static get scopedElements() {
                return {
                  ...super.scopedElements,
                  ${klassDefs.map(def => `${def.ce}:${def.klass},`).join('')}
                };
              }
            }`;

          const classMethodNode = parseToNodes(scopedElsClassMethodString, 'ClassMethod')[0];
          path.node.body.body.unshift(classMethodNode);
        },
      },
      CallExpression(path) {
        if (path.node.callee.type !== 'MemberExpression') {
          return;
        }
        const { callee } = path.node;
        console.log(callee);
        if (callee.object.name === 'document' && callee.property.name === 'createElement') {
          path.replaceWith(
            t.callExpression(t.identifier('createScopedElement'), [
              t.stringLiteral(path.node.arguments[0].value) /* ,this.constructor.scopedElements */,
            ]),
          );
          shouldImportCreateScopedElement = true;
        }
      },
    },
  };
}
