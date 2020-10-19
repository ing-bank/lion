# Change Log

## 0.7.0

### Minor Changes

- 2dc85b14: Monorepo support for extend-docs

  ### Features

  - add monorepo support for extend-docs

  ### Fixes

  - allow custom element and class definitions to be in same file for 'match-paths'

## 0.6.3

### Patch Changes

- b71bd7f2: Providence windows support

  - fix: make all tests run on Windows

## 0.6.2

### Patch Changes

- 65ecd432: Update to lit-element 2.4.0, changed all uses of \_requestUpdate into requestUpdateInterval

## 0.6.1

### Patch Changes

- 4b3ac525: Fixed version of "lit-element" for now to "~2.3.0", since breaking

## 0.6.0

### Minor Changes

- 623b10a3: Custom '--allowlist' takes precedence over '--allowlist-mode'

  #### Features

  - Custom '--allowlist' takes precedence over '--allowlist-mode' when conflicting.
    For instance, when running CLI with '--allowlist-mode git --allowlist ./dist'
    (and .gitignore contained '/dist'), './dist' will still be analyzed.

  #### Patches

  - Align naming conventions between CLI and InputDataService.gatherFilesFromDir

## 0.5.0

### Minor Changes

- ca6c8e62: Allowlist modes

  #### Features

  - Allowlist mode: autodetects whether analyzed repository is a "git" or "npm" (published artifact) repository.
    Via the cli `--allowlist-mode 'npm|git|all'` and `--allowlist-mode-reference 'npm|git|all'` can be
    configured to override the autodetected mode.

  #### Bugfixes

  - Clean output extend-docs: strings like '[no-dependency]' will not end up in aggregated result

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
