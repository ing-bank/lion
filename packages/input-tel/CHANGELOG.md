# @lion/input-tel

## 0.1.0
### Minor Changes

- a882c94f: New component "LionInputTel"
- aa8b8916: BREAKING CHANGE: Work without polyfill if possible
  
  When using [component composition](https://lit.dev/docs/composition/component-composition/) in a Lion Component we always made it very explicit which sub-components are used.
  On top of that we scoped these [sub components](https://open-wc.org/docs/development/scoped-elements/) to the [current shadow root](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) allowing multiple version to be used simultaneously.
  
  To enable this features we relied on the fact that the `ScopedElementsMixin` did loaded the needed polyfill for us.
  
  We however over time got feedback from multiple consumers that lion components "break the app as soon as you load them".
  The reasons is/was that not everyone is always using `ScopedElementsMixin` or in full control of the app (or its load order).
  
  To quote the release notes of `ScopedElementsMixin` v2.1.0:
  
  > ScopedElementsMixin 2.x tried to be as convenient as possible by automatically loading the scoped custom elements registry polyfill.
  > This however led to a fatal error whenever you registered any component before ScopedElementsMixin was used.
  
  And this was the case.
  
  With the upgrade to `@open-wc/scoped-elements` v2.1.1 Lion now no longer automatically loads the polyfill through `ScopedElementsMixin`.
  
  This essentially means the polyfill became optional which results in the following behavior
  
  1. If polyfill is not loaded it will use the global registry as a fallback
  2. Log error if actually scoping is needed and polyfill is not loaded
  3. If you manually create elements you will need to handle polyfilled and not polyfilled cases now
  
  ```diff
  -  const myButton = this.shadowRoot.createElement('my-button');
  +  const myButton = this.createScopedElement('my-button');
  ```
  
  This also removes `@webcomponents/scoped-custom-element-registry` as a production dependency.
  
  If you need scoping be sure to load the polyfill before any other web component gets registered.
  
  It may look something like this in your HTML
  
  ```html
  <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
  ```
  
  or if you have an SPA you can load it at the top of your app shell code
  
  ```js
  import '@webcomponents/scoped-custom-element-registry';
  ```
  
  You need scoping if you want to
  
  use 2 major versions of a web component (e.g. in an SPA pageA uses 1.x and pageB uses 2.x of color-picker)
  or you want to use the same tag name with different implementations (use tag color-picker from foo here and from bar here)
  
  See more details at
  
  - [Lion release blog post](https://lion-web.netlify.app/blog/lion-without-polyfills/)
  - [@open-wc/scoped-elements release blog post](https://open-wc.org/blog/scoped-elements-without-polyfill/)
  - [Change log of ScopedElementsMixin](https://github.com/open-wc/open-wc/blob/master/packages/scoped-elements/CHANGELOG.md#210)

### Patch Changes

- Updated dependencies [9c1dfdcd]
- Updated dependencies [3772c943]
- Updated dependencies [66531e3c]
- Updated dependencies [672c8e99]
- Updated dependencies [7016a150]
- Updated dependencies [aa8b8916]
- Updated dependencies [f408f6f8]
  - @lion/form-core@0.17.0
  - @lion/core@0.22.0
  - @lion/input@0.17.0
  - @lion/localize@0.24.0
