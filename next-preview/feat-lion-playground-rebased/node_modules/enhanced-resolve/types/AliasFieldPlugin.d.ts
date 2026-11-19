export = AliasFieldPlugin;
declare class AliasFieldPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | string[]} field field
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		field: string | string[],
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	field: string | string[];
	target: string | import("./Resolver").ResolveStepHook;
	/** @type {WeakMap<import("./Resolver").JsonObject, { [k: string]: JsonPrimitive } | typeof NO_FIELD_OBJECT>} */
	_fieldDataCache: WeakMap<
		import("./Resolver").JsonObject,
		| {
				[k: string]: JsonPrimitive;
		  }
		| typeof NO_FIELD_OBJECT
	>;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace AliasFieldPlugin {
	export { Resolver, JsonPrimitive, ResolveRequest, ResolveStepHook };
}
/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").JsonPrimitive} JsonPrimitive */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */
declare const NO_FIELD_OBJECT: unique symbol;
type Resolver = import("./Resolver");
type JsonPrimitive = import("./Resolver").JsonPrimitive;
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
