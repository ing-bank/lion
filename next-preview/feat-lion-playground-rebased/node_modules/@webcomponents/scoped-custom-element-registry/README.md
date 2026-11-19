# Scoped CustomElementRegistry polyfill prototype

## 🚨 Work in progress

This polyfill explores implementation of a non-finalized spec proposal and is
currently a work in progress.

## Overview

Scoped CustomElementRegistry polyfill based on [Scoped Custom Element
Registries](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md)
WICG proposal.

Technique: uses native CustomElements to register stand-in classes that
delegate to the constructor in the registry for the element's scope; this
avoids any manual treewalks to identify custom elements that need upgrading.
Constructor delegation is achieved by constructing a bare `HTMLElement`,
inspecting its tree scope (or the tree scope of the node it was created via) to
determine its registry, and then applying the "constructor call trick" to
upgrade it.

Notes/limitations:

- In order to leverage native CE when available, `observedAttributes` handling
  must be simulated by patching `setAttribute`/`getAttribute`/`toggleAttribute` to call
  `attributeChangedCallback` manually, since while we can delegate constructors,
  the `observedAttributes` respected by the browser are fixed at define time.
  This means that native reflecting properties are not observable when set via
  properties.
- In theory, this should be able to be layered on top of the Custom Elements
  polyfill for use on older browsers, although this is yet to be tested. Use of
  `Reflect.construct` may need to be modified in those cases

Outstanding TODOs:

- [ ] [#419](https://github.com/webcomponents/polyfills/issues/419): Convert source to TS (to match convention in this monorepo)
- [ ] [#420](https://github.com/webcomponents/polyfills/issues/420): Test and work out layering strategy with standard custom-elements polyfill
- [ ] [#421](https://github.com/webcomponents/polyfills/issues/421): Test and work out layering strategy with shady-dom & shady-css polyfills
- [ ] [#422](https://github.com/webcomponents/polyfills/issues/422): Add benchmarks
