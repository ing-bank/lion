/**
 * `eslint-plugin-wc` behind the oxlint compatibility adapter.
 *
 * Registered in `.oxlintrc.json` as
 *   { "name": "wc", "specifier": "eslint-plugin-lion/compat/wc" }
 * so the rule ids stay `wc/<rule>`, exactly as they were under eslint.
 *
 * 5 of the 8 enabled `wc/*` rules call `sourceCode.getJSDocComment()` for every class they
 * check; oxlint throws from that method, so without the adapter those rules fail instead of
 * reporting.
 */
const { adaptPlugin } = require('./oxlint-compat.js');

module.exports = adaptPlugin(require('eslint-plugin-wc'));
