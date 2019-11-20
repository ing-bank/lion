const babel = require('@babel/core');

// TODO: check to see if parseExpression would be a better fit...
/**
 *
 * @param {string} code
 * @param {string} nodeType compatible with babel AST
 */
function parseToNodes(code, nodeType) {
  const ast = babel.parse(code);
  let res = [];
  if (nodeType) {
    babel.traverse(ast, {
      [nodeType](path) {
        res.push(path.node);
      }
    });
  } else {
    res = ast.program.body;
  }
  return res;
}

module.exports = { parseToNodes };
