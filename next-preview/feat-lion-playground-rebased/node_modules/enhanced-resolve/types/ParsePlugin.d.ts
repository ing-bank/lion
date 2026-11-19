export = ParsePlugin;
declare class ParsePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {Partial<ResolveRequest>} requestOptions request options
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		requestOptions: Partial<ResolveRequest>,
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	requestOptions: Partial<import("./Resolver").ResolveRequest>;
	target: string | import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace ParsePlugin {
	export { Resolver, ResolveRequest, ResolveStepHook };
}
type Resolver = import("./Resolver");
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
