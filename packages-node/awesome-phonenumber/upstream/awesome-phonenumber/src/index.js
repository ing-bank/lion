goog.require('i18n.phonenumbers.AsYouTypeFormatter');
goog.require('i18n.phonenumbers.PhoneNumberFormat');
goog.require('i18n.phonenumbers.PhoneNumberType');
goog.require('i18n.phonenumbers.PhoneNumberUtil');
goog.require('i18n.phonenumbers.PhoneNumberUtil.ValidationResult');
goog.require('i18n.phonenumbers.ShortNumberInfo');

const PhoneNumberType = i18n.phonenumbers.PhoneNumberType;
const PhoneNumberFormat = i18n.phonenumbers.PhoneNumberFormat;
const ValidationResult = i18n.phonenumbers.PhoneNumberUtil.ValidationResult;
const AsYouTypeFormatter = i18n.phonenumbers.AsYouTypeFormatter;
const PhoneNumberUtil = i18n.phonenumbers.PhoneNumberUtil;
const ShortNumberInfo = i18n.phonenumbers.ShortNumberInfo;

const phoneUtil = PhoneNumberUtil.getInstance( );
const shortInfo = ShortNumberInfo.getInstance( );

function getNumberType( number )
{
	switch( phoneUtil.getNumberType( number ) )
	{
		case PhoneNumberType.FIXED_LINE:           return 'fixed-line';
		case PhoneNumberType.FIXED_LINE_OR_MOBILE: return 'fixed-line-or-mobile';
		case PhoneNumberType.MOBILE:               return 'mobile';
		case PhoneNumberType.PAGER:                return 'pager';
		case PhoneNumberType.PERSONAL_NUMBER:      return 'personal-number';
		case PhoneNumberType.PREMIUM_RATE:         return 'premium-rate';
		case PhoneNumberType.SHARED_COST:          return 'shared-cost';
		case PhoneNumberType.TOLL_FREE:            return 'toll-free';
		case PhoneNumberType.UAN:                  return 'uan';
		case PhoneNumberType.VOIP:                 return 'voip';
		default:
		case PhoneNumberType.UNKNOWN:              return 'unknown';
	}
}

function toNumberType( exportedName )
{
	switch( exportedName )
	{
		case 'fixed-line':           return PhoneNumberType.FIXED_LINE;
		case 'fixed-line-or-mobile': return PhoneNumberType.FIXED_LINE_OR_MOBILE;
		case 'mobile':               return PhoneNumberType.MOBILE;
		case 'pager':                return PhoneNumberType.PAGER;
		case 'personal-number':      return PhoneNumberType.PERSONAL_NUMBER;
		case 'premium-rate':         return PhoneNumberType.PREMIUM_RATE;
		case 'shared-cost':          return PhoneNumberType.SHARED_COST;
		case 'toll-free':            return PhoneNumberType.TOLL_FREE;
		case 'uan':                  return PhoneNumberType.UAN;
		case 'voip':                 return PhoneNumberType.VOIP;
		default:
		case 'unknown':              return PhoneNumberType.UNKNOWN;
	}
}

function getValidationResult( number )
{
	try
	{
		switch( phoneUtil.isPossibleNumberWithReason( number ) )
		{
			case ValidationResult.IS_POSSIBLE:          return 'is-possible';
			case ValidationResult.INVALID_COUNTRY_CODE: return 'invalid-country-code';
			case ValidationResult.TOO_LONG:             return 'too-long';
			case ValidationResult.TOO_SHORT:            return 'too-short';
		}

		if ( phoneUtil.isPossibleNumber( number ) )
			return 'is-possible';
	} catch ( err ) { }

	return 'unknown';
}

function isInternational( number )
{
	return number.charAt( 0 ) === '+' || number.slice( 0, 2 ) === '00';
}

function extractRegionCode( phoneNumber, regionHint )
{
	var parsed, regionCode;

	if ( !isInternational( phoneNumber ) )
		return { parsed, regionCode };

	try
	{
		parsed = phoneUtil.parse( phoneNumber, regionHint );
	} catch ( err ) { }

	if ( parsed )
	{
		regionCode = phoneUtil.getRegionCodeForNumber( parsed );

		if ( regionCode != null && regionCode !== 'ZZ' )
			return { parsed, regionCode };
	}

	for ( var len = 1; len < 4; ++len )
	{
		regionCode = void 0;

		if ( phoneNumber.length < len + 1 )
			return { parsed, regionCode };

		regionCode = PhoneNumber.getRegionCodeForCountryCode(
			phoneNumber.substring( 1, len + 1 )
		);

		if ( regionCode !== 'ZZ' )
			return { regionCode };
	}

	return { parsed, regionCode: void 0 };
}

function makeWeakMap( )
{
	try
	{
		return new WeakMap( );
	}
	catch ( err )
	{
		return undefined;
	}
}

const weakMap = makeWeakMap( );

function getWeakInstance( parsedPhoneNumber )
{
	if ( weakMap )
	{
		const pn = weakMap.get( parsedPhoneNumber );

		if ( pn )
		{
			return pn;
		}
	}

	return parsePhoneNumber( parsedPhoneNumber?.['number']?.['international'] ).pn;
}

/**
 * The PhoneNumber class.
 *
 * @constructor
 * @export
 */
export function PhoneNumber( )
{
	throw new Error( 'Internal error' );
}


function isMobile( type )
{
	return type === 'mobile' || type === 'fixed-line-or-mobile';
}

function isFixedLine( type )
{
	return type === 'fixed-line' || type === 'fixed-line-or-mobile';
}

const failureSentry = Object.freeze( {
	'valid': false,
	'possible': false,
	'possibility': 'invalid-country-code',
} );

function parsePhoneNumber( phoneNumber, options )
{
	var regionCode = options?.['regionCode'];

	var isInternal =
		typeof phoneNumber === 'string'
		? false
		: function( )
		{
			try
			{
				phoneUtil.isValidNumber( phoneNumber );
				return true;
			}
			catch ( e )
			{
				return false;
			}
		}( );

	if ( !isInternal && typeof phoneNumber !== 'string' )
		throw new Error( "Invalid phone number, expected a string" );
	if (
		!isInternal &&
		typeof options !== 'object' &&
		typeof options !== 'undefined'
	)
		throw new Error(
			`Invalid options, expected object, got ${typeof options}. ` +
			"This may be because of not yet upgraded code."
		);
	if ( !isInternal && regionCode != null && typeof regionCode !== 'string' )
		throw new Error(
			'Invalid region code, expected a string, got ' +
			`${typeof regionCode} ${regionCode}`
		);

	let pn = null;

	if ( !isInternal )
	{
		phoneNumber = phoneNumber.trim( );

		if ( regionCode && ( phoneNumber.charAt( 0 ) === '+' ) )
			// Ignore region code if we have an international phonenumber,
			// it'll be extracted properly by libphonenumber.
			regionCode = null;

		if ( !regionCode || isInternational( phoneNumber ) )
		{
			let parsed;
			// Guess region code
			(
				{ regionCode = null, parsed } =
					extractRegionCode( phoneNumber, regionCode )
			);
			pn = parsed;
		}
	}
	else
	{
		pn = phoneNumber;
		regionCode = phoneUtil.getRegionCodeForNumber( pn );
		phoneNumber = phoneUtil.format( pn, PhoneNumberFormat.NATIONAL );
	}

	var cc;
	if ( !isInternal )
	{
		if ( !regionCode )
		{
			return failureSentry;
		}
		else
		{
			cc = PhoneNumber.getCountryCodeForRegionCode( regionCode );
			if ( cc === 0 )
			{
				return {
					...failureSentry,
					...( regionCode ? { 'regionCode': regionCode } : { } ),
				};
			}
		}

		try
		{
			if ( !pn )
				pn = phoneUtil.parse( phoneNumber, regionCode );
		}
		catch ( e )
		{
			return {
				...failureSentry,
				...( regionCode ? { 'regionCode': regionCode } : { } ),
				'error': e,
			};
		}
	}

	return { pn, cc, phoneNumber, regionCode };
}

function memo( fn )
{
	return function( )
	{
		let res;

		if ( !res )
			res = fn( );

		return res;
	}
}

/** @export */
PhoneNumber.parse = function( phoneNumber, options )
{
	const parsed = parsePhoneNumber( phoneNumber, options );

	if ( !parsed.pn )
		return parsed;

	let regionCode, pn, cc;
	( { pn, cc, phoneNumber, regionCode } = parsed );

	const number = Object.defineProperties( Object.create( null ), {
		'input': {
			configurable: false, enumerable: true,
			value: phoneNumber,
		},
		'international': {
			configurable: false, enumerable: true,
			get: memo( ( ) => phoneUtil.format( pn, PhoneNumberFormat.INTERNATIONAL ) ),
		},
		'national': {
			configurable: false, enumerable: true,
			get: memo( ( ) => phoneUtil.format( pn, PhoneNumberFormat.NATIONAL ) ),
		},
		'e164': {
			configurable: false, enumerable: true,
			get: memo( ( ) => phoneUtil.format( pn, PhoneNumberFormat.E164 ) ),
		},
		'rfc3966': {
			configurable: false, enumerable: true,
			get: memo( ( ) => phoneUtil.format( pn, PhoneNumberFormat.RFC3966 ) ),
		},
		'significant': {
			configurable: false, enumerable: true,
			get: memo( ( ) => phoneUtil.getNationalSignificantNumber( pn ) ),
		},
	} );

	const type = getNumberType( pn );
	const valid = phoneUtil.isValidNumber( pn );
	let possible = phoneUtil.isPossibleNumber( pn );
	if ( !valid && !possible )
	{
		possible = false;
	}

	const ret = Object.defineProperties( Object.create( null ), {
		'number': {
			configurable: false, enumerable: true,
			value: number,
		},
		'regionCode': {
			configurable: false, enumerable: true,
			value: regionCode,
		},
		'valid': {
			configurable: false, enumerable: true,
			value: valid,
		},
		'possible': {
			configurable: true, enumerable: true,
			value: possible,
		},
		'possibility': {
			configurable: true, enumerable: true,
			get: memo( ( ) => getValidationResult( pn ) ),
		},
		'shortValid': {
			configurable: false, enumerable: true,
			get: memo( ( ) => shortInfo.isValidShortNumber( pn ) ),
		},
		'shortPossible': {
			configurable: false, enumerable: true,
			get: memo( ( ) => shortInfo.isPossibleShortNumber( pn ) ),
		},
		'type': {
			configurable: false, enumerable: true,
			value: type
		},
		'typeIsMobile': {
			configurable: false, enumerable: true,
			value: isMobile( type )
		},
		'typeIsFixedLine': {
			configurable: false, enumerable: true,
			value: isFixedLine( type )
		},
		'canBeInternationallyDialled': {
			configurable: false, enumerable: true,
			get: memo( ( ) => phoneUtil.canBeInternationallyDialled( pn ) ),
		},
		'countryCode': {
			configurable: false, enumerable: true,
			get: memo( ( ) => cc ?? phoneUtil.getCountryCodeForRegion( regionCode ) ),
		},
	} );

	if ( weakMap )
	{
		weakMap.set( ret, pn );
	}

	return ret;
}

/** @export */
PhoneNumber.getCountryCodeForRegionCode = function( regionCode )
{
	return phoneUtil.getCountryCodeForRegion( regionCode );
}

/** @export */
PhoneNumber.getRegionCodeForCountryCode = function( countryCode )
{
	var regionCode = phoneUtil.getRegionCodeForCountryCode( countryCode );
	return regionCode;
}

/** @export */
PhoneNumber.findNumbers = function( text, options )
{
	const defaultRegionCode = options?.[ 'defaultRegionCode' ];
	const leniency = options?.[ 'leniency' ] ?? 'valid';
	const maxTries = options?.[ 'maxTries' ] ?? Number.MAX_SAFE_INTEGER;

	const re = /([0-9]+(?: [0-9]+)*)/g;
	const res = [ ];
	let m;
	for ( let i = 0; i < maxTries; ++i )
	{
		m = re.exec( text );
		if ( !m )
			break;

		let start = m.index;
		const end = m.index + m[ 1 ].length;
		if ( start > 0 && text.charAt( start - 1 ) === '+' )
			--start;

		const slice = text.slice( start, end );

		const pn = PhoneNumber.parse(
			slice,
			{ 'regionCode': defaultRegionCode }
		);

		if ( pn[ 'valid' ] || ( leniency === 'possible' && pn[ 'possible' ] ) )
			res.push( {
				'text': slice,
				'phoneNumber': pn,
				'start': start,
				'end': end,
			} );
	}

	return res;
}

function uniq( arr )
{
	const lookup = { };
	return arr.filter( elem =>
	{
		if ( lookup.hasOwnProperty( elem ) )
			return false;
		lookup[ elem ] = 1;
		return true;
	} );
}

/** @export */
PhoneNumber.getSupportedRegionCodes = function( )
{
	return uniq( phoneUtil.getSupportedRegions( ) );
}

/** @export */
PhoneNumber.getSupportedCallingCodes = function( )
{
	return uniq( phoneUtil.getSupportedCallingCodes( ) );
}

/** @export */
PhoneNumber.getExample = function( regionCode, type /* = null */ )
{
	var example;
	if ( !type )
		example = phoneUtil.getExampleNumber( regionCode );
	else
		example = phoneUtil.getExampleNumberForType(
			regionCode, toNumberType( type ) );

	return PhoneNumber.parse( example, regionCode );
}

/** @export */
PhoneNumber.getAsYouType = function( regionCode )
{
	return new AsYouType( regionCode );
}

/** @export */
PhoneNumber.getNumberFrom = function( parsedPhoneNumber, regionCode )
{
	try
	{
		const instance = getWeakInstance( parsedPhoneNumber );
		const number = phoneUtil.formatOutOfCountryCallingNumber(
			instance,
			regionCode
		);
		return {
			[ 'valid' ]: true,
			[ 'number' ]: number,
		};
	}
	catch ( err )
	{
		return {
			[ 'valid' ]: false,
			[ 'error' ]: err,
		};
	}
}

/** @export */
PhoneNumber.prototype.toJSON = function( )
{
	return this._json;
}

/** @export */
PhoneNumber.prototype.canBeInternationallyDialled = function( )
{
	return this._json[ 'canBeInternationallyDialled' ];
}

/** @export */
PhoneNumber.prototype.isValid = function( )
{
	return this._json[ 'valid' ];
}

/** @export */
PhoneNumber.prototype.isPossible = function( )
{
	return this._json[ 'possible' ];
}

/** @export */
PhoneNumber.prototype.getType = function( )
{
	return this._json[ 'type' ];
}

/** @export */
PhoneNumber.prototype.isMobile = function( )
{
	return this._json[ 'type' ] === 'mobile'
		|| this._json[ 'type' ] === 'fixed-line-or-mobile';
}

/** @export */
PhoneNumber.prototype.isFixedLine = function( )
{
	return this._json[ 'type' ] === 'fixed-line'
		|| this._json[ 'type' ] === 'fixed-line-or-mobile';
}

/**
 * The type can be any of 'international', 'national', 'e164', 'rfc3966',
 * 'significant'.
 */
/** @export */
PhoneNumber.prototype.getNumber = function( type /* = e164 */ )
{
	type = type == null ? 'e164' : type;

	return this._json[ 'number' ][ type ];
}

/** @export */
PhoneNumber.prototype.getRegionCode = function( )
{
	return this._json[ 'regionCode' ];
}

/** @export */
PhoneNumber.prototype.getCountryCode = function( )
{
	const regionCode = this._json[ 'regionCode' ];
	return PhoneNumber.getCountryCodeForRegionCode( regionCode );
}


/**
 * The AsYouType class.
 * @constructor
 */
function AsYouType( regionCode )
{
	this._regionCode = regionCode;
	this._aytf = new AsYouTypeFormatter( regionCode );
	this._rawInput = '';
	this._number = '';
}

/** @export */
AsYouType.prototype.addChar = function( nextChar )
{
	this._rawInput += nextChar;
	this._number = this._aytf.inputDigit( nextChar );
	return this._number;
}

/** @export */
AsYouType.prototype.number = function( )
{
	return this._number;
}

/** @export */
AsYouType.prototype.removeChar = function( )
{
	if ( this._rawInput === '' )
		return this._number;

	return this.reset( this._rawInput.slice( 0, this._rawInput.length - 1 ) );
}

/** @export */
AsYouType.prototype.reset = function( number /* = '' */ )
{
	this._aytf.clear( );
	this._rawInput = '';
	this._number = '';
	if ( number )
		for ( var i = 0, n = number.length; i < n; ++i )
			this.addChar( number.charAt( i ) );
	return this._number;
}

/** @export */
AsYouType.prototype.getPhoneNumber = function( )
{
	return PhoneNumber.parse(
		this._number,
		{ [ 'regionCode' ]: this._regionCode }
	);
}
