export = UnsafeCachePlugin;
declare class UnsafeCachePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {(request: ResolveRequest) => boolean} filterPredicate filterPredicate
	 * @param {Cache} cache cache
	 * @param {boolean} withContext withContext
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		filterPredicate: (request: ResolveRequest) => boolean,
		cache: Cache,
		withContext: boolean,
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	filterPredicate: (request: ResolveRequest) => boolean;
	withContext: boolean;
	cache: Cache;
	target: string | import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace UnsafeCachePlugin {
	export {
		Resolver,
		ResolveRequest,
		ResolveStepHook,
		ResolveContextYield,
		Cache,
	};
}
type Resolver = import("./Resolver");
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
type ResolveContextYield = import("./Resolver").ResolveContextYield;
type Cache = {
	[k: string]: undefined | ResolveRequest | ResolveRequest[];
};
