declare namespace _exports {
	export {
		ResolveOptionsOptionalFS,
		CachedInputFileSystem,
		BaseFileSystem,
		CloneBasenamePlugin,
		LogInfoPlugin,
		PnpApi,
		Resolver,
		Context,
		FileSystem,
		ResolveCallback,
		ResolveContext,
		ResolveRequest,
		SyncFileSystem,
		Plugin,
		ResolveOptions,
		TsconfigPathsPlugin,
		ResolveFunctionAsync,
		ResolveFunction,
		ResolveFunctionPromise,
	};
}
declare const _exports: ResolveFunctionAsync & {
	readonly sync: ResolveFunction;
	readonly promise: ResolveFunctionPromise;
	create: typeof create & {
		readonly sync: typeof createSync;
		readonly promise: typeof createPromise;
	};
	readonly ResolverFactory: typeof import("./ResolverFactory");
	readonly CachedInputFileSystem: typeof import("./CachedInputFileSystem");
	readonly CloneBasenamePlugin: typeof import("./CloneBasenamePlugin");
	readonly LogInfoPlugin: typeof import("./LogInfoPlugin");
	readonly TsconfigPathsPlugin: typeof import("./TsconfigPathsPlugin");
	readonly forEachBail: <T, Z>(
		array: T[],
		iterator: import("./forEachBail").Iterator<T, Z>,
		callback: (err?: null | Error, result?: null | Z, i?: number) => void,
	) => void;
};
export = _exports;
type ResolveOptionsOptionalFS = Omit<ResolveOptions, "fileSystem"> &
	Partial<Pick<ResolveOptions, "fileSystem">>;
type CachedInputFileSystem = import("./CachedInputFileSystem");
type BaseFileSystem = import("./CachedInputFileSystem").BaseFileSystem;
type CloneBasenamePlugin = import("./CloneBasenamePlugin");
type LogInfoPlugin = import("./LogInfoPlugin");
type PnpApi = import("./PnpPlugin").PnpApiImpl;
type Resolver = import("./Resolver");
type Context = import("./Resolver").Context;
type FileSystem = import("./Resolver").FileSystem;
type ResolveCallback = import("./Resolver").ResolveCallback;
type ResolveContext = import("./Resolver").ResolveContext;
type ResolveRequest = import("./Resolver").ResolveRequest;
type SyncFileSystem = import("./Resolver").SyncFileSystem;
type Plugin = import("./ResolverFactory").Plugin;
type ResolveOptions = import("./ResolverFactory").UserResolveOptions;
type TsconfigPathsPlugin = import("./TsconfigPathsPlugin");
type ResolveFunctionAsync = {
	(
		context: Context,
		parent: string | URL,
		specifier: string | URL,
		resolveContext: ResolveContext,
		callback: ResolveCallback,
	): void;
	(
		context: Context,
		parent: string | URL,
		specifier: string | URL,
		callback: ResolveCallback,
	): void;
	(
		parent: string | URL,
		specifier: string | URL,
		resolveContext: ResolveContext,
		callback: ResolveCallback,
	): void;
	(
		parent: string | URL,
		specifier: string | URL,
		callback: ResolveCallback,
	): void;
};
type ResolveFunction = {
	(
		context: Context,
		parent: string | URL,
		specifier: string | URL,
		resolveContext?: ResolveContext,
	): string | false;
	(
		parent: string | URL,
		specifier: string | URL,
		resolveContext?: ResolveContext,
	): string | false;
};
type ResolveFunctionPromise = {
	(
		context: Context,
		parent: string | URL,
		specifier: string | URL,
		resolveContext?: ResolveContext,
	): Promise<string | false>;
	(
		parent: string | URL,
		specifier: string | URL,
		resolveContext?: ResolveContext,
	): Promise<string | false>;
};
/** @typedef {Omit<ResolveOptions, "fileSystem"> & Partial<Pick<ResolveOptions, "fileSystem">>} ResolveOptionsOptionalFS */
/**
 * @param {ResolveOptionsOptionalFS} options Resolver options
 * @returns {ResolveFunctionAsync} Resolver function
 */
declare function create(
	options: ResolveOptionsOptionalFS,
): ResolveFunctionAsync;
/**
 * @param {ResolveOptionsOptionalFS} options Resolver options
 * @returns {ResolveFunction} Resolver function
 */
declare function createSync(options: ResolveOptionsOptionalFS): ResolveFunction;
/**
 * @param {ResolveOptionsOptionalFS} options Resolver options
 * @returns {ResolveFunctionPromise} Resolver function
 */
declare function createPromise(
	options: ResolveOptionsOptionalFS,
): ResolveFunctionPromise;
