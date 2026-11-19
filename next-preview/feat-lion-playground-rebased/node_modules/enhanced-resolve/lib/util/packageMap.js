/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

// Node.js package maps: https://nodejs.org/api/packages.html#package-maps
//
// A package map is a static table that maps bare specifiers to package
// locations per importing package, so resolution never has to walk
// `node_modules`. This module turns the configuration file into the lookup
// tables `PackageMapPlugin` needs; no file system access is involved beyond
// reading the file itself.
//
// @experimental Package maps are stability 1 (experimental) in Node.js and are
// only reachable there behind `--experimental-package-map`. This parser tracks
// that specification and may change with it, including in a patch release.

const fileURLToPath = require("./fileURLToPath");
const { isInside, normalize } = require("./path");
const pathToFileURL = require("./pathToFileURL");

/** @typedef {import("../Resolver").JsonObject} JsonObject */

/** @typedef {{ [specifier: string]: string }} PackageMapDependencies */

/**
 * A single entry of the configuration file's `packages` object.
 * @typedef {object} PackageMapPackage
 * @property {string} url an absolute or relative `file:` URL, resolved against the configuration file
 * @property {PackageMapDependencies=} dependencies bare specifier to package id
 */

/** @typedef {{ [id: string]: PackageMapPackage }} PackageMapPackages */

/**
 * The parsed contents of a package map configuration file.
 * @typedef {object} PackageMapJson
 * @property {PackageMapPackages} packages package entries by package id
 */

/**
 * @typedef {object} PackageMapEntry
 * @property {string} id the package id this entry is keyed by
 * @property {string} path absolute filesystem path the entry's `url` points at
 * @property {Map<string, string>} dependencies bare specifier to package id
 */

/**
 * @typedef {object} PackageMap
 * @property {Map<string, PackageMapEntry>} packages entries by package id
 * @property {{ path: string, ids: string[] }[]} locations package ids by location, longest path first
 */

/**
 * @param {string} message message
 * @param {string} code error code
 * @returns {Error & { code: string }} the error
 */
function createError(message, code) {
	const error = /** @type {Error & { code: string }} */ (new Error(message));
	error.code = code;
	return error;
}

/**
 * Resolve an entry's `url` the way Node does: through the WHATWG `URL` parser
 * with the configuration file as the base, accepting only `file:`.
 * @param {string} url the entry's `url` value
 * @param {URL} base the configuration file URL
 * @param {string} id the package id, for error messages
 * @returns {string} the absolute filesystem path
 */
function toPackagePath(url, base, id) {
	let parsed;
	try {
		parsed = new URL(url, base);
	} catch (_err) {
		throw createError(
			`Package map entry "${id}" has an invalid "url": ${url}`,
			"ERR_INVALID_PACKAGE_MAP",
		);
	}
	if (parsed.protocol !== "file:") {
		throw createError(
			`Package map entry "${id}" must use a "file:" url, received: ${url}`,
			"ERR_INVALID_PACKAGE_MAP",
		);
	}
	return normalize(fileURLToPath(parsed));
}

/**
 * Parse and validate a package map configuration file.
 *
 * Dangling dependency targets are rejected here rather than at resolution
 * time: the map is static, so a broken table is a configuration error that is
 * better surfaced once and in full.
 * @param {JsonObject} data the parsed configuration file contents
 * @param {string} configFilePath absolute path of the configuration file, used as the base for relative urls
 * @returns {PackageMap} the parsed package map
 */
function parsePackageMap(data, configFilePath) {
	if (!data || typeof data !== "object" || Array.isArray(data)) {
		throw createError(
			`Package map "${configFilePath}" must contain a JSON object`,
			"ERR_INVALID_PACKAGE_MAP",
		);
	}

	const rawPackages = data.packages;

	if (
		!rawPackages ||
		typeof rawPackages !== "object" ||
		Array.isArray(rawPackages)
	) {
		throw createError(
			`Package map "${configFilePath}" must contain a "packages" object`,
			"ERR_INVALID_PACKAGE_MAP",
		);
	}

	const base = pathToFileURL(configFilePath);
	/** @type {Map<string, PackageMapEntry>} */
	const packages = new Map();
	/** @type {Map<string, string[]>} */
	const idsByPath = new Map();

	for (const id of Object.keys(rawPackages)) {
		const rawEntry = /** @type {JsonObject} */ (rawPackages[id]);

		if (!rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry)) {
			throw createError(
				`Package map entry "${id}" must be an object`,
				"ERR_INVALID_PACKAGE_MAP",
			);
		}
		// An empty `url` would resolve to the configuration file itself rather
		// than to a package directory, so reject it like Node does.
		if (typeof rawEntry.url !== "string" || rawEntry.url === "") {
			throw createError(
				`Package map entry "${id}" must have a non-empty string "url"`,
				"ERR_INVALID_PACKAGE_MAP",
			);
		}

		const packagePath = toPackagePath(rawEntry.url, base, id);
		/** @type {Map<string, string>} */
		const dependencies = new Map();
		const rawDependencies = rawEntry.dependencies;

		if (rawDependencies !== undefined) {
			if (
				!rawDependencies ||
				typeof rawDependencies !== "object" ||
				Array.isArray(rawDependencies)
			) {
				throw createError(
					`Package map entry "${id}" has a non-object "dependencies"`,
					"ERR_INVALID_PACKAGE_MAP",
				);
			}
			for (const specifier of Object.keys(rawDependencies)) {
				const target = rawDependencies[specifier];

				if (typeof target !== "string") {
					throw createError(
						`Package map entry "${id}" maps "${specifier}" to a non-string package id`,
						"ERR_INVALID_PACKAGE_MAP",
					);
				}
				dependencies.set(specifier, target);
			}
		}

		packages.set(id, { id, path: packagePath, dependencies });

		const ids = idsByPath.get(packagePath);
		if (ids) {
			ids.push(id);
		} else {
			idsByPath.set(packagePath, [id]);
		}
	}

	for (const entry of packages.values()) {
		for (const [specifier, target] of entry.dependencies) {
			if (!packages.has(target)) {
				throw createError(
					`Package map entry "${entry.id}" maps "${specifier}" to unknown package id "${target}"`,
					"ERR_INVALID_PACKAGE_MAP",
				);
			}
		}
	}

	// Longest path first so a package nested inside another one wins the
	// containment lookup below.
	const locations = [...idsByPath]
		.map(([path, ids]) => ({ path, ids }))
		.sort((a, b) => b.path.length - a.path.length);

	return { packages, locations };
}

/**
 * Find the package ids whose location contains `filePath`. More than one id is
 * returned when several package entries share the same `url`, which the caller
 * has to disambiguate with an explicit package id.
 * @param {PackageMap} packageMap the package map
 * @param {string} filePath an absolute filesystem path
 * @returns {string[]} the matching package ids, empty when the path is outside every package
 */
function findPackageIds(packageMap, filePath) {
	for (const location of packageMap.locations) {
		if (isInside(location.path, filePath)) return location.ids;
	}
	return [];
}

module.exports.createError = createError;
module.exports.findPackageIds = findPackageIds;
module.exports.parsePackageMap = parsePackageMap;
