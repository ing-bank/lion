import { promises } from 'fs'

export async function overwriteFile( filename: string, data: string )
{
	const file = await promises.open( filename, 'w' );
	await file.write( data, 0, 'utf-8' );
	await file.sync( );
	await file.close( );
}
