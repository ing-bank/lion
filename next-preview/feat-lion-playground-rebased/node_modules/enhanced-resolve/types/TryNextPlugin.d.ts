export = TryNextPlugin;
declare class TryNextPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string} message message
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		message: string,
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	message: string;
	target: string | import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace TryNextPlugin {
	export { Resolver, ResolveStepHook };
}
type Resolver = import("./Resolver");
type ResolveStepHook = import("./Resolver").ResolveStepHook;
