# Why this adapter exists, and what we want to give back

`.oxlintrc.json` loads Lion's eslint plugins through oxlint's JS plugin bridge (`jsPlugins`). Two of
them need behaviour from the objects a rule is handed that oxlint does not provide today, which is
why `oxlint-compat.js` wraps their rules instead of them being loaded directly:

| package                  | what it uses                                                                                                                                  | what oxlint does                                                        |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `eslint-plugin-wc`       | `sourceCode.getJSDocComment(node)` - 5 of the 8 rules Lion enables call it for every class they check                                         | throws (`getJSDocComment is not supported at present (and deprecated)`) |
| `eslint-plugin-lit-a11y` | writes and reads per-file lit-html state in `sourceCode.parserServices` (`HasLitHtmlImportRuleExtension`), all 26 enabled rules go through it | hands the rule a frozen `{}`                                            |

The other plugins Lion uses - `eslint-plugin-lit`, `eslint-plugin-no-only-tests`,
`eslint-plugin-import` - run unmodified, which is why the adapter is only three files.

The adapter is a bridge, not a destination: it reimplements two behaviours in JS for every oxlint
release. The point of this note is the exit - each part is a small change in the package that owns
the behaviour, and we want to hand them over instead of carrying them:

1. **`eslint-plugin-wc`** - stop calling `sourceCode.getJSDocComment()`: read `node.jsDoc` /
   `leadingComments` in the plugin (same information, no eslint-only API). Works under eslint and
   oxlint alike, so nothing has to be conditional. A PR with a test is a few lines.
2. **`eslint-plugin-lit-a11y`** - stop storing per-file state in `sourceCode.parserServices`: keep
   it in a module-level `WeakMap` keyed by `sourceCode`, which is all `parserServices` is used as
   here. Again valid under both linters, again a small change in
   `HasLitHtmlImportRuleExtension`.
3. **oxc / oxlint** - the two gaps themselves: `getJSDocComment` is deprecated in eslint but is
   still called by widely used plugins, and `parserServices` is the convention for rule-set state.
   Either provide both on the `sourceCode` object oxlint passes to a JS plugin, or document an
   official way for a plugin to keep per-file state, so plugins that follow eslint's conventions
   work unchanged.

We are happy to write 1 and 2 and send them upstream. Once either side lands, the corresponding
file here goes away and `jsPlugins` lists the package itself.

## Checking that the adapter is still needed, and still correct

`packages-node/eslint-plugin-lion/test-node/plugin.test.js` covers both directions: the adapter
keeps the plugins working (the three fixture findings appear), and the raw packages report nothing
on stock oxlint - the test that says the adapter can be deleted the day oxlint grows the API.

```bash
npm run test:node --workspace eslint-plugin-lion   # 4 tests
npm run oxlint:check 2>&1 | grep -i "JS plugin"    # expect no output: no rule fails on the bridge
```
