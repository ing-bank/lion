export = MainFieldPlugin;
declare class MainFieldPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {MainFieldOptions} options options
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		options: MainFieldOptions,
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	options: MainFieldOptions;
	target: string | import("./Resolver").ResolveStepHook;
	/** @type {WeakMap<JsonObject, string | typeof NO_MAIN>} */
	_mainModuleCache: WeakMap<JsonObject, string | typeof NO_MAIN>;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace MainFieldPlugin {
	export {
		Resolver,
		JsonObject,
		ResolveRequest,
		ResolveStepHook,
		MainFieldOptions,
	};
}
declare const NO_MAIN: unique symbol;
type Resolver = import("./Resolver");
type JsonObject = import("./Resolver").JsonObject;
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
type MainFieldOptions = {
	name: string | string[];
	forceRelative: boolean;
};
