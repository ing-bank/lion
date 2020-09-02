const prettier = require('prettier');
const { default: generate } = require('@babel/generator');

/** Generic Utils */

/**
 * Formats the generated codemod output via Prettier
 * @param {string} code javascript file
 * @returns {string} formatted javascript file
 */
function formatJs(code) {
  return prettier.format(code, { parser: 'babel' });
}

/**
 * Formats the generated codemod html output via Prettier
 * @param {string} code html file
 * @returns {string} formatted html file
 */
function formatHtml(code) {
  return prettier.format(code, { parser: 'html' });
}

function generateJs(astNode) {
  return generate(astNode).code;
}

/**
 * Flatten function for older versions of Node
 * @param {Array} array like ['a', ['b']]
 * @returns {Array} like ['a', 'b']
 */
function flatten(array) {
  return Array.prototype.concat.apply([], array);
}

/**
 * Converts Babel ObjectExpression to a regular Javascript object
 * @param {ObjectExpression} objExpr
 * @returns {string} serialized object like { a: Boolean, b: { value: 'x' }}
 */
function objExprToObj(objExpr) {
  const res = {};
  objExpr.properties.forEach(p => {
    if (p.value.properties) {
      res[p.key.name] = {};
      const resl2 = res[p.key.name];
      if (p.value.properties) {
        p.value.properties.forEach(p2 => {
          if (p2.value.type !== 'ObjectExpression') {
            if (p2.value.type === 'Literal' || p2.value.type === 'StringLiteral') {
              resl2[p2.key.name] = `'${p2.value.value}'`;
            } else if (p2.value.type === 'Identifier') {
              resl2[p2.key.name] = `${p2.value.name}`;
            } else {
              // Boolean
              resl2[p2.key.name] = `${p2.value.value}`;
            }
          } else {
            resl2[p2.key.name] = p2.value;
          }
        });
      }
    } else {
      res[p.key.name] = `${p.value.name}`;
    }
  });
  return res;
}

// https://gist.github.com/andrei-m/982927
function levenshtein(a, b) {
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1,
          ),
        ); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * - From:
 * <div>
 *
 *   <input>
 *
 * </div>
 *
 * - To:
 * <div>
 *   <input>
 * </div>
 *
 * @param {string} code
 */
function trimLines(code) {
  return code
    .join('\n')
    .split('\n')
    .filter(_ => _.trim()) // filter out empty lines
    .join('\n');
}

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const caseMap = {};
const DASH_TO_CAMEL = /-[a-z]/g;
const CAMEL_TO_DASH = /([A-Z])/g;

/**
 * @fileoverview Module with utilities for converting between "dash-case" and
 * "camelCase" identifiers.
 */

/**
 * Converts "dash-case" identifier (e.g. `foo-bar-baz`) to "camelCase"
 * (e.g. `fooBarBaz`).
 *
 * @param {string} dash Dash-case identifier
 * @return {string} Camel-case representation of the identifier
 */
function dashToCamelCase(dash) {
  // eslint-disable-next-line no-return-assign
  return (
    caseMap[dash] ||
    (caseMap[dash] =
      dash.indexOf('-') < 0 ? dash : dash.replace(DASH_TO_CAMEL, m => m[1].toUpperCase()))
  );
}

/**
 * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
 * (e.g. `foo-bar-baz`).
 *
 * @param {string} camel Camel-case identifier
 * @return {string} Dash-case representation of the identifier
 */
function camelToDashCase(camel) {
  // eslint-disable-next-line no-return-assign
  return caseMap[camel] || (caseMap[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase());
}

function pascalCase(str) {
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * Converts dashcased elements
 * @param {string} str like 'my-element'
 * @returns {string} like 'MyElement'
 */
function dashToPascalCase(str) {
  return pascalCase(dashToCamelCase(str));
}

module.exports = {
  dashToCamelCase,
  camelToDashCase,
  dashToPascalCase,
  pascalCase,
  formatJs,
  formatHtml,
  generateJs,
  flatten,
  objExprToObj,
  levenshtein,
  trimLines,
};
