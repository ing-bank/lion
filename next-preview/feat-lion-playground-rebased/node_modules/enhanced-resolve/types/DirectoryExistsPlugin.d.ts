export = DirectoryExistsPlugin;
declare class DirectoryExistsPlugin {
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
declare namespace DirectoryExistsPlugin {
	export { Resolver, ResolveStepHook };
}
type Resolver = import("./Resolver");
type ResolveStepHook = import("./Resolver").ResolveStepHook;
