export = PackageMapPlugin;
declare class PackageMapPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {PackageMapOptions} options package map options
	 * @param {boolean} symlinks whether the resolver resolves symlinks
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		options: PackageMapOptions,
		symlinks: boolean,
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	options: PackageMapOptions;
	symlinks: boolean;
	target: string | import("./Resolver").ResolveStepHook;
	/** @type {PackageMap | undefined} */
	_packageMap: PackageMap | undefined;
	/** @type {PackageMapCallback[] | undefined} */
	_pending: PackageMapCallback[] | undefined;
	/**
	 * Read and parse the configuration file once, queueing every request that
	 * arrives while the read is in flight so a cold start does not re-read the
	 * same file for each of them.
	 * @param {Resolver} resolver the resolver
	 * @param {ResolveContext} resolveContext resolve context
	 * @param {PackageMapCallback} callback callback
	 * @returns {void}
	 */
	_getPackageMap(
		resolver: Resolver,
		resolveContext: ResolveContext,
		callback: PackageMapCallback,
	): void;
	/**
	 * Hand back the configuration file path package locations resolve against:
	 * its real path when the resolver follows symlinks, and the path as given
	 * otherwise. A configuration file whose real path cannot be read (it may not
	 * exist, or the file system may not implement it) is used as-is, so the
	 * read below reports the problem.
	 * @param {Resolver} resolver the resolver
	 * @param {(configFile: string) => void} callback callback
	 * @returns {void}
	 */
	_resolveConfigFile(
		resolver: Resolver,
		callback: (configFile: string) => void,
	): void;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace PackageMapPlugin {
	export {
		Resolver,
		ResolveContext,
		ResolveRequest,
		ResolveStepHook,
		PackageMap,
		PackageMapPackages,
		PackageMapOptions,
		PackageMapCallback,
	};
}
type Resolver = import("./Resolver");
type ResolveContext = import("./Resolver").ResolveContext;
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
type PackageMap = import("./util/packageMap").PackageMap;
type PackageMapPackages = import("./util/packageMap").PackageMapPackages;
type PackageMapOptions = {
	/**
	 * absolute path of the configuration file, read lazily when `packages` is not given
	 */
	configFile: string;
	/**
	 * an already-parsed `packages` object, used instead of reading `configFile`
	 */
	packages: PackageMapPackages | null;
};
type PackageMapCallback = (err: Error | null, packageMap?: PackageMap) => void;
