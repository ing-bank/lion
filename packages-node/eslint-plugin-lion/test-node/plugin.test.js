const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const plugin = require('../index.js');

/**
 * Integration test for the oxlint jsPlugins bridge and the compatibility adapter in
 * `compat/oxlint-compat.js`.
 *
 * Runs the repo's own oxlint over fixtures and asserts the diagnostics, so a plugin bump that
 * stops loading, a regression in our ported rules, or a break in the adapter (which provides
 * `sourceCode.getJSDocComment` and a writable `parserServices`, both of which oxlint does not
 * offer) fails here instead of silently dropping coverage in the repo.
 *
 * Invoked as `npm run test:node` from this package, which is picked up by the root
 * `test:node` task.
 */
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const OXLINT_BIN = path.join(REPO_ROOT, 'node_modules', 'oxlint', 'bin', 'oxlint');

const A11Y_FIXTURE =
  'import { LitElement, html } from "lit";\n' +
  'class T extends LitElement { render() { return html`<img src="x.png"><input autofocus>`; } }\n' +
  'customElements.define("x-t", T);\n';
const WC_FIXTURE =
  'class MyEl extends HTMLElement {\n  connectedCallbak() {}\n}\ncustomElements.define("my-el", MyEl);\n';

function runOxlint(files, rules, jsPlugins) {
  // The config has to live inside the repo: oxlint resolves `jsPlugins` relative to the
  // config file's directory, not the working directory.
  const dir = fs.mkdtempSync(path.join(REPO_ROOT, '.tmp-oxlint-test-'));
  const fixturePaths = {};
  for (const [name, contents] of Object.entries(files)) {
    fixturePaths[name] = path.join(dir, name);
    fs.writeFileSync(fixturePaths[name], contents);
  }
  const configPath = path.join(dir, '.oxlintrc.json');
  fs.writeFileSync(configPath, JSON.stringify({ jsPlugins, rules }, null, 2));

  const result = spawnSync(
    process.execPath,
    [OXLINT_BIN, '-c', configPath, ...Object.values(fixturePaths)],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    },
  );
  fs.rmSync(dir, { recursive: true, force: true });
  return { status: result.status, output: `${result.stdout || ''}${result.stderr || ''}` };
}

test('the adapter keeps eslint-plugin-lit-a11y and eslint-plugin-wc working', () => {
  const { output } = runOxlint(
    { 'a11y.js': A11Y_FIXTURE, 'wc.js': WC_FIXTURE },
    { 'lit-a11y/alt-text': 'error', 'lit-a11y/no-autofocus': 'error', 'wc/no-typos': 'error' },
    [
      { name: 'lit-a11y', specifier: 'eslint-plugin-lion/compat/lit-a11y' },
      { name: 'wc', specifier: 'eslint-plugin-lion/compat/wc' },
    ],
  );

  // lit-a11y needs the writable parserServices bag (it stores the lit-html tag names there),
  // wc needs sourceCode.getJSDocComment (it inspects the class' JSDoc for @customElement).
  assert.match(output, /lit-a11y\(alt-text\)/u);
  assert.match(output, /lit-a11y\(no-autofocus\)/u);
  assert.match(output, /wc\(no-typos\)/u);
});

test('the raw plugins report nothing without the adapter', () => {
  // Pins down why the adapter exists: on stock oxlint the frozen parserServices makes every
  // lit-a11y rule bail out (no tag names -> no template analysis) and wc's
  // sourceCode.getJSDocComment call throws. If this ever starts reporting, oxlint grew the
  // API and the adapter can go.
  const { output } = runOxlint(
    { 'a11y.js': A11Y_FIXTURE, 'wc.js': WC_FIXTURE },
    { 'lit-a11y/alt-text': 'error', 'lit-a11y/no-autofocus': 'error', 'wc/no-typos': 'error' },
    ['eslint-plugin-lit-a11y', 'eslint-plugin-wc'],
  );

  assert.ok(!/lit-a11y\(alt-text\)/u.test(output), 'lit-a11y must not report without the adapter');
  assert.ok(
    !/lit-a11y\(no-autofocus\)/u.test(output),
    'lit-a11y must not report without the adapter',
  );
  assert.ok(!/wc\(no-typos\)/u.test(output), 'wc must not report without the adapter');
});

test('the ported core rules report what eslint reports', () => {
  const { output } = runOxlint(
    {
      'rules.js':
        'const foo_bar = 1;\n' +
        'const obj = { snake_key: 2 };\n' +
        'for (const k in obj) { void k; }\n' +
        'const undef1 = undefined;\n' +
        'let undef2 = undefined;\n' +
        'class Foo {constructor() { this.a = new Symbol("s"); } }\n' +
        'export { foo_bar, undef1, undef2, Foo };\n',
    },
    {
      'lion/camelcase': 'error',
      'lion/no-restricted-syntax': 'error',
      'lion/no-undef-init': 'error',
      'lion/no-new-symbol': 'error',
    },
    ['eslint-plugin-lion'],
  );

  assert.match(output, /lion\(camelcase\)/u);
  assert.match(output, /lion\(no-restricted-syntax\)/u);
  assert.match(output, /lion\(no-new-symbol\)/u);
  // `let x = undefined` is reported, `const x = undefined` is not (eslint's own exemption).
  assert.match(output, /undef2/u);
  assert.ok(!/undef1/u.test(output), 'const declarators must not be reported');
});

test('the plugin exposes the resolution rule and loads without eslint in the tree', () => {
  for (const rule of [
    'no-unresolved',
    'camelcase',
    'no-new-symbol',
    'no-new-object',
    'no-undef-init',
    'no-buffer-constructor',
    'strict',
    'lines-around-directive',
    'no-restricted-syntax',
  ]) {
    assert.equal(typeof plugin.rules[rule], 'object', `rule ${rule} must be exported`);
    assert.equal(typeof plugin.rules[rule].create, 'function', `rule ${rule} must have create()`);
  }
});
