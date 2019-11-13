# Rationale of the `localize` design

## Requirements

- loading translations per a web component or a module scope
- loading translations lazily
- loading translations from an API
- bundling and injecting translations for improving the initial page load time
- using variables in translations
- formatting dates and numbers according to a user's locale
- changing the language on the page without a full reload
- using JavaScript standards
- compatibility with modern tools like rollup and webpack
- backwards compatibility with Polymer CLI
- integration with lit-html and LitElement

## Decision making

### Building block of the localization system

We chose ES modules as building blocks because:

- this is a future proof standard
- support for loading both statically and dynamically
- good support in tools like rollup and webpack
- reusability of same translations between dialects of the same language

We decided to split all translation data into immutable namespaces because:

- there is a need for scopes to have a fine control over data
- namespaces can be loaded individually and bundled too (if needed)
- it is possible to consistently load all translations for a new language without full page reload (immutability is a key prerequisite here)

### Localization of numbers and dates

We decided to use `<html lang>` as a source of truth for the locale value because:

- this is a standard place in HTML
- it allows to support different tools like Google Chrome translate

We chose `Intl MessageFormat` as a format for translation parts because:

- it is the most stable solution for the web
- it is being standardized at the moment
- it supports formatting dates and numbers out of the box

### Fallbacks

> Important: language-only locales are now removed, and cause an error if you try to use it. This is because language only locales cause bugs with date and number formatting. It also makes writing locale based tooling harder and more cumbersome.

We decided to have a fallback mechanism in case a dialect (e.g. `nl-NL.js`) is not defined, but generic language (e.g. `nl.js`) is, because we wanted to support legacy applications which used [Polymer's AppLocalizeBehavior](https://polymer-library.polymer-project.org/3.0/docs/apps/localize) and could not instantly switch to using full dialects.

We decided to have a fallback locale (`en-GB` by default):

- so that an app can work (with English where the gaps are) until everything is translated to all supported languages
- to allow Google Chrome translate feature to work and use a reliable source for translations when a user asks the page to be translated to an unsupported language

### Switch statements in the loader functions

We add switch statements to each of the loader functions to be backwards compatible with Polymer CLI.
