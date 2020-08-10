# Change Log

## 0.4.0

### Minor Changes

- c702e47c: Providence update to fix some issues with target/reference and to allow filtering target project dependencies.

  #### Features

  - Allow specifying target project dependencies via CLI using `--target-dependencies` flag:
    When `--target-dependencies` is applied without argument, it will act as boolean and include all dependencies for all search targets (node_modules and bower_components).
    When a regex is supplied like `--target-dependencies /^my-brand-/`, it will filter all packages that comply with the regex.

  #### Bugfixes

  - Use the correct gatherFilesConfig for references/targets
  - Provide target/reference result match
  - Edit `from-import-to-export` helper function to work without filesystem lookup. This will allow to supply target/reference result matches to `match-imports` analyzer

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.3.0](https://github.com/ing-bank/lion/compare/providence-analytics@0.2.2...providence-analytics@0.3.0) (2020-07-22)

### Bug Fixes

- **providence-analytics:** allow dashboard to run within package ([12b6608](https://github.com/ing-bank/lion/commit/12b66085160cdae833b2c4bf9d5b6b6875f36bea))
- **providence-analytics:** allow scoped package refs dashboard ([9dea018](https://github.com/ing-bank/lion/commit/9dea01831055cfc6011825ae57b152490f86e7f4))

### Features

- **providence-analytics:** supply prev results match-imports ([e31d1f5](https://github.com/ing-bank/lion/commit/e31d1f51509dfe54c7ccb27f2f7066fc70d1cf9b))

## [0.2.2](https://github.com/ing-bank/lion/compare/providence-analytics@0.2.1...providence-analytics@0.2.2) (2020-07-13)

**Note:** Version bump only for package providence-analytics

## [0.2.1](https://github.com/ing-bank/lion/compare/providence-analytics@0.2.0...providence-analytics@0.2.1) (2020-06-29)

### Bug Fixes

- **providence-analytics:** extensions argument extend-docs ([5bf014b](https://github.com/ing-bank/lion/commit/5bf014b952f1e82620b5f100955d68136623c185))

# [0.2.0](https://github.com/ing-bank/lion/compare/providence-analytics@0.1.0...providence-analytics@0.2.0) (2020-06-29)

### Features

- **providence-analytics:** cli arguments extend-docs ([7299665](https://github.com/ing-bank/lion/commit/729966504b1e67969ea35e645a2271f61703f20a))
- **providence-analytics:** filepath matching based on anymatch ([54d06b9](https://github.com/ing-bank/lion/commit/54d06b9faa8e392d530185289a985a1212f6564f))

# 0.1.0 (2020-06-25)

### Features

- **providence-analytics:** add providence-analytics package ([e78aba8](https://github.com/ing-bank/lion/commit/e78aba8192ff0c7503497fe1f278d4b3da8b8401))
- **providence-analytics:** extend-docs cli command ([ef3d233](https://github.com/ing-bank/lion/commit/ef3d233d4e1b4ed38f78c584b98b4a736205cd0f))
