export = ResultPlugin;
declare class ResultPlugin {
	/**
	 * @param {ResolveStepHook} source source
	 */
	constructor(source: ResolveStepHook);
	source: import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace ResultPlugin {
	export { Resolver, ResolveStepHook };
}
type Resolver = import("./Resolver");
type ResolveStepHook = import("./Resolver").ResolveStepHook;
