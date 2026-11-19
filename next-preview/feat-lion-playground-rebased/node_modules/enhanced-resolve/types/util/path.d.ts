export type CachedJoin = {
	fn: (rootPath: string, request: string) => string;
	cache: Map<string, Map<string, string | undefined>>;
};
export type CachedDirname = {
	fn: (maybePath: string) => string;
	cache: Map<string, string>;
};
export type CachedBasename = {
	fn: (maybePath: string, suffix?: string) => string;
	cache: Map<string, Map<string | undefined, string | undefined>>;
};
export type PathType = number;
/**
 * @enum {number}
 */
export const PathType: Readonly<{
	Empty: 0;
	Normal: 1;
	Relative: 2;
	AbsoluteWin: 3;
	AbsolutePosix: 4;
	Internal: 5;
}>;
/** @typedef {{ fn: (maybePath: string, suffix?: string) => string, cache: Map<string, Map<string | undefined, string | undefined>> }} CachedBasename */
/**
 * @returns {CachedBasename} cached basename
 */
export function createCachedBasename(): CachedBasename;
/** @typedef {{ fn: (maybePath: string) => string, cache: Map<string, string> }} CachedDirname */
/**
 * @returns {CachedDirname} cached dirname
 */
export function createCachedDirname(): CachedDirname;
/** @typedef {{ fn: (rootPath: string, request: string) => string, cache: Map<string, Map<string, string | undefined>> }} CachedJoin */
/**
 * @returns {CachedJoin} cached join
 */
export function createCachedJoin(): CachedJoin;
export const deprecatedInvalidSegmentRegEx: RegExp;
/**
 * @param {string} maybePath a path
 * @returns {string} the directory name
 */
export function dirname(maybePath: string): string;
/**
 * @param {string} maybePath a path
 * @returns {PathType} type of path
 */
export function getType(maybePath: string): PathType;
export const invalidSegmentRegEx: RegExp;
/**
 * Whether a string names a `file:` URL rather than a path. The scheme has to
 * open the string and be followed by a slash, as Node's own URL parser needs,
 * so a path segment spelled `file:` stays a path and `file:x.js` — which Node
 * reads as `/x.js` — stays the relative request it looks like.
 * @param {string} maybePath a path or a `file:` URL string
 * @returns {boolean} true when the string is a `file:` URL
 */
export function isFileURL(maybePath: string): boolean;
/**
 * Whether childPath is parentPath itself or a path under it, the answer node's
 * `relative(parentPath, childPath)` gives: not escaping upward and not
 * absolute. A trailing separator on the parent is not part of the boundary, so
 * `/a/b/` contains exactly what `/a/b` contains.
 * @param {string} parentPath parent directory path
 * @param {string} childPath child path to check
 * @returns {boolean} true if childPath is parentPath or is under it
 */
export function isInside(parentPath: string, childPath: string): boolean;
/**
 * Whether `request` is a relative request — i.e. matches `^\.\.?(?:\/|$)`.
 *
 * This is called on every `doResolve` via `UnsafeCachePlugin` and
 * `getInnerRequest`, so the char-code form is meaningfully faster than the
 * equivalent regex test: no regex state machine, no string object churn.
 * @param {string} request request string
 * @returns {boolean} true if request is relative
 */
export function isRelativeRequest(request: string): boolean;
/**
 * Check if childPath is a subdirectory of parentPath. Compares like `isInside`,
 * except that a path is not a subpath of itself.
 *
 * Called from `TsconfigPathsPlugin._selectPathsDataForContext` inside a loop
 * over every tsconfig-paths context on every resolve, so it's worth keeping
 * cheap: a native `startsWith` plus a separator char check answers it, and the
 * character loop only runs for a Windows path that the prefix test missed.
 * @param {string} parentPath parent directory path
 * @param {string} childPath child path to check
 * @returns {boolean} true if childPath is under parentPath
 */
export function isSubPath(parentPath: string, childPath: string): boolean;
/**
 * Whether this is a Windows path, in which `/` and `\` are interchangeable and
 * paths compare case-insensitively, as opposed to a posix path, in which `\` is
 * an ordinary filename character. Decided by the root — a drive letter or a
 * leading `\` — which is where `path.win32` and `path.posix` disagree about
 * `parse(maybePath).root`, and never by the host platform, since Windows paths
 * are resolved on posix hosts and in browsers too. A path starting with `//`
 * stays posix: `path.win32` reads it as a UNC root, but here it cannot be told
 * apart from a posix path, where `\` has to keep being a filename character.
 * @param {string} maybePath a path
 * @returns {boolean} true, when the path is a Windows path
 */
export function isWindowsPath(maybePath: string): boolean;
/**
 * @param {string} rootPath the root path
 * @param {string | undefined} request the request path
 * @returns {string} the joined path
 */
export function join(rootPath: string, request: string | undefined): string;
/**
 * @param {string} maybePath a path
 * @returns {string} the normalized path
 */
export function normalize(maybePath: string): string;
/**
 * Convert a `file:` URL — a `URL` instance or a `file:/` string, the form
 * `import.meta.resolve` returns — to the path it names. Anything else is
 * returned unchanged, so a path passes through.
 * @param {string | URL} maybeURL a path, a `file:` URL string or a `file:` `URL` instance
 * @returns {string} a filesystem path
 */
export function toPath(maybeURL: string | URL): string;
