export = getPaths;
/** @typedef {import("./Resolver").FileSystem} FileSystem */
/** @typedef {{ paths: string[], segments: string[] }} GetPathsResult */
/**
 * Walk `path` from tip to root, returning every ancestor directory (plus the
 * input itself) in `paths`, and each corresponding segment name in `segments`.
 *
 * The return value may be shared across callers via `getPathsCached` — treat
 * it as read-only. Callers that need to mutate (currently only
 * `SymlinkPlugin`) should `slice()` the arrays locally before writing.
 * @param {string} path path
 * @returns {GetPathsResult} paths and segments
 */
declare function getPaths(path: string): GetPathsResult;
declare namespace getPaths {
	export { getPathsCached, FileSystem, GetPathsResult };
}
/**
 * Memoized `getPaths`. The returned object is shared across callers — do
 * not mutate the `paths` or `segments` arrays in-place; `slice()` first if
 * you need a mutable copy.
 * @param {FileSystem} fileSystem filesystem used as the cache namespace
 * @param {string} path path
 * @returns {GetPathsResult} paths and segments
 */
declare function getPathsCached(
	fileSystem: FileSystem,
	path: string,
): GetPathsResult;
type FileSystem = import("./Resolver").FileSystem;
type GetPathsResult = {
	paths: string[];
	segments: string[];
};
