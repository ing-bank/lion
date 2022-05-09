# Change Log

## 0.12.1

### Patch Changes

- Updated dependencies [d1d977c1]
  - @lion/core@0.17.1

## 0.12.0

### Minor Changes

- 02e4f2cb: add simulator to demos

### Patch Changes

- Updated dependencies [02e4f2cb]
  - @lion/core@0.17.0
  - singleton-manager@1.4.2

## 0.11.1

### Patch Changes

- 77a04245: add protected and private type info
- Updated dependencies [77a04245]
- Updated dependencies [43e4bb81]
  - @lion/core@0.16.0
  - singleton-manager@1.4.1

## 0.11.0

### Minor Changes

- f3e54c56: Publish documentation with a format for Rocket
- 5db622e9: BREAKING: Align exports fields. This means no more wildcards, meaning you always import with bare import specifiers, extensionless. Import components where customElements.define side effect is executed by importing from '@lion/package/define'. For multi-component packages this defines all components (e.g. radio-group + radio). If you want to only import a single one, do '@lion/radio-group/define-radio' for example for just lion-radio.

### Patch Changes

- Updated dependencies [f3e54c56]
- Updated dependencies [5db622e9]
  - @lion/core@0.15.0
  - singleton-manager@1.4.0

## 0.10.1

### Patch Changes

- Updated dependencies [701aadce]
  - @lion/core@0.14.1

## 0.10.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

### Patch Changes

- Updated dependencies [b2f981db]
  - @lion/core@0.14.0
  - singleton-manager@1.3.0

## 0.9.5

### Patch Changes

- c913c973: Export the IconManager in @lion/icon index.js entrypoint.

## 0.9.4

### Patch Changes

- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8

## 0.9.3

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [98f1bb7e]
  - @lion/core@0.13.7
  - singleton-manager@1.2.1

## 0.9.2

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6

## 0.9.1

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5

## 0.9.0

### Minor Changes

- 31471262: Allow setting a custom icon manager, which is important if you as a subclasser are managing your singletons.

## 0.8.4

### Patch Changes

- Updated dependencies [39d5e767]
  - singleton-manager@1.2.0

## 0.8.3

### Patch Changes

- cfbcccb5: Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.
- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4

## 0.8.2

### Patch Changes

- a3ac76f1: Fix lion icon types

## 0.8.1

### Patch Changes

- Updated dependencies [e2e4deec]
  - @lion/core@0.13.3

## 0.8.0

### Minor Changes

- 978af941: fix(icon): single pronounciation in JAWS/FF

### Patch Changes

- Updated dependencies [20ba0ca8]
  - @lion/core@0.13.2

## 0.7.6

### Patch Changes

- Updated dependencies [e92b98a4]
  - @lion/core@0.13.1

## 0.7.5

### Patch Changes

- Updated dependencies [01a798e5]
  - @lion/core@0.13.0

## 0.7.4

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0

## 0.7.3

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0

## 0.7.2

### Patch Changes

- Updated dependencies [65ecd432]
- Updated dependencies [4dc621a0]
  - @lion/core@0.10.0

## 0.7.1

### Patch Changes

- Updated dependencies [4b3ac525]
  - @lion/core@0.9.1

## 0.7.0

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

## [0.6.5](https://github.com/ing-bank/lion/compare/@lion/icon@0.6.4...@lion/icon@0.6.5) (2020-07-13)

**Note:** Version bump only for package @lion/icon

## [0.6.4](https://github.com/ing-bank/lion/compare/@lion/icon@0.6.3...@lion/icon@0.6.4) (2020-06-18)

**Note:** Version bump only for package @lion/icon

## [0.6.3](https://github.com/ing-bank/lion/compare/@lion/icon@0.6.2...@lion/icon@0.6.3) (2020-06-10)

**Note:** Version bump only for package @lion/icon

## [0.6.2](https://github.com/ing-bank/lion/compare/@lion/icon@0.6.1...@lion/icon@0.6.2) (2020-06-08)

**Note:** Version bump only for package @lion/icon

## [0.6.1](https://github.com/ing-bank/lion/compare/@lion/icon@0.6.0...@lion/icon@0.6.1) (2020-06-03)

### Bug Fixes

- define side effects for demo files ([1d40567](https://github.com/ing-bank/lion/commit/1d405671875c1c9c5518a3b7f57814337b3a67d6))

# [0.6.0](https://github.com/ing-bank/lion/compare/@lion/icon@0.5.2...@lion/icon@0.6.0) (2020-05-29)

### Features

- merge field/validate/choice-input/form-group into @lion/form-core ([6170374](https://github.com/ing-bank/lion/commit/6170374ee8c058cb95fff79b4953b0535219e9b4))
- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

## [0.5.2](https://github.com/ing-bank/lion/compare/@lion/icon@0.5.1...@lion/icon@0.5.2) (2020-05-25)

### Bug Fixes

- add side effects to package.json to fix storybook build ([a7f7b4c](https://github.com/ing-bank/lion/commit/a7f7b4c70d48a78c0a1d5511e54004c157f1dba3))

## [0.5.1](https://github.com/ing-bank/lion/compare/@lion/icon@0.5.0...@lion/icon@0.5.1) (2020-05-19)

### Bug Fixes

- **icon:** export setIcons ([0393427](https://github.com/ing-bank/lion/commit/0393427fa9df50dc4240a6e20115fb4a4d9756ca))

# [0.5.0](https://github.com/ing-bank/lion/compare/@lion/icon@0.4.4...@lion/icon@0.5.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

## [0.4.4](https://github.com/ing-bank/lion/compare/@lion/icon@0.4.3...@lion/icon@0.4.4) (2020-04-29)

### Bug Fixes

- add display:none for hidden ([#692](https://github.com/ing-bank/lion/issues/692)) ([9731771](https://github.com/ing-bank/lion/commit/9731771c23a5ed8661558e62cb5e34b62cc2b8b7))

## [0.4.3](https://github.com/ing-bank/lion/compare/@lion/icon@0.4.2...@lion/icon@0.4.3) (2020-04-02)

**Note:** Version bump only for package @lion/icon

## [0.4.2](https://github.com/ing-bank/lion/compare/@lion/icon@0.4.1...@lion/icon@0.4.2) (2020-03-25)

**Note:** Version bump only for package @lion/icon

## [0.4.1](https://github.com/ing-bank/lion/compare/@lion/icon@0.4.0...@lion/icon@0.4.1) (2020-03-05)

**Note:** Version bump only for package @lion/icon

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/icon@0.3.4...@lion/icon@0.4.0) (2020-03-03)

### Features

- **icon:** add icon lazy loading system ([f887f97](https://github.com/ing-bank/lion/commit/f887f973f0071f5c2af3e62ef1634cf9ce7f4e76))

## [0.3.4](https://github.com/ing-bank/lion/compare/@lion/icon@0.3.3...@lion/icon@0.3.4) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.3.3](https://github.com/ing-bank/lion/compare/@lion/icon@0.3.2...@lion/icon@0.3.3) (2020-02-06)

**Note:** Version bump only for package @lion/icon

## [0.3.2](https://github.com/ing-bank/lion/compare/@lion/icon@0.3.1...@lion/icon@0.3.2) (2020-01-20)

**Note:** Version bump only for package @lion/icon

## [0.3.1](https://github.com/ing-bank/lion/compare/@lion/icon@0.3.0...@lion/icon@0.3.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.10...@lion/icon@0.3.0) (2020-01-13)

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))
- integrate and pass automated a11y testing ([e1a417b](https://github.com/ing-bank/lion/commit/e1a417b041431e4e25a5b6a63e23ba0a3974f5a5))

## [0.2.10](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.9...@lion/icon@0.2.10) (2019-12-02)

### Bug Fixes

- use strict versions to get correct deps on older versions ([8645c13](https://github.com/ing-bank/lion/commit/8645c13b1d77e488713f2e5e0e4e00c4d30ea1ee))

## [0.2.9](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.8...@lion/icon@0.2.9) (2019-11-13)

**Note:** Version bump only for package @lion/icon

## [0.2.8](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.7...@lion/icon@0.2.8) (2019-10-23)

**Note:** Version bump only for package @lion/icon

## [0.2.7](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.6...@lion/icon@0.2.7) (2019-09-25)

**Note:** Version bump only for package @lion/icon

## [0.2.6](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.5...@lion/icon@0.2.6) (2019-09-17)

### Bug Fixes

- **icon:** render nothing consistently when svg is null ([4ff7a1e](https://github.com/ing-bank/lion/commit/4ff7a1e))

## [0.2.5](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.4...@lion/icon@0.2.5) (2019-07-25)

**Note:** Version bump only for package @lion/icon

## [0.2.4](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.3...@lion/icon@0.2.4) (2019-07-24)

**Note:** Version bump only for package @lion/icon

## [0.2.3](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.2...@lion/icon@0.2.3) (2019-07-23)

**Note:** Version bump only for package @lion/icon

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.1...@lion/icon@0.2.2) (2019-07-23)

**Note:** Version bump only for package @lion/icon

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/icon@0.2.0...@lion/icon@0.2.1) (2019-07-02)

**Note:** Version bump only for package @lion/icon

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.10...@lion/icon@0.2.0) (2019-07-01)

### Features

- **icon:** enforce icon security using tagged templates ([a6b0780](https://github.com/ing-bank/lion/commit/a6b0780))

## [0.1.10](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.9...@lion/icon@0.1.10) (2019-06-27)

### Bug Fixes

- **icon:** refactor icon to not use 'until' hack and use get/set ([675fc61](https://github.com/ing-bank/lion/commit/675fc61))
- **icon:** render nothing consistently when svg is undefined ([c62d335](https://github.com/ing-bank/lion/commit/c62d335))
- **icon:** use LitElement ([bd5f51e](https://github.com/ing-bank/lion/commit/bd5f51e))

## [0.1.9](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.8...@lion/icon@0.1.9) (2019-05-29)

**Note:** Version bump only for package @lion/icon

## [0.1.8](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.7...@lion/icon@0.1.8) (2019-05-24)

**Note:** Version bump only for package @lion/icon

## [0.1.7](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.6...@lion/icon@0.1.7) (2019-05-22)

**Note:** Version bump only for package @lion/icon

## [0.1.6](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.5...@lion/icon@0.1.6) (2019-05-17)

**Note:** Version bump only for package @lion/icon

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.4...@lion/icon@0.1.5) (2019-05-16)

**Note:** Version bump only for package @lion/icon

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.3...@lion/icon@0.1.4) (2019-05-13)

### Bug Fixes

- add prepublish step to make links absolute for npm docs ([9f2c4f6](https://github.com/ing-bank/lion/commit/9f2c4f6))

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.2...@lion/icon@0.1.3) (2019-04-28)

### Bug Fixes

- update storybook/linting; adjust story labels, eslint ignores ([8d96f84](https://github.com/ing-bank/lion/commit/8d96f84))

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.1...@lion/icon@0.1.2) (2019-04-27)

**Note:** Version bump only for package @lion/icon

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/icon@0.1.0...@lion/icon@0.1.1) (2019-04-26)

### Bug Fixes

- add missing files to npm packages ([0e3ca17](https://github.com/ing-bank/lion/commit/0e3ca17))

# 0.1.0 (2019-04-26)

### Features

- release inital public lion version ([ec8da8f](https://github.com/ing-bank/lion/commit/ec8da8f))
