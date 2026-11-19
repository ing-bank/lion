/**
 * Posix `basename` — the browser is treated as a posix platform, matching how
 * Node picks the posix variant for `path.basename` on non-Windows systems.
 * @param {string} path path
 * @param {string=} suffix optional suffix to strip
 * @returns {string} basename
 */
export function basename(path: string, suffix?: string | undefined): string;
/**
 * @param {string} path path
 * @returns {string} normalized posix path
 */
declare function posixNormalize(path: string): string;
/**
 * @param {string} path path
 * @returns {string} posix dirname
 */
declare function posixDirname(path: string): string;
/**
 * Normalizes drive paths (`C:\…`), UNC paths (`\\server\share\…`), DOS device
 * paths (`\\.\…`, `\\?\…`) and relative/normal segments like Node's
 * `path.win32.normalize`, including the CVE-2024-36139 colon-segment guard.
 *
 * Scope note: reserved Windows device names (`CON`, `COM1`, `LPT1`, …) are not
 * special-cased, so e.g. `\\.\COM1:` differs from Node. Such names cannot occur
 * in a browser (the only place this shim is used) and the resolver never routes
 * them to `win32.normalize`, so this does not affect resolution.
 * @param {string} path path
 * @returns {string} normalized win32 path
 */
declare function win32Normalize(path: string): string;
/**
 * @param {string} path path
 * @returns {string} win32 dirname
 */
declare function win32Dirname(path: string): string;
export declare namespace posix {
	export { posixNormalize as normalize };
	export { posixDirname as dirname };
}
export declare namespace win32 {
	export { win32Normalize as normalize };
	export { win32Dirname as dirname };
}
export {};
