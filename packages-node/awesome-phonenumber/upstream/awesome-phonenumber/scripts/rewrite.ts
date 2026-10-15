import { promises } from 'fs'
import * as path from 'path'

import { overwriteFile } from './file'

const { readFile } = promises;

const distFile = path.resolve( __dirname, '..', 'lib', 'index.js' );

async function rewrite( )
{
	const data = await readFile( distFile, 'utf-8' );
	const res = data.replace( /\bconst /g, 'var ' );
	await overwriteFile( distFile, res );
}
rewrite( ).catch( err =>
{
	console.error( err.stack );
	process.exit( 1 );
} );
