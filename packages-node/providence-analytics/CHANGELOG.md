# Change Log

## 0.17.1

### Patch Changes

- cc2a646: optimisedGlob: allow providing cwd with trailing slash

## 0.17.0

### Minor Changes

- 615472c: - use oxc for all analyzers (oxc is way smaller and more performant than swc, let alone babel)

  - make swcTraverse compatible with oxc
  - expand scope functionality of swcTraverse

  BREAKING:

  - make parsers peerDependencies (babel or swc should be loaded by external analyzers)
  - rename `swcTraverse` to `oxcTraverse`

### Patch Changes

- 6f3137c: fix normalization of native glob dirent.parentPath for optimisedGlob

## 0.16.8

### Patch Changes

- 6ec74dc: support fullPath notation in optimisedGlob

## 0.16.7

### Patch Changes

- 2dbb1ca: - support `ignore: string[]` globs in optimisedGlob
  - experimental `fs.glob` support under the hood in optimisedGlob

## 0.16.6

### Patch Changes

- a30dbf3: update dependencies

## 0.16.5

### Patch Changes

- 4ee62c3: export MatchSubclassesAnalyzer for external usage

## 0.16.4

### Patch Changes

- bdebc8f: - expose types; improve logging and formatting
  - apply memoisation in optimised-glob
  - add perf logs to LogService
  - allow to clear cache of memoized function

## 0.16.3

### Patch Changes

- 9f8826a: resolve scoped packages outside node_modules

## 0.16.2

### Patch Changes

- cbfbdb4: - feat: expose ReportService to allow config of outputPath
  - fix: cache and performance improvements

## 0.16.1

### Patch Changes

- f9698e9: fix: expose inlined-swc-to-babel

## 0.16.0

### Minor Changes

- aea90ae: - Added `optimised-glob` util: a drop-in replacement for globby. It's faster, smaller and has zero dependencies
  - Added `fs-adapter` util, allowing to provide a virtual fs instead of the default
  - BREAKING: Cleanup of code and dependencies, removing deprecated cli commands

## 0.15.3

### Patch Changes

- 3737c492: fix: allow compatibility with node 16

## 0.15.2

### Patch Changes

- 5b64da8a: fix: update @web/dev-server version

## 0.15.1

### Patch Changes

- 7f6eb15a: feat: allow to resolve outside node_modules as well
- 7f6eb15a: feat: do not throw on unparseable files, but allow to proceed run for rest of projects
- 7f6eb15a: fix: swc-traverse does not fail on object proto builtins like "toString"
- 292dcfc8: fix: corrected export path for MatchImportAnalyzer

## 0.15.0

### Minor Changes

- bdb038e1: Many improvements:

  - rewritten from babel to swc
  - oxcTraverse tool, compatible with babel traverse api
  - increased performance
  - better windows compatibility

  BREAKING:

  - package fully written as esm
  - entrypoints changed:
    - `@providence-analytics/src/cli` => `@providence-analytics/cli.js`
    - `@providence-analytics/analyzers` => `@providence-analytics/analyzers.js`

## 0.14.1

### Patch Changes

- d40fd90b: Fixes:

  - allow absence of config file
  - remove package=lock of non-root packages
  - fix conflicting package entries

## 0.14.0

### Minor Changes

- e9c6523f: Expose more exports; updated to cjs format only

### Patch Changes

- a849f09f: add possibility to provide a 'custom defined project' (array of filePaths) to Analyzer
- f7fc7df3: improvements find-exports, trackdown-identifier, get-source-code-fragment-of-declaration
- 9593c456: providence-analytics: add export-map functionality to InputDataService
- a849f09f: add util "getSourceCodeFragmentOfDeclaration"
- dd3458af: improve memoization

## 0.13.0

### Minor Changes

- 672c8e99: New documentation structure

### Patch Changes

- ab7cc1e0: providence-analytics: expose skipCheckMatchCompatibility: skips semver checks when targets and reference projects are matched. Handy for forward compatible libs and libs below v1
- 17dadabf: providence-analytics: enhanced allowlistMode detection

## 0.12.5

### Patch Changes

- 683d5c1c: Upgrade to latest Typescript. Keep in mind, some @ts-ignores were necessary, also per TS maintainer's advice. Use skipLibCheck in your TSConfig to ignore issues coming from Lion, the types are valid.

  **We also unfixed lion's dependencies (now using caret ^) on its own packages**, because it caused a lot of problems with duplicate installations for end users as well as subclassers and its end users. Both of these changes may affect subclassers in a breaking manner, hence the minor bump.

  Be sure to [read our Rationale on this change](https://lion-web.netlify.app/docs/rationales/versioning/) and what this means for you as a user.

## 0.12.4

### Patch Changes

- 30805edf: Replace deprecated node folder exports with wildcard exports for docs

## 0.12.3

### Patch Changes

- 306d57f5: - correctly dedupe match-imports exportSpecifiers
  - windows compatibility
  - example conf file esm compatible

## 0.12.2

### Patch Changes

- 4aad06a1: Fixed dynamic import for providence config on windows

## 0.12.1

### Patch Changes

- 26b150f0: fix paths for dashboard

## 0.12.0

### Minor Changes

- 96ae18c4: Improved dashboard:

  - allows to configure categories in `providence.conf.(m)js`that show up in dashboard
  - exposes dashboard in cli: `npx providence dashboard`

  BREAKING CHANGES:

  - `providence.conf.(m)js` must be in ESM format.

### Patch Changes

- 88babab7: add type support for (the majority of) providence-analytics

## 0.11.2

### Patch Changes

- 1e8839f2: Support export maps for match-\* analyzers

## 0.11.1

### Patch Changes

- a0b313c6: correctly handle exports like "const x=3; export {x};"
- 2995a503: Correct default target in Windows if no -t

## 0.11.0

### Minor Changes

- 72067c0d: **BREAKING** Upgrade to [lit](https://lit.dev/) version 2

  This does not change any of the public APIs of lion.
  It however effects you when you have your own extension layer or your own components especially when using directives.
  See the [official lit upgrade guide](https://lit.dev/docs/releases/upgrade/).

  **BREAKING** Upgrade to [ScopedElements](https://open-wc.org/docs/development/scoped-elements/) version 2

  This version of `@open-wc/scoped-elements` is now following the [Scoped Custom Element Registries](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) and automatically loads a polyfill [@webcomponents/scoped-custom-element-registry](https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry).

  This means tag names are no longer being rewritten with a hash.

  ```js
  import { css, LitElement } from 'lit';
  import { ScopedElementsMixin } from '@open-wc/scoped-elements';
  import { MyButton } from './MyButton.js';

  export class MyElement extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
      return {
        'my-button': MyButton,
      };
    }

    render() {
      return html` <my-button>click me</my-button> `;
    }
  }
  ```

  ```html
  <!-- before (ScopedElements 1.x) -->
  <my-element>
    #shadow-root
    <my-button-23243424>click me</my-button-23243424>
  </my-element>

  <!-- after (ScopedElements 2.x) -->
  <my-element>
    #shadow-root
    <my-button>click me</my-button>
  </my-element>
  ```

## 0.10.4

### Patch Changes

- 098365e6: move index.js to path exposed for npm

## 0.10.3

### Patch Changes

- 0e678dec: - enable debug logs in analyzers
  - export QueryService

## 0.10.2

### Patch Changes

- 02e4f2cb: add simulator to demos

## 0.10.1

### Patch Changes

- 67cd8e35: Expose analyzers that are requested to be run in external contexts

## 0.10.0

### Minor Changes

- 5db622e9: BREAKING: Align exports fields. If you want to import from CLI instead of main entrypoint (`import { ... } from 'providence-analytics';`) using export maps, you can now do so with `import { ... } from 'providence-analytics/src/cli';` instead of `import { ... } from 'providence-analytics/src/cli/index.js';`.

## 0.9.0

### Minor Changes

- b2f981db: Add exports field in package.json

  Note that some tools can break with this change as long as they respect the exports field. If that is the case, check that you always access the elements included in the exports field, with the same name which they are exported. Any item not exported is considered private to the package and should not be accessed from the outside.

## 0.8.4

### Patch Changes

- b4ec2fe8: - allowlist does not preprocess globs in cli before handing them over to the program

## 0.8.3

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.

## 0.8.2

### Patch Changes

- 3cd1cf95: Relative source path util take posix path for both full path and root path, to ensure the replace happens properly.

## 0.8.1

### Patch Changes

- cfbcccb5: Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.

## 0.8.0

### Minor Changes

- ca210dae: add option skipCheckMatchCompatibility and enable for monorepos in extend-docs

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
