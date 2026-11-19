export type Resolver = import("./Resolver");
export type JsonObject = import("./Resolver").JsonObject;
export type JsonValue = import("./Resolver").JsonValue;
export type ResolveContext = import("./Resolver").ResolveContext;
export type ResolveRequest = import("./Resolver").ResolveRequest;
export type DescriptionFileInfo = {
	/**
	 * content
	 */
	content?: JsonObject | undefined;
	/**
	 * path
	 */
	path: string;
	/**
	 * directory
	 */
	directory: string;
};
export type ErrorFirstCallback = (
	error?: (Error | null) | undefined,
	result?: DescriptionFileInfo | undefined,
) => any;
export type Result = {
	/**
	 * path to description file
	 */
	path: string;
	/**
	 * directory of description file
	 */
	directory: string;
	/**
	 * content of description file
	 */
	content: JsonObject;
};
/**
 * Walk up one directory. Called once per package-root candidate and once per
 * `described-resolve` (to find the enclosing description file), so it's on
 * the resolver's hot path.
 *
 * Previous implementation called `lastIndexOf("/")` and `lastIndexOf("\\")`
 * separately and then picked the larger. For any non-trivial directory
 * string on POSIX, `lastIndexOf("\\")` scans the full string just to return
 * -1. A single reverse char-code scan does the same work in one pass.
 *
 * Any single-character directory is treated as a root — `directory.length
 * <= 1` collapses the `"/"`, `"\\"` and `""` branches into one compare.
 * Without the `"\\"` case, `cdUp("\\")` (reached from a UNC root or a DOS
 * device path like `\\?\…`) would return itself via `slice(0, i || 1)`
 * and trap `loadDescriptionFile` in an infinite loop. Once single-char
 * roots are filtered up front, the reverse scan always produces a
 * strictly shorter string.
 * @param {string} directory directory
 * @returns {string | null} parent directory or null
 */
export function cdUp(directory: string): string | null;
/**
 * @param {JsonObject} content content
 * @param {string | string[]} field field
 * @returns {JsonValue | undefined} field data
 */
export function getField(
	content: JsonObject,
	field: string | string[],
): JsonValue | undefined;
/**
 * @param {Resolver} resolver resolver
 * @param {string} directory directory
 * @param {string[]} filenames filenames
 * @param {DescriptionFileInfo | undefined} oldInfo oldInfo
 * @param {ResolveContext} resolveContext resolveContext
 * @param {ErrorFirstCallback} callback callback
 */
export function loadDescriptionFile(
	resolver: Resolver,
	directory: string,
	filenames: string[],
	oldInfo: DescriptionFileInfo | undefined,
	resolveContext: ResolveContext,
	callback: ErrorFirstCallback,
): void;
