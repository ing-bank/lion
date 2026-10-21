import { promises } from 'fs'
import * as path from 'path'

import { overwriteFile } from './file'

const { readFile } = promises;

const esmFile = path.resolve( __dirname, '..', 'build', 'index-esm.js' );
const outroFile = path.resolve( __dirname, '..', 'src', 'esm-outro.js' );
const resultFile = path.resolve( __dirname, '..', 'index-esm.mjs' );

async function rewrite( )
{
	const [ file1, file2 ] = await Promise.all( [
		readFile( esmFile, 'utf-8' ),
		readFile( outroFile, 'utf-8' ),
	] );

	console.log(
		`Lines: ${file1.split('\n').length} ${file2.split('\n').length}`
	);

	const file1WithoutDefaultExport = file1
		.split( '\n' )
		.filter( line => line !== 'export { index as default };' )
		.join( '\n' );

	const data = file1WithoutDefaultExport + file2;

	await overwriteFile( resultFile, data );
}
rewrite( ).catch( err =>
{
	console.error( err.stack );
	process.exit( 1 );
} );
