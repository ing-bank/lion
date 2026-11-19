export type JsonObject = import("../Resolver").JsonObject;
export type PackageMapDependencies = {
	[specifier: string]: string;
};
/**
 * A single entry of the configuration file's `packages` object.
 */
export type PackageMapPackage = {
	/**
	 * an absolute or relative `file:` URL, resolved against the configuration file
	 */
	url: string;
	/**
	 * bare specifier to package id
	 */
	dependencies?: PackageMapDependencies | undefined;
};
export type PackageMapPackages = {
	[id: string]: PackageMapPackage;
};
/**
 * The parsed contents of a package map configuration file.
 */
export type PackageMapJson = {
	/**
	 * package entries by package id
	 */
	packages: PackageMapPackages;
};
export type PackageMapEntry = {
	/**
	 * the package id this entry is keyed by
	 */
	id: string;
	/**
	 * absolute filesystem path the entry's `url` points at
	 */
	path: string;
	/**
	 * bare specifier to package id
	 */
	dependencies: Map<string, string>;
};
export type PackageMap = {
	/**
	 * entries by package id
	 */
	packages: Map<string, PackageMapEntry>;
	/**
	 * package ids by location, longest path first
	 */
	locations: {
		path: string;
		ids: string[];
	}[];
};
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
export function createError(
	message: string,
	code: string,
): Error & {
	code: string;
};
/**
 * Find the package ids whose location contains `filePath`. More than one id is
 * returned when several package entries share the same `url`, which the caller
 * has to disambiguate with an explicit package id.
 * @param {PackageMap} packageMap the package map
 * @param {string} filePath an absolute filesystem path
 * @returns {string[]} the matching package ids, empty when the path is outside every package
 */
export function findPackageIds(
	packageMap: PackageMap,
	filePath: string,
): string[];
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
export function parsePackageMap(
	data: JsonObject,
	configFilePath: string,
): PackageMap;
