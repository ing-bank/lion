# Change Log

## 0.14.0

### Minor Changes

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

## 0.13.0

### Minor Changes

- 683d5c1c: Upgrade to latest Typescript. Keep in mind, some @ts-ignores were necessary, also per TS maintainer's advice. Use skipLibCheck in your TSConfig to ignore issues coming from Lion, the types are valid.

  **We also unfixed lion's dependencies (now using caret ^) on its own packages**, because it caused a lot of problems with duplicate installations for end users as well as subclassers and its end users. Both of these changes may affect subclassers in a breaking manner, hence the minor bump.

  Be sure to [read our Rationale on this change](https://lion-web.netlify.app/docs/rationales/versioning/) and what this means for you as a user.

## 0.12.1

### Patch Changes

- 30805edf: Replace deprecated node folder exports with wildcard exports for docs

## 0.12.0

### Minor Changes

- 87959850: **BREAKING** public API changes:

  - Changed `timeToLive` to `maxAge`
  - Renamed `requestIdentificationFn` to `requestIdFunction`

### Patch Changes

- 87959850: Fix cache session race condition for in-flight requests

## 0.11.1

### Patch Changes

- 84131205: use mdjs-preview in docs for lit compatibility

## 0.11.0

### Minor Changes

- 73d4e222: **BREAKING** public API changes:

  - `AjaxClient` is now `Ajax`
  - `AjaxClientFetchError` is now `AjaxFetchError`
  - `request` and `requestJson` methods of `Ajax` class are renamed as `fetch` and `fetchJson` respectively
  - `getCookie` and `validateOptions` is not part of the public API any more
  - Removed the `setAjax`
  - `createXSRFRequestInterceptor` renamed as `createXsrfRequestInterceptor`
  - Exporting `createCacheInterceptors` instead of `cacheRequestInterceptorFactory` and `cacheResponseInterceptorFactory`

## 0.10.0

### Minor Changes

- 02e4f2cb: add simulator to demos

## 0.9.0

### Minor Changes

- 43e4bb81: Type fixes and enhancements:

  - all protected/private entries added to form-core type definitions, and their dependents were fixed
  - a lot @ts-expect-error and @ts-ignore (all `get slots()` and `get modelValue()` issues are fixed)
  - categorized @ts-expect-error / @ts-ignore into:
    - [external]: when a 3rd party didn't ship types (could also be browser specs)
    - [allow-protected]: when we are allowed to know about protected methods. For instance when code
      resides in the same package
    - [allow-private]: when we need to check a private value inside a test
    - [allow]: miscellaneous allows
    - [editor]: when the editor complains, but the cli/ci doesn't

### Patch Changes

- c1a81fe4: allow caching concurrent requests
- 9b79b287: Fix(ajax) options expansion, fix removing request interceptors, use 1 hour as default time to live, check for null when serializing the search params
- 77a04245: add protected and private type info
- 468223a0: return cached status and headers

## 0.8.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket

## 0.7.0

### Minor Changes

- 2cd7993d: Set fromCache property on the Response, for user consumption. Allow setting cacheOptions on the AjaxClient upon instantiation. Create docs/demos.

## 0.6.0

### Minor Changes

- 4452d06d: BREAKING CHANGE: We no longer use axios! Our ajax package is now a thin wrapper around Fetch. The API has changed completely. You will need a fetch polyfill for IE11.
- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

- bbffd710: Added Ajax cache interceptors.

## 0.5.15

### Patch Changes

- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8

## 0.5.14

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [98f1bb7e]
  - @lion/core@0.13.7
  - singleton-manager@1.2.1

## 0.5.13

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6

## 0.5.12

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5

## 0.5.11

### Patch Changes

- Updated dependencies [39d5e767]
  - singleton-manager@1.2.0

## 0.5.10

### Patch Changes

- 6cc8b95c: Added types for ajax package, although they are mostly quite butchered. This is due to the complexity of interceptor factories and bundled-es-modules/axios not exporting types, which makes it really difficult to type it properly.
- 1cb604c6: enable types for ajax

## 0.5.9

### Patch Changes

- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4

## 0.5.8

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3

## 0.5.7

### Patch Changes

- Updated dependencies [20ba0ca8]
  - @lion/core@0.13.2

## 0.5.6

### Patch Changes

- Updated dependencies [e92b98a4]
  - @lion/core@0.13.1

## 0.5.5

### Patch Changes

- Updated dependencies [01a798e5]
  - @lion/core@0.13.0

## 0.5.4

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0

## 0.5.3

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0

## 0.5.2

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0

## 0.5.1

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1

## 0.5.0

### Minor Changes

- 9ecab4d5: Removing LionSingleton as es modules are already guaranteed to be singletons.
  This reduces complexity and means less code to ship to our users.

### Patch Changes

- Updated dependencies [3c61fd29]
- Updated dependencies [09d96759]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0
  - singleton-manager@1.1.2

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.4](https://github.com/ing-bank/lion/compare/@lion/ajax@0.4.3...@lion/ajax@0.4.4) (2020-07-13)

**Note:** Version bump only for package @lion/ajax

## [0.4.3](https://github.com/ing-bank/lion/compare/@lion/ajax@0.4.2...@lion/ajax@0.4.3) (2020-06-18)

**Note:** Version bump only for package @lion/ajax

## [0.4.2](https://github.com/ing-bank/lion/compare/@lion/ajax@0.4.1...@lion/ajax@0.4.2) (2020-06-08)

**Note:** Version bump only for package @lion/ajax

## [0.4.1](https://github.com/ing-bank/lion/compare/@lion/ajax@0.4.0...@lion/ajax@0.4.1) (2020-06-03)

### Bug Fixes

- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/ajax@0.3.0...@lion/ajax@0.4.0) (2020-05-29)

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.10...@lion/ajax@0.3.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

## [0.2.10](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.9...@lion/ajax@0.2.10) (2020-04-29)

**Note:** Version bump only for package @lion/ajax

## [0.2.9](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.8...@lion/ajax@0.2.9) (2020-04-02)

**Note:** Version bump only for package @lion/ajax

## [0.2.8](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.7...@lion/ajax@0.2.8) (2020-03-25)

**Note:** Version bump only for package @lion/ajax

## [0.2.7](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.6...@lion/ajax@0.2.7) (2020-03-05)

**Note:** Version bump only for package @lion/ajax

## [0.2.6](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.5...@lion/ajax@0.2.6) (2020-02-26)

**Note:** Version bump only for package @lion/ajax

## [0.2.5](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.4...@lion/ajax@0.2.5) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.2.4](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.3...@lion/ajax@0.2.4) (2020-02-06)

**Note:** Version bump only for package @lion/ajax

## [0.2.3](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.2...@lion/ajax@0.2.3) (2020-01-29)

### Bug Fixes

- update broken ajax storybook link ([f731ade](https://github.com/ing-bank/lion/commit/f731ade8f02f68cc140228bfd1d58934c403a57d))

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.1...@lion/ajax@0.2.2) (2020-01-20)

**Note:** Version bump only for package @lion/ajax

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/ajax@0.2.0...@lion/ajax@0.2.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.20...@lion/ajax@0.2.0) (2020-01-13)

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))

## [0.1.20](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.19...@lion/ajax@0.1.20) (2019-12-02)

### Bug Fixes

- use strict versions to get correct deps on older versions ([8645c13](https://github.com/ing-bank/lion/commit/8645c13b1d77e488713f2e5e0e4e00c4d30ea1ee))

## [0.1.19](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.18...@lion/ajax@0.1.19) (2019-11-13)

**Note:** Version bump only for package @lion/ajax

## [0.1.18](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.17...@lion/ajax@0.1.18) (2019-10-23)

**Note:** Version bump only for package @lion/ajax

## [0.1.17](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.16...@lion/ajax@0.1.17) (2019-09-25)

**Note:** Version bump only for package @lion/ajax

## [0.1.16](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.15...@lion/ajax@0.1.16) (2019-07-25)

**Note:** Version bump only for package @lion/ajax

## [0.1.15](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.14...@lion/ajax@0.1.15) (2019-07-24)

**Note:** Version bump only for package @lion/ajax

## [0.1.14](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.13...@lion/ajax@0.1.14) (2019-07-23)

**Note:** Version bump only for package @lion/ajax

## [0.1.13](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.12...@lion/ajax@0.1.13) (2019-07-23)

**Note:** Version bump only for package @lion/ajax

## [0.1.12](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.11...@lion/ajax@0.1.12) (2019-06-03)

### Bug Fixes

- **ajax:** update to axios with security vularability fix ([d227a04](https://github.com/ing-bank/lion/commit/d227a04))

## [0.1.11](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.10...@lion/ajax@0.1.11) (2019-05-29)

**Note:** Version bump only for package @lion/ajax

## [0.1.10](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.9...@lion/ajax@0.1.10) (2019-05-24)

**Note:** Version bump only for package @lion/ajax

## [0.1.9](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.8...@lion/ajax@0.1.9) (2019-05-22)

**Note:** Version bump only for package @lion/ajax

## [0.1.8](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.7...@lion/ajax@0.1.8) (2019-05-17)

**Note:** Version bump only for package @lion/ajax

## [0.1.7](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.6...@lion/ajax@0.1.7) (2019-05-16)

**Note:** Version bump only for package @lion/ajax

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.5...@lion/ajax@0.1.6) (2019-05-13)

### Bug Fixes

- add prepublish step to make links absolute for npm docs ([9f2c4f6](https://github.com/ing-bank/lion/commit/9f2c4f6))

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.4...@lion/ajax@0.1.5) (2019-05-07)

### Bug Fixes

- import from entry points so stories can be extended ([49f18a4](https://github.com/ing-bank/lion/commit/49f18a4))

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.3...@lion/ajax@0.1.4) (2019-04-28)

### Bug Fixes

- update storybook/linting; adjust story labels, eslint ignores ([8d96f84](https://github.com/ing-bank/lion/commit/8d96f84))

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.2...@lion/ajax@0.1.3) (2019-04-27)

**Note:** Version bump only for package @lion/ajax

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.1...@lion/ajax@0.1.2) (2019-04-27)

### Bug Fixes

- **ajax:** add setAjax to public api ([9a69b1a](https://github.com/ing-bank/lion/commit/9a69b1a))

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/ajax@0.1.0...@lion/ajax@0.1.1) (2019-04-26)

### Bug Fixes

- add missing files to npm packages ([0e3ca17](https://github.com/ing-bank/lion/commit/0e3ca17))

# 0.1.0 (2019-04-26)

### Features

- release inital public lion version ([ec8da8f](https://github.com/ing-bank/lion/commit/ec8da8f))
