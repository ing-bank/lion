/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

// A runtime-agnostic port of Node's `url.pathToFileURL`, built on the global
// `URL` (available in Node, browsers, Deno and Bun) so the resolver does not
// depend on the Node `url` builtin. It is the inverse of `./fileURLToPath` and
// takes the same `windows` option to force the platform branch.
//
// Unlike Node's version this does not call `path.resolve` on the input: the
// resolver only ever converts paths it has already made absolute, and reaching
// for the current working directory would not work in a browser.

const percentRegEx = /%/g;
const backslashRegEx = /\\/g;
const newlineRegEx = /\n/g;
const carriageReturnRegEx = /\r/g;
const tabRegEx = /\t/g;

const isWindows =
	typeof process !== "undefined" && process.platform === "win32";

/**
 * Percent-encode the characters the `URL` pathname setter would otherwise
 * interpret. Everything else is left to the setter itself.
 * @param {string} filepath absolute filesystem path
 * @param {boolean} windows true to follow the Windows branch
 * @returns {string} the encoded path
 */
function encodePathChars(filepath, windows) {
	if (filepath.includes("%")) {
		filepath = filepath.replace(percentRegEx, "%25");
	}
	// A backslash is a legal character in a POSIX file name, so it has to be
	// encoded rather than treated as a separator.
	if (!windows && filepath.includes("\\")) {
		filepath = filepath.replace(backslashRegEx, "%5C");
	}
	if (filepath.includes("\n")) {
		filepath = filepath.replace(newlineRegEx, "%0A");
	}
	if (filepath.includes("\r")) {
		filepath = filepath.replace(carriageReturnRegEx, "%0D");
	}
	if (filepath.includes("\t")) {
		filepath = filepath.replace(tabRegEx, "%09");
	}
	return filepath;
}

/**
 * @param {string} filepath an absolute filesystem path
 * @param {{ windows?: boolean }=} options force the platform branch
 * @returns {URL} the `file:` URL
 */
function pathToFileURL(filepath, options) {
	const windows =
		options && options.windows !== undefined ? options.windows : isWindows;

	if (windows && filepath.startsWith("\\\\")) {
		// UNC path: `\\server\share\file` becomes `file://server/share/file`.
		const hostnameEndIndex = filepath.indexOf("\\", 2);
		if (hostnameEndIndex === -1) {
			throw new TypeError(
				`Missing UNC resource path in file path '${filepath}'`,
			);
		}
		if (hostnameEndIndex === 2) {
			throw new TypeError(`Empty UNC servername in file path '${filepath}'`);
		}
		const url = new URL("file://");
		url.hostname = filepath.slice(2, hostnameEndIndex);
		url.pathname = encodePathChars(
			filepath.slice(hostnameEndIndex).replace(backslashRegEx, "/"),
			windows,
		);
		return url;
	}

	const url = new URL("file://");
	url.pathname = encodePathChars(filepath, windows);
	return url;
}

module.exports = pathToFileURL;
