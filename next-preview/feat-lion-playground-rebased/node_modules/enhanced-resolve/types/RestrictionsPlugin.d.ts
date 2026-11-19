export = RestrictionsPlugin;
declare class RestrictionsPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {Set<string | RegExp>} restrictions restrictions
	 */
	constructor(
		source: string | ResolveStepHook,
		restrictions: Set<string | RegExp>,
	);
	source: string | import("./Resolver").ResolveStepHook;
	restrictions: Set<string | RegExp>;
	/** @type {Restriction[]} */
	_restrictions: Restriction[];
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace RestrictionsPlugin {
	export {
		Resolver,
		ResolveStepHook,
		PathRestriction,
		RegExpRestriction,
		Restriction,
	};
}
type Resolver = import("./Resolver");
type ResolveStepHook = import("./Resolver").ResolveStepHook;
type PathRestriction = {
	/**
	 * type of the restriction
	 */
	type: "path";
	/**
	 * normalized path the request has to be inside of
	 */
	rule: string;
};
type RegExpRestriction = {
	/**
	 * type of the restriction
	 */
	type: "regexp";
	/**
	 * pattern the request has to match
	 */
	rule: RegExp;
};
type Restriction = PathRestriction | RegExpRestriction;
