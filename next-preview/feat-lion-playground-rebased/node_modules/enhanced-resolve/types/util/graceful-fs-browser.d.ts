/**
 * Takes the arguments its callers pass - `readFile(path, callback)` and the
 * rest - so the declaration describes a call that actually compiles, even
 * though every one of them throws.
 * @param {...unknown} _args arguments, ignored
 * @returns {never} always throws
 */
declare function unavailable(..._args: unknown[]): never;
export {
	unavailable as lstat,
	unavailable as lstatSync,
	unavailable as readFile,
	unavailable as readFileSync,
	unavailable as readdir,
	unavailable as readdirSync,
	unavailable as readlink,
	unavailable as readlinkSync,
	unavailable as realpath,
	unavailable as realpathSync,
	unavailable as stat,
	unavailable as statSync,
};
