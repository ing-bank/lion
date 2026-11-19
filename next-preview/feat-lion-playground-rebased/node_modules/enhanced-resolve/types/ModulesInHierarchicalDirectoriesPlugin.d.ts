export = ModulesInHierarchicalDirectoriesPlugin;
declare class ModulesInHierarchicalDirectoriesPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | string[]} directories directories
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		directories: string | string[],
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	directories: string[];
	target: string | import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace ModulesInHierarchicalDirectoriesPlugin {
	export { Resolver, ResolveStepHook };
}
type Resolver = import("./Resolver");
type ResolveStepHook = import("./Resolver").ResolveStepHook;
