export = LogInfoPlugin;
declare class LogInfoPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 */
	constructor(source: string | ResolveStepHook);
	source: string | import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace LogInfoPlugin {
	export { Resolver, ResolveStepHook };
}
type Resolver = import("./Resolver");
type ResolveStepHook = import("./Resolver").ResolveStepHook;
