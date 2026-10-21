#!/usr/bin/env node
// Verifies a packed awesome-phonenumber tarball: payload, metadata,
// `npm publish --dry-run` parity, and consumption (CJS, ESM, types) after
// installing the tarball into a scratch project.
//
// Usage: node scripts/verify-pack.mjs <path/to/awesome-phonenumber-x.y.z.tgz>
// Set PACK_TSC to a tsc binary (defaults to ./node_modules/.bin/tsc).

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve( dirname( fileURLToPath( import.meta.url ) ), '..' );
const tarball = resolve( process.argv[ 2 ] ?? '' );
if ( !process.argv[ 2 ] || !existsSync( tarball ) )
{
	console.error( 'Usage: node scripts/verify-pack.mjs <tarball.tgz>' );
	process.exit( 1 );
}
const tsc = process.env.PACK_TSC ?? join( root, 'node_modules', '.bin', 'tsc' );

const run = ( cmd, args, opts = { } ) =>
	execFileSync( cmd, args, { encoding: 'utf8', ...opts } );

const expectedFiles = [
	'LICENSE',
	'LICENSE.closure-library',
	'LICENSE.libphonenumber',
	'README.md',
	'index-esm.mjs',
	'index.d.ts',
	'index.js',
	'lib/index.js',
	'package.json',
];

// 1. Payload
const entries = run( 'tar', [ '-tzf', tarball ] )
	.split( '\n' )
	.filter( Boolean )
	.map( entry => entry.replace( /^package\//, '' ) )
	.sort( );
assert.deepEqual( entries, expectedFiles, 'unexpected tarball payload' );
console.log( `✓ payload: ${entries.join( ', ' )}` );

// 2. Metadata
const pkg = JSON.parse(
	run( 'tar', [ '-xzOf', tarball, 'package/package.json' ] )
);
assert.equal( pkg.name, 'awesome-phonenumber' );
assert.notEqual( pkg.version, '0.0.0-development' );
assert.ok( !pkg.private, 'package must not be private' );
assert.equal( pkg.main, './index.js' );
assert.equal( pkg.types, './index.d.ts' );
assert.equal( pkg.exports[ '.' ].require, './index.js' );
assert.equal( pkg.exports[ '.' ].default, './index-esm.mjs' );
assert.equal( pkg.dependencies, undefined, 'no runtime dependencies expected' );
console.log( `✓ metadata: ${pkg.name}@${pkg.version}` );

// 3. Parity with `npm publish --dry-run` (written by scripts/pack.sh)
const packJson = join( dirname( tarball ), 'pack.json' );
const publishJson = join( dirname( tarball ), 'publish-dry-run.json' );
if ( existsSync( packJson ) && existsSync( publishJson ) )
{
	const [ packed ] = JSON.parse( readFileSync( packJson, 'utf8' ) );
	const published = JSON.parse( readFileSync( publishJson, 'utf8' ) );
	// npm 10 prints an object, npm 11 keys it by package name
	const dryRun = published.files ? published : published[ pkg.name ];
	const paths = list => list.map( f => f.path ).sort( );
	assert.deepEqual( paths( dryRun.files ), paths( packed.files ) );
	assert.equal( dryRun.version, packed.version );
	assert.equal( dryRun.integrity, packed.integrity );
	assert.equal( dryRun.shasum, packed.shasum );
	console.log( '✓ npm publish --dry-run matches npm pack (files, version, integrity)' );
}
else
	console.log( '- skipped publish parity (pack.json / publish-dry-run.json not found)' );

// 4. Consume the actual tarball
const consumer = mkdtempSync( join( tmpdir( ), 'awesome-phonenumber-consumer-' ) );
try
{
	writeFileSync(
		join( consumer, 'package.json' ),
		JSON.stringify( { name: 'consumer', private: true } )
	);
	run(
		'npm',
		[ 'install', '--no-audit', '--no-fund', '--ignore-scripts', tarball ],
		{ cwd: consumer, stdio: 'ignore' }
	);

	const installed = JSON.parse( readFileSync(
		join( consumer, 'node_modules', 'awesome-phonenumber', 'package.json' ),
		'utf8'
	) );
	assert.equal( installed.version, pkg.version );

	writeFileSync( join( consumer, 'cjs.cjs' ), `
const assert = require( 'node:assert/strict' );
const { parsePhoneNumber, findNumbers, getAsYouType } = require( 'awesome-phonenumber' );
const pn = parsePhoneNumber( '0707123456', { regionCode: 'SE' } );
assert.equal( pn.valid, true );
assert.equal( pn.number.e164, '+46707123456' );
assert.equal( findNumbers( 'call +46707123456' ).length, 1 );
assert.equal( getAsYouType( 'SE' ).addChar( '0' ), '0' );
assert.equal( require( 'awesome-phonenumber/package.json' ).version, ${JSON.stringify( pkg.version )} );
` );
	run( 'node', [ 'cjs.cjs' ], { cwd: consumer } );
	console.log( '✓ CommonJS require' );

	writeFileSync( join( consumer, 'esm.mjs' ), `
import assert from 'node:assert/strict';
import parse, { parsePhoneNumber, getSupportedRegionCodes } from 'awesome-phonenumber';
assert.equal( parse, parsePhoneNumber );
assert.equal( parsePhoneNumber( '+31 20 123 4567' ).regionCode, 'NL' );
assert.ok( getSupportedRegionCodes( ).includes( 'NL' ) );
` );
	run( 'node', [ 'esm.mjs' ], { cwd: consumer } );
	console.log( '✓ ESM import' );

	writeFileSync( join( consumer, 'types.mts' ), `
import { parsePhoneNumber, type ParsedPhoneNumber } from 'awesome-phonenumber';
const pn: ParsedPhoneNumber = parsePhoneNumber( '+46707123456' );
const e164: string | undefined = pn.valid ? pn.number.e164 : undefined;
// @ts-expect-error regionCode must be a string
parsePhoneNumber( '0707123456', { regionCode: 46 } );
export { e164 };
` );
	writeFileSync( join( consumer, 'types.cts' ), `
import { getExample } from 'awesome-phonenumber';
const example: string | undefined = getExample( 'SE', 'mobile' ).number?.e164;
export { example };
` );
	writeFileSync( join( consumer, 'tsconfig.json' ), JSON.stringify( {
		compilerOptions: {
			module: 'node16',
			moduleResolution: 'node16',
			strict: true,
			noEmit: true,
			types: [ ],
		},
		files: [ 'types.mts', 'types.cts' ],
	} ) );
	if ( existsSync( tsc ) )
	{
		run( tsc, [ '-p', consumer ], { cwd: consumer } );
		console.log( '✓ TypeScript types (node16 ESM + CJS resolution)' );
	}
	else
		console.log( `- skipped TypeScript check (${tsc} not found)` );
}
finally
{
	rmSync( consumer, { recursive: true, force: true } );
}

console.log( `✓ ${tarball} verified` );
