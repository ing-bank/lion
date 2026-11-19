export = AliasPlugin;
declare class AliasPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {AliasOption | AliasOption[]} options options
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		options: AliasOption | AliasOption[],
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	options: AliasOption[];
	target: string | import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace AliasPlugin {
	export { Resolver, ResolveStepHook, Alias, AliasOption };
}
type Resolver = import("./Resolver");
type ResolveStepHook = import("./Resolver").ResolveStepHook;
type Alias = string | string[] | false;
type AliasOption = {
	alias: Alias;
	name: string;
	onlyModule?: boolean;
};
