export = fileURLToPath;
/**
 * @param {string | URL} path a `file:` URL string or `URL` instance
 * @param {{ windows?: boolean }=} options force the platform branch
 * @returns {string} the filesystem path
 */
declare function fileURLToPath(
	path: string | URL,
	options?:
		| {
				windows?: boolean;
		  }
		| undefined,
): string;
