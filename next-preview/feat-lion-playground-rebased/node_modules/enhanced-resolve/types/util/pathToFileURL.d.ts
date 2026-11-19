export = pathToFileURL;
/**
 * @param {string} filepath an absolute filesystem path
 * @param {{ windows?: boolean }=} options force the platform branch
 * @returns {URL} the `file:` URL
 */
declare function pathToFileURL(
	filepath: string,
	options?:
		| {
				windows?: boolean;
		  }
		| undefined,
): URL;
