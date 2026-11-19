export function createResolver(options: UserResolveOptions): Resolver;
export type AliasOptionEntry = import("./AliasPlugin").AliasOption;
export type ExtensionAliasOption =
	import("./ExtensionAliasPlugin").ExtensionAliasOption;
export type PackageMapOptions = import("./PackageMapPlugin").PackageMapOptions;
export type PackageMapPackages = import("./util/packageMap").PackageMapPackages;
export type PnpApi = import("./PnpPlugin").PnpApiImpl;
export type EnsuredHooks = import("./Resolver").EnsuredHooks;
export type FileSystem = import("./Resolver").FileSystem;
export type KnownHooks = import("./Resolver").KnownHooks;
export type ResolveRequest = import("./Resolver").ResolveRequest;
export type SyncFileSystem = import("./Resolver").SyncFileSystem;
export type Cache = import("./UnsafeCachePlugin").Cache;
export type AliasOptionNewRequest = string | string[] | false;
export type AliasOptions = {
	[k: string]: AliasOptionNewRequest;
};
export type UserAliasOptionNewRequest = string | URL | (string | URL)[] | false;
export type UserAliasOptions = {
	[k: string]: UserAliasOptionNewRequest;
};
export type UserAliasOptionEntry = {
	alias: UserAliasOptionNewRequest;
	name: string;
	onlyModule?: boolean;
};
export type ExtensionAliasOptions = {
	[k: string]: string | string[];
};
export type Falsy = false | 0 | "" | null | undefined;
export type Plugin =
	| {
			apply: (resolver: Resolver) => void;
	  }
	| ((this: Resolver, resolver: Resolver) => void)
	| Falsy;
export type TsconfigOptions = {
	/**
	 * A relative path to the tsconfig file based on cwd, or an absolute path of tsconfig file
	 */
	configFile?: string | undefined;
	/**
	 * References to other tsconfig files. 'auto' inherits from TypeScript config, or an array of relative/absolute paths
	 */
	references?: (string[] | "auto") | undefined;
	/**
	 * Override baseUrl from tsconfig.json. If provided, this value will be used instead of the baseUrl in the tsconfig file
	 */
	baseUrl?: string | undefined;
};
export type UserTsconfigOptions = {
	/**
	 * A path, or `file:` URL, pointing at the tsconfig file
	 */
	configFile?: (string | URL) | undefined;
	/**
	 * References to other tsconfig files. 'auto' inherits from TypeScript config, or an array of relative/absolute paths or `file:` URLs
	 */
	references?: ((string | URL)[] | "auto") | undefined;
	/**
	 * Override baseUrl from tsconfig.json with a path or `file:` URL
	 */
	baseUrl?: (string | URL) | undefined;
};
/**
 * A Node.js package map (https://nodejs.org/api/packages.html#package-maps),
 * either as the path of the configuration file or as its already-parsed
 * contents.
 */
export type UserPackageMapOptions = {
	/**
	 * A path, or `file:` `URL` instance, pointing at the package map file. Required together with `packages`, whose relative `url` values are resolved against it
	 */
	configFile?: (string | URL) | undefined;
	/**
	 * An already-parsed `packages` object, used instead of reading `configFile` from disk
	 */
	packages?: PackageMapPackages | undefined;
};
export type UserResolveOptions = {
	/**
	 * A list of module alias configurations or an object which maps key to value
	 */
	alias?: (UserAliasOptions | UserAliasOptionEntry[]) | undefined;
	/**
	 * A list of module alias configurations or an object which maps key to value, applied only after modules option
	 */
	fallback?: (UserAliasOptions | UserAliasOptionEntry[]) | undefined;
	/**
	 * An object which maps extension to extension aliases
	 */
	extensionAlias?: ExtensionAliasOptions | undefined;
	/**
	 * Also apply `extensionAlias` to paths resolved through the package.json `exports` field. Off by default (Node.js-aligned); when enabled, matches TypeScript's behavior for packages that ship TS sources alongside compiled JS.
	 */
	extensionAliasForExports?: boolean | undefined;
	/**
	 * A list of alias fields in description files
	 */
	aliasFields?: (string | string[])[] | undefined;
	/**
	 * A function which decides whether a request should be cached or not. An object is passed with at least `path` and `request` properties.
	 */
	cachePredicate?: ((predicate: ResolveRequest) => boolean) | undefined;
	/**
	 * Whether or not the unsafeCache should include request context as part of the cache key.
	 */
	cacheWithContext?: boolean | undefined;
	/**
	 * A list of description files to read from
	 */
	descriptionFiles?: string[] | undefined;
	/**
	 * A list of exports field condition names.
	 */
	conditionNames?: string[] | undefined;
	/**
	 * Enforce that a extension from extensions must be used
	 */
	enforceExtension?: boolean | undefined;
	/**
	 * A list of exports fields in description files
	 */
	exportsFields?: (string | string[])[] | undefined;
	/**
	 * A list of imports fields in description files
	 */
	importsFields?: (string | string[])[] | undefined;
	/**
	 * A list of extensions which should be tried for files
	 */
	extensions?: string[] | undefined;
	/**
	 * The file system which should be used
	 */
	fileSystem: FileSystem;
	/**
	 * Use this cache object to unsafely cache the successful requests
	 */
	unsafeCache?: (Cache | boolean) | undefined;
	/**
	 * Resolve symlinks to their symlinked location
	 */
	symlinks?: boolean | undefined;
	/**
	 * A prepared Resolver to which the plugins are attached
	 */
	resolver?: Resolver | undefined;
	/**
	 * A list of directories to resolve modules from, can be absolute path, folder name, or a `file:` URL
	 */
	modules?: ((string | URL)[] | string | URL) | undefined;
	/**
	 * A list of main fields in description files
	 */
	mainFields?:
		| (
				| string
				| string[]
				| {
						name: string | string[];
						forceRelative: boolean;
				  }
		  )[]
		| undefined;
	/**
	 * A list of main files in directories
	 */
	mainFiles?: string[] | undefined;
	/**
	 * A list of additional resolve plugins which should be applied
	 */
	plugins?: Plugin[] | undefined;
	/**
	 * A Node.js package map file path (or `file:` `URL` instance), or an object with the already-parsed `packages`. When set, bare specifiers resolve through the map instead of `node_modules` (`@experimental`)
	 */
	packageMap?: (string | URL | UserPackageMapOptions) | undefined;
	/**
	 * A PnP API that should be used - null is "never", undefined is "auto"
	 */
	pnpApi?: (PnpApi | null) | undefined;
	/**
	 * A list of root paths, each an absolute path or a `file:` URL
	 */
	roots?: (string | URL)[] | undefined;
	/**
	 * The request is already fully specified and no extensions or directories are resolved for it
	 */
	fullySpecified?: boolean | undefined;
	/**
	 * Resolve to a context instead of a file
	 */
	resolveToContext?: boolean | undefined;
	/**
	 * A list of resolve restrictions, each an absolute path, a `file:` URL, or a RegExp
	 */
	restrictions?: (string | URL | RegExp)[] | undefined;
	/**
	 * Use only the sync constraints of the file system calls
	 */
	useSyncFileSystemCalls?: boolean | undefined;
	/**
	 * Prefer to resolve module requests as relative requests before falling back to modules
	 */
	preferRelative?: boolean | undefined;
	/**
	 * Prefer to resolve server-relative urls as absolute paths before falling back to resolve in roots
	 */
	preferAbsolute?: boolean | undefined;
	/**
	 * TypeScript config file path (or `file:` URL) or config object with configFile and references
	 */
	tsconfig?: (string | URL | boolean | UserTsconfigOptions) | undefined;
};
export type ResolveOptions = {
	/**
	 * alias
	 */
	alias: AliasOptionEntry[];
	/**
	 * fallback
	 */
	fallback: AliasOptionEntry[];
	/**
	 * alias fields
	 */
	aliasFields: Set<string | string[]>;
	/**
	 * extension alias
	 */
	extensionAlias: ExtensionAliasOption[];
	/**
	 * apply extension alias to exports field targets
	 */
	extensionAliasForExports: boolean;
	/**
	 * cache predicate
	 */
	cachePredicate: (predicate: ResolveRequest) => boolean;
	/**
	 * cache with context
	 */
	cacheWithContext: boolean;
	/**
	 * A list of exports field condition names.
	 */
	conditionNames: Set<string>;
	/**
	 * description files
	 */
	descriptionFiles: string[];
	/**
	 * enforce extension
	 */
	enforceExtension: boolean;
	/**
	 * exports fields
	 */
	exportsFields: Set<string | string[]>;
	/**
	 * imports fields
	 */
	importsFields: Set<string | string[]>;
	/**
	 * extensions
	 */
	extensions: Set<string>;
	/**
	 * fileSystem
	 */
	fileSystem: FileSystem;
	/**
	 * unsafe cache
	 */
	unsafeCache: Cache | false;
	/**
	 * symlinks
	 */
	symlinks: boolean;
	/**
	 * resolver
	 */
	resolver?: Resolver | undefined;
	/**
	 * modules
	 */
	modules: (string | string[])[];
	/**
	 * main fields
	 */
	mainFields: {
		name: string[];
		forceRelative: boolean;
	}[];
	/**
	 * main files
	 */
	mainFiles: Set<string>;
	/**
	 * plugins
	 */
	plugins: Plugin[];
	/**
	 * package map
	 */
	packageMap: PackageMapOptions | null;
	/**
	 * pnp API
	 */
	pnpApi: PnpApi | null;
	/**
	 * roots
	 */
	roots: Set<string>;
	/**
	 * fully specified
	 */
	fullySpecified: boolean;
	/**
	 * resolve to context
	 */
	resolveToContext: boolean;
	/**
	 * restrictions
	 */
	restrictions: Set<string | RegExp>;
	/**
	 * prefer relative
	 */
	preferRelative: boolean;
	/**
	 * prefer absolute
	 */
	preferAbsolute: boolean;
	/**
	 * tsconfig file path or config object
	 */
	tsconfig: string | boolean | TsconfigOptions;
};
import Resolver = require("./Resolver");
