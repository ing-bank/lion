/**
 * `eslint-plugin-lit-a11y` behind the oxlint compatibility adapter.
 *
 * Registered in `.oxlintrc.json` as
 *   { "name": "lit-a11y", "specifier": "eslint-plugin-lion/compat/lit-a11y" }
 * so the rule ids stay `lit-a11y/<rule>`, exactly as they were under eslint.
 *
 * All 26 enabled `lit-a11y/*` rules read and write `parserServices` through
 * `HasLitHtmlImportRuleExtension`; without the adapter (frozen parserServices in oxlint) they
 * report nothing at all.
 */
const { adaptPlugin } = require('./oxlint-compat.js');

// Resolved from the repo root's devDependencies, like the other jsPlugins entries.
module.exports = adaptPlugin(require('eslint-plugin-lit-a11y'));
