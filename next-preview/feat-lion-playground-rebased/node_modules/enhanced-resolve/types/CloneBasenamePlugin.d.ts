export = CloneBasenamePlugin;
declare class CloneBasenamePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	target: string | import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace CloneBasenamePlugin {
	export { Resolver, ResolveRequest, ResolveStepHook };
}
type Resolver = import("./Resolver");
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
