# Change Log

## 0.16.12

### Patch Changes

- 5a48e69b: Add a guard for content wrapper containing the content node before appending to the renderTarget. This prevents unhandled rejection.
- Updated dependencies [3c61fd29]
- Updated dependencies [09d96759]
- Updated dependencies [9ecab4d5]
  - @lion/core@0.9.0
  - singleton-manager@1.1.2

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.16.11](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.10...@lion/overlays@0.16.11) (2020-07-13)

### Bug Fixes

- **overlays:** no hide on label click ([e46f51c](https://github.com/ing-bank/lion/commit/e46f51ce335ec50879fc4f3bcdd57454632cc333))
- **overlays:** role preservation + guarded attr storage ([c3f7aa8](https://github.com/ing-bank/lion/commit/c3f7aa8ea21bfe5fec23010bd130b4d942e8bc1a))

## [0.16.10](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.9...@lion/overlays@0.16.10) (2020-07-13)

**Note:** Version bump only for package @lion/overlays

## [0.16.9](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.8...@lion/overlays@0.16.9) (2020-07-09)

### Bug Fixes

- **overlays:** add protected show and hide complete hooks,fix flaky test ([53a5426](https://github.com/ing-bank/lion/commit/53a54261e97a529867a6f56971471d6f6de5347c))

## [0.16.8](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.7...@lion/overlays@0.16.8) (2020-07-07)

### Bug Fixes

- **overlays:** only teardown when overlayCtrl defined ([121e156](https://github.com/ing-bank/lion/commit/121e1562fa0896f5e91732e4f9bea270c941a59c))

## [0.16.7](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.6...@lion/overlays@0.16.7) (2020-07-06)

**Note:** Version bump only for package @lion/overlays

## [0.16.6](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.5...@lion/overlays@0.16.6) (2020-06-24)

### Bug Fixes

- **overlays:** make focusable slotted buttons ([5e151bb](https://github.com/ing-bank/lion/commit/5e151bb8a41b4fcb37a00c0dcf568f4cb0378259))

## [0.16.5](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.4...@lion/overlays@0.16.5) (2020-06-23)

### Bug Fixes

- **overlays:** accessibility attrs setup/teardown ([dfe1905](https://github.com/ing-bank/lion/commit/dfe1905e7c61007decb27da4dc30ea17fb1de1b1))

## [0.16.4](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.3...@lion/overlays@0.16.4) (2020-06-18)

**Note:** Version bump only for package @lion/overlays

## [0.16.3](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.2...@lion/overlays@0.16.3) (2020-06-10)

**Note:** Version bump only for package @lion/overlays

## [0.16.2](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.1...@lion/overlays@0.16.2) (2020-06-08)

**Note:** Version bump only for package @lion/overlays

## [0.16.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.16.0...@lion/overlays@0.16.1) (2020-06-03)

### Bug Fixes

- **overlays:** change dropdownConfig inheritsReferenceWidth to min ([16f7afb](https://github.com/ing-bank/lion/commit/16f7afbbdc8316c8da16f6f177c85af0cde4f70d))
- **overlays:** prevent resize due to scrollbars on global overlay open ([#746](https://github.com/ing-bank/lion/issues/746)) ([c8da23c](https://github.com/ing-bank/lion/commit/c8da23ccb2a44b646e4bcdc3a2306086f444fb63))
- define side effects for demo files ([1d40567](https://github.com/ing-bank/lion/commit/1d405671875c1c9c5518a3b7f57814337b3a67d6))
- remove all stories folders from npm ([1e04d06](https://github.com/ing-bank/lion/commit/1e04d06921f9d5e1a446b6d14045154ff83771c3))
- throw when passing unconnected contentNode ([78dbfbe](https://github.com/ing-bank/lion/commit/78dbfbed49be49791f02054748e85f5f59468f67))

# [0.16.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.15.3...@lion/overlays@0.16.0) (2020-05-29)

### Features

- use markdown javascript (mdjs) for documentation ([bcd074d](https://github.com/ing-bank/lion/commit/bcd074d1fbce8754d428538df723ba402603e2c8))

## [0.15.3](https://github.com/ing-bank/lion/compare/@lion/overlays@0.15.2...@lion/overlays@0.15.3) (2020-05-25)

### Bug Fixes

- add side effects to package.json to fix storybook build ([a7f7b4c](https://github.com/ing-bank/lion/commit/a7f7b4c70d48a78c0a1d5511e54004c157f1dba3))

## [0.15.2](https://github.com/ing-bank/lion/compare/@lion/overlays@0.15.1...@lion/overlays@0.15.2) (2020-05-20)

### Bug Fixes

- **overlays:** contain focus when tabbing into window ([d1189c9](https://github.com/ing-bank/lion/commit/d1189c9b4ea7f1393496206466fd4ff336afde5c))

## [0.15.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.15.0...@lion/overlays@0.15.1) (2020-05-19)

### Bug Fixes

- **overlays:** support singleton override via setOverlays ([171b87f](https://github.com/ing-bank/lion/commit/171b87f8ebc74c7c780282bb97dbce01c8124d4f))

# [0.15.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.14.0...@lion/overlays@0.15.0) (2020-05-18)

### Features

- use singleton manager to support nested npm installations ([e2eb0e0](https://github.com/ing-bank/lion/commit/e2eb0e0077b9efed9382701461753778f63cad48))

# [0.14.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.13.3...@lion/overlays@0.14.0) (2020-05-18)

### Bug Fixes

- **overlays:** catch rejected promise ([5114076](https://github.com/ing-bank/lion/commit/5114076eb32ebd8a5d9a5c9d5a77e37639f48fe1))
- **overlays:** local backdrop outlet ([e19a0f4](https://github.com/ing-bank/lion/commit/e19a0f483c65a8a758da78b86e3723e9270e5bd3))
- **overlays:** setup/teardown fixes + perf improvements OverlayMixin ([8a6bef8](https://github.com/ing-bank/lion/commit/8a6bef8142d252cde7dd66067ca87acfffb2b9f6))

### Features

- **overlays:** enhance content projection for styling purposes ([f33ea6b](https://github.com/ing-bank/lion/commit/f33ea6b0b0dca88d006762ec5110e5845a73d219))

## [0.13.3](https://github.com/ing-bank/lion/compare/@lion/overlays@0.13.2...@lion/overlays@0.13.3) (2020-05-06)

### Bug Fixes

- **dialog:** teardown open close listeners after initial update complete ([da87445](https://github.com/ing-bank/lion/commit/da87445f33f4a168449ef6e37fc4244f16a0dc00))

## [0.13.2](https://github.com/ing-bank/lion/compare/@lion/overlays@0.13.1...@lion/overlays@0.13.2) (2020-04-29)

**Note:** Version bump only for package @lion/overlays

## [0.13.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.13.0...@lion/overlays@0.13.1) (2020-04-15)

### Bug Fixes

- **overlays:** synchronize intercepted opened state OverlayMixin ([88d3850](https://github.com/ing-bank/lion/commit/88d3850d5ddcbd98f94a1950bfd096dc76ddc90f))

# [0.13.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.12.9...@lion/overlays@0.13.0) (2020-04-07)

### Features

- **overlays:** add invokerRelation option ([#672](https://github.com/ing-bank/lion/issues/672)) ([d7cfab0](https://github.com/ing-bank/lion/commit/d7cfab016fa8526f0a3ce5be4d77fb306accbc6e))

## [0.12.9](https://github.com/ing-bank/lion/compare/@lion/overlays@0.12.8...@lion/overlays@0.12.9) (2020-04-02)

### Bug Fixes

- **overlays:** support reconnecting overlay nodes inside other overlays ([afd5ac9](https://github.com/ing-bank/lion/commit/afd5ac96cc100d86acd88c4b225039dc47fe8773))

## [0.12.8](https://github.com/ing-bank/lion/compare/@lion/overlays@0.12.7...@lion/overlays@0.12.8) (2020-03-26)

### Bug Fixes

- **select-rich:** consider no default select for inheritsReferenceWidth ([e636ce1](https://github.com/ing-bank/lion/commit/e636ce1f9c12c35a0885aa6e991d9554c944def5))

## [0.12.7](https://github.com/ing-bank/lion/compare/@lion/overlays@0.12.6...@lion/overlays@0.12.7) (2020-03-25)

**Note:** Version bump only for package @lion/overlays

## [0.12.6](https://github.com/ing-bank/lion/compare/@lion/overlays@0.12.5...@lion/overlays@0.12.6) (2020-03-20)

### Bug Fixes

- **overlays:** support backdrop with local overlay ([e472b64](https://github.com/ing-bank/lion/commit/e472b64f7bc7c7c3ecf1e50f3f2b245c36c387f1))

## [0.12.5](https://github.com/ing-bank/lion/compare/@lion/overlays@0.12.4...@lion/overlays@0.12.5) (2020-03-19)

### Bug Fixes

- normalization model-value-changed events ([1b6c3a4](https://github.com/ing-bank/lion/commit/1b6c3a44c820b9d61c26849b91bbb1bc8d6c772b))

## [0.12.4](https://github.com/ing-bank/lion/compare/@lion/overlays@0.12.3...@lion/overlays@0.12.4) (2020-03-05)

**Note:** Version bump only for package @lion/overlays

## [0.12.3](https://github.com/ing-bank/lion/compare/@lion/overlays@0.12.2...@lion/overlays@0.12.3) (2020-02-26)

**Note:** Version bump only for package @lion/overlays

## [0.12.2](https://github.com/ing-bank/lion/compare/@lion/overlays@0.12.1...@lion/overlays@0.12.2) (2020-02-19)

### Bug Fixes

- reduce storybook chunck sizes for more performance ([9fc5606](https://github.com/ing-bank/lion/commit/9fc560605f5dcf6e9abcf8d58079c59f12750046))

## [0.12.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.12.0...@lion/overlays@0.12.1) (2020-02-13)

**Note:** Version bump only for package @lion/overlays

# [0.12.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.11.3...@lion/overlays@0.12.0) (2020-02-06)

### Features

- **overlay:** add hide on outside esc handler ([c0ed437](https://github.com/ing-bank/lion/commit/c0ed437e8fed618c47fe90feca7969fde934b9eb))

## [0.11.3](https://github.com/ing-bank/lion/compare/@lion/overlays@0.11.2...@lion/overlays@0.11.3) (2020-01-23)

**Note:** Version bump only for package @lion/overlays

## [0.11.2](https://github.com/ing-bank/lion/compare/@lion/overlays@0.11.1...@lion/overlays@0.11.2) (2020-01-20)

**Note:** Version bump only for package @lion/overlays

## [0.11.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.11.0...@lion/overlays@0.11.1) (2020-01-17)

### Bug Fixes

- update storybook and use main.js ([e61e0b9](https://github.com/ing-bank/lion/commit/e61e0b938ff72cc18cc0b3aa1560f2cece0c9fe6))

# [0.11.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.10.1...@lion/overlays@0.11.0) (2020-01-13)

### Features

- improved storybook demos ([89b835a](https://github.com/ing-bank/lion/commit/89b835a79998c45a28093de01f69216c35009a40))

## [0.10.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.10.0...@lion/overlays@0.10.1) (2019-12-17)

**Note:** Version bump only for package @lion/overlays

# [0.10.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.9.0...@lion/overlays@0.10.0) (2019-12-13)

### Features

- **tooltip:** arrow ([d4f99f1](https://github.com/ing-bank/lion/commit/d4f99f1b9222e26908139d0269ab95b563af19eb))

# [0.9.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.8.0...@lion/overlays@0.9.0) (2019-12-11)

### Features

- **overlays:** close/hide events on dom (OverlayMixin) level ([b2c5f92](https://github.com/ing-bank/lion/commit/b2c5f92e085c28eebeedd948a1386be9b4c1cdea))

# [0.8.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.7.1...@lion/overlays@0.8.0) (2019-12-04)

### Features

- integrate and pass automated a11y testing ([e1a417b](https://github.com/ing-bank/lion/commit/e1a417b041431e4e25a5b6a63e23ba0a3974f5a5))

## [0.7.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.7.0...@lion/overlays@0.7.1) (2019-12-02)

### Bug Fixes

- use strict versions to get correct deps on older versions ([8645c13](https://github.com/ing-bank/lion/commit/8645c13b1d77e488713f2e5e0e4e00c4d30ea1ee))

# [0.7.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.6.4...@lion/overlays@0.7.0) (2019-12-01)

### Bug Fixes

- **overlays:** close overlay upon disconnectedCallback ([ab5cb62](https://github.com/ing-bank/lion/commit/ab5cb627afe5ce5c9739346afe1404cc16326576))
- **overlays:** fix overlay content node selector to be more accurate ([411889c](https://github.com/ing-bank/lion/commit/411889c919951a74a85b97f8edff7379c46180f7))
- **overlays:** hideOnEsc should also work while being on the invoker ([c899cf2](https://github.com/ing-bank/lion/commit/c899cf26d278d8512f521ba37522f7472805c9ed))
- **overlays:** remove \_contentNodeWrapper on teardown ([0b31494](https://github.com/ing-bank/lion/commit/0b3149469aaa4f7b50d62fc758137a2c94e3a10c))
- no longer use overlay templates ([49974bd](https://github.com/ing-bank/lion/commit/49974bd2b86d7f02e8c19aa51a0a79779b897384))

### Features

- refactor the overlay system implementations, docs and demos ([a5a9f97](https://github.com/ing-bank/lion/commit/a5a9f975a61649cd1f861a80923c678c5f4d51be))
- **overlays:** add before-show event to OverlayMixin ([57a3c04](https://github.com/ing-bank/lion/commit/57a3c04873d2f7e6cc879f4d129a10d7d863a8f7))
- **overlays:** improve API for overriding controller config in mixin ([45f5571](https://github.com/ing-bank/lion/commit/45f557183d7bef95ea9685d751e90ba12a4eb2d8))

## [0.6.4](https://github.com/ing-bank/lion/compare/@lion/overlays@0.6.3...@lion/overlays@0.6.4) (2019-11-15)

### Bug Fixes

- refactor slot selection ([5999ea9](https://github.com/ing-bank/lion/commit/5999ea956967b449f3f04935c7facb19e2889dc9))

## [0.6.3](https://github.com/ing-bank/lion/compare/@lion/overlays@0.6.2...@lion/overlays@0.6.3) (2019-11-13)

**Note:** Version bump only for package @lion/overlays

## [0.6.2](https://github.com/ing-bank/lion/compare/@lion/overlays@0.6.1...@lion/overlays@0.6.2) (2019-10-25)

### Bug Fixes

- **overlays:** remove setting inheritsReferenceWidth by default ([8237b64](https://github.com/ing-bank/lion/commit/8237b64))

## [0.6.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.6.0...@lion/overlays@0.6.1) (2019-10-23)

**Note:** Version bump only for package @lion/overlays

# [0.6.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.5.1...@lion/overlays@0.6.0) (2019-10-10)

### Features

- **overlays:** release new overlay system ([364f185](https://github.com/ing-bank/lion/commit/364f185))

## [0.5.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.5.0...@lion/overlays@0.5.1) (2019-09-27)

### Bug Fixes

- **overlays:** fix contentNodes for local and global overlays ([733991d](https://github.com/ing-bank/lion/commit/733991d))

# [0.5.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.4.0...@lion/overlays@0.5.0) (2019-09-26)

### Features

- **overlays:** delegate events in DynamicOverlayController ([20037ba](https://github.com/ing-bank/lion/commit/20037ba))

# [0.4.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.12...@lion/overlays@0.4.0) (2019-09-25)

### Features

- **overlays:** add viewport placement to global overlays ([1cc92fb](https://github.com/ing-bank/lion/commit/1cc92fb))
- **overlays:** align Overlays API + add DynamicOverlay ([224f794](https://github.com/ing-bank/lion/commit/224f794))
- **overlays:** create BottomsheetController ([4b858cb](https://github.com/ing-bank/lion/commit/4b858cb))

## [0.3.12](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.11...@lion/overlays@0.3.12) (2019-08-01)

### Bug Fixes

- **overlays:** global overlays have fixed positioning context ([6bee300](https://github.com/ing-bank/lion/commit/6bee300))

## [0.3.11](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.10...@lion/overlays@0.3.11) (2019-07-25)

**Note:** Version bump only for package @lion/overlays

## [0.3.10](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.9...@lion/overlays@0.3.10) (2019-07-24)

**Note:** Version bump only for package @lion/overlays

## [0.3.9](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.8...@lion/overlays@0.3.9) (2019-07-23)

**Note:** Version bump only for package @lion/overlays

## [0.3.8](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.7...@lion/overlays@0.3.8) (2019-07-23)

**Note:** Version bump only for package @lion/overlays

## [0.3.7](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.6...@lion/overlays@0.3.7) (2019-07-23)

**Note:** Version bump only for package @lion/overlays

## [0.3.6](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.5...@lion/overlays@0.3.6) (2019-07-23)

### Bug Fixes

- **overlays:** fix popper for IE11 by using esm dist target ([16078c5](https://github.com/ing-bank/lion/commit/16078c5))

## [0.3.5](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.4...@lion/overlays@0.3.5) (2019-07-18)

**Note:** Version bump only for package @lion/overlays

## [0.3.4](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.3...@lion/overlays@0.3.4) (2019-07-17)

### Bug Fixes

- support Chinese language ([a0ebd2d](https://github.com/ing-bank/lion/commit/a0ebd2d))

## [0.3.3](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.2...@lion/overlays@0.3.3) (2019-07-12)

### Bug Fixes

- **overlays:** add inheritsReferenceObjectWidth parameter ([229d282](https://github.com/ing-bank/lion/commit/229d282))
- **overlays:** fire show/hide event on shown changed ([e02bc42](https://github.com/ing-bank/lion/commit/e02bc42))

## [0.3.2](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.1...@lion/overlays@0.3.2) (2019-07-02)

**Note:** Version bump only for package @lion/overlays

## [0.3.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.3.0...@lion/overlays@0.3.1) (2019-07-01)

### Bug Fixes

- **overlays:** fix update popper config method ([910a1b5](https://github.com/ing-bank/lion/commit/910a1b5))

# [0.3.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.2.7...@lion/overlays@0.3.0) (2019-06-28)

### Features

- **overlays:** base LocalOverlay positioning system on Popper.js ([22357ea](https://github.com/ing-bank/lion/commit/22357ea))

## [0.2.7](https://github.com/ing-bank/lion/compare/@lion/overlays@0.2.6...@lion/overlays@0.2.7) (2019-06-24)

**Note:** Version bump only for package @lion/overlays

## [0.2.6](https://github.com/ing-bank/lion/compare/@lion/overlays@0.2.5...@lion/overlays@0.2.6) (2019-06-20)

### Bug Fixes

- **overlays:** trapsKeyboardFocus should work with contentNode ([4695cfd](https://github.com/ing-bank/lion/commit/4695cfd))

## [0.2.5](https://github.com/ing-bank/lion/compare/@lion/overlays@0.2.4...@lion/overlays@0.2.5) (2019-05-29)

**Note:** Version bump only for package @lion/overlays

## [0.2.4](https://github.com/ing-bank/lion/compare/@lion/overlays@0.2.3...@lion/overlays@0.2.4) (2019-05-24)

**Note:** Version bump only for package @lion/overlays

## [0.2.3](https://github.com/ing-bank/lion/compare/@lion/overlays@0.2.2...@lion/overlays@0.2.3) (2019-05-22)

**Note:** Version bump only for package @lion/overlays

## [0.2.2](https://github.com/ing-bank/lion/compare/@lion/overlays@0.2.1...@lion/overlays@0.2.2) (2019-05-17)

**Note:** Version bump only for package @lion/overlays

## [0.2.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.2.0...@lion/overlays@0.2.1) (2019-05-16)

### Bug Fixes

- **overlays:** publish translations to npm ([d19f576](https://github.com/ing-bank/lion/commit/d19f576))

# [0.2.0](https://github.com/ing-bank/lion/compare/@lion/overlays@0.1.5...@lion/overlays@0.2.0) (2019-05-16)

### Features

- **overlays:** translations for navigation ([5255b1b](https://github.com/ing-bank/lion/commit/5255b1b))

## [0.1.5](https://github.com/ing-bank/lion/compare/@lion/overlays@0.1.4...@lion/overlays@0.1.5) (2019-05-13)

### Bug Fixes

- add prepublish step to make links absolute for npm docs ([9f2c4f6](https://github.com/ing-bank/lion/commit/9f2c4f6))

## [0.1.4](https://github.com/ing-bank/lion/compare/@lion/overlays@0.1.3...@lion/overlays@0.1.4) (2019-05-07)

### Bug Fixes

- import from entry points so stories can be extended ([49f18a4](https://github.com/ing-bank/lion/commit/49f18a4))

## [0.1.3](https://github.com/ing-bank/lion/compare/@lion/overlays@0.1.2...@lion/overlays@0.1.3) (2019-04-28)

### Bug Fixes

- update storybook/linting; adjust story labels, eslint ignores ([8d96f84](https://github.com/ing-bank/lion/commit/8d96f84))

## [0.1.2](https://github.com/ing-bank/lion/compare/@lion/overlays@0.1.1...@lion/overlays@0.1.2) (2019-04-27)

**Note:** Version bump only for package @lion/overlays

## [0.1.1](https://github.com/ing-bank/lion/compare/@lion/overlays@0.1.0...@lion/overlays@0.1.1) (2019-04-26)

### Bug Fixes

- add missing files to npm packages ([0e3ca17](https://github.com/ing-bank/lion/commit/0e3ca17))

# 0.1.0 (2019-04-26)

### Features

- release inital public lion version ([ec8da8f](https://github.com/ing-bank/lion/commit/ec8da8f))
