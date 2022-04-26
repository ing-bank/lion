# Lit Hybrid

At first sight, migrating from lit1 to lit2 looks easy.

Based on our personal experiences for our [lion monorepo](https://github.com/ing-bank/lion/) and its extension layer, we found the following challenges/steps (grouped by package):

- for `lit-element`:
  - change protected api `.requestUpdateInternal` to `requestUpdate`
  - change protected api `._classProperties` to `.elementProperties`
  - upgrade our @lion/core reexports
- for `lit-html`:
  - replace our own ref directive in demos with that of lit2
- for `@open-wc/scoped-elements`:
  - update `document.createElement` to `this.createScopedElement`
  - drop IE11
- for `@open-wc/testing`:
  - make sure all lit-html versions are compatible, either by:
    - dedupe lit-html (not always possible when not in control of dependencies and their versions)
    - [provide a hybrid render function to fixture](#provide-a-hybrid-render-function-to-fixture) that can be used in all contexts
- for `@mdjs/preview`:
  - make sure all lit-html versions are compatible, either by:
    - dedupe (not always possible when not in control of dependencies and their versions)
    - import everything from mdjs-preview (although not possible when directives are used)
    - [provide a hybrid render function to mdjs-preview](#provide-a-hybrid-render-function-to-mdjs-preview) that can be used in all contexts

On top of that, special steps can be taken when you want to support an app that runs both lit1 and lit2:

- for `lit`|`lit-element`|`lit-html`:
  - [make css tag variables/mixins consumable inside legacy (lit1) contexts](<#make-css-tag-variables/mixins-consumable-inside-legacy-(lit1)-contexts>)
  - [make html tag templates consumable inside legacy (lit1) contexts](<#make-html-tag-templates-consumable-inside-legacy-(lit1)-contexts>)
    If you have the luxury to be a 'leaf node' (i.e. not have dependencies with other (major) lit versions),
    migrating is relatively straightforward.
    However, many projects contain multiple lit versions due to (transitive) dependencies.

There are several strategies for dealing with those situations:

## Hybrid strategies

Note that all of them should be considered temporary workarounds for code (lit versions) that you
are not in control of. Be sure to run a sanity check that scans your node_modules to see
if these workarounds are still needed for your app.

### Hybrid strategies for client tooling

#### Make css tag variables/mixins consumable inside legacy (lit1) contexts

```diff
- import { css } from 'lit';
+ import { cssHybrid as css } from 'lit-hybrid';

export const grayColor = css`#eee`;
```

#### Make html tag templates consumable inside legacy (lit1) contexts

```js
import { LitElement } from 'lit';
import { html as html1 } from 'lit-html';
import { html2Hybrid } from 'lit-hybrid';

export class X extends LitElement {
  render() {
    return html2Hybrid`<div>${html1`<span>x</span>`}</div>`;
  }
}
```

### Hybrid strategies for dev tooling

#### Provide a hybrid render function to mdjs-preview

Load this file before mdjs-preview is loaded

```js
import { MdJsPreview } from '@mdjs/mdjs-preview';
import { renderHybrid } from 'lit-hybrid';

export class HybridLitMdjsPreview extends MdJsPreview {
  get renderFunction() {
    return renderHybrid;
  }
}
customElements.define('mdjs-preview', HybridLitMdjsPreview);
```

#### Provide a hybrid render function to fixture

Create a global file `testing-hybrid.js` that exports a hybrid fixture:

```js
import { fixture, fixtureSync } from '@open-wc/testing';
import { renderHybrid } from 'lit-hybrid';

export const hybridFixture = async (/** @type {TemplateResult1|TemplateResult2|string} */ (templateOrString)) =>
  fixture(templateOrString, { render: renderHybrid });
export const hybridFixtureSync = (/** @type {TemplateResult1|TemplateResult2|string} */ (templateOrString)) =>
  fixtureSync(templateOrString, { render: renderHybrid });
```

In your test files, consume this:

```diff
- import { fixture } from '@open-wc/testing';
+ import { hybridFixture as fixture } from '#testing-hybrid';
```
