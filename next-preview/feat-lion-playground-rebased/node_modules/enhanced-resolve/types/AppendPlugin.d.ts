export = AppendPlugin;
declare class AppendPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string} appending appending
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		appending: string,
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	appending: string;
	target: string | import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace AppendPlugin {
	export { Resolver, ResolveRequest, ResolveStepHook };
}
type Resolver = import("./Resolver");
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
