'use strict';

const { types, traverse } = require('@putout/babel');

const {
  convertModuleToProgram,
  convertSpanToPosition,
  convertVariableDeclarator,
  convertStringLiteral,
  convertIdentifier,
  convertCallExpression,
  convertObjectProperty,
  BlockStatement,
  TemplateElement,
  convertTSTypeParameter,
  convertExportDeclaration,
  convertExportDefaultExpression,
  convertParenthesisExpression,
  convertGetterSetter,
  ClassMethod,
  ClassDeclaration,
  ArrayExpression,
  MemberExpression,
  NewExpression,
  Function,
  ImportDeclaration,
  ImportSpecifier,
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
  ExportSpecifier,
  TSTypeAliasDeclaration,
  TSMappedType,
  TSTypeReference,
  TSTypeOperator,
  TSTypeParameter,
  TSIndexedAccessType,
  TSAsExpression,
  JSXElement,
  JSXFragment,
} = require('./swc/index.cjs');

const getAST = require('./get-ast.cjs');
const { isIdentifier } = types;

/**
 * Convert an SWC ast to a babel ast
 * @param ast {Module} SWC ast
 * @param {string} [src=""] Source code
 * @returns {ParseResult<File>} Babel ast
 */
function toBabel(node, source = '') {
  const ast = getAST(node);

  traverse(ast, {
    noScope: true,

    BlockStatement,
    TemplateElement,
    ClassMethod,
    ClassDeclaration,
    ClassExpression: ClassDeclaration,
    ArrayExpression,
    MemberExpression,
    NewExpression,
    Function,
    ImportDeclaration,
    ImportSpecifier,
    ExportNamedDeclaration,
    ExportSpecifier,
    ExportDefaultDeclaration,

    TSTypeAliasDeclaration,
    TSMappedType,
    TSTypeReference,
    TSTypeOperator,
    TSTypeParameter,
    TSIndexedAccessType,
    TSAsExpression,

    JSXElement,
    JSXFragment,

    enter(path) {
      const { node } = path;
      const { type } = node;

      if ('span' in path.node) convertSpanToPosition(path, source);

      delete node.start;
      delete node.end;

      if (type?.startsWith('Ts')) node.type = type.replace('Ts', 'TS');

      if (type?.endsWith('Literal')) setEsprimaRaw(node);

      if (isIdentifier(path)) return convertIdentifier(path);

      if (path.isStringLiteral()) return convertStringLiteral(path);

      if (type === 'Module') return convertModuleToProgram(path);

      if (path.isVariableDeclarator()) return convertVariableDeclarator(path);

      if (path.isCallExpression()) return convertCallExpression(path);

      if (path.isTSTypeParameter()) return convertTSTypeParameter(path);

      if (path.type === 'ExportDeclaration') return convertExportDeclaration(path);

      if (path.type === 'ExportDefaultExpression') return convertExportDefaultExpression(path);

      if (path.type === 'ParenthesisExpression') return convertParenthesisExpression(path);

      if (/^(KeyValue|KeyValuePattern|AssignmentPattern)Property$/.test(path.type))
        return convertObjectProperty(path);

      if (path.type === 'GetterProperty' || path.type === 'SetterProperty')
        return convertGetterSetter(path);
    },
  });

  return ast;
}

module.exports = toBabel;

function setEsprimaRaw(node) {
  const { raw } = node;

  node.raw = raw || node.extra?.raw;
  node.extra = node.extra || {
    raw,
  };
}
