# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- ## Unreleased -->
<!-- ### Added -->
<!-- ### Changed -->
<!-- ### Fixed -->

## [0.0.10] - 2025-02-26

### Added

- Added support for `ShadowRoot.prototype.createElementNS()`

- Added the `registry` property to ShadowRootInit to match current proposal.
  `customElements` remains supported for compatibility

### Changed

- polyfill always used; conditional installation blocked by need for spec

- formAssociated set by first name's defining value or if
  CustomElementRegistryPolyfill.formAssociated set contains name

### Fixed

- Fixed a bug in versions of WebKit and Safari that had the prototype scoped
  custom element registry implementation enabled.

- parser created custom elements call attributeChangedCallback for parser
  created attributes

- toggleAttribute called only when attribute value changes

## [0.0.9] - 2023-03-30

- Update dependencies ([#542](https://github.com/webcomponents/polyfills/pull/542))

## [0.0.8] - 2023-02-03

### Fixed

- toggleAttribute polyfill now retains the force argument if it is present

## [0.0.7] - 2023-01-06

### Fixed

- Polyfilled ElementInternals prototype methods now return their original value.

## [0.0.5] - 2022-02-18

### Fixed

- Replaced `self` with `typeof globalThis === 'object' ? globalThis : window` for compatibility with Node (for SSR).

## [0.0.4] - 2022-01-27

### Fixed

- Bump @web/test-runner and related deps to resolve issue running tests on Chrome
- Make form-associated tests conditional on the native feature.
- Fixed form-associated custom element definitions (`static formAssociated = true`) when used with the polyfill.
- Fixed patched callback names in form-associated custom element support.
- Fixed handling of mixed-case attributes. Fixes #483

## [0.0.3] - 2021-08-02

- Maintenance release (no user-facing changes)

## [0.0.2] - 2021-06-02

- Fix to allow definition of custom elements whose classes have been created before applying the polyfill.
- Run `connectedCallback` on upgraded elements. Fixes #442.
- Checks if ShadowRoot prototype supports the createElement method to determine if the polyfill should be applied or not.

## [0.0.1] - 2021-02-18

- First public prerelease.
