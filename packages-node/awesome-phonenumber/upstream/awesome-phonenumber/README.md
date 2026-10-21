[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![minzipped size][bundlephobia-image]][bundlephobia-url]
[![Dependency count][depcount-image]][npm-url]


# Awesome phonenumber parser

This library is a pre-compiled version of Google's `libphonenumber`, with a slightly simpler interface. It has a minimal footprint - is by far the smallest libphonenumber-based library available on npmjs, and has no dependencies.

Unlike libphonenumber, it includes a `findNumbers( )` function to find phone numbers in text.

TypeScript typings are provided within the package.

Uses libphonenumber v9.0.41


### Versions

 - v3:
   - Changed API (although with backwards compatible ABI)
   - Added ESM export
 - v4:
   - Changed API to be much cleaner
     - No constructor
     - No functions on returned object
     - No errors being thrown
   - Not backwards compatible, although like v3 except:
     - The second argument to `parsePhoneNumber` is an object
       - E.g. `{ regionCode: 'SE' }` instead of a region code string
     - The return value is like `toJSON( )` on v3
 - v5:
   - Dropped Node 12 support
 - v6:
   - Dropped Node 16 support
 - v7:
   - Added `findNumbers( )` feature, to find phone numbers in text
   - Added support for _short_ numbers


## Comparison with other libraries

Since this library is pre-compiled, it doesn't depend on the closure compiler, and needs not load it on start. This makes the library faster and saves you a lot of space. It also means this library is trivial to use in any `webpack` project (or using any other means to run in the browser).

Among all the popular phone number using Google's `libphonenumber` (or mimicing it), only this one, `google-libphonenumber` and `libphonenumber-js` have decent README's with examples. *This may have changed since first doing these benchmarks*.

A library should be quick to load (`require()`), quick to parse first time and all consecutive times. It shouldn't bloat your `node_modules`, and it should have a small memory footprint, if possible.

The following is the result of a test program which loads the library, then parses a phone number, and then once again. It's called 100 times for each library and the mean values are shown here. Parsing a phone number first time might be slower because of initially compiling/optimizing regular expressions and whatnot. Parsing a phone number a second time will show the speed of likely all future parsing within that process.

Action                    | awesome-phonenumber<br/>7.2.0<br/>(lib 8.13.47) | google-libphonenumber<br/>3.2.38<br/>(lib 8.13.42) | libphonenumber-js<br/>1.11.9<br/>(lib -)
------------------------- | ------------------- | --------------------- | ----------------
Load library first time         | 7.82 ms ✅          | 14.28 ms              | 14.53 ms
Parse first phone number        | 2.00 ms             | 1.86 ms               | 1.65 ms ✅
**⇒ Load + parse first number** | 9.82 ms ✅          | 16.14 ms              | 16.18 ms
Format again                    | 0.09 ms ✅          | 0.22 ms               | 0.13 ms
Parse again                     | 0.39 ms ✅          | 0.51 ms               | 0.43 ms
Increased memory usage          | 9.77 M ✅           | 12.71 M               | 11.25 M
node_modules size               | 720 K               | * 604 K ✅            | 9.9 M
node_modules files              | 9                   | * 7 ✅                | 787

\* NOTE: google-libphonenumber only ships CJS, while awesome-phonenumber and libphonenumber-js ships _both_ CJS and ESM


## Basic usage
```ts
import { parsePhoneNumber } from 'awesome-phonenumber'

const pn = parsePhoneNumber( '0707123456', { regionCode: 'SE' } );
// or on e164 format:
const pn = parsePhoneNumber( '+46707123456' );

// pn is now the same as:
const pn = {
	valid: true,

	number: {
		input: '0707123456',
		e164: '+46707123456',
		international: '+46 70 712 34 56',
		national: '070-712 34 56',
		rfc3966: 'tel:+46-70-712-34-56',
		significant: '707123456',
	},
	possibility: 'is-possible',
	regionCode: 'SE',
	possible: true,
	shortPossible: false,
	shortValid: false,
	canBeInternationallyDialled: true,
	type: 'mobile',
	countryCode: 46,
	typeIsMobile: true,
	typeIsFixedLine: false,
};
```

The return type is `ParsedPhoneNumber` which is either a `ParsedPhoneNumberValid` or a `ParsedPhoneNumberInvalid`. The `valid` property identifies whether the parsing was successful or not, hence which type is returned.

The format of a successful parsing is:

```ts
interface ParsedPhoneNumberValid {
	valid: true;

	number: {
		input: string;
		international: string;
		national: string;
		e164: string;
		rfc3966: string;
		significant: string;
	};
	possibility: PhoneNumberPossibility; // a string union, see below
	regionCode: string;
	possible: boolean;
	shortPossible: boolean;
	shortValid: boolean;
	canBeInternationallyDialled: boolean;
	type: PhoneNumberTypes; // a string union, see below
	countryCode: number;
	typeIsMobile: boolean;
	typeIsFixedLine: boolean;
}
```

If the number failed to be parsed, or there was another error, the return type is:

```ts
interface ParsedPhoneNumberInvalid {
	valid: false;

	possible: false;
	possibility: 'invalid';
	shortPossible: boolean;
	shortValid: boolean;
	error?: unknown;
};
```

Note that an incorrect (invalid) phone number can still be a valid _short number_ for the given region.


## API

```ts
import {
	parsePhoneNumber,
	findNumbers,
	getNumberFrom,
	getExample,
	getCountryCodeForRegionCode,
	getRegionCodeForCountryCode,
	getSupportedCallingCodes,
	getSupportedRegionCodes,
	getAsYouType,
} from 'awesome-phonenumber'
```


### parsePhoneNumber

`parsePhoneNumber( phoneNumber, { regionCode: string } )` parses a phone number as described above.

The first argument is the phone number to parse, on either _national_ or _international_ (e164, i.e. prefixed with a `+`) form. If _national_ form, the second argument is required to contain a `regionCode` string property, e.g. 'SE' for Sweden, 'CH' for Switzerland, etc.


### findNumbers


To find (extract) phone numbers in text, use `findNumbers( )`:

```ts
import { findNumbers } from 'awesome-phonenumber'

const text = 'My number is +46 707 123 456, otherwise call +33777777777.';
const numbers = findNumbers( text );
```

The returned list of numbers is of the type `PhoneNumberMatch` such as:

```ts
interface PhoneNumberMatch
{
	text: string; // The raw string found
	phoneNumber: object; // Same as the result of parsePhoneNumber()
	start: number; // Start offset in the text
	end: number; // End offset in the text
}
```

A second options argument to `findNumbers( text, options )` can be provided on the form:

```ts
interface FindNumbersOptions
{
	defaultRegionCode?: string;
	leniency?: FindNumbersLeniency;
	maxTries?: number;
}
```

where `FindNumbersLeniency` is an enum of `'valid'` or `'possible'`. The default is `'valid'` meaning that only valid phone numbers are found. If this is set to `'possible'` also possible (but invalid) phone numbers are found.

`defaultRegionCode` can be set (e.g. to `'SE'` for Sweden), in which case phone numbers on _national_ form (i.e. without `+` prefix) will be found, as long as they are from that region.

For really large texts, `maxTries` will set the maximum number of phone numbers to _try_ to find (not necessary actually find).


### getNumberFrom

```ts
import { parsePhoneNumber, getNumberFrom } from 'awesome-phonenumber'

const pn = parsePhoneNumber( '0707654321', { regionCode: 'SE' } );
if ( pn.valid ) {
	const fromJp = getNumberFrom( pn, 'JP' );
	// fromJp is the number to call from Japan:
	fromJp.number === "010 46 70 765 43 21";
}
```

The return value from `getNumberFrom` is a `PhoneNumberFrom` which is either a `PhoneNumberFromValid` or a `PhoneNumberFromInvalid`.

The `PhoneNumberFromValid` is defined as:

```ts
interface PhoneNumberFromValid
{
	valid: true;
	number: string;
}
```

The `PhoneNumberFromInvalid` is defined as:

```ts
interface PhoneNumberFromInvalid
{
	valid: false;
	error?: unknown;
}
```


## <a name="example"></a>getExample

Sometimes you want to display a formatted example phone number for a certain country (and maybe also a certain type of phone number). The `getExample` function is used for this.

```ts
import { getExample } from 'awesome-phonenumber'

getExample( regionCode[, phoneNumberType] ); // Parsed phone number
```

The `phoneNumberType` is any of the [types defined above](#phone-number-types).

### Example

```ts
import { getExample } from 'awesome-phonenumber'

// Get an example Swedish phone number
const example = getExample( 'SE' ); // A ParsedPhoneNumberValid
const exampleMobile = getExample( 'SE', 'mobile' ); // A ParsedPhoneNumberValid

example.number.e164;           // e.g. '+468123456'
exampleMobile.number.e164;     // e.g. '+46701234567'
exampleMobile.number.national; // e.g. '070 123 45 67'
```


## Country codes

There are conversion functions between the 2-character ISO 3166-1 region codes (e.g. 'SE' for Sweden) and the corresponding country calling codes.

```ts
import {
	getCountryCodeForRegionCode,
	getRegionCodeForCountryCode,
	getSupportedCallingCodes,
	getSupportedRegionCodes,
} from 'awesome-phonenumber'

getCountryCodeForRegionCode( regionCode );  // -> countryCode
getRegionCodeForCountryCode( countryCode ); // -> regionCode
```

### Example

```ts
getCountryCodeForRegionCode( 'SE' ); // -> 46
getRegionCodeForCountryCode( 46 );   // -> 'SE'
```

### Supported calling codes

```ts
getSupportedCallingCodes( ); // -> [ calling codes... ]
```

### Supported region codes

```ts
getSupportedRegionCodes( ); // -> [ region codes... ]
```


## API types

The API consists of the `PhoneNumber` class which sometimes uses *enums*. These are:

### <a name="phone-number-types"></a>Phone number types
```ts
type PhoneNumberTypes =
	| 'fixed-line'
	| 'fixed-line-or-mobile'
	| 'mobile'
	| 'pager'
	| 'personal-number'
	| 'premium-rate'
	| 'shared-cost'
	| 'toll-free'
	| 'uan'
	| 'voip'
	| 'unknown'
```

### Phone number possibilities

```ts
type PhoneNumberPossibility =
	| 'is-possible'
	| 'invalid-country-code'
	| 'too-long'
	| 'too-short'
	| 'unknown'
```

### Phone number formats

```ts
'international'
'national'
'e164'
'rfc3966'
'significant'
```




## As-you-type formatting

You can create an `AsYouType` class with `getAsYouType()` to format a phone number as it is being typed.

```ts
import { getAsYouType } from 'awesome-phonenumber'

const ayt = getAsYouType( 'SE' );
```

The returned class instance has the following methods

```ts
// Add a character to the end of the number
ayt.addChar( nextChar: string );

// Get the current formatted number
ayt.number( );

// Remove the last character
ayt.removeChar( );

// Replace the whole number with a new number (or an empty number if undefined)
ayt.reset( number?: string );

// Get a ParsedPhoneNumber object representing the current number
ayt.getPhoneNumber( );
```

All the functions above except `getPhoneNumber( )` return the current formatted number as a string.

#### Example

```ts
import { getAsYouType } from 'awesome-phonenumber'

const ayt = getAsYouType( 'SE' );
ayt.addChar( '0' ); // -> '0'
ayt.addChar( '7' ); // -> '07'
ayt.addChar( '0' ); // -> '070'
ayt.addChar( '7' ); // -> '070 7'
ayt.addChar( '1' ); // -> '070 71'
ayt.addChar( '2' ); // -> '070 712'
ayt.addChar( '3' ); // -> '070 712 3'
ayt.addChar( '4' ); // -> '070 712 34'
ayt.addChar( '5' ); // -> '070 712 34 5'
ayt.addChar( '6' ); // -> '070 712 34 56'
ayt.removeChar( );  // -> '070 712 34 5'
ayt.addChar( '7' ); // -> '070 712 34 57'
```


## Packing a tarball without publishing

`npm run pack` produces the same tarball `npm publish` would upload, without publishing anything. It is used to hand a build (e.g. a newer libphonenumber) to downstream projects before an official release.

```sh
yarn install --immutable
npm run pack                     # writes to ./dist
PACK_DESTINATION=/some/dir npm run pack
PACK_VERSION=7.9.0-mytag.1 npm run pack
```

`scripts/pack.sh`:

 - exports the committed revision (`PACK_SOURCE_REF`, default `HEAD`; uncommitted changes are *not* packed) into a clean staging directory named `awesome-phonenumber` (rollup derives identifiers in `index-esm.mjs` from it)
 - runs `yarn install --immutable`, `yarn build` (libphonenumber at the tag pinned in `libphonenumber.version`) and `yarn test`, like the release workflow
 - sets the version (default `7.9.0-tlouisse.libphonenumber-<libphonenumber version>`: the next minor after the latest release, 7.8.0, marked as a fork prerelease) and runs `npm pack`, which runs the same `prepack`/`prepare`/`postpack` lifecycle as `npm publish`
 - runs `npm publish --dry-run` and checks that its file list and integrity match the tarball
 - writes `<tarball>.sha256` and `<tarball-name>.provenance.json` (source commit, libphonenumber version, sizes, file list)
 - runs `scripts/verify-pack.mjs` (also available as `npm run pack:verify -- <tarball>`), which checks the payload and metadata, installs the tarball into a scratch project and verifies CommonJS `require`, ESM `import` and the TypeScript types

The tarball contains `lib/`, `index.js`, `index-esm.mjs`, `index.d.ts`, `package.json`, `README.md` and the license files: `LICENSE` (this package), `LICENSE.libphonenumber` and `LICENSE.closure-library` (Apache-2.0, for the Google libphonenumber and Closure Library code compiled into `lib/index.js`).

The [Pack workflow](.github/workflows/pack.yml) runs the same script on pushes to its configured branches (or manually via `workflow_dispatch`, with an optional version) and uploads the tarball, checksum and provenance as the `awesome-phonenumber-tarball` artifact.

[npm-image]: https://img.shields.io/npm/v/awesome-phonenumber.svg
[npm-url]: https://npmjs.org/package/awesome-phonenumber
[downloads-image]: https://img.shields.io/npm/dm/awesome-phonenumber.svg
[build-image]: https://img.shields.io/github/actions/workflow/status/grantila/awesome-phonenumber/master.yml?branch=master
[build-url]: https://github.com/grantila/awesome-phonenumber/actions?query=workflow%3AMaster
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/awesome-phonenumber
[bundlephobia-url]: https://bundlephobia.com/package/awesome-phonenumber
[depcount-image]: https://badgen.net/bundlephobia/dependency-count/awesome-phonenumber
