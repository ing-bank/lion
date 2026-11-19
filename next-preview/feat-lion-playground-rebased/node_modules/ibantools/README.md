# IBANTools

![License](https://img.shields.io/badge/License-MIT-blue)
![License](https://img.shields.io/badge/License-MPL_2.0-blue)

![Bower version](https://badge.fury.io/bo/ibantools.svg)
[![npm version](https://badge.fury.io/js/ibantools.svg)](https://badge.fury.io/js/ibantools)
[![NPM downloads](https://img.shields.io/npm/dw/ibantools)](https://www.npmjs.com/package/ibantools)
![Dependents (via libraries.io)](https://img.shields.io/librariesio/dependents/npm/ibantools)

![Build CI](https://github.com/Simplify/ibantools/workflows/Build%20CI%20(Master)/badge.svg?branch=master)
![ESLint & Prettier CI](https://github.com/Simplify/ibantools/workflows/ESLint%20&%20Prettier/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/Simplify/ibantools/badge.svg?branch=master)](https://coveralls.io/github/Simplify/ibantools?branch=master)

![GitHub last commit](https://img.shields.io/github/last-commit/Simplify/IBANtools)
![GitHub contributors](https://img.shields.io/github/contributors/Simplify/IBANTools)
![GitHub issues](https://img.shields.io/github/issues/Simplify/ibantools)
![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/Simplify/ibantools)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Simplify/ibantools)
![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/Simplify/IBANTools)

![No deps](https://img.shields.io/badge/dependencies-0-brightgreen)
![dev deps](https://img.shields.io/librariesio/github/Simplify/IBANTools?label=devDependencies)

## About

IBANTools is TypeScript/JavaScript library for validation, creation and extraction of IBAN, BBAN and BIC/SWIFT numbers.

For more information about IBAN/BBAN see [wikipedia page](https://en.wikipedia.org/wiki/International_Bank_Account_Number) and
[IBAN registry](https://www.swift.com/resource/iban-registry-pdf).

For more information about BIC/SWIFT see [this wikipedia page](https://en.wikipedia.org/wiki/ISO_9362).

## Installation

### Node (Common JS ES5 and ES6)

```
$ npm install ibantools
```

### Bower (AMD ES5)

```
$ bower install ibantools
```

Note that Bower package will not be generated any more after TypeScript 7 release.

## Usage

See [full documentation](http://simplify.github.io/ibantools) with examples on Github pages.

### Node.js - CommonJS

```js
const ibantools = require('ibantools');
const iban = electronicFormatIBAN('NL91 ABNA 0417 1643 00'); // 'NL91ABNA0517164300'
ibantools.isValidIBAN(iban);

// If you want to know reason why IBAN is invalid
ibantools.validateIBAN('NL91ABNA0517164300');
// Returns { valid: false, errorCodes: [iban.ValidationErrorsIBAN.WrongIBANChecksum] }

// Validate BIC
ibantools.isValidBIC('ABNANL2A');
```

### AMD - RequireJS - Browser

```js
require(["ibantools"], function(ibantools) {
  console.log(ibantools.isValidIBAN('NL91 ABNA 0417 1643 00'));
  console.log(ibantools.isValidBIC('ABNANL2A'));
});
```

### Node.js - Common JS in browser

Use browserify or webpack.

### jsnext:main

Use node, not bower module.

If you are using tools that support `jsnext`, like a [rollup](https://github.com/rollup/rollup) or [JSPM](http://jspm.io/), they will automatically select right module from the package.

### With TypeScript

Install library/module using npm. Package bundles type definitions and if you are on TypeScript 2.0 or above `tsc` will access those automatically. If not, check your `tsconfig.json` file.

### Extension

Country specifications can be extended with national BBAN validations by calling `setCountryBBANValidation`.

For example, to fully syntactically check German IBAN, you can install [IBANTools-Germany](https://github.com/baumerdev/ibantools-germany) and add this with

```
const ibantools = require('ibantools');
const ibantoolsGermany = require("ibantools-germany");
ibantools.setCountryBBANValidation("DE", ibantoolsGermany.isValidBBAN);
```

## Contributing

This project adheres to the Contributor Covenant [code of conduct](https://github.com/Simplify/ibantools/blob/master/.github/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.

For contribution details, please read [this document](https://github.com/Simplify/ibantools/blob/master/CONTRIBUTING.md).

## License

This work is dual-licensed under MIT and MPL-2.0.
You can choose between one of them if you use this work.

`SPDX-License-Identifier: MIT OR MPL-2.0`
