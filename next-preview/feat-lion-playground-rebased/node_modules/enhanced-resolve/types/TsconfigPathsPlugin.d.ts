export = TsconfigPathsPlugin;
declare class TsconfigPathsPlugin {
	/**
	 * @param {true | string | TsconfigOptions} configFileOrOptions tsconfig file path or options object
	 */
	constructor(configFileOrOptions: true | string | TsconfigOptions);
	/** @type {boolean} */
	isAutoConfigFile: boolean;
	/** @type {string} */
	configFile: string;
	/** @type {TsconfigReference[] | "auto"} */
	references: TsconfigReference[] | "auto";
	/** @type {string | undefined} */
	baseUrl: string | undefined;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
	/**
	 * Get TsconfigPathsMap for the request (with caching)
	 * @param {Resolver} resolver the resolver
	 * @param {ResolveRequest} request the request
	 * @param {ResolveContext} resolveContext the resolve context
	 * @param {(err: Error | null, result?: TsconfigPathsMap | null) => void} callback the callback
	 * @returns {void}
	 */
	_getTsconfigPathsMap(
		resolver: Resolver,
		request: ResolveRequest,
		resolveContext: ResolveContext,
		callback: (err: Error | null, result?: TsconfigPathsMap | null) => void,
	): void;
	/**
	 * Walk up from startDir to the filesystem root looking for tsconfig.json.
	 * Like TypeScript's own `findConfigFile` / `forEachAncestorDirectory`.
	 * @param {Resolver} resolver the resolver
	 * @param {string} startDir the directory to start searching from
	 * @param {(err: Error | null, result?: TsconfigPathsMap | null) => void} callback the callback
	 * @returns {void}
	 */
	_findTsconfigUpward(
		resolver: Resolver,
		startDir: string,
		callback: (err: Error | null, result?: TsconfigPathsMap | null) => void,
	): void;
	/**
	 * Load tsconfig.json and build complete TsconfigPathsMap
	 * Includes main project paths and all referenced projects
	 * @param {Resolver} resolver the resolver
	 * @param {string} absTsconfigPath absolute path to tsconfig.json
	 * @param {(err: Error | null, result?: TsconfigPathsMap) => void} callback the callback
	 * @returns {void}
	 */
	_loadTsconfigPathsMap(
		resolver: Resolver,
		absTsconfigPath: string,
		callback: (err: Error | null, result?: TsconfigPathsMap) => void,
	): void;
	/**
	 * Select the correct TsconfigPathsData based on request.path (context-aware)
	 * Matches the behavior of tsconfig-paths-webpack-plugin
	 * @param {string | false} requestPath the request path
	 * @param {TsconfigPathsMap} tsconfigPathsMap the tsconfig paths map
	 * @returns {TsconfigPathsData | null} the selected paths data
	 */
	_selectPathsDataForContext(
		requestPath: string | false,
		tsconfigPathsMap: TsconfigPathsMap,
	): TsconfigPathsData | null;
	/**
	 * Load tsconfig from extends path
	 * @param {Resolver} resolver the resolver
	 * @param {string} configFilePath current config file path
	 * @param {string} extendedConfigValue extends value
	 * @param {Set<string>} fileDependencies the file dependencies
	 * @param {Set<string>} visitedConfigPaths config paths being loaded (for circular extends detection)
	 * @param {(err: Error | null, result?: Tsconfig) => void} callback callback
	 * @returns {void}
	 */
	_loadTsconfigFromExtends(
		resolver: Resolver,
		configFilePath: string,
		extendedConfigValue: string,
		fileDependencies: Set<string>,
		visitedConfigPaths: Set<string>,
		callback: (err: Error | null, result?: Tsconfig) => void,
	): void;
	/**
	 * Walk up from startDir looking for `<dir>/<subPath>` (a
	 * `node_modules/...` sub-path), matching Node.js module resolution so a
	 * package hoisted to a parent workspace's node_modules is found.
	 * @param {Resolver} resolver the resolver
	 * @param {string} startDir directory to start searching from
	 * @param {string} subPath node_modules-relative sub-path to look for
	 * @param {(found: string | null) => void} callback receives the found path or null
	 * @returns {void}
	 */
	_findExtendsInNodeModules(
		resolver: Resolver,
		startDir: string,
		subPath: string,
		callback: (found: string | null) => void,
	): void;
	/**
	 * Load referenced tsconfig projects and store in referenceMatchMap
	 * Simple implementation matching tsconfig-paths-webpack-plugin:
	 * Just load each reference and store independently
	 * @param {Resolver} resolver the resolver
	 * @param {string} context the context
	 * @param {TsconfigReference[]} references array of references
	 * @param {Set<string>} fileDependencies the file dependencies
	 * @param {{ [baseUrl: string]: TsconfigPathsData }} referenceMatchMap the map to populate
	 * @param {(err: Error | null) => void} callback callback
	 * @param {Set<string>=} visitedRefPaths visited reference config paths (for circular reference detection)
	 * @returns {void}
	 */
	_loadTsconfigReferences(
		resolver: Resolver,
		context: string,
		references: TsconfigReference[],
		fileDependencies: Set<string>,
		referenceMatchMap: {
			[baseUrl: string]: TsconfigPathsData;
		},
		callback: (err: Error | null) => void,
		visitedRefPaths?: Set<string> | undefined,
	): void;
	/**
	 * Load tsconfig.json with extends support
	 * @param {Resolver} resolver the resolver
	 * @param {string} configFilePath absolute path to tsconfig.json
	 * @param {Set<string>} fileDependencies the file dependencies
	 * @param {Set<string> | undefined} visitedConfigPaths config paths being loaded (for circular extends detection)
	 * @param {(err: Error | null, result?: Tsconfig) => void} callback callback
	 * @returns {void}
	 */
	_loadTsconfig(
		resolver: Resolver,
		configFilePath: string,
		fileDependencies: Set<string>,
		visitedConfigPaths: Set<string> | undefined,
		callback: (err: Error | null, result?: Tsconfig) => void,
	): void;
}
declare namespace TsconfigPathsPlugin {
	export {
		Resolver,
		ResolveStepHook,
		AliasOption,
		ResolveRequest,
		ResolveContext,
		FileSystem,
		TsconfigPathsData,
		TsconfigPathsMap,
		TsconfigOptions,
		TsconfigCompilerOptions,
		TsconfigReference,
		Tsconfig,
	};
}
type Resolver = import("./Resolver");
type ResolveStepHook = import("./Resolver").ResolveStepHook;
type AliasOption = import("./AliasUtils").AliasOption;
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveContext = import("./Resolver").ResolveContext;
type FileSystem = import("./Resolver").FileSystem;
type TsconfigPathsData = import("./Resolver").TsconfigPathsData;
type TsconfigPathsMap = import("./Resolver").TsconfigPathsMap;
type TsconfigOptions = import("./ResolverFactory").TsconfigOptions;
type TsconfigCompilerOptions = {
	/**
	 * Base URL for resolving paths
	 */
	baseUrl?: string | undefined;
	/**
	 * TypeScript paths mapping
	 */
	paths?:
		| {
				[key: string]: string[];
		  }
		| undefined;
};
type TsconfigReference = {
	/**
	 * Path to the referenced project
	 */
	path: string;
};
type Tsconfig = {
	/**
	 * Compiler options
	 */
	compilerOptions?: TsconfigCompilerOptions | undefined;
	/**
	 * Extended configuration paths
	 */
	extends?: (string | string[]) | undefined;
	/**
	 * Project references
	 */
	references?: TsconfigReference[] | undefined;
};
