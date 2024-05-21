'use strict';

const { getPositionByOffset } = require('./get-position-by-offset.cjs');

const isNull = a => !a && typeof a === 'object';
const { assign } = Object;

module.exports.convertModuleToProgram = path => {
  path.node.type = 'Program';
  path.node.sourceType = 'module';
};

module.exports.convertSpanToPosition = (path, source) => {
  const { start, end } = path.node.span;

  delete path.node.span;

  if (end > source.length)
    return assign(path.node, {
      start,
      end,
    });

  const startPosition = getPositionByOffset(start, source);
  const endPosition = getPositionByOffset(end, source);

  assign(path.node, {
    start: startPosition.index,
    end: endPosition.index,
    loc: {
      start: startPosition,
      end: endPosition,
    },
  });
};

module.exports.convertVariableDeclarator = path => {
  delete path.parentPath.node.declare;
  delete path.node.optional;
  delete path.node.definite;
};

module.exports.convertStringLiteral = path => {
  delete path.node.hasEscape;
  delete path.node.kind;
};

module.exports.convertIdentifier = ({ node }) => {
  convertIdentifier(node);
};

function convertIdentifier(node) {
  const { typeAnnotation } = node;

  node.name = node.value;

  if (isNull(typeAnnotation)) {
    delete node.typeAnnotation;
  }

  delete node.value;
  delete node.optional;
  delete node.span;
}

module.exports.convertCallExpression = path => {
  const newArgs = [];

  for (const arg of path.node.arguments) {
    newArgs.push(arg.expression);
  }

  delete path.node.typeArguments;
  path.node.arguments = newArgs;
};

module.exports.BlockStatement = path => {
  path.node.body = path.node.stmts;
  delete path.node.stmts;
  path.node.directives = [];
};

module.exports.TSMappedType = path => {
  path.node.typeParameter = path.node.typeParam;

  if (!path.node.nameType) path.node.nameType = null;

  if (!path.node.readonly) delete path.node.readonly;

  if (!path.node.optional) delete path.node.optional;

  delete path.node.typeParam;
};

module.exports.convertTSTypeParameter = path => {
  convertIdentifier(path.node.name);
};

module.exports.TemplateElement = path => {
  const { cooked, raw } = path.node;

  path.node.value = {
    cooked,
    raw,
  };

  delete path.node.cooked;
  delete path.node.raw;
  delete path.node.tail;
};

module.exports.convertExportDeclaration = path => {
  path.node.type = 'ExportNamedDeclaration';
};

module.exports.convertExportDefaultExpression = path => {
  path.node.type = 'ExportDefaultDeclaration';
  path.node.declaration = path.node.expression;

  delete path.node.expression;
  delete path.node.declare;
};

module.exports.convertParenthesisExpression = path => {
  const expressionPath = path.get('expression');

  if (expressionPath.type === 'TsAsExpression') convertTSAsExpression(expressionPath);
  else if (expressionPath.type === 'TsConstAssertion') convertTSConstAssertion(expressionPath);

  path.replaceWith(expressionPath.node);
};

module.exports.ClassMethod = path => {
  const { node } = path;
  const { key } = path.node;

  Object.assign(node, {
    ...path.node.function,
    key,
  });

  if (node.kind === 'getter') {
    node.kind = 'get';
  }
  if (node.kind === 'setter') {
    node.kind = 'set';
  }

  node.static = node.isStatic;

  delete path.node.isStatic;
  delete path.node.accessibility;
  delete path.node.isAbstract;
  delete path.node.isOptional;
  delete path.node.isOverride;
  delete path.node.optional;
  delete path.node.function;
  delete path.node.decorators;
  delete path.node.typeParameters;
  delete path.node.returnType;
  delete path.node.span;
};

module.exports.ClassDeclaration = path => {
  path.node.id = path.node.identifier;
  path.node.body = {
    type: 'ClassBody',
    body: path.node.body,
  };

  delete path.node.identifier;
  delete path.node.declare;
  delete path.node.decorators;
  delete path.node.isAbstract;
  delete path.node.typeParams;
  delete path.node.superTypeParams;
  delete path.node.implements;
};

module.exports.MemberExpression = ({ node }) => {
  node.computed = node.property.type === 'Computed';

  if (node.computed) node.property = node.property.expression;
};

function convertSpreadElement(node) {
  const { expression } = node;

  assign(node, {
    type: 'SpreadElement',
    argument: expression,
  });

  delete node.spread;
  delete node.expression;
}

function maybeConvertSpread(arg) {
  if (arg === null) return;

  const { spread } = arg;

  if (spread) {
    convertSpreadElement(arg);
    return;
  }

  assign(arg, arg.expression);

  delete arg.spread;
  delete arg.expression;
}

module.exports.NewExpression = path => {
  path.node.arguments = path.node.arguments || [];
  path.node.arguments.forEach(maybeConvertSpread);

  delete path.node.typeArguments;
};

module.exports.ArrayExpression = path => {
  path.node.elements.forEach(maybeConvertSpread);
};

module.exports.Function = path => {
  const { node } = path;

  if (path.parentPath.isExportDefaultDeclaration()) path.node.type = 'FunctionDeclaration';

  const { params, typeParameters } = node;

  node.id = node.identifier || null;

  delete node.identifier;
  delete node.decorators;

  if (!node.returnType) delete node.returnType;

  for (const [index, param] of params.entries()) {
    if (param.type === 'Parameter') params[index] = param.pat;
  }

  if (isNull(typeParameters)) delete node.typeParameters;

  delete node.declare;
};

module.exports.TSTypeAliasDeclaration = path => {
  delete path.node.declare;
  delete path.node.typeParams;
};

module.exports.TSAsExpression = convertTSAsExpression;
function convertTSAsExpression({ node }) {
  node.type = 'TSAsExpression';

  if (node.typeAnnotation.kind === 'any')
    assign(node.typeAnnotation, {
      type: 'TSAnyKeyword',
    });
}

module.exports.TSConstAssertion = convertTSConstAssertion;
function convertTSConstAssertion({ node }) {
  assign(node, {
    type: 'TSAsExpression',
    extra: {
      parenthesized: true,
      parenStart: 0,
    },
    typeAnnotation: {
      type: 'TSTypeReference',
      typeName: {
        type: 'Identifier',
        name: 'const',
      },
    },
  });
}

module.exports.TSTypeReference = path => {
  delete path.node.typeParams;
};

module.exports.TSTypeOperator = path => {
  path.node.operator = path.node.op;

  delete path.node.op;
};

module.exports.TSTypeParameter = path => {
  path.node.name = path.node.name.name;

  delete path.node.in;
  delete path.node.out;
  delete path.node.default;
};

module.exports.TSIndexedAccessType = path => {
  delete path.node.readonly;
};

module.exports.ImportDeclaration = ({ node }) => {
  const { typeOnly } = node;

  node.assertions = node.asserts?.properties || [];
  node.importKind = typeOnly ? 'type' : 'value';

  delete node.asserts;
  delete node.typeOnly;
};

module.exports.ImportSpecifier = ({ node }) => {
  if (!node.imported)
    node.imported = {
      ...node.local,
    };

  delete node.isTypeOnly;
};

module.exports.convertObjectProperty = path => {
  const { node } = path;

  node.type = 'ObjectProperty';
  node.shorthand = !node.value;

  if (!node.value)
    node.value = {
      ...node.key,
    };

  delete path.parentPath.node.optional;
};

module.exports.convertGetterSetter = ({ node }) => {
  node.kind = node.type === 'GetterProperty' ? 'get' : 'set';
  node.type = 'ObjectMethod';
  node.params = node.param ? [node.param] : [];

  delete node.param;
};

module.exports.ExportDefaultDeclaration = ({ node }) => {
  // node.declaration may have been already provided by convertExportDefaultExpression
  node.declaration = node.declaration || node.decl;
  node.exportKind = 'value';
  node.assertions = node.asserts?.properties || [];

  delete node.decl;
};

module.exports.ExportNamedDeclaration = ({ node }) => {
  const { typeOnly } = node;

  node.assertions = node.asserts?.properties || [];
  // node.source = null;
  node.specifiers = node.specifiers || [];

  node.exportKind = typeOnly ? 'type' : 'value';

  delete node.asserts;
  delete node.typeOnly;
};

module.exports.ExportSpecifier = ({ node }) => {
  const { orig, exported } = node;

  node.local = orig;
  node.exported = exported || {
    ...orig,
  };

  delete node.isTypeOnly;
  delete node.orig;
};

module.exports.JSXElement = path => {
  path.node.openingElement = path.node.opening;
  delete path.node.opening;
  path.node.closingElement = path.node.closing;
  delete path.node.closing;
};

module.exports.JSXFragment = path => {
  path.node.openingFragment = path.node.opening;
  delete path.node.opening;
  path.node.closingFragment = path.node.closing;
  delete path.node.closing;
};
