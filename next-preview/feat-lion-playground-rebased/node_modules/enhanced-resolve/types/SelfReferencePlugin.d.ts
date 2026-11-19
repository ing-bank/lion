export = SelfReferencePlugin;
declare class SelfReferencePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | string[]} fieldNamePath name path
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		fieldNamePath: string | string[],
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	target: string | import("./Resolver").ResolveStepHook;
	fieldName: string | string[];
	/** @type {WeakMap<JsonObject, string | typeof NO_SELF_REF>} */
	_nameCache: WeakMap<JsonObject, string | typeof NO_SELF_REF>;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace SelfReferencePlugin {
	export { Resolver, JsonObject, ResolveRequest, ResolveStepHook };
}
declare const NO_SELF_REF: unique symbol;
type Resolver = import("./Resolver");
type JsonObject = import("./Resolver").JsonObject;
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
