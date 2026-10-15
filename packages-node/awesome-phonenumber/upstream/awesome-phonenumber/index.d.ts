export type PhoneNumberFormat =
	| 'e164'
	| 'international'
	| 'national'
	| 'rfc3966'
	| 'significant';

export type PhoneNumberTypes =
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
	| 'unknown';

export type PhoneNumberPossibility =
	| 'is-possible'
	| 'invalid'
	| 'invalid-country-code'
	| 'too-long'
	| 'too-short'
	| 'unknown';

/**
 * Parse a phone number into an object describing the number.
 *
 * @example
 *   ```ts
 *   // Using a national phone number format
 *   parsePhoneNumber( '0707123456', { regionCode: 'SE' } )
 *   // Using an international (e164) phone number format
 *   parsePhoneNumber( '+46707123456' )
 *   ```
 *
 * The options object is on the form:
 *   ```ts
 *   {
 *     regionCode?: string;
 *   }
 *   ```
 *
 * @param phoneNumber Either an `e164` formatted (international) phone number
 *                    or a _national_ phone number.
 * @param options     Object of type {@link PhoneNumberParseOptions}.
 * @returns A {@link ParsedPhoneNumber}
 */
export function parsePhoneNumber(
	phoneNumber: string,
	options?: PhoneNumberParseOptions
): ParsedPhoneNumber;

export interface PhoneNumberParseOptions
{
	/**
	 * If the phone number is on national form, this region code specifies the
	 * region of the phone number, e.g. "SE" for Sweden.
	 */
	regionCode?: string;
}

export interface ParsedPhoneNumberFull
{
	number: {
		input: string;
		international: string;
		national: string;
		e164: string;
		rfc3966: string;
		significant: string;
	};
	possibility: PhoneNumberPossibility;
	regionCode: string;
	valid: boolean;
	possible: boolean;
	shortValid: boolean;
	shortPossible: boolean;
	canBeInternationallyDialled: boolean;
	type: PhoneNumberTypes;
	countryCode: number;
	typeIsMobile: boolean;
	typeIsFixedLine: boolean;
}

export type ParsedPhoneNumberValid =
	& Omit< ParsedPhoneNumberFull, 'valid' >
	& { valid: true; };

export type ParsedPhoneNumberInvalid =
	& Partial< Omit< ParsedPhoneNumberFull, 'valid' | 'possible' | 'possibility' > >
	& {
		valid: false;
		possible: boolean;
		possibility: PhoneNumberPossibility;
		error?: unknown;
	};

export type ParsedPhoneNumber =
	| ParsedPhoneNumberValid
	| ParsedPhoneNumberInvalid;

export function getCountryCodeForRegionCode( regionCode: string ): number;
export function getRegionCodeForCountryCode( countryCode: number ): string;
export function getSupportedCallingCodes( ): string[ ];
export function getSupportedRegionCodes( ): string[ ];

export type FindNumbersLeniency =
	/**
	 * Phone numbers accepted are possible, but not necessarily valid.
	 */
	| 'possible'
	/**
	 * Phone numbers accepted are possible and valid.
	 */
	| 'valid';

export interface FindNumbersOptions
{
	/**
	 * A default region code, to find local (non-e164) formatted phone numbers
	 */
	defaultRegionCode?: string;

	/** Leniency options */
	leniency?: FindNumbersLeniency;

	/**
	 * The maximum number of invalid numbers to try before giving up on the text
	 */
	maxTries?: number;
}

export interface PhoneNumberMatch
{
	/** The raw string found */
	text: string;

	/** The parsed phone number object */
	phoneNumber: ParsedPhoneNumber;

	/** Start offset of the found number */
	start: number;

	/** End offset of the found number */
	end: number;
}

/**
 * Find phone numbers in text.
 *
 * If the text is expected to have phone numbers for a certain region code,
 * the option `defaultRegionCode` can be set. Phone numbers without the
 * international prefix `+` will then be found too.
 *
 * Leniency can be specified using the `leniency` option, in which case
 * `maxTries` needs to be set too.
 */
export function findNumbers( text: string, options?: FindNumbersOptions )
	: PhoneNumberMatch[ ];

/**
 * Get an example phone number, given a region code and a phone number
 * {@link PhoneNumberTypes type}.
 *
 * @param regionCode Region code
 * @param type Phone number {@link PhoneNumberTypes type}
 */
export function getExample(
	regionCode: string,
	type?: PhoneNumberTypes
): ParsedPhoneNumber;


/**
 * Get a phonenumber string as it would be called from another country.
 *
 * @param parsedPhoneNumber A phone number object as returned from {@link parsePhoneNumber `parsePhoneNumber()`}
 * @param regionCode Region code of the country to call from
 */
export function getNumberFrom(
	parsedPhoneNumber: ParsedPhoneNumberValid,
	regionCode?: string
): PhoneNumberFrom;

export type PhoneNumberFrom =
	| PhoneNumberFromValid
	| PhoneNumberFromInvalid;

export interface PhoneNumberFromValid
{
	valid: true;
	number: string;
}

export interface PhoneNumberFromInvalid
{
	valid: false;
	number?: string;
	error?: unknown;
}


/**
 * Get an instance of the AsYouType class, based on a region code.
 *
 * @param regionCode The region code to get an AsYouType instance for.
 */
export function getAsYouType( regionCode: string ): AsYouType;


export class AsYouType
{
	private constructor( );

	addChar( char: string ): string;
	number( ): string;
	removeChar( ): string;
	reset( number?: string ): string;
	getPhoneNumber( ): ParsedPhoneNumber;
}

// /** @deprecated use `parsePhoneNumber()` instead */
// export default PhoneNumber;
