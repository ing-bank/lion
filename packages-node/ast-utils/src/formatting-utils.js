const prettier = require('prettier');
const { default: generate } = require('@babel/generator');

/** Generic Utils */

/**
 * Formats the generated codemod output via Prettier
 * @param {string} code javascript file
 * @returns {string} formatted javascript fragment
 */
function formatJs(code) {
  return prettier.format(code, { parser: 'babel' });
}

/**
 * Formats the generated codemod html output via Prettier
 * @param {string} code html file
 * @returns {string} formatted html fragment
 */
function formatHtml(code) {
  return prettier.format(code, { parser: 'html' });
}

/**
 * Takes a babel ast node and formats this as a piece of Javascript source code
 * @param {*} astNode Babel ast node
 * @returns {string} js fragment
 */
function generateJs(astNode) {
  return generate(astNode).code;
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

module.exports = {
  formatJs,
  formatHtml,
  generateJs,
  trimLines,
};
